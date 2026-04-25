const https = require("https");

function httpsPost(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(new Error("Invalid JSON from OpenAI: " + data.substring(0, 200))); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let imagesBase64, userNote;
  try {
    ({ imagesBase64, userNote } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  if (!imagesBase64 || !Array.isArray(imagesBase64) || imagesBase64.length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "No images provided" }) };
  }

  const apiKey = process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "API key not configured" }) };
  }

  // Build image content array for vision API
  const imageContents = imagesBase64.map((img) => ({
    type: "image_url",
    image_url: {
      url: img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`,
      detail: "high"
    }
  }));

  const systemPrompt = `You are PickScope Label Analyzer, an elite supplement scientist and formulation auditor.

Analyze the supplement label image(s) provided. Your job is NOT just to read the label — it is to perform a full-stack audit: ingredient quality, stability risks, interaction conflicts, and redundancy warnings.

Return a JSON object with this EXACT structure:
{
  "product_name": "Full product name from label",
  "brand": "Brand name",
  "serving_size": "e.g. 2 capsules",
  "servings_per_container": 60,
  "key_ingredients": [
    { "name": "Ingredient name", "amount": "500mg", "dv_percent": "50%" }
  ],
  "certifications": ["NSF", "GMP", "USP"],
  "allergen_info": "Contains or free-from info",
  "suggested_use": "How to take as stated on label",
  "analysis": {
    "summary": "2-3 sentence expert summary of this supplement's overall design logic — what is it trying to do, and does the formulation actually support that goal?",
    "strengths": "What this formulation does well: high-quality ingredient forms, effective doses, good synergies between ingredients",
    "concerns": "Formulation weaknesses: underdosed ingredients, inferior forms (e.g., magnesium oxide), proprietary blends hiding doses, or ingredients with weak evidence",
    "quality_score": 85
  },
  "stability_audit": {
    "triggered": true,
    "headline": "One-line summary of the most critical stability finding across ALL ingredients on this label",
    "findings": [
      {
        "ingredient": "Ingredient name",
        "risk_level": "HIGH",
        "issue": "Short label: e.g. 'pH Crash Risk' / 'Oxidation Sensitivity' / 'Reconstitution Half-Life'",
        "detail": "2-3 sentences explaining the specific stability risk for this ingredient in plain language.",
        "user_checklist": [
          "Actionable checklist item 1",
          "Actionable checklist item 2"
        ]
      }
    ],
    "interaction_warnings": [
      {
        "pair": ["Ingredient A", "Ingredient B"],
        "severity": "CRITICAL",
        "warning": "Plain explanation of what happens when these two ingredients are combined and why it is a problem.",
        "recommendation": "What the user should do: timing separation, dosing adjustment, or avoid entirely"
      }
    ]
  },
  "stack_analysis": {
    "triggered": true,
    "redundancy_warnings": [
      {
        "ingredients": ["Ingredient A", "Ingredient B"],
        "shared_pathway": "Name of the biological pathway both target (e.g., 'Mitochondrial NAD+ / AMPK signaling')",
        "explanation": "Explain why both ingredients converge on the same pathway and what diminishing returns look like in practice.",
        "recommendation": "Which one to keep, which to reduce, or how to use them strategically rather than simultaneously"
      }
    ],
    "synergy_highlights": [
      {
        "ingredients": ["Ingredient A", "Ingredient B"],
        "synergy_type": "e.g. 'Absorption Enhancement' / 'Pathway Amplification' / 'Antioxidant Cycling'",
        "explanation": "Why these two work better together than either alone."
      }
    ],
    "overall_verdict": "One paragraph verdict on the overall stack design: is this a well-engineered formulation or a 'kitchen sink' product? What is the signal-to-noise ratio of active ingredients vs. filler? What type of user would benefit most from this product?"
  }
}

## Rules
- stability_audit and stack_analysis are MANDATORY fields. If a label has only 1-2 simple ingredients with no known issues, set triggered=false and return empty arrays — but still include the fields.
- For stack_analysis: scan ALL ingredient pairs for redundancy. A stack with 8+ ingredients almost always has at least one redundancy or one genuine synergy worth calling out.
- Be specific and scientific — avoid generic marketing language. Name the exact biological pathway, enzyme, or receptor involved.
- quality_score: score 0–100 based on ingredient form quality, dose adequacy, evidence tier, and formulation logic. Do not inflate scores. A product with inferior forms or underdosed ingredients should score 50–70.
- If the user provided a specific question, add a "user_question_response" field at the TOP LEVEL of the JSON:
  {
    "user_question_response": {
      "question": "Repeat the user's original question exactly",
      "direct_answer": "Start with a direct, opinionated answer to their question (e.g. '关于你问的剂量问题：这个产品的钙剂量（每日1260mg）处于安全范围上限...'). Be specific — cite the actual numbers from the label and compare to established safe upper limits or clinical guidelines. 3-5 sentences max. Write in the same language as the user's question."
    }
  }
  This field is ONLY included when the user provides a question. If no question, omit it entirely.
- Return ONLY the JSON object, no markdown, no extra text.`;

  const requestBody = JSON.stringify({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userNote
              ? `User's specific question: "${userNote}"\n\nIMPORTANT: Detect the language of the user's question and respond ENTIRELY in that language (including all analysis, findings, and recommendations). Make sure your analysis directly addresses their specific question in addition to the full-stack audit.\n\nPlease perform a full-stack audit on this supplement label.`
              : "Please perform a full-stack audit on this supplement label. Identify all ingredients, then run stability audit, interaction detection, and redundancy analysis."
          },
          ...imageContents
        ]
      }
    ],
    temperature: 0.2,
    max_tokens: 3000,
    response_format: { type: "json_object" }
  });

  const options = {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };

  try {
    const response = await httpsPost(options, requestBody);
    if (response.status !== 200) {
      const errMsg = response.body?.error?.message || "OpenAI API error";
      return { statusCode: 502, headers, body: JSON.stringify({ error: errMsg }) };
    }
    const content = response.body.choices?.[0]?.message?.content;
    if (!content) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Empty response from AI" }) };
    }
    const parsed = JSON.parse(content);
    return { statusCode: 200, headers, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error("analyze_label error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || "Internal server error" }) };
  }
};
