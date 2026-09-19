const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

// Parse .env manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
let dbUrl = '';
for (const line of envContent.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.replace('DATABASE_URL=', '').trim().replace(/^['"]|['"]$/g, '');
  }
}

if (!dbUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  const users = await sql`SELECT id, name, email, role, tenant_id, created_at FROM "user"`;
  console.log("USERS_RESULT_START");
  console.log(JSON.stringify(users, null, 2));
  console.log("USERS_RESULT_END");

  const invites = await sql`SELECT id, email, role, tenant_id, created_at FROM "invite"`;
  console.log("INVITES_RESULT_START");
  console.log(JSON.stringify(invites, null, 2));
  console.log("INVITES_RESULT_END");
  
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
