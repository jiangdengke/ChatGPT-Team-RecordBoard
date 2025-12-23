'use server';

import { getTeams, saveTeams } from '@/lib/data';
import { Member, Team } from '@/types';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

const PASSWORD = 'jiangdk';
const COOKIE_NAME = 'admin_session';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === 'true';
}

export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  if (password === PASSWORD) {
    const cookieStore = await cookies();
    // Valid for 7 days
    cookieStore.set(COOKIE_NAME, 'true', { httpOnly: true, secure: false, maxAge: 60 * 60 * 24 * 7 });
    revalidatePath('/');
    return { success: true };
  }
  return { success: false, error: '密码错误' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  revalidatePath('/');
}

export async function createTeam(formData: FormData) {
  if (!(await checkAuth())) return;

  const name = formData.get('name') as string;
  const ownerEmail = formData.get('ownerEmail') as string;
  
  if (!name || !ownerEmail) return;

  const teams = await getTeams();
  const newTeam: Team = {
    id: randomUUID(),
    name,
    ownerEmail,
    members: [],
  };

  await saveTeams([...teams, newTeam]);
  revalidatePath('/');
}

export async function updateTeam(teamId: string, formData: FormData) {
  if (!(await checkAuth())) return;

  const name = formData.get('name') as string;
  const ownerEmail = formData.get('ownerEmail') as string;

  if (!name || !ownerEmail) return;

  const teams = await getTeams();
  const updatedTeams = teams.map((team) => {
    if (team.id === teamId) {
      return { ...team, name, ownerEmail };
    }
    return team;
  });

  await saveTeams(updatedTeams);
  revalidatePath('/');
}

export async function addMember(teamId: string, formData: FormData) {
  if (!(await checkAuth())) return;
  const email = formData.get('email') as string;
  
  if (!email) return;

  const teams = await getTeams();
  const updatedTeams = teams.map((team) => {
    if (team.id === teamId) {
      // Check for duplicate email in this team (optional but good)
      if (team.members.some(m => m.email === email)) {
          return team;
      }
      
      const newMember: Member = {
        id: randomUUID(),
        email,
      };
      return { ...team, members: [...team.members, newMember] };
    }
    return team;
  });

  await saveTeams(updatedTeams);
  revalidatePath('/');
}

export async function deleteMember(teamId: string, memberId: string) {
  if (!(await checkAuth())) return;
  const teams = await getTeams();
  const updatedTeams = teams.map((team) => {
    if (team.id === teamId) {
      const filteredMembers = team.members.filter((m) => m.id !== memberId);
      return { ...team, members: filteredMembers };
    }
    return team;
  });

  await saveTeams(updatedTeams);
  revalidatePath('/');
}

export async function deleteTeam(teamId: string) {
    if (!(await checkAuth())) return;
    const teams = await getTeams();
    const updatedTeams = teams.filter(t => t.id !== teamId);
    await saveTeams(updatedTeams);
    revalidatePath('/');
}