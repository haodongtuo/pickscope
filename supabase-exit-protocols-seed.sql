-- PickScope: 第一批真实退出协议数据
-- 来源：Reddit r/Peptides / r/GLP1 真实用户分享（2025）
-- 执行前请先执行 supabase-exit-protocols.sql 建表

insert into exit_protocols (
  substance,
  substance_category,
  peak_dose,
  duration_of_use,
  taper_steps,
  outcome,
  maintained_loss,
  maintenance_strategy,
  months_since_stopped,
  starting_weight_lbs,
  ending_weight_lbs,
  goal_achieved,
  source_platform,
  source_username,
  tags,
  ai_summary,
  evidence_quality
) values (
  'Retatrutide',
  'GLP-1/GIP/GCGR triple agonist',
  '2mg',
  '4 months',
  '[
    {
      "phase": 1,
      "dose": "2mg",
      "interval_days": 10,
      "trigger": "hunger signals returning — used as natural cue to extend interval",
      "notes": "Extended from weekly to 10-day intervals when appetite began to return. Body used as feedback sensor."
    },
    {
      "phase": 2,
      "dose": "1mg",
      "interval_days": 14,
      "trigger": "planned step-down",
      "notes": "Reduced dose to 1mg at 14-day intervals. Continued resistance training throughout."
    },
    {
      "phase": 3,
      "dose": "1mg",
      "interval_days": 14,
      "trigger": "continued maintenance",
      "notes": "Held at 1mg every 14 days to allow metabolic recalibration."
    },
    {
      "phase": 4,
      "dose": "0.5mg",
      "interval_days": 7,
      "trigger": "final taper",
      "notes": "Final week at 0.5mg before full cessation. No rebound observed."
    }
  ]',
  'success',
  true,
  'Heavy resistance training + portion control + intuitive eating',
  null,
  165,
  130,
  true,
  'reddit',
  'lilkillerpwny_anon',
  ARRAY[
    'plateau_break',
    'successful_taper',
    'resistance_training',
    'glp1_gip_gcgr',
    'retatrutide',
    'appetite_as_feedback',
    'no_rebound',
    'sustainable_exit',
    'lifetime_dependency_disproven'
  ],
  'User reduced from 165 to 130 lbs in 4 months on Retatrutide 2mg. Broke a plateau at 165 with 2mg Reta. Tapered off by using returning hunger as a natural signal to extend injection intervals: weekly → 10 days → 1mg/14d → 1mg/14d → 0.5mg final week → stopped. No rebound. Maintained results with heavy resistance training and portion control. Key insight: body hunger signal is a reliable biofeedback trigger for extending intervals. Disproves "lifetime dependency" narrative for motivated users with training foundation.',
  'self_reported_tracked'
);
