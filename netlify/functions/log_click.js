const https = require("https");

const SUPABASE_URL = "https://mymezahwaaxunxaxqshe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAwNDMsImV4cCI6MjA4OTMzNjA0M30.PWQ4VucqevwqbzGIIGXwv99nupBTe8Bw0Hm7s-x-acU";

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  let query, product_name, platform, affiliate_link;
  try {
    ({ query, product_name, platform, affiliate_link } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const payload = JSON.stringify({
    original_query: query || "",
    product_name: product_name || "",
    platform: platform || "Amazon",
    affiliate_link: affiliate_link || "",
  });

  const options = {
    hostname: new URL(SUPABASE_URL).hostname,
    path: "/rest/v1/click_logs",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  try {
    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.on("data", () => {});
        res.on("end", resolve);
      });
      req.on("error", reject);
      req.write(payload);
      req.end();
    });
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("log_click error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
