"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

export default function ProjectTasks() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Task Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskStatus, setTaskStatus] = useState('PENDING');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectData, tasksData] = await Promise.all([
          fetchApi(`/projects/${projectId}`),
          fetchApi('/tasks')
        ]);
        setProject(projectData);
        // Filter tasks for this project, supporting both the old array format and the new { data, meta } format
        const tasksArray = tasksData.data || tasksData;
        setTasks(tasksArray.filter((t: any) => t.projectId === projectId));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const resetForm = () => {
    setIsEditing(false);
    setEditingTaskId(null);
    setTaskName('');
    setTaskDescription('');
    setTaskPriority('MEDIUM');
    setTaskStatus('PENDING');
    setTaskDueDate('');
  };

  const handleEditClick = (task: any) => {
    setIsEditing(true);
    setEditingTaskId(task.id);
    setTaskName(task.name);
    setTaskDescription(task.description || '');
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);

    try {
      if (isEditing && editingTaskId) {
        const updatedTask = await fetchApi(`/tasks/${editingTaskId}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: taskName,
            description: taskDescription,
            priority: taskPriority,
            status: taskStatus,
            dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null,
          })
        });
        setTasks(tasks.map(t => t.id === editingTaskId ? updatedTask : t));
      } else {
        const newTask = await fetchApi('/tasks', {
          method: 'POST',
          body: JSON.stringify({
            name: taskName,
            description: taskDescription,
            priority: taskPriority,
            status: taskStatus,
            dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null,
            projectId,
          })
        });
        setTasks([newTask, ...tasks]);
      }
      resetForm();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleCompleteTask = async (task: any) => {
    setIsFormLoading(true);
    try {
      const updatedTask = await fetchApi(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...task,
          status: 'COMPLETED'
        })
      });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await fetchApi(`/tasks/${taskId}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err: any) {
      alert(err.message);
    }
  };

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

  if (error || !project) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="bg-rose-950/50 border border-rose-800/50 rounded-xl p-6 max-w-md">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-rose-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-rose-300">Error Loading Tasks</h3>
              <p className="text-sm text-rose-400 mt-1">{error || 'Project not found'}</p>
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
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-150">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-100">Tasks for {project.name}</h1>
          <p className="mt-2 text-sm text-slate-400">Manage and track all tasks for this project</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-[#131B2E] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 bg-[#0F1629] border-b border-slate-800">
                <h2 className="text-lg font-semibold text-slate-100">Task List</h2>
              </div>
              <ul className="divide-y divide-slate-800">
                {tasks.length === 0 ? (
                  <li className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="mt-3 text-sm font-medium text-slate-400">No tasks found</p>
                      <p className="mt-1 text-xs text-slate-500">Create your first task to get started</p>
                    </div>
                  </li>
                ) : (
                  tasks.map((task) => (
                    <li key={task.id} className="px-6 py-5 hover:bg-slate-800/30 transition-colors duration-150">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-semibold text-slate-100 truncate">{task.name}</h3>
                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${task.priority === 'HIGH' ? 'bg-rose-950/50 text-rose-300 border border-rose-800/50' : 
                                task.priority === 'MEDIUM' ? 'bg-amber-950/50 text-amber-300 border border-amber-800/50' : 
                                'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50'}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${task.status === 'COMPLETED' ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50' : 
                                task.status === 'IN_PROGRESS' ? 'bg-amber-950/50 text-amber-300 border border-amber-800/50' : 
                                'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-slate-400 mb-3">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Created: {new Date(task.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="flex items-center space-x-2">
                            {task.status !== 'COMPLETED' && (
                              <button 
                                onClick={() => handleCompleteTask(task)} 
                                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/50 transition-colors duration-150"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Complete
                              </button>
                            )}
                            <button 
                              onClick={() => handleEditClick(task)} 
                              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/50 transition-colors duration-150"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)} 
                              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-300 bg-rose-950/50 hover:bg-rose-900/50 border border-rose-800/50 transition-colors duration-150"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#131B2E] rounded-xl border border-slate-800 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-100">
                  {isEditing ? 'Edit Task' : 'Add New Task'}
                </h3>
                {isEditing && (
                  <button
                    onClick={resetForm}
                    className="text-slate-500 hover:text-slate-300 transition-colors duration-150"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <form onSubmit={handleTaskSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Task Name <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg placeholder-slate-500 text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-sm"
                    placeholder="Enter task name"
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg placeholder-slate-500 text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-sm"
                    placeholder="Add details about the task"
                    value={taskDescription}
                    onChange={e => setTaskDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Priority</label>
                  <select
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-sm"
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Status</label>
                  <select
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-sm"
                    value={taskStatus}
                    onChange={e => setTaskStatus(e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg text-slate-100 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-sm"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 border border-slate-700 rounded-lg text-sm font-semibold text-slate-300 bg-[#1E293B] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#131B2E] transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isFormLoading}
                    className="inline-flex justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#131B2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isFormLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (isEditing ? 'Update Task' : 'Add Task')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
