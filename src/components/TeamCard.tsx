'use client';

import { addMember, deleteMember, deleteTeam } from '@/app/actions';
import { Member, Team } from '@/types';
import { Mail, Trash2, User, X, Shield } from 'lucide-react';
import { useRef, useState } from 'react';

interface TeamCardProps {
  team: Team;
  isAdmin: boolean;
}

export default function TeamCard({ team, isAdmin }: TeamCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Limit: Owner + 4 members. The members array stores the invited ones.
  const isFull = team.members.length >= 4;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col w-80 max-h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-lg">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-slate-800 text-lg truncate" title={team.name}>{team.name}</h3>
            {isAdmin && (
                <button
                onClick={() => {
                    if (confirm('确定要删除这个团队吗？')) {
                    deleteTeam(team.id);
                    }
                }}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="删除团队"
                >
                <Trash2 size={16} />
                </button>
            )}
        </div>
        
        {/* Owner Email Display */}
        <div className="flex items-center gap-2 text-slate-600 bg-blue-50 px-2 py-1.5 rounded text-xs border border-blue-100">
            <Shield size={12} className="text-blue-600" />
            <span className="font-medium text-blue-900">母号:</span>
            <span className="truncate" title={team.ownerEmail}>{team.ownerEmail}</span>
        </div>
      </div>

      {/* Member List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <div className="px-2 py-1 flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">邀请成员 ({team.members.length}/4)</span>
        </div>

        {team.members.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm italic">
            暂无邀请成员
          </div>
        ) : (
          team.members.map((member) => (
            <MemberItem key={member.id} member={member} teamId={team.id} isAdmin={isAdmin} />
          ))
        )}
      </div>

      {/* Add Member Footer */}
      {isAdmin && (
          <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-lg">
            {isAdding ? (
              <form
                action={async (formData) => {
                  await addMember(team.id, formData);
                  formRef.current?.reset();
                  setIsAdding(false);
                }}
                ref={formRef}
                className="space-y-2"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="被邀请人邮箱"
                  className="w-full px-2 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                  >
                    添加
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                disabled={isFull}
                className={`w-full py-2 text-sm rounded border border-dashed flex items-center justify-center gap-1 transition-colors ${
                    isFull 
                    ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
                    : 'text-slate-500 hover:bg-slate-100 border-slate-300'
                }`}
              >
                {isFull ? (
                    <span>已满员 (4人)</span>
                ) : (
                    <>
                        <User size={16} />
                        添加邀请成员
                    </>
                )}
              </button>
            )}
          </div>
      )}
    </div>
  );
}

function MemberItem({ member, teamId, isAdmin }: { member: Member; teamId: string; isAdmin: boolean }) {
  return (
    <div className="p-3 bg-white border border-slate-100 rounded flex items-center justify-between group hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 overflow-hidden">
        <Mail size={14} className="text-slate-400 flex-shrink-0" />
        <span className="text-sm text-slate-700 truncate" title={member.email}>
            {member.email}
        </span>
      </div>
      
      {isAdmin && (
        <button
            onClick={() => {
                if (confirm('确认移除该成员吗？')) deleteMember(teamId, member.id);
            }}
            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            title="移除成员"
        >
            <X size={14} />
        </button>
      )}
    </div>
  );
}