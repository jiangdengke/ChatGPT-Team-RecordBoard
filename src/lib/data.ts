import pool from './db';
import { Team, Member } from '@/types';
import { RowDataPacket } from 'mysql2';

// Helper to map DB rows to Team objects
interface TeamRow extends RowDataPacket {
  id: string;
  name: string;
  owner_email: string;
  member_id: string | null;
  member_email: string | null;
}

export async function getTeams(): Promise<Team[]> {
  const [rows] = await pool.query<TeamRow[]>(`
    SELECT 
      t.id, t.name, t.owner_email,
      m.id as member_id, m.email as member_email
    FROM teams t
    LEFT JOIN members m ON t.id = m.team_id
  `);

  const teamsMap = new Map<string, Team>();

  rows.forEach(row => {
    if (!teamsMap.has(row.id)) {
      teamsMap.set(row.id, {
        id: row.id,
        name: row.name,
        ownerEmail: row.owner_email,
        members: []
      });
    }

    if (row.member_id && row.member_email) {
      teamsMap.get(row.id)!.members.push({
        id: row.member_id,
        email: row.member_email
      });
    }
  });

  return Array.from(teamsMap.values());
}

export async function createTeam(team: Team): Promise<void> {
  await pool.query(
    'INSERT INTO teams (id, name, owner_email) VALUES (?, ?, ?)',
    [team.id, team.name, team.ownerEmail]
  );
}

export async function updateTeam(team: Team): Promise<void> {
  await pool.query(
    'UPDATE teams SET name = ?, owner_email = ? WHERE id = ?',
    [team.name, team.ownerEmail, team.id]
  );
}

export async function deleteTeam(teamId: string): Promise<void> {
  // Cascading delete handles members
  await pool.query('DELETE FROM teams WHERE id = ?', [teamId]);
}

export async function addMember(teamId: string, member: Member): Promise<void> {
  await pool.query(
    'INSERT INTO members (id, team_id, email) VALUES (?, ?, ?)',
    [member.id, teamId, member.email]
  );
}

export async function deleteMember(memberId: string): Promise<void> {
  await pool.query('DELETE FROM members WHERE id = ?', [memberId]);
}