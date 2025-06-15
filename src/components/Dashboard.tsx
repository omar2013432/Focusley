import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Timer, Waves, MoreHorizontal, Trash2, RotateCcw, Play, Pause } from 'lucide-react';
import { Task, Settings } from '../types';

interface DashboardProps {
  tasks: Task[];
  onAddTask: (input: string, isTimedTask?: boolean) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onDeleteTask: (taskId: string) => void;
  onRescheduleTask: (taskId: string) => void;
  settings: Settings;
}

const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onRescheduleTask,
  settings
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [isTimedTask, setIsTimedTask] = useState(true);
  const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null);

  const today = new Date().toDateString();
  const todayTasks = tasks.filter(task => 
    !task.scheduledTime || new Date(task.scheduledTime).toDateString() === today
  );
  
  const completedTasks = todayTasks.filter(task => task.completed);
  const activeTasks = todayTasks.filter(task => task.status === 'active');
  const flexibleTasks = todayTasks.filter(task => !task.isTimedTask && !task.completed);
  
  const progress = todayTasks.length > 0 ? completedTasks.length / todayTasks.length : 0;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    if (settings.timeFormat === '12h') {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim()) {
      onAddTask(taskInput.trim(), isTimedTask);
      setTaskInput('');
    }
  };

  const handleTaskAction = (taskId: string, action: 'delete' | 'reschedule') => {
    if (action === 'delete') {
      onDeleteTask(taskId);
    } else if (action === 'reschedule') {
      onRescheduleTask(taskId);
    }
    setActiveTaskMenu(null);
  };

  const currentActiveTask = activeTasks[0];

  return (
    <div className="px-4 pt-6 pb-4 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                {settings.nickname ? `Hello, ${settings.nickname}` : 'Welcome back'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {todayTasks.length > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {completedTasks.length}/{todayTasks.length}
                </div>
                <div className="text-xs text-gray-500">completed</div>
              </div>
            )}
          </div>
          
          {/* Enhanced Progress Bar */}
          {todayTasks.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Today's Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Task Input */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What do you want to get done today?
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="e.g., Finish homework (45 minutes)"
                  className="w-full p-4 pr-14 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!taskInput.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isTimedTask}
                    onChange={(e) => setIsTimedTask(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                  />
                  <Timer size={16} className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    Make this a timed task
                  </span>
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Enhanced Current Active Task Widget */}
        {currentActiveTask && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="font-semibold text-blue-900">Currently Active</h3>
              </div>
              <Timer size={18} className="text-blue-600" />
            </div>
            <p className="text-blue-800 font-medium text-lg mb-2">{currentActiveTask.title}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-600">
                {currentActiveTask.duration} minutes
                {currentActiveTask.scheduledTime && (
                  <span> • Started at {formatTime(currentActiveTask.scheduledTime)}</span>
                )}
              </p>
              <button
                onClick={() => onUpdateTaskStatus(currentActiveTask.id, 'not-started')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <Pause size={14} />
                <span>Pause</span>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Flexible Tasks Summary */}
        {flexibleTasks.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Waves size={18} className="text-purple-600" />
              <h3 className="font-semibold text-purple-900">Flexible Tasks</h3>
            </div>
            <p className="text-purple-800 font-medium">
              {flexibleTasks.length} flexible task{flexibleTasks.length !== 1 ? 's' : ''} remaining
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Complete these at your own pace
            </p>
          </div>
        )}

        {/* Enhanced Today's Plan */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Today's Plan</h2>

          {todayTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Nothing planned yet for today
              </h3>
              <p className="text-gray-600 text-sm">
                Add your first task above to get started with your productive day
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks
                .sort((a, b) => {
                  // Sort by scheduled time, then by creation time
                  if (a.scheduledTime && b.scheduledTime) {
                    return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
                  }
                  if (a.scheduledTime && !b.scheduledTime) return -1;
                  if (!a.scheduledTime && b.scheduledTime) return 1;
                  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                })
                .map(task => (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl p-5 border transition-all duration-200 relative shadow-sm hover:shadow-md ${
                    task.completed 
                      ? 'border-green-200 bg-green-50' 
                      : task.status === 'active'
                      ? 'border-blue-200 bg-blue-50 shadow-md'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-1 transition-transform duration-200 hover:scale-110"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={22} className="text-green-600" />
                      ) : (
                        <Circle size={22} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-lg leading-tight ${
                        task.completed ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center mt-2 space-x-4">
                        {task.scheduledTime ? (
                          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                            {formatTime(task.scheduledTime)}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-lg">
                            Flexible
                          </span>
                        )}
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                          {task.duration} min
                        </span>
                        <div className="flex items-center">
                          {task.isTimedTask ? (
                            <Timer size={14} className="text-gray-500" />
                          ) : (
                            <Waves size={14} className="text-purple-500" />
                          )}
                        </div>
                      </div>
                      {!task.completed && (
                        <div className="mt-3 flex items-center space-x-2">
                          {task.status !== 'active' ? (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, 'active')}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                            >
                              <Play size={14} />
                              <span>Start Task</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, 'not-started')}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                            >
                              <Pause size={14} />
                              <span>Pause Task</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {activeTaskMenu === task.id && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10 min-w-[140px]">
                          {task.scheduledTime && (
                            <button
                              onClick={() => handleTaskAction(task.id, 'reschedule')}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <RotateCcw size={16} />
                              <span>Reschedule</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleTaskAction(task.id, 'delete')}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;