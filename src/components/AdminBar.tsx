'use client';

import { login, logout } from '@/app/actions';
import { LogIn, LogOut, Lock } from 'lucide-react';
import { useState } from 'react';

export default function AdminBar({ isAdmin }: { isAdmin: boolean }) {
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');

  if (isAdmin) {
    return (
      <form action={logout}>
        <button
          type="submit"
          className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          title="退出管理员模式"
        >
          <LogOut size={16} />
          退出
        </button>
      </form>
    );
  }

  return (
    <div className="relative">
      {!showLogin ? (
        <button
          onClick={() => setShowLogin(true)}
          className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          <Lock size={16} />
          管理员
        </button>
      ) : (
        <form
          action={async (formData) => {
            const res = await login(formData);
            if (!res.success) {
              setError(res.error || 'Login failed');
            } else {
              setShowLogin(false);
              setError('');
            }
          }}
          className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4"
        >
          <input
            type="password"
            name="password"
            placeholder="输入密码"
            className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
            autoFocus
          />
          <button
            type="submit"
            className="bg-slate-800 text-white p-1 rounded hover:bg-slate-700"
            title="登录"
          >
            <LogIn size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
                setShowLogin(false);
                setError('');
            }}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            取消
          </button>
          {error && <span className="text-xs text-red-500 absolute top-full right-0 mt-1 whitespace-nowrap">{error}</span>}
        </form>
      )}
    </div>
  );
}
