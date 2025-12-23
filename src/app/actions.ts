'use server';

import { 
  getTeams, 
  createTeam as createTeamDb, 
  updateTeam as updateTeamDb, 
  deleteTeam as deleteTeamDb, 
  addMember as addMemberDb, 
  deleteMember as deleteMemberDb 
} from '@/lib/data';
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

  const newTeam: Team = {
    id: randomUUID(),
    name,
    ownerEmail,
    members: [],
  };

  await createTeamDb(newTeam);
  revalidatePath('/');
}

export async function updateTeam(teamId: string, formData: FormData) {
  if (!(await checkAuth())) return;

  const name = formData.get('name') as string;
  const ownerEmail = formData.get('ownerEmail') as string;

  if (!name || !ownerEmail) return;

  // We only update the team details, not members here
  const teamToUpdate: Team = {
    id: teamId,
    name,
    ownerEmail,
    members: [], // Not used in updateTeamDb
  };

  await updateTeamDb(teamToUpdate);
  revalidatePath('/');
}

export async function addMember(teamId: string, formData: FormData) {
  if (!(await checkAuth())) return;
  const email = formData.get('email') as string;
  
  if (!email) return;

  const teams = await getTeams();
  const team = teams.find(t => t.id === teamId);
  
  if (team) {
      if (team.members.some(m => m.email === email)) {
          return; // Already exists
      }

      const newMember: Member = {
        id: randomUUID(),
        email,
      };
      
      await addMemberDb(teamId, newMember);
  }

  revalidatePath('/');
}

export async function deleteMember(teamId: string, memberId: string) {
  if (!(await checkAuth())) return;
  // teamId is not strictly needed for deletion if memberId is unique, but kept for signature compatibility if needed
  await deleteMemberDb(memberId);
  revalidatePath('/');
}

export async function deleteTeam(teamId: string) {
    if (!(await checkAuth())) return;
    await deleteTeamDb(teamId);
    revalidatePath('/');
}
