const mysql = require('mysql2/promise');

async function setup() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
  });

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS record_board');
    console.log('Database record_board created or already exists.');

    await connection.changeUser({ database: 'record_board' });

    const createTeamsTable = `
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        owner_email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createTeamsTable);
    console.log('Table teams created or already exists.');

    const createMembersTable = `
      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(36) PRIMARY KEY,
        team_id VARCHAR(36) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createMembersTable);
    console.log('Table members created or already exists.');

  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await connection.end();
  }
}

setup();
