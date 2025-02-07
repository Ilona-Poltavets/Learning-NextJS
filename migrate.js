const fs = require('fs');
const path = require('path');
const { query } = require('./src/app/lib/db_for_migration');

const migrationsDir = path.join(__dirname, 'migrations');

async function runMigration(file) {
  const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
  try {
    await query(migrationSQL);
    console.log(`Migration ${file} applied successfully.`);
  } catch (err) {
    console.error(`Error running migration ${file}:`, err);
  }
}

async function applyMigrations() {
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    await runMigration(file);
  }
}

applyMigrations().finally(() => {
  process.exit();
});
