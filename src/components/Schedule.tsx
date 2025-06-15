import React from 'react';
import { Calendar, CheckCircle2, Circle, Timer, Waves, Clock, Play, Pause, CalendarDays } from 'lucide-react';
import { Task, Settings } from '../types';

interface ScheduleProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onDeleteTask: (taskId: string) => void;
  settings: Settings;
}

const Schedule: React.FC<ScheduleProps> = ({ 
  tasks, 
  onToggleTask, 
  onUpdateTaskStatus,
  settings 
}) => {
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

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = task.scheduledTime 
      ? new Date(task.scheduledTime).toDateString()
      : new Date().toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Sort dates
  const sortedDates = Object.keys(tasksByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
    
    if (dateString === today) return 'Today';
    if (dateString === tomorrow) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTaskStatusStyle = (task: Task) => {
    if (task.completed) return 'bg-gradient-green-soft border-green-200';
    if (task.status === 'active') return 'bg-gradient-blue-soft border-blue-200 shadow-beautiful-lg';
    return 'bg-white border-gray-100 hover:shadow-beautiful-hover';
  };

  const getDateIcon = (dateString: string) => {
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
    
    if (dateString === today) return '🌟';
    if (dateString === tomorrow) return '⭐';
    return '📅';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-md mx-auto">
          {/* Beautiful Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <CalendarDays size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">Schedule</h1>
                <p className="text-gray-600 text-base">Your timeline for focused work</p>
              </div>
            </div>
          </div>

          {/* Beautiful Schedule List */}
          {sortedDates.length === 0 ? (
            <div className="card-beautiful p-12 text-center animate-fade-in">
              <div className="empty-state-icon">
                <Calendar size={64} className="text-gray-300 mx-auto animate-float" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">No scheduled tasks</h2>
              <p className="text-gray-600">
                Add tasks from the Today tab to see your schedule here.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDates.map((date, dateIndex) => {
                const dateTasks = tasksByDate[date];
                const scheduledTasks = dateTasks.filter(t => t.scheduledTime);
                const flexibleTasks = dateTasks.filter(t => !t.scheduledTime);
                
                return (
                  <div 
                    key={date} 
                    className="card-beautiful p-8 animate-slide-up"
                    style={{ animationDelay: `${dateIndex * 200}ms` }}
                  >
                    {/* Beautiful Date Header */}
                    <div className="flex items-center space-x-3 mb-8">
                      <span className="text-2xl">{getDateIcon(date)}</span>
                      <h2 className="text-2xl font-bold text-gray-900">{formatDate(date)}</h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4"></div>
                    </div>
                    
                    {/* Beautiful Scheduled Tasks Timeline */}
                    {scheduledTasks.length > 0 && (
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                          <Timer size={18} className="text-blue-600" />
                          <h3 className="text-lg font-bold text-blue-900">Scheduled Tasks</h3>
                        </div>
                        {scheduledTasks
                          .sort((a, b) => new Date(a.scheduledTime!).getTime() - new Date(b.scheduledTime!).getTime())
                          .map((task, taskIndex) => (
                          <div
                            key={task.id}
                            className={`rounded-2xl border transition-all duration-300 p-6 animate-slide-up ${getTaskStatusStyle(task)}`}
                            style={{ animationDelay: `${(dateIndex * 200) + (taskIndex * 100)}ms` }}
                          >
                            <div className="flex items-start space-x-4">
                              <button
                                onClick={() => onToggleTask(task.id)}
                                className="mt-1 transition-all duration-300 hover:scale-110"
                              >
                                {task.completed ? (
                                  <CheckCircle2 size={24} className="text-green-600" />
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
                                  <span className="time-display text-blue-800 font-bold">
                                    {formatTime(task.scheduledTime!)}
                                  </span>
                                  <span className="time-display text-gray-600">
                                    {task.duration} min
                                  </span>
                                  <Timer size={16} className="text-blue-500" />
                                  {task.status === 'active' && (
                                    <div className="status-active flex items-center space-x-2 text-blue-600 font-semibold text-sm">
                                      <span>Active</span>
                                    </div>
                                  )}
                                </div>
                                {!task.completed && (
                                  <div className="flex items-center space-x-3">
                                    {task.status !== 'active' ? (
                                      <button
                                        onClick={() => onUpdateTaskStatus(task.id, 'active')}
                                        className="btn-primary flex items-center space-x-2"
                                      >
                                        <Play size={16} />
                                        <span>Start Task</span>
                                      </button>
                                    ) : (
                                      <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft"></div>
                                          <span>Active Now</span>
                                        </div>
                                        <button
                                          onClick={() => onUpdateTaskStatus(task.id, 'not-started')}
                                          className="btn-secondary flex items-center space-x-2"
                                        >
                                          <Pause size={16} />
                                          <span>Pause</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Beautiful Flexible Tasks */}
                    {flexibleTasks.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <Waves size={18} className="text-purple-600" />
                          <h3 className="text-lg font-bold text-purple-900">Flexible Tasks</h3>
                        </div>
                        {flexibleTasks.map((task, taskIndex) => (
                          <div
                            key={task.id}
                            className={`rounded-2xl border transition-all duration-300 p-6 animate-slide-up ${getTaskStatusStyle(task)}`}
                            style={{ animationDelay: `${(dateIndex * 200) + (scheduledTasks.length * 100) + (taskIndex * 100)}ms` }}
                          >
                            <div className="flex items-start space-x-4">
                              <button
                                onClick={() => onToggleTask(task.id)}
                                className="mt-1 transition-all duration-300 hover:scale-110"
                              >
                                {task.completed ? (
                                  <CheckCircle2 size={24} className="text-green-600" />
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
                                  <span className="task-type-flexible font-bold">
                                    Flexible timing
                                  </span>
                                  <span className="time-display text-gray-600">
                                    {task.duration} min
                                  </span>
                                  <Waves size={16} className="text-purple-500" />
                                  {task.status === 'active' && (
                                    <div className="status-active flex items-center space-x-2 text-blue-600 font-semibold text-sm">
                                      <span>Active</span>
                                    </div>
                                  )}
                                </div>
                                {!task.completed && (
                                  <div className="flex items-center space-x-3">
                                    {task.status !== 'active' ? (
                                      <button
                                        onClick={() => onUpdateTaskStatus(task.id, 'active')}
                                        className="btn-primary flex items-center space-x-2"
                                      >
                                        <Play size={16} />
                                        <span>Start Task</span>
                                      </button>
                                    ) : (
                                      <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft"></div>
                                          <span>Active Now</span>
                                        </div>
                                        <button
                                          onClick={() => onUpdateTaskStatus(task.id, 'not-started')}
                                          className="btn-secondary flex items-center space-x-2"
                                        >
                                          <Pause size={16} />
                                          <span>Pause</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;