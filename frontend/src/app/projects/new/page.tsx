"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

export default function NewProject() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('NOT_STARTED');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          status,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
        }),
      });
      router.push('/projects');
    } catch (err: any) {
      setError(err.message || 'Validation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-150">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-slate-100">
            Create New Project
          </h2>
          <p className="mt-2 text-sm text-slate-400">Fill in the details to create a new project</p>
        </div>

        <div className="bg-[#131B2E] rounded-xl border border-slate-800 px-6 py-8 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-950/50 border border-rose-800/50 rounded-xl p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-rose-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-rose-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-2">Project Name <span className="text-rose-400">*</span></label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="block w-full px-4 py-3 border border-slate-700 rounded-lg placeholder-slate-500 text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-medium text-slate-400 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="block w-full px-4 py-3 border border-slate-700 rounded-lg placeholder-slate-500 text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                placeholder="Provide a brief description of the project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-medium text-slate-400 mb-2">Status</label>
              <select
                id="status"
                name="status"
                className="block w-full px-4 py-3 border border-slate-700 rounded-lg text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-xs font-medium text-slate-400 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="block w-full px-4 py-3 border border-slate-700 rounded-lg text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-xs font-medium text-slate-400 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="block w-full px-4 py-3 border border-slate-700 rounded-lg text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-800">
              <Link
                href="/projects"
                className="px-5 py-2.5 border border-slate-700 rounded-lg text-sm font-semibold text-slate-300 bg-[#1E293B] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#131B2E] transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#131B2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Project
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
