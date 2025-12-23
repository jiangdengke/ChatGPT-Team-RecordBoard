import { getTeams } from '@/lib/data';
import TeamCard from '@/components/TeamCard';
import AddTeam from '@/components/AddTeam';
import AdminBar from '@/components/AdminBar';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const teams = await getTeams();
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'true';

  return (
    <main className="min-h-screen flex flex-col bg-slate-100">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ChatGPT Team 邀请看板</h1>
        </div>
        <div className="flex items-center gap-4">
            <AdminBar isAdmin={isAdmin} />
            <AddTeam isAdmin={isAdmin} />
        </div>
      </header>

      {/* Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full p-6 flex gap-6 items-start">
            {teams.map((team) => (
                <TeamCard key={team.id} team={team} isAdmin={isAdmin} />
            ))}
            
            {teams.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 mt-20">
                    <p className="text-lg">暂无团队。</p>
                    <p className="text-sm">
                        {isAdmin ? '请在右上方创建新团队以开始使用。' : '请使用管理员密码登录以管理团队。'}
                    </p>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}