import pkg from 'pg';
const { Client } = pkg;

// Supabase Postgres 直连（Transaction mode pooler, port 6543）
// 连接字符串格式：postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
// 我们用 session mode (port 5432) 来支持 DDL

const PROJECT_REF = 'mymezahwaaxunxaxqshe';
// Supabase DB 密码通常在 Settings > Database 里，
// 但可以尝试用 service_role JWT 的方式 — 不行的话只能要密码

// 先试 Supabase 的 Transaction pooler
const CONNECTION_STRING = `postgres://postgres.${PROJECT_REF}:${process.env.DB_PASSWORD}@aws-0-us-west-2.pooler.supabase.com:6543/postgres`;

if (!process.env.DB_PASSWORD) {
  console.log('❌ 需要设置 DB_PASSWORD 环境变量');
  console.log('   在 Supabase Dashboard → Settings → Database → Connection string 里找到密码');
  console.log('   然后运行: $env:DB_PASSWORD="你的密码"; node scripts/create_exit_protocols_pg.mjs');
  process.exit(1);
}

const client = new Client({ connectionString: CONNECTION_STRING, ssl: { rejectUnauthorized: false } });

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
`;

const policySQL = `
do $$ begin
  if not exists (select 1 from pg_policies where tablename='exit_protocols' and policyname='anon read exit_protocols') then
    execute 'create policy "anon read exit_protocols" on exit_protocols for select using (true)';
  end if;
  if not exists (select 1 from pg_policies where tablename='exit_protocols' and policyname='service role write exit_protocols') then
    execute 'create policy "service role write exit_protocols" on exit_protocols for insert with check (true)';
  end if;
end $$;
`;

const indexSQL = `
create index if not exists idx_exit_protocols_substance on exit_protocols(substance);
create index if not exists idx_exit_protocols_outcome on exit_protocols(outcome);
create index if not exists idx_exit_protocols_tags on exit_protocols using gin(tags);
`;

try {
  await client.connect();
  console.log('✅ 数据库连接成功');

  console.log('建表...');
  await client.query(createSQL);
  console.log('✅ 表创建成功');

  console.log('开启 RLS...');
  await client.query('alter table exit_protocols enable row level security;');
  await client.query(policySQL);
  console.log('✅ RLS 策略设置完成');

  console.log('创建索引...');
  await client.query(indexSQL);
  console.log('✅ 索引创建完成');

  await client.end();
  console.log('\n🎉 建表全部完成！可以运行 seed 脚本了');
} catch (err) {
  console.error('❌ 错误:', err.message);
  await client.end().catch(() => {});
}
