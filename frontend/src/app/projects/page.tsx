"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

export default function ProjectsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering and Search State — pre-populate from URL query param
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get('status') || '');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchApi('/projects');
        setProjects(data.data || data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []); // Empty dependency - only load once

  // Sync filter dropdown → URL, and reset to page 1 when filter changes
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    router.replace(`/projects?${params.toString()}`);
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetchApi(`/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 bg-[#0B0F19] min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Projects</h1>
            <p className="mt-1 text-sm text-slate-400">Manage and organize all your projects</p>
          </div>
          <Link 
            href="/projects/new"
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#0B0F19] transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Project
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-xs font-medium text-slate-400 mb-2">Search Projects</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search by name..."
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg leading-5 bg-[#1E293B] placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-xs font-medium text-slate-400 mb-2">Filter by Status</label>
            <select
              id="statusFilter"
              className="block w-full pl-3 pr-10 py-2.5 text-base border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 sm:text-sm rounded-lg bg-[#1E293B] text-slate-100 transition-all duration-200"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-800"></div>
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-indigo-500 absolute top-0 left-0"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-rose-950/50 border border-rose-800/50 rounded-xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-rose-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-rose-300">Error Loading Projects</h3>
                <p className="text-sm text-rose-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
          <div className="bg-[#131B2E] rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-[#0F1629]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      End Date
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#131B2E] divide-y divide-slate-800">
                  {paginatedProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="mt-3 text-sm font-medium text-slate-400">No projects found</p>
                          <p className="mt-1 text-xs text-slate-500">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-800/40 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/projects/${project.id}/tasks`} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors duration-150">
                            {project.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${project.status === 'COMPLETED' ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50' : 
                              project.status === 'IN_PROGRESS' ? 'bg-amber-950/50 text-amber-300 border border-amber-800/50' : 
                              'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                            {project.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <Link href={`/projects/${project.id}/tasks`} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-150">
                              Tasks
                            </Link>
                            <span className="text-slate-700">|</span>
                            <Link href={`/projects/${project.id}/edit`} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150">
                              Edit
                            </Link>
                            <span className="text-slate-700">|</span>
                            <button onClick={() => deleteProject(project.id)} className="text-rose-400 hover:text-rose-300 font-medium transition-colors duration-150">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-[#131B2E] px-6 py-4 flex items-center justify-between border-t border-slate-800 rounded-b-xl mt-0">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Showing <span className="font-semibold text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-200">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> of <span className="font-semibold text-slate-200">{filteredProjects.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-slate-700 bg-[#1E293B] text-sm font-medium text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="ml-1">Previous</span>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold transition-colors duration-150
                          ${currentPage === page ? 'z-10 bg-indigo-950/40 border-indigo-700 text-indigo-400' : 'bg-[#1E293B] border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-slate-700 bg-[#1E293B] text-sm font-medium text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      <span className="mr-1">Next</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
