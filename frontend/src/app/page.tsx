"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-200"></div>
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-indigo-600 absolute top-0 left-0"></div>
      </div>
    </div>
  );
}
