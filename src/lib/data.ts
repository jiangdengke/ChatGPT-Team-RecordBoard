import fs from 'fs/promises';
import path from 'path';
import { Data, Team } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data.json');

async function readData(): Promise<Data> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or error, return empty
    return { teams: [] };
  }
}

async function writeData(data: Data): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getTeams(): Promise<Team[]> {
  const data = await readData();
  return data.teams;
}

export async function saveTeams(teams: Team[]): Promise<void> {
  const data = { teams };
  await writeData(data);
}
