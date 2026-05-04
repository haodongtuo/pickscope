// 验证数据写入 + 用 anon key 测试读取权限
import https from 'https';

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWV6YWh3YWF4dW54YXhxc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAwNDMsImV4cCI6MjA4OTMzNjA0M30.PWQ4VucqevwqbzGIIGXwv99nupBTe8Bw0Hm7s-x-acU';
const PROJECT_REF = 'mymezahwaaxunxaxqshe';

const options = {
  hostname: `${PROJECT_REF}.supabase.co`,
  path: '/rest/v1/exit_protocols?select=id,substance,outcome,tags',
  method: 'GET',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
  }
};

const req = https.request(options, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      const rows = JSON.parse(d);
      console.log(`✅ anon key 可读，共 ${rows.length} 条记录`);
      rows.forEach(r => console.log(`  - ${r.substance} | ${r.outcome} | ${r.tags?.slice(0,3).join(', ')}`));
    } else {
      console.log(`响应: ${d}`);
    }
  });
});
req.on('error', e => console.error(e.message));
req.end();
