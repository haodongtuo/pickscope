import https from 'https';

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc2MDA0MywiZXhwIjoyMDg5MzM2MDQzfQ.0SB5YsHu53hh61BV2izACCGwU4UBMcFJHKk6KzEsSOU';
const PROJECT_REF = 'mymezahwaaxunxaxqshe';

async function request(path, method, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path,
      method,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Prefer': 'return=representation'
      }
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Step 1: 建表 — 通过插入一条测试记录来触发表存在检查（不行就走 RPC）
// 实际上 service_role 可以直接 POST 到 /rest/v1/exit_protocols
// 但表不存在的话要先用 SQL。试试 Supabase 的 /pg endpoint

async function execSQL(sql) {
  // Supabase 没有公开的 SQL endpoint，但可以用 pg-meta（内部 API）
  // 换个思路：直接通过 REST 建表是不可能的
  // 最后手段：用 Supabase JS 客户端的 rpc 调用一个已有的 exec 函数
  // 检查是否有 exec_sql function
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path: '/pg/query',
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// 先试 /pg/query
const createSQL = `
create table if not exists exit_protocols (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  substance text not null,
  substance_category text not null,
  peak_dose text,
  duration_of_use text,
  taper_steps jsonb not null,
  outcome text not null,
  maintained_loss boolean,
  maintenance_strategy text,
  months_since_stopped integer,
  starting_weight_lbs numeric,
  ending_weight_lbs numeric,
  goal_achieved boolean,
  source_platform text default 'reddit',
  source_url text,
  source_username text,
  is_verified boolean default false,
  tags text[],
  ai_summary text,
  evidence_quality text default 'anecdotal'
);
alter table exit_protocols enable row level security;
create index if not exists idx_exit_protocols_substance on exit_protocols(substance);
create index if not exists idx_exit_protocols_outcome on exit_protocols(outcome);
create index if not exists idx_exit_protocols_tags on exit_protocols using gin(tags);
`;

console.log('Step 1: 尝试建表...');
const r1 = await execSQL(createSQL);
console.log(`Status: ${r1.status}`);
console.log(`Response: ${r1.body.substring(0, 500)}`);

if (r1.status === 200 || r1.status === 201) {
  console.log('\n✅ 建表成功！');
} else {
  console.log('\n/pg/query 不可用，需要 Management API PAT');
}
