import https from 'https';

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc2MDA0MywiZXhwIjoyMDg5MzM2MDQzfQ.0SB5YsHu53hh61BV2izACCGwU4UBMcFJHKk6KzEsSOU';
const PROJECT_REF = 'mymezahwaaxunxaxqshe';

async function insert(table, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path: `/rest/v1/${table}`,
      method: 'POST',
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

const record = {
  substance: 'Retatrutide',
  substance_category: 'GLP-1/GIP/GCGR triple agonist',
  peak_dose: '2mg',
  duration_of_use: '4 months',
  taper_steps: [
    {
      phase: 1,
      dose: '2mg',
      interval_days: 10,
      trigger: 'hunger signals returning — used as natural cue to extend interval',
      notes: 'Extended from weekly to 10-day intervals when appetite began to return. Body used as feedback sensor.'
    },
    {
      phase: 2,
      dose: '1mg',
      interval_days: 14,
      trigger: 'planned step-down',
      notes: 'Reduced dose to 1mg at 14-day intervals. Continued resistance training throughout.'
    },
    {
      phase: 3,
      dose: '1mg',
      interval_days: 14,
      trigger: 'continued maintenance',
      notes: 'Held at 1mg every 14 days to allow metabolic recalibration.'
    },
    {
      phase: 4,
      dose: '0.5mg',
      interval_days: 7,
      trigger: 'final taper',
      notes: 'Final week at 0.5mg before full cessation. No rebound observed.'
    }
  ],
  outcome: 'success',
  maintained_loss: true,
  maintenance_strategy: 'Heavy resistance training + portion control + intuitive eating',
  months_since_stopped: null,
  starting_weight_lbs: 165,
  ending_weight_lbs: 130,
  goal_achieved: true,
  source_platform: 'reddit',
  source_username: 'lilkillerpwny_anon',
  tags: [
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
  ai_summary: 'User reduced from 165 to 130 lbs in 4 months on Retatrutide 2mg. Broke a plateau at 165 with 2mg Reta. Tapered off by using returning hunger as a natural signal to extend injection intervals: weekly → 10 days → 1mg/14d → 1mg/14d → 0.5mg final week → stopped. No rebound. Maintained results with heavy resistance training and portion control. Key insight: body hunger signal is a reliable biofeedback trigger for extending intervals. Disproves "lifetime dependency" narrative for motivated users with training foundation.',
  evidence_quality: 'self_reported_tracked'
};

console.log('插入第一条退出协议数据...');
const r = await insert('exit_protocols', record);
console.log(`Status: ${r.status}`);

if (r.status === 201) {
  const data = JSON.parse(r.body);
  console.log(`\n✅ 写入成功！`);
  console.log(`   ID: ${data[0].id}`);
  console.log(`   Substance: ${data[0].substance}`);
  console.log(`   Outcome: ${data[0].outcome}`);
  console.log(`   Tags: ${data[0].tags.join(', ')}`);
} else {
  console.log(`❌ 失败: ${r.body}`);
}
