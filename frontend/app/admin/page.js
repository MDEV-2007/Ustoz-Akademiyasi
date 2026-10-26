'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';

export default function AdminIndexPage() {
  const router = useRouter();
  const { user, loading } = useAdmin();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Boshqaruv paneliga yo‘naltirilmoqda...</span>
      </div>
    </div>
  );
}
