-- PickScope 自学习知识库
-- 执行此 SQL 在 Supabase SQL Editor 中

-- ─────────────────────────────────────────────
-- 1. learned_ingredients：成分知识库（核心）
--    每次 AI 分析完成后，自动提炼并写入
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS learned_ingredients (
  id                  BIGSERIAL PRIMARY KEY,
  ingredient_name     TEXT NOT NULL,
  ingredient_name_lower TEXT NOT NULL,
  stability_findings  JSONB DEFAULT '{}',
  interaction_warnings JSONB DEFAULT '[]',
  mechanisms          JSONB DEFAULT '[]',
  use_cases           TEXT[] DEFAULT '{}',
  evidence_notes      TEXT,
  dose_notes          TEXT,
  query_count         INTEGER DEFAULT 1,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  last_updated        TIMESTAMPTZ DEFAULT NOW()
);

-- 唯一索引：按小写名字去重
CREATE UNIQUE INDEX IF NOT EXISTS idx_learned_ingredients_name_lower
  ON learned_ingredients(ingredient_name_lower);

-- ─────────────────────────────────────────────
-- 2. query_cache：查询结果缓存
--    相同问题直接返回，毫秒级响应
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS query_cache (
  id                BIGSERIAL PRIMARY KEY,
  query_normalized  TEXT NOT NULL,
  original_query    TEXT NOT NULL,
  result            JSONB NOT NULL,
  hit_count         INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  last_accessed     TIMESTAMPTZ DEFAULT NOW()
);

-- 唯一索引：按标准化查询去重
CREATE UNIQUE INDEX IF NOT EXISTS idx_query_cache_normalized
  ON query_cache(query_normalized);

-- ─────────────────────────────────────────────
-- 3. 修复 search_logs 表（补全字段）
-- ─────────────────────────────────────────────
ALTER TABLE search_logs
  ADD COLUMN IF NOT EXISTS original_query TEXT,
  ADD COLUMN IF NOT EXISTS ai_keyword     TEXT,
  ADD COLUMN IF NOT EXISTS results_count  INTEGER,
  ADD COLUMN IF NOT EXISTS created_at     TIMESTAMPTZ DEFAULT NOW();
