export default function ProjectsLoading() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-pulse">
          <div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
          </div>
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden animate-pulse">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
