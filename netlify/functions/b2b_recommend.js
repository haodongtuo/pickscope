/**
 * PickScope B2B Merchant Plugin API
 * ------------------------------------
 * Allows merchants (Shopify, Wix, custom sites) to embed PickScope's
 * AI recommendation engine into their own storefronts.
 *
 * Flow:
 *   1. Merchant registers → gets an API key (TODO: key management)
 *   2. Merchant embeds a JS snippet on their site (TODO: embed SDK)
 *   3. Their customer types a natural-language query
 *   4. Their frontend POSTs to this endpoint with their catalog + query
 *   5. PickScope returns ranked recommendations from THEIR inventory
 *
 * Planned billing models:
 *   - Monthly SaaS subscription (tiered by query volume)
 *   - Per-conversion commission (TODO: conversion webhook)
 *
 * Request body:
 * {
 *   "api_key": "merchant_xxx",           // Merchant auth key
 *   "query": "I'm a 50yo woman...",      // End-user natural language query
 *   "catalog": [                          // Merchant's own product list
 *     {
 *       "id": "prod_001",
 *       "name": "NovaBalance Women's Health",
 *       "description": "...",
 *       "price": 39.99,
 *       "url": "https://merchant.com/product/001",
 *       "ingredients": ["Ashwagandha 300mg", "Magnesium Glycinate 200mg"],
 *       "certifications": ["GMP", "NSF"]
 *     }
 *   ],
 *   "options": {
 *     "max_results": 3,
 *     "language": "auto"                 // auto-detect from query
 *   }
 * }
 *
 * Response:
 * {
 *   "recommendations": [...],            // Same schema as /analyze
 *   "query_id": "qry_xxx",              // For conversion tracking
 *   "merchant_id": "mer_xxx"
 * }
 */

const https = require("https");

// TODO: Replace with real key store (Supabase / Redis)
const VALID_API_KEYS = {
  // "merchant_demo_key": { merchant_id: "mer_001", name: "Demo Store", plan: "starter" }
};

function httpsPost(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(new Error("Invalid JSON: " + data.substring(0, 200))); }
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
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  let api_key, query, catalog, options;
  try {
    ({ api_key, query, catalog, options } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  // ── TODO: Uncomment when key management is ready ──────────────
  // const merchant = VALID_API_KEYS[api_key];
  // if (!merchant) {
  //   return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid API key" }) };
  // }
  // ─────────────────────────────────────────────────────────────

  if (!query) return { statusCode: 400, headers, body: JSON.stringify({ error: "query is required" }) };

  const apiKey = process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: "API key not configured" }) };

  // Build catalog context for the prompt
  const catalogContext = catalog && catalog.length > 0
    ? `\n\nMERCHANT CATALOG (recommend ONLY from these products):\n${catalog.map((p, i) =>
        `${i+1}. ${p.name} — $${p.price} | ${p.description || ''} | Ingredients: ${(p.ingredients || []).join(', ')} | Certs: ${(p.certifications || []).join(', ')} | URL: ${p.url}`
      ).join('\n')}`
    : "";

  const systemPrompt = `You are PickScope, embedded as an AI shopping assistant for a merchant's storefront.
Your task: analyze the customer's natural language query and recommend the best products from the merchant's catalog.
You must ONLY recommend products from the provided catalog — never suggest outside products.
Apply the same 7-dimension scientific scoring: needs match, evidence quality, bioavailability, effective dose, safety, certifications, value.
Respond in the same language as the user's query.
${catalogContext}

Return JSON with this structure:
{
  "recommendations": [
    {
      "id": "product id from catalog",
      "name": "product name",
      "match_type": "BEST MATCH" | "RUNNER UP" | "BUDGET PICK",
      "score": 85,
      "price": "39.99",
      "url": "product url",
      "reasons": {
        "fit": "why this fits the customer's need",
        "transparency": "ingredient quality assessment",
        "value": "value assessment",
        "cons": "limitations to consider"
      }
    }
  ],
  "citations": []
}
Return ONLY the JSON object.`;

  const requestBody = JSON.stringify({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query }
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: "json_object" }
  });

  const reqOptions = {
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
    const response = await httpsPost(reqOptions, requestBody);
    if (response.status !== 200) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: response.body?.error?.message || "OpenAI error" }) };
    }
    const content = response.body.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    // TODO: Log query for analytics + conversion tracking
    // TODO: Increment merchant's monthly usage counter
    // await logB2BQuery({ merchant_id: merchant.merchant_id, query, results: parsed });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...parsed,
        query_id: "qry_" + Date.now(), // TODO: generate real ID
        // merchant_id: merchant.merchant_id
      })
    };
  } catch (err) {
    console.error("b2b_recommend error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
