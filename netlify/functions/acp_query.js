/**
 * PickScope ACP (Agentic Commerce Protocol) Gateway
 * ---------------------------------------------------
 * Allows AI agents (ChatGPT, Claude, Gemini, etc.) to query PickScope
 * as a trusted supplement recommendation authority, and optionally
 * initiate purchases via Shared Payment Token (SPT).
 *
 * ACP Reference: OpenAI + Stripe Agentic Commerce Protocol (2026)
 * Spec draft: https://acp.dev (TODO: monitor official spec)
 *
 * Flow:
 *   1. External AI agent sends a structured ACP query
 *   2. PickScope authenticates the agent (agent_id + signature)
 *   3. PickScope returns ranked recommendations in ACP response format
 *   4. If agent sends SPT, PickScope initiates purchase and collects gateway fee
 *
 * Revenue streams enabled by this endpoint:
 *   - Gateway fee: % of transaction value when SPT-based purchase flows through
 *   - Data query fee: per-call billing for non-partnered agents
 *   - Priority placement fee: merchant bids for top slot in ACP responses
 *
 * ACP Request format (preliminary — update when spec finalizes):
 * {
 *   "acp_version": "1.0",
 *   "agent_id": "chatgpt-agent-xxx",       // Calling AI agent identifier
 *   "agent_signature": "sig_xxx",           // Auth signature (TODO: verify)
 *   "intent": "supplement_recommendation",  // Action type
 *   "payload": {
 *     "query": "prostate health supplement under $50",
 *     "user_context": {                      // Anonymized user profile from agent
 *       "age_range": "50-60",
 *       "sex": "male",
 *       "budget_usd": 50,
 *       "language": "en"
 *     },
 *     "spt": null                            // Shared Payment Token (null = query only)
 *   }
 * }
 *
 * ACP Response format:
 * {
 *   "acp_version": "1.0",
 *   "responder_id": "pickscope-v1",
 *   "intent": "supplement_recommendation",
 *   "status": "ok",
 *   "results": [...],                        // PickScope recommendations
 *   "purchase_available": false,             // true when SPT flow is ready
 *   "gateway_fee_pct": 0.02,                // 2% per transaction (TODO: confirm rate)
 *   "meta": {
 *     "query_id": "qry_xxx",
 *     "billable": true,
 *     "call_fee_usd": 0.01                  // Per-query fee for non-partners
 *   }
 * }
 */

const https = require("https");

// TODO: Load from verified ACP agent registry when available
const TRUSTED_AGENTS = {
  // "chatgpt-agent": { name: "ChatGPT", partner: true, fee_exempt: true },
  // "claude-agent":  { name: "Claude",  partner: true, fee_exempt: true },
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
    "Access-Control-Allow-Headers": "Content-Type, X-ACP-Agent-ID, X-ACP-Signature",
    "Content-Type": "application/json",
    // ACP discovery header — lets agent registries find this endpoint
    "X-ACP-Responder": "pickscope-v1",
    "X-ACP-Capabilities": "supplement_recommendation,label_analysis",
  };

  // ACP agent discovery: GET returns capability manifest
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        acp_version: "1.0",
        responder_id: "pickscope-v1",
        name: "PickScope",
        description: "AI-powered supplement recommendation and analysis engine",
        capabilities: ["supplement_recommendation", "label_analysis"],
        supported_intents: ["supplement_recommendation"],
        pricing: {
          query_fee_usd: 0.01,       // Per query for non-partners
          gateway_fee_pct: 0.02,     // 2% for SPT-based purchases
          partner_program: "https://pickscope.com/partners" // TODO
        },
        contact: "api@pickscope.com",  // TODO
        docs: "https://pickscope.com/acp-docs",  // TODO
      })
    };
  }

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  let acpRequest;
  try {
    acpRequest = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid ACP request body" }) };
  }

  const { acp_version, agent_id, agent_signature, intent, payload } = acpRequest;

  // ── TODO: Verify agent signature when ACP spec finalizes ──────
  // const verified = await verifyACPSignature(agent_id, agent_signature, event.body);
  // if (!verified) return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid agent signature" }) };
  // ─────────────────────────────────────────────────────────────

  if (intent !== "supplement_recommendation") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Unsupported intent: ${intent}. Supported: supplement_recommendation` })
    };
  }

  const { query, user_context, spt } = payload || {};
  if (!query) return { statusCode: 400, headers, body: JSON.stringify({ error: "payload.query is required" }) };

  // Build enriched query from user_context
  let enrichedQuery = query;
  if (user_context) {
    const ctx = [];
    if (user_context.age_range) ctx.push(`Age range: ${user_context.age_range}`);
    if (user_context.sex)       ctx.push(`Sex: ${user_context.sex}`);
    if (user_context.budget_usd) ctx.push(`Budget: under $${user_context.budget_usd}`);
    if (ctx.length > 0) enrichedQuery = `${query}. Context: ${ctx.join(', ')}.`;
  }

  const lang = user_context?.language || "auto";

  const apiKey = process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: "API key not configured" }) };

  const systemPrompt = `You are PickScope, responding to an AI agent query via ACP protocol.
Analyze the request and return top 3 supplement recommendations.
Apply the 7-dimension scientific scoring model.
Respond in language: ${lang === "auto" ? "match the query language" : lang}.
Return only valid JSON matching the standard PickScope product schema.`;

  const requestBody = JSON.stringify({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: enrichedQuery }
    ],
    temperature: 0.3,
    max_tokens: 2500,
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
      return { statusCode: 502, headers, body: JSON.stringify({ error: response.body?.error?.message }) };
    }
    const content = response.body.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    // ── TODO: SPT purchase flow ───────────────────────────────────
    // if (spt) {
    //   const purchaseResult = await processACPPurchase(spt, parsed.products[0]);
    //   return { statusCode: 200, headers, body: JSON.stringify({ ...acpResponse, purchase: purchaseResult }) };
    // }
    // ─────────────────────────────────────────────────────────────

    // ── TODO: Billing — charge query fee for non-partner agents ──
    // const agent = TRUSTED_AGENTS[agent_id];
    // if (!agent?.fee_exempt) await chargeQueryFee(agent_id, 0.01);
    // ─────────────────────────────────────────────────────────────

    const queryId = "qry_" + Date.now();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        acp_version: "1.0",
        responder_id: "pickscope-v1",
        intent: "supplement_recommendation",
        status: "ok",
        results: parsed.products || [],
        citations: parsed.citations || [],
        purchase_available: false,  // flip to true when SPT flow is live
        gateway_fee_pct: 0.02,
        meta: {
          query_id: queryId,
          billable: true,
          call_fee_usd: 0.01,
          agent_id: agent_id || "unknown",
        }
      })
    };
  } catch (err) {
    console.error("acp_query error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
