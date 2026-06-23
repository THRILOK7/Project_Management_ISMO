export default function DashboardLoading() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-3"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                </div>
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
