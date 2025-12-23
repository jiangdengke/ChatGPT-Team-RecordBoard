'use client';

import { createTeam } from '@/app/actions';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

export default function AddTeam({ isAdmin }: { isAdmin: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);

  if (!isAdmin) return null;

  return (
    <form
      action={async (formData) => {
        await createTeam(formData);
        formRef.current?.reset();
      }}
      ref={formRef}
      className="flex items-center gap-2"
    >
      <input
        type="text"
        name="name"
        placeholder="Team 名称"
        className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
        required
      />
      <input
        type="email"
        name="ownerEmail"
        placeholder="母号邮箱"
        className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm font-medium whitespace-nowrap"
      >
        <Plus size={16} />
        新建 Team
      </button>
    </form>
  );
}