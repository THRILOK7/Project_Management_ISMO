"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

function AllTasksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering — pre-populate from URL query param (set by dashboard card click)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchApi('/tasks');
        setTasks(data.data || data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Sync status filter → URL and reset pagination
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    router.replace(`/tasks?${params.toString()}`);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.project?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    const matchesPriority = priorityFilter ? t.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Derived heading based on active filter
  const pageTitle =
    statusFilter === 'COMPLETED' ? 'Completed Tasks' :
      statusFilter === 'PENDING' ? 'Pending Tasks' :
        statusFilter === 'IN_PROGRESS' ? 'In-Progress Tasks' :
          'All Tasks';

  const pageSubtitle =
    statusFilter === 'COMPLETED' ? 'Tasks that have been successfully finished' :
      statusFilter === 'PENDING' ? 'Tasks awaiting action' :
        statusFilter === 'IN_PROGRESS' ? 'Tasks currently being worked on' :
          'All tasks across every project';

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 bg-[#0B0F19] min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-150 mb-3">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-100">{pageTitle}</h1>
            <p className="mt-1 text-sm text-slate-400">{pageSubtitle}</p>
          </div>
          {/* Summary badge */}
          <div className="flex items-center gap-2 mt-1">
            <span className="px-3 py-1.5 rounded-lg bg-[#131B2E] border border-slate-800 text-sm text-slate-400">
              <span className="font-bold text-slate-100">{filteredTasks.length}</span> task{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search */}
          <div>
            <label htmlFor="task-search" className="block text-xs font-medium text-slate-400 mb-2">Search Tasks</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="task-search"
                placeholder="Search by task or project name..."
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-[#1E293B] placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          {/* Status filter */}
          <div>
            <label htmlFor="status-filter" className="block text-xs font-medium text-slate-400 mb-2">Filter by Status</label>
            <select
              id="status-filter"
              className="block w-full pl-3 pr-10 py-2.5 border border-slate-700 rounded-lg bg-[#1E293B] text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          {/* Priority filter */}
          <div>
            <label htmlFor="priority-filter" className="block text-xs font-medium text-slate-400 mb-2">Filter by Priority</label>
            <select
              id="priority-filter"
              className="block w-full pl-3 pr-10 py-2.5 border border-slate-700 rounded-lg bg-[#1E293B] text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Content */}
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
                <h3 className="text-sm font-semibold text-rose-300">Error Loading Tasks</h3>
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
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Name</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Date</th>
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#131B2E] divide-y divide-slate-800">
                    {paginatedTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center">
                            <svg className="w-14 h-14 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="mt-3 text-sm font-medium text-slate-400">No tasks found</p>
                            <p className="mt-1 text-xs text-slate-500">Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-800/40 transition-colors duration-150">
                          {/* Task Name */}
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-slate-100">{task.name}</p>
                            {task.description && (
                              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{task.description}</p>
                            )}
                          </td>
                          {/* Project */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {task.project ? (
                              <Link
                                href={`/projects/${task.projectId}/tasks`}
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors duration-150"
                              >
                                {task.project.name}
                              </Link>
                            ) : (
                              <span className="text-slate-500 text-sm">—</span>
                            )}
                          </td>
                          {/* Status Badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${task.status === 'COMPLETED'
                                ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50'
                                : task.status === 'IN_PROGRESS'
                                  ? 'bg-amber-950/50 text-amber-300 border border-amber-800/50'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </td>
                          {/* Priority Badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${task.priority === 'HIGH'
                                ? 'bg-rose-950/50 text-rose-300 border border-rose-800/50'
                                : task.priority === 'MEDIUM'
                                  ? 'bg-amber-950/50 text-amber-300 border border-amber-800/50'
                                  : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50'
                              }`}>
                              {task.priority}
                            </span>
                          </td>
                          {/* Due Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                          </td>
                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link
                              href={`/projects/${task.projectId}/tasks`}
                              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors duration-150"
                            >
                              Open →
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-[#131B2E] px-6 py-4 flex items-center justify-between border-t border-slate-800 rounded-b-xl">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">
                    Showing <span className="font-semibold text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-semibold text-slate-200">{Math.min(currentPage * itemsPerPage, filteredTasks.length)}</span> of{' '}
                    <span className="font-semibold text-slate-200">{filteredTasks.length}</span> results
                  </p>
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
                          ${currentPage === page
                            ? 'z-10 bg-indigo-950/40 border-indigo-700 text-indigo-400'
                            : 'bg-[#1E293B] border-slate-700 text-slate-400 hover:bg-slate-800'
                          }`}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllTasksPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-[#0B0F19]"><div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-800 border-t-indigo-500"></div></div>}>
      <AllTasksContent />
    </Suspense>
  );
}
