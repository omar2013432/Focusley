import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Timer, Waves, MoreHorizontal, Trash2, RotateCcw, Play, Pause, Sparkles, Target, Plus, Info } from 'lucide-react';
import Toast from './Toast';
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      setToastMessage('Task added!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleTaskAction = (taskId: string, action: 'delete' | 'reschedule') => {
    if (action === 'delete') {
      onDeleteTask(taskId);
      setToastMessage('Task deleted');
    } else if (action === 'reschedule') {
      onRescheduleTask(taskId);
      setToastMessage('Task rescheduled');
    }
    setActiveTaskMenu(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentActiveTask = activeTasks[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-md mx-auto">
          {/* Beautiful Header with Gradient */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">
                  {getGreeting()}{settings.nickname ? `, ${settings.nickname}` : ''}
                </h1>
                <p className="text-gray-600 text-base mt-2 flex items-center space-x-2">
                  <Sparkles size={16} className="text-blue-500" />
                  <span>{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </p>
              </div>
              {todayTasks.length > 0 && (
                <div className="text-right animate-bounce-gentle">
                  <div className="text-3xl font-bold text-gradient-success">
                    {completedTasks.length}/{todayTasks.length}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">completed</div>
                </div>
              )}
            </div>
            
            {/* Beautiful Progress Bar */}
            {todayTasks.length > 0 && (
              <div className="card-beautiful p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Target size={18} className="text-blue-600" />
                    <span className="text-base font-semibold text-gray-800">Today's Progress</span>
                  </div>
                  <span className="text-sm font-bold text-gradient-primary">{Math.round(progress * 100)}%</span>
                </div>
                <div className="progress-beautiful relative">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress * 100}%` }}
                  />
                  <div className="absolute top-0 left-1/4 h-full w-px bg-white/70"></div>
                  <div className="absolute top-0 left-1/2 h-full w-px bg-white/70"></div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Keep going! You're doing great today.
                </div>
              </div>
            )}
          </div>

          {/* Beautiful Task Input */}
          <div className="mb-8 animate-slide-up">
            <div className="card-beautiful rounded-xl shadow-md hover:shadow-lg transition-all p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] rounded-full">
                  <Plus size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  What do you want to get done today?
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isTimedTask}
                      onChange={(e) => setIsTimedTask(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:outline-none transition-colors duration-200"
                    />
                    <div className="flex items-center space-x-2">
                      <Timer size={18} className="text-orange-500 group-hover:text-orange-600 transition-colors duration-200" />
                      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                        Make this a timed task
                      </span>
                      <Info size={16} className="text-gray-500" title="Timed tasks will be scheduled automatically in your daily focus window" />
                    </div>
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="e.g. Finish homework (45)"
                    className="input-beautiful text-base pr-16 h-12 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    aria-label="Add Task"
                    onClick={handleSubmit}
                    disabled={!taskInput.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform p-2 h-10 bg-orange-500 text-white rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-500">Press Enter to add</p>
                <p className="text-sm text-gray-500">Tip: include the number of minutes in parentheses</p>
              </form>
            </div>
          </div>

          {/* Beautiful Active Task Widget */}
          {currentActiveTask && (
            <div className="mb-8 animate-scale-in">
              <div className="bg-gradient-to-r from-[#007BFF] to-[#0056b3] rounded-lg p-6 text-white shadow-beautiful-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse-soft"></div>
                    <h3 className="font-bold text-lg">Currently Active</h3>
                  </div>
                  <Timer size={20} className="text-white/80" />
                </div>
                <p className="text-white font-semibold text-xl mb-3">{currentActiveTask.title}</p>
                <div className="flex items-center justify-between">
                  <div className="text-white/90 text-sm">
                    <span className="font-medium">{currentActiveTask.duration} minutes</span>
                    {currentActiveTask.scheduledTime && (
                      <span> • Started at {formatTime(currentActiveTask.scheduledTime)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onUpdateTaskStatus(currentActiveTask.id, 'not-started')}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-300 backdrop-blur-sm"
                  >
                    <Pause size={16} />
                    <span>Pause</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Beautiful Flexible Tasks Summary */}
          {flexibleTasks.length > 0 && (
            <div className="mb-8 animate-slide-up">
              <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-lg p-6 text-white shadow-beautiful-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Waves size={20} className="text-white" />
                  <h3 className="font-bold text-lg">Flexible Tasks</h3>
                </div>
                <p className="text-white font-semibold text-xl">
                  {flexibleTasks.length} flexible task{flexibleTasks.length !== 1 ? 's' : ''} remaining
                </p>
                <p className="text-white/90 text-sm mt-2">
                  Complete these at your own pace throughout the day
                </p>
              </div>
            </div>
          )}

          {/* Beautiful Today's Plan */}
          <div className="mt-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <span>Today's Plan</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4"></div>
            </h2>

            {todayTasks.length === 0 ? (
              <div className="card-beautiful p-12 text-center animate-fade-in">
                <div className="empty-state-icon">
                  <Clock size={64} className="text-gray-300 mx-auto animate-float" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Nothing planned yet for today
                </h3>
                <p className="text-gray-600">
                  Add your first task above to get started with your productive day
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayTasks
                  .sort((a, b) => {
                    if (a.scheduledTime && b.scheduledTime) {
                      return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
                    }
                    if (a.scheduledTime && !b.scheduledTime) return -1;
                    if (!a.scheduledTime && b.scheduledTime) return 1;
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                  })
                  .map((task, index) => (
                  <div
                    key={task.id}
                    className={`card-beautiful p-6 transition-all duration-300 relative animate-slide-up animate-scale-in ${
                      task.completed
                        ? 'bg-gradient-orange-soft border-orange-200'
                        : task.status === 'active'
                        ? 'bg-gradient-blue-soft border-blue-200 shadow-beautiful-lg'
                        : 'hover:shadow-beautiful-hover'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="mt-1 transition-all duration-300 hover:scale-110"
                      >
                          {task.completed ? (
                            <CheckCircle2 size={24} className="text-orange-600" />
                          ) : (
                          <Circle size={24} className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-lg leading-tight mb-3 ${
                          task.completed ? 'task-completed' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center flex-wrap gap-3 mb-4">
                          {task.scheduledTime ? (
                            <span className="time-display text-gray-800">
                              {formatTime(task.scheduledTime)}
                            </span>
                          ) : (
                            <span className="task-type-flexible">
                              Flexible
                            </span>
                          )}
                          <span className="time-display text-gray-600">
                            {task.duration} min
                          </span>
                          <div className="flex items-center">
                            {task.isTimedTask ? (
                              <Timer size={16} className="text-blue-500" />
                            ) : (
                              <Waves size={16} className="text-purple-500" />
                            )}
                          </div>
                          {task.status === 'active' && (
                            <div className="status-active flex items-center space-x-2 text-blue-600 font-semibold text-sm">
                              <span>Active</span>
                            </div>
                          )}
                        </div>
                        {!task.completed && (
                          <div className="flex items-center justify-center space-x-3">
                            {task.status !== 'active' ? (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'active')}
                                className="btn-primary flex items-center space-x-2"
                              >
                                <Play size={16} />
                                <span>Start Task</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'not-started')}
                                className="btn-secondary flex items-center space-x-2"
                              >
                                <Pause size={16} />
                                <span>Pause Task</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        {activeTaskMenu === task.id && (
                          <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-beautiful-lg py-2 z-10 min-w-[160px] animate-scale-in">
                            {task.scheduledTime && (
                              <button
                                onClick={() => handleTaskAction(task.id, 'reschedule')}
                                className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <RotateCcw size={16} />
                                <span>Reschedule</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleTaskAction(task.id, 'delete')}
                              className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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
        <Toast message={toastMessage ?? ''} visible={toastMessage !== null} />
      </div>
    </div>
  );
};

export default Dashboard;