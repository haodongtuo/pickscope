-- PickScope: 真实用户退出协议数据库
-- 记录 GLP-1 / 肽类药物的真实退出经验，用于构建 AI 退出路线图审计器
-- 执行方式：Supabase Dashboard → SQL Editor 粘贴执行

-- 主表：退出协议
create table if not exists exit_protocols (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  -- 药物信息
  substance text not null,              -- e.g. "Retatrutide", "Semaglutide", "Tirzepatide"
  substance_category text not null,     -- e.g. "GLP-1", "GLP-1/GIP/GCGR", "peptide"
  peak_dose text,                       -- 最高使用剂量，e.g. "2mg"
  duration_of_use text,                 -- 使用总时长，e.g. "4 months"

  -- 退出协议（JSON 数组，按阶段记录）
  -- 每个阶段格式：{ phase: 1, dose: "2mg", interval_days: 10, notes: "..." }
  taper_steps jsonb not null,

  -- 结果
  outcome text not null,               -- "success" | "partial" | "rebound" | "unknown"
  maintained_loss boolean,             -- 是否维持了减重成果
  maintenance_strategy text,           -- 维持方式，e.g. "resistance training + portion control"
  months_since_stopped integer,        -- 停药后多少个月仍维持

  -- 背景信息
  starting_weight_lbs numeric,
  ending_weight_lbs numeric,
  goal_achieved boolean,

  -- 来源
  source_platform text default 'reddit',  -- reddit / user_submitted / clinical
  source_url text,
  source_username text,                   -- 匿名化处理，仅供内部追溯
  is_verified boolean default false,      -- 是否经专业人士审核

  -- AI 使用字段
  tags text[],                            -- 关键词标签，e.g. ["plateau_break", "successful_taper", "resistance_training"]
  ai_summary text,                        -- AI 生成的简洁摘要，供 RAG 调用
  evidence_quality text default 'anecdotal'  -- "anecdotal" | "self_reported_tracked" | "clinical"
);

-- 开放匿名读取（供 AI 分析时查询）
alter table exit_protocols enable row level security;
create policy "anon read exit_protocols" on exit_protocols for select using (true);
create policy "service role write exit_protocols" on exit_protocols for insert with check (true);

-- 索引
create index if not exists idx_exit_protocols_substance on exit_protocols(substance);
create index if not exists idx_exit_protocols_outcome on exit_protocols(outcome);
create index if not exists idx_exit_protocols_tags on exit_protocols using gin(tags);
