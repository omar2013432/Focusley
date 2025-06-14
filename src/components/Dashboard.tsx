import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Timer, Waves, MoreHorizontal, Trash2, RotateCcw } from 'lucide-react';
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
    <div className="px-4 pt-8 pb-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {settings.nickname ? `Hello, ${settings.nickname}` : 'Welcome back'}
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Task Input */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            What do you want to get done today?
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="e.g., Finish homework (45 minutes)"
                className="w-full p-4 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!taskInput.trim()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTimedTask}
                  onChange={(e) => setIsTimedTask(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Timer size={16} className="text-gray-600" />
                <span className="text-gray-700">Make this a timed task</span>
              </label>
            </div>
          </form>
        </div>

        {/* Current Active Task Widget */}
        {currentActiveTask && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-blue-900">Currently Active</h3>
              <Timer size={16} className="text-blue-600" />
            </div>
            <p className="text-blue-800 font-medium">{currentActiveTask.title}</p>
            <p className="text-sm text-blue-600 mt-1">
              {currentActiveTask.duration} minutes
              {currentActiveTask.scheduledTime && (
                <span> • Started at {formatTime(currentActiveTask.scheduledTime)}</span>
              )}
            </p>
          </div>
        )}

        {/* Flexible Tasks Summary */}
        {flexibleTasks.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-1">
              <Waves size={16} className="text-purple-600" />
              <h3 className="font-medium text-purple-900">Flexible Tasks</h3>
            </div>
            <p className="text-purple-800">
              You have {flexibleTasks.length} flexible task{flexibleTasks.length !== 1 ? 's' : ''} left
            </p>
          </div>
        )}

        {/* Progress */}
        {todayTasks.length > 0 && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-gray-900">Today's Progress</h2>
              <span className="text-sm text-gray-600">
                {completedTasks.length}/{todayTasks.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Today's Plan */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Plan</h2>

          {todayTasks.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <Clock size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-2">
                Nothing planned yet for today
              </p>
              <p className="text-sm text-gray-500">
                Add your first task above to get started
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
                  className={`bg-white rounded-xl p-4 border transition-all relative ${
                    task.completed 
                      ? 'border-green-200 bg-green-50' 
                      : task.status === 'active'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={20} className="text-green-600" />
                      ) : (
                        <Circle size={20} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        task.completed ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center mt-1 space-x-3">
                        {task.scheduledTime ? (
                          <span className="text-sm text-gray-600">
                            {formatTime(task.scheduledTime)}
                          </span>
                        ) : (
                          <span className="text-sm text-purple-600">Flexible</span>
                        )}
                        <span className="text-sm text-gray-600">
                          {task.duration} min
                        </span>
                        <div className="flex items-center space-x-1">
                          {task.isTimedTask ? (
                            <Timer size={12} className="text-gray-500" />
                          ) : (
                            <Waves size={12} className="text-purple-500" />
                          )}
                        </div>
                      </div>
                      {!task.completed && task.status !== 'active' && (
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, 'active')}
                          className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
                        >
                          Start Task
                        </button>
                      )}
                      {task.status === 'active' && (
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, 'not-started')}
                          className="text-xs text-gray-600 hover:text-gray-700 mt-2 font-medium"
                        >
                          Pause Task
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {activeTaskMenu === task.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                          {task.scheduledTime && (
                            <button
                              onClick={() => handleTaskAction(task.id, 'reschedule')}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <RotateCcw size={14} />
                              <span>Reschedule</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleTaskAction(task.id, 'delete')}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
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