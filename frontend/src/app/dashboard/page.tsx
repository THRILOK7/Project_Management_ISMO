"use client";

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

interface DashboardMetrics {
  totalProjects: number;
  projectsInProgress: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Use the dedicated dashboard endpoint — single optimized DB query
        // instead of fetching all projects + all tasks separately
        const data = await fetchApi('/projects/dashboard');
        setMetrics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array - only run once

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-800"></div>
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-indigo-500 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="bg-rose-950/50 border border-rose-800/50 rounded-xl p-6 max-w-md">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-rose-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-rose-300">Error Loading Dashboard</h3>
              <p className="text-sm text-rose-400 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 bg-[#0B0F19] min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-slate-400">Click any card to explore the details</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Projects Card → /projects (all) */}
          <Link href="/projects" className="group bg-[#131B2E] overflow-hidden rounded-xl border border-slate-800 hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-950/50 transition-all duration-200 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Total Projects</p>
                  <p className="text-3xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors duration-200">{metrics?.totalProjects}</p>
                  <p className="text-xs text-slate-500 mt-2">All projects in workspace</p>
                  <p className="text-xs text-indigo-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">View all →</p>
                </div>
                <div className="flex-shrink-0 bg-indigo-950/40 group-hover:bg-indigo-900/40 rounded-xl p-4 transition-colors duration-200">
                  <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Projects In Progress Card → /projects?status=IN_PROGRESS */}
          <Link href="/projects?status=IN_PROGRESS" className="group bg-[#131B2E] overflow-hidden rounded-xl border border-slate-800 hover:border-amber-700/60 hover:shadow-lg hover:shadow-amber-950/50 transition-all duration-200 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors duration-200">{metrics?.projectsInProgress}</p>
                  <p className="text-xs text-slate-500 mt-2">Active projects</p>
                  <p className="text-xs text-amber-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">View all →</p>
                </div>
                <div className="flex-shrink-0 bg-amber-950/50 group-hover:bg-amber-900/40 rounded-xl p-4 transition-colors duration-200">
                  <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Total Tasks Card → /tasks (all) */}
          <Link href="/tasks" className="group bg-[#131B2E] overflow-hidden rounded-xl border border-slate-800 hover:border-violet-700/60 hover:shadow-lg hover:shadow-violet-950/50 transition-all duration-200 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-100 group-hover:text-violet-300 transition-colors duration-200">{metrics?.totalTasks}</p>
                  <p className="text-xs text-slate-500 mt-2">All tasks created</p>
                  <p className="text-xs text-violet-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">View all →</p>
                </div>
                <div className="flex-shrink-0 bg-violet-950/40 group-hover:bg-violet-900/40 rounded-xl p-4 transition-colors duration-200">
                  <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Pending Tasks Card → /tasks?status=PENDING */}
          <Link href="/tasks?status=PENDING" className="group bg-[#131B2E] overflow-hidden rounded-xl border border-slate-800 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-950/50 transition-all duration-200 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Pending Tasks</p>
                  <p className="text-3xl font-bold text-slate-100 group-hover:text-slate-200 transition-colors duration-200">{metrics?.pendingTasks}</p>
                  <p className="text-xs text-slate-500 mt-2">Awaiting action</p>
                  <p className="text-xs text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">View all →</p>
                </div>
                <div className="flex-shrink-0 bg-slate-800 group-hover:bg-slate-700/60 rounded-xl p-4 transition-colors duration-200">
                  <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Completed Tasks Card → /tasks?status=COMPLETED */}
          <Link href="/tasks?status=COMPLETED" className="group bg-[#131B2E] overflow-hidden rounded-xl border border-slate-800 hover:border-emerald-700/60 hover:shadow-lg hover:shadow-emerald-950/50 transition-all duration-200 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Completed Tasks</p>
                  <p className="text-3xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors duration-200">{metrics?.completedTasks}</p>
                  <p className="text-xs text-slate-500 mt-2">Successfully finished</p>
                  <p className="text-xs text-emerald-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">View all →</p>
                </div>
                <div className="flex-shrink-0 bg-emerald-950/50 group-hover:bg-emerald-900/40 rounded-xl p-4 transition-colors duration-200">
                  <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
