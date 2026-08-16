const bcrypt = require('bcryptjs');

async function run() {
  const password = 'Pa$$w0rd!';
  console.log('Password:', password);
  const salt = await bcrypt.genSalt(12);
  console.log('Generated salt:', salt);
  const hash = await bcrypt.hash(password, salt);
  console.log('Hash:', hash);
  const ok = await bcrypt.compare(password, hash);
  console.log('Compare (should be true):', ok);
  const okFalse = await bcrypt.compare('wrong', hash);
  console.log('Compare wrong (should be false):', okFalse);
}

run().catch((e) => { console.error(e); process.exit(1); });
