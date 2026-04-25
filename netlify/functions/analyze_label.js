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

  let imagesBase64;
  try {
    ({ imagesBase64 } = JSON.parse(event.body));
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

  const systemPrompt = `You are PickScope Label Analyzer, an expert supplement label reader.
Analyze the supplement label image(s) provided and return a JSON object with this structure:
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
    "summary": "2-3 sentence expert summary of this supplement",
    "strengths": "What this product does well",
    "concerns": "Any concerns or limitations",
    "quality_score": 85
  }
}
Return ONLY the JSON object, no markdown, no extra text.`;

  const requestBody = JSON.stringify({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: "Please analyze this supplement label." },
          ...imageContents
        ]
      }
    ],
    temperature: 0.2,
    max_tokens: 1500,
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
