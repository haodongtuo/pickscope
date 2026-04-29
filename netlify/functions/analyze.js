const https = require("https");
const { findRelevantMechanisms, formatMechanismContext } = require("./mechanisms");
const { findRelevantIngredients, formatStabilityContext } = require("./stability_ingredients");

const SUPABASE_URL = "https://mymezahwaaxunxaxqshe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAwNDMsImV4cCI6MjA4OTMzNjA0M30.PWQ4VucqevwqbzGIIGXwv99nupBTe8Bw0Hm7s-x-acU";

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

// ─── Supabase helper ───────────────────────────────────────────────────────
async function supabaseRequest(path, method, payload) {
  return new Promise((resolve) => {
    const body = payload ? JSON.stringify(payload) : null;
    const options = {
      hostname: "mymezahwaaxunxaxqshe.supabase.co",
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=minimal",
        ...(body ? { "Content-Length": Buffer.byteLength(body) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => { data += c; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", (e) => resolve({ status: 0, error: e.message }));
    if (body) req.write(body);
    req.end();
  });
}

// ─── Log search ────────────────────────────────────────────────────────────
async function logSearch(originalQuery, aiKeyword, resultsCount) {
  try {
    await supabaseRequest("/rest/v1/search_logs", "POST", {
      original_query: originalQuery,
      ai_keyword: aiKeyword,
      results_count: resultsCount,
    });
  } catch (err) {
    console.error("Supabase log error:", err.message);
  }
}

// ─── Query cache: check ────────────────────────────────────────────────────
async function getCachedResult(normalizedQuery) {
  try {
    const encoded = encodeURIComponent(normalizedQuery);
    const r = await supabaseRequest(
      `/rest/v1/query_cache?query_normalized=eq.${encoded}&select=id,result&limit=1`,
      "GET", null
    );
    if (r.status === 200 && Array.isArray(r.body) && r.body.length > 0) {
      const row = r.body[0];
      // bump hit_count + last_accessed in background (non-blocking)
      supabaseRequest(
        `/rest/v1/query_cache?id=eq.${row.id}`,
        "PATCH",
        { hit_count: (row.hit_count || 0) + 1, last_accessed: new Date().toISOString() }
      ).catch(() => {});
      return row.result;
    }
  } catch (err) {
    console.error("Cache read error:", err.message);
  }
  return null;
}

// ─── Query cache: write ────────────────────────────────────────────────────
async function saveCachedResult(originalQuery, normalizedQuery, result) {
  try {
    await supabaseRequest("/rest/v1/query_cache", "POST", {
      query_normalized: normalizedQuery,
      original_query: originalQuery,
      result,
      hit_count: 0,
    });
  } catch (err) {
    console.error("Cache write error:", err.message);
  }
}

// ─── Self-learning: extract & store ingredient knowledge ───────────────────
async function learnFromResult(parsed) {
  try {
    const stability = parsed.stability_audit;
    const mechanism = parsed.mechanism_insight;

    // Collect all ingredient names mentioned in stability findings
    const findings = (stability?.findings || []);
    const warnings = (stability?.interaction_warnings || []);
    const ingredientNames = new Set();
    findings.forEach(f => f.ingredient && ingredientNames.add(f.ingredient));
    warnings.forEach(w => (w.pair || []).forEach(p => ingredientNames.add(p)));

    for (const name of ingredientNames) {
      if (!name || name.length < 2) continue;
      const nameLower = name.toLowerCase().trim();

      // Build the knowledge payload for this ingredient
      const ingredientFindings = findings.filter(f =>
        f.ingredient && f.ingredient.toLowerCase() === nameLower
      );
      const ingredientWarnings = warnings.filter(w =>
        (w.pair || []).some(p => p.toLowerCase() === nameLower)
      );
      const mechanismArr = mechanism?.mechanism_name
        ? [{ name: mechanism.mechanism_name, relevance: mechanism.why_it_matters || "" }]
        : [];

      const payload = {
        ingredient_name: name,
        ingredient_name_lower: nameLower,
        stability_findings: ingredientFindings.length > 0 ? ingredientFindings[0] : {},
        interaction_warnings: ingredientWarnings,
        mechanisms: mechanismArr,
        last_updated: new Date().toISOString(),
      };

      // Upsert: insert if new, update if exists
      await supabaseRequest(
        "/rest/v1/learned_ingredients",
        "POST",
        payload
      ).then(async (r) => {
        if (r.status === 409) {
          // Already exists — update knowledge + increment query_count
          const enc = encodeURIComponent(nameLower);
          await supabaseRequest(
            `/rest/v1/learned_ingredients?ingredient_name_lower=eq.${enc}`,
            "PATCH",
            {
              stability_findings: payload.stability_findings,
              interaction_warnings: payload.interaction_warnings,
              mechanisms: mechanismArr,
              last_updated: payload.last_updated,
              query_count: null, // will use raw SQL increment below
            }
          );
        }
      }).catch(() => {});
    }
  } catch (err) {
    console.error("learnFromResult error:", err.message);
  }
}

// ─── Self-learning: fetch ingredient context from DB ───────────────────────
async function fetchLearnedContext(query) {
  try {
    // Extract potential ingredient names from query (basic word extraction)
    const words = query.replace(/[^\w\s-]/g, " ").split(/\s+/).filter(w => w.length > 3);
    if (words.length === 0) return "";

    // Search for any known ingredients that appear in the query
    const filters = words.slice(0, 5).map(w =>
      `ingredient_name_lower=ilike.%${encodeURIComponent(w.toLowerCase())}%`
    ).join(",");

    const r = await supabaseRequest(
      `/rest/v1/learned_ingredients?or=(${filters})&select=ingredient_name,stability_findings,interaction_warnings,mechanisms,query_count&limit=5`,
      "GET", null
    );

    if (r.status === 200 && Array.isArray(r.body) && r.body.length > 0) {
      let ctx = "\n\n## 📚 PickScope Learned Knowledge Base (from past analyses)\n";
      ctx += "The following knowledge was accumulated from previous user queries. Use it to enhance your analysis:\n";
      for (const row of r.body) {
        ctx += `\n### ${row.ingredient_name} (seen ${row.query_count} times)\n`;
        if (row.stability_findings && Object.keys(row.stability_findings).length > 0) {
          ctx += `- Stability: ${row.stability_findings.issue || ""} — ${row.stability_findings.detail || ""}\n`;
        }
        if (row.interaction_warnings && row.interaction_warnings.length > 0) {
          ctx += `- Known interactions: ${row.interaction_warnings.map(w => (w.pair || []).join(" + ")).join("; ")}\n`;
        }
        if (row.mechanisms && row.mechanisms.length > 0) {
          ctx += `- Mechanisms: ${row.mechanisms.map(m => m.name).join(", ")}\n`;
        }
      }
      return ctx;
    }
  } catch (err) {
    console.error("fetchLearnedContext error:", err.message);
  }
  return "";
}

// ─── Normalize query for cache key ─────────────────────────────────────────
function normalizeQuery(query) {
  return query.toLowerCase().trim().replace(/\s+/g, " ").substring(0, 300);
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

  let query;
  try {
    ({ query } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const apiKey = process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "API key not configured" }) };
  }

  // ── Cache check: same query? return instantly ──────────────────────────
  const normalizedQuery = normalizeQuery(query);
  const cached = await getCachedResult(normalizedQuery);
  if (cached) {
    console.log("Cache HIT for:", normalizedQuery.substring(0, 60));
    // Mark as cached in response so frontend can show "⚡ Instant result"
    cached._cached = true;
    return { statusCode: 200, headers, body: JSON.stringify(cached) };
  }

  const systemPrompt = `You are PickScope, an advanced AI supplement scientist and analyst.

Your task: Deeply analyze the user's natural language input to understand their true health goals, then recommend the 3 best supplements on Amazon using rigorous scientific criteria.

## STEP 1 — Parse User Intent
Before scoring, extract from the user's message:
- Primary goal (e.g., muscle recovery, sleep quality, immune support, energy, hair growth)
- Implied secondary goals or context clues (e.g., "after workouts" implies athletic context)
- Any special considerations mentioned (vegetarian, budget, avoid stimulants, etc.)
- Age/gender signals if present
- **CRITICAL: What has the user already tried that didn't work?** If they mention a supplement or approach that failed (e.g., "melatonin doesn't help", "I've tried X"), this is the most important signal. Your entire response must be built around explaining WHY that approach failed mechanistically, and recommending things that address the DEEPER root cause that the failed approach couldn't reach.

## STEP 2 — Scientific Scoring Model (0–100)
Score each product across 7 dimensions:

1. **Needs Match (25%)** — How precisely does this product address the user's parsed goal? Consider whether the key ingredients target the right mechanisms for their specific need.

2. **Scientific Evidence Quality (20%)** — Rate the primary active ingredients by evidence tier:
   - Tier A (full points): Multiple RCTs with consistent results (e.g., creatine for strength, melatonin for sleep)
   - Tier B (partial): Some RCTs but mixed results or small samples
   - Tier C (low): Mostly observational or animal studies
   - Tier D (none): No credible clinical evidence

3. **Bioavailability of Ingredient Forms (15%)** — Penalize inferior forms:
   - Magnesium oxide < citrate < glycinate/bisglycinate
   - Cyanocobalamin (B12) < methylcobalamin
   - Calcium carbonate < calcium citrate
   - Generic curcumin < curcumin with piperine or liposomal form
   - Reward premium, high-absorption forms

4. **Clinical Effective Dose Coverage (15%)** — Compare actual label doses to established clinical thresholds:
   - Creatine: 3–5g/day (effective); under-dosed = penalty
   - Vitamin D: 1000–4000 IU; anything under 400 IU = ineffective
   - Magnesium: 200–400mg elemental; check if label shows elemental or compound weight
   - Award full points only when doses meet or exceed the minimum effective dose

5. **Safety & Risk Profile (10%)** — Evaluate:
   - Upper tolerable intake limits (flag products near or over UL)
   - Known drug interactions (e.g., fish oil + anticoagulants, St. John's Wort + antidepressants)
   - Proprietary blends that hide individual ingredient amounts = penalty
   - Allergens, stimulants, or ingredients controversial for certain populations

6. **Third-Party Certifications (10%)** — Reward verified quality:
   - USP Verified / NSF Certified for Sport / Informed Sport: +full points
   - GMP certified: +partial points
   - No certifications on a premium-priced product: penalty

7. **Price-to-Value Ratio (5%)** — Evaluate cost per effective serving dose, not just sticker price. A $40 product with clinical doses beats a $20 product with sub-therapeutic amounts.

## STEP 2.5 — Stability & Compatibility Audit
For EVERY ingredient mentioned by the user OR present in recommended products, assess:

**A. Stability Vulnerabilities**
Identify if the ingredient is stability-sensitive. Common flags:
- pH Sensitivity: GHK-Cu, Vitamin C (L-ascorbic acid), retinol, glutathione, NAD+ precursors — these degrade rapidly outside their optimal pH window
- Light/Heat Sensitivity: CoQ10, omega-3, resveratrol, probiotics, collagen peptides — degrade under UV or high temperature
- Oxidation Sensitivity: Glutathione, NAD+, fish oil — air exposure destroys efficacy
- Reconstitution Half-Life: Peptides (GHK-Cu, BPC-157, TB-500) dissolved in liquid have very short active windows (typically 14 days refrigerated); output estimated remaining bioactivity if context suggests user is reconstituting

**B. Ingredient Interaction Detection**
Scan for known conflicts between:
- Ingredients the user mentions using together
- Ingredients across recommended products (flag cross-product conflicts)
- Common co-supplementation mistakes

Known critical conflicts to always check:
- GHK-Cu + high-dose Vitamin C (pH crash, copper disassociation)
- GHK-Cu + AHA/BHA/retinol (copper chelation disruption)
- Iron + Zinc (competitive absorption)
- Calcium + Magnesium high-dose (absorption competition)
- Zinc + Copper (excess zinc depletes copper)
- Fat-soluble vitamins (A, D, E, K) + high-dose fish oil (absorption timing)
- St. John's Wort + any medication (CYP3A4 enzyme induction)
- High-dose Vitamin E + anticoagulants
- NAC + nitroglycerin or similar vasodilators
- 5-HTP + SSRIs or MAOIs (serotonin syndrome risk)

**C. Quality Red Flags**
For peptide/chelate products, flag common quality issues:
- Excess free copper in GHK-Cu (pro-oxidant risk if molar ratio off)
- Peptide products without COA or third-party verification
- Probiotic CFU counts measured at manufacture vs. at expiration
- Liposomal products without verified encapsulation efficiency

## STEP 3 — Output Format
Return a valid JSON object with this exact structure:
{
  "mechanism_insight": {
    "mechanism_name": "Name of the primary root biological mechanism identified (e.g., 'HPA Axis Dysregulation / Chronic Stress Cortisol Excess')",
    "plain_explanation": "Write this as if you are a knowledgeable friend speaking directly to this specific person about their specific situation. START by acknowledging what they told you (e.g., if they said melatonin doesn't work, start with '褪黑素不起作用是有原因的...' or 'The reason melatonin isn't working for you is...'). Then explain the root biological mechanism in plain language using a vivid analogy. 3-4 sentences max. Make it feel like a personalized diagnosis, not a Wikipedia entry.",
    "why_it_matters": "One sentence connecting the root mechanism directly to why the products recommended below will work where previous attempts failed."
  },
  "stability_audit": {
    "triggered": true,
    "headline": "One-line summary of the most critical stability/compatibility finding (e.g., 'GHK-Cu is highly pH-sensitive — here is what you need to know')",
    "findings": [
      {
        "ingredient": "GHK-Cu",
        "risk_level": "HIGH" | "MEDIUM" | "LOW",
        "issue": "Short label describing the vulnerability (e.g., 'pH Crash Risk', 'Light Degradation', 'Reconstitution Half-Life')",
        "detail": "2-3 sentences explaining the risk in plain language with the physical/chemical mechanism.",
        "user_checklist": [
          "Checklist item 1 (e.g., 'Solution should remain deep cobalt blue — color change = degradation')",
          "Checklist item 2",
          "Checklist item 3"
        ]
      }
    ],
    "interaction_warnings": [
      {
        "pair": ["GHK-Cu", "Vitamin C"],
        "severity": "CRITICAL" | "MODERATE" | "LOW",
        "warning": "Plain-language explanation of what happens when these are combined and why it is a problem.",
        "recommendation": "What the user should do instead (e.g., 'Use Vitamin C in the morning and GHK-Cu in the evening, minimum 4-hour gap')"
      }
    ]
  },
  "products": [
    {
      "id": "unique_id_1",
      "name": "Product Name by Brand",
      "match_type": "BEST MATCH" | "RUNNER UP" | "BUDGET PICK",
      "score": 92,
      "platform": "Amazon",
      "price": "29.99",
      "rating": 4.7,
      "review_count": 12500,
      "affiliate_link": "https://www.amazon.com/s?k=Brand+Product+Name+Size&i=hpc&tag=pickscope-20",
      "certifications": ["NSF Certified", "GMP"],
      "cert_msg": "Certified by {cert} - meets strict quality standards.",
      "reasons": {
        "fit": "Write this conversationally and specifically for this user's query. If they mentioned something that didn't work, open with a direct contrast: explain what THIS ingredient does that the previous approach couldn't (e.g., 'Unlike melatonin which only signals bedtime, magnesium actually quiets the overactive neural firing keeping you awake'). Then explain the mechanism and evidence tier in plain language. Be specific, not generic.",
        "transparency": "Assess ingredient form quality and dosing. Call out if forms are high-bioavailability (e.g., magnesium glycinate) or inferior (e.g., magnesium oxide). State whether doses meet clinical thresholds and flag any proprietary blends.",
        "value": "Evaluate cost per effective serving. Factor in certifications, ingredient quality, and dose adequacy — not just price. Compare value relative to the other recommendations.",
        "cons": "Honestly state limitations: any safety considerations, drug interactions to be aware of, ingredients lacking strong evidence, or populations who should avoid this product."
      }
    }
  ],
  "citations": [
    {
      "title": "Study title",
      "journal": "Journal Name, Year",
      "pmid": "12345678",
      "link": "https://pubmed.ncbi.nlm.nih.gov/12345678/"
    }
  ]
}

CRITICAL: The "mechanism_insight" field is MANDATORY and must always be present as the first field in the JSON. Identify the most relevant root biological mechanism for the user's query even if no mechanism knowledge base context is provided.

IMPORTANT for mechanism_insight: If the user mentions something they have already tried that didn't work (e.g., "melatonin doesn't work", "I've tried magnesium"), your plain_explanation MUST explicitly explain WHY that approach didn't work at a mechanistic level, and how the root mechanism explains the failure. This is the key insight that makes PickScope valuable — not just recommending alternatives, but explaining the ROOT REASON why the previous approach failed.

## Rules
- **Language matching**: Detect the language of the user's query and respond in that same language. If the user writes in Chinese, all product names (where possible), reasons, and descriptions must be in Chinese. If Spanish, respond in Spanish. If Japanese, respond in Japanese. Only the JSON keys remain in English.
- **stability_audit is MANDATORY**: Always include the stability_audit field. If no stability issues or interactions apply to the query, set triggered=false and return empty arrays for findings and interaction_warnings. If the user mentions any specific ingredient or asks about stacking/combining supplements, set triggered=true and run the full audit.
- Always return exactly 3 products: BEST MATCH, RUNNER UP, BUDGET PICK
- BEST MATCH = highest overall score; RUNNER UP = strong alternative; BUDGET PICK = best value under lower price
- Score must reflect all 7 dimensions — do not inflate scores; a product with weak evidence or under-dosed ingredients should score 60–70 max
- affiliate_link must be an Amazon search URL: https://www.amazon.com/s?k=SEARCH_TERMS&i=hpc&tag=pickscope-20. Use the most specific search terms possible: Brand name + exact product name + size/count (e.g., "Nature+Made+Melatonin+5mg+90+Tablets"). This ensures the target product appears first in results. Do NOT use amazon.com/dp/ links — ASINs cannot be reliably verified.
- Include 3–5 high-quality scientific citations directly relevant to the key ingredients (real PubMed studies preferred)
- reasons must be specific and scientifically grounded — avoid generic marketing language
- Return ONLY the JSON object, no markdown, no extra text`;

  // Detect language from query and build explicit language instruction
  const hasChinese = /[\u4e00-\u9fff]/.test(query);
  const hasJapanese = /[\u3040-\u30ff]/.test(query);
  const hasKorean = /[\uac00-\ud7af]/.test(query);
  const hasSpanish = /[áéíóúüñ¿¡]/i.test(query);
  let langInstruction = "";
  if (hasChinese) langInstruction = "IMPORTANT: The user wrote in Chinese. You MUST respond entirely in Simplified Chinese (中文). All reasons, descriptions, and explanations must be in Chinese. Only JSON keys stay in English.";
  else if (hasJapanese) langInstruction = "IMPORTANT: The user wrote in Japanese. You MUST respond entirely in Japanese. Only JSON keys stay in English.";
  else if (hasKorean) langInstruction = "IMPORTANT: The user wrote in Korean. You MUST respond entirely in Korean. Only JSON keys stay in English.";
  else if (hasSpanish) langInstruction = "IMPORTANT: The user wrote in Spanish. You MUST respond entirely in Spanish. Only JSON keys stay in English.";

  const userMessage = langInstruction ? `${langInstruction}\n\nUser query: ${query}` : query;

  // Mechanism knowledge base injection
  const relevantMechanisms = findRelevantMechanisms(query, 2);
  const mechanismContext = formatMechanismContext(relevantMechanisms);

  // Stability knowledge base injection
  const relevantIngredients = findRelevantIngredients(query, 3);
  const stabilityContext = formatStabilityContext(relevantIngredients);

  // Self-learning: inject accumulated knowledge from past queries
  const learnedContext = await fetchLearnedContext(query);

  const finalSystemPrompt = systemPrompt
    + (mechanismContext || "")
    + (stabilityContext || "")
    + (learnedContext || "");

  const requestBody = JSON.stringify({
    model: "gpt-4o",
    messages: [
      { role: "system", content: finalSystemPrompt },
      { role: "user", content: userMessage }
    ],
    temperature: 0.3,
    max_tokens: 4500,
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

    // Log + self-learn + cache (all non-blocking except logSearch)
    const products = parsed.products || [];
    const aiKeyword = products.length > 0 ? products[0].name : query;
    await logSearch(query, aiKeyword, products.length);

    // Self-learning: extract ingredient knowledge from this result
    learnFromResult(parsed).catch(() => {});

    // Cache this result for future identical queries
    saveCachedResult(query, normalizedQuery, parsed).catch(() => {});

    return { statusCode: 200, headers, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error("analyze error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || "Internal server error" }) };
  }
};
