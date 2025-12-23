const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const DATA_FILE = path.join(__dirname, '../data.json');

async function migrate() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log('No data.json found.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const teams = data.teams || [];

  if (teams.length === 0) {
    console.log('No teams to migrate.');
    return;
  }

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'record_board'
  });

  try {
    for (const team of teams) {
      console.log(`Migrating team: ${team.name}`);
      
      // Check if exists
      const [existing] = await connection.query('SELECT id FROM teams WHERE id = ?', [team.id]);
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO teams (id, name, owner_email) VALUES (?, ?, ?)',
          [team.id, team.name, team.ownerEmail]
        );
      } else {
        console.log(`Team ${team.name} already exists, skipping insert.`);
      }

      for (const member of team.members) {
        const [existingMember] = await connection.query('SELECT id FROM members WHERE id = ?', [member.id]);
        if (existingMember.length === 0) {
           await connection.query(
            'INSERT INTO members (id, team_id, email) VALUES (?, ?, ?)',
            [member.id, team.id, member.email]
          );
        }
      }
    }
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
