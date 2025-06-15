import React from 'react';
import { Calendar, CheckCircle2, Circle, Timer, Waves, Clock, Play, Pause } from 'lucide-react';
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
      : new Date().toDateString(); // Flexible tasks go to today
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

  const getTaskStatusColor = (task: Task) => {
    if (task.completed) return 'border-green-200 bg-green-50';
    if (task.status === 'active') return 'border-blue-200 bg-blue-50 shadow-md';
    return 'border-gray-100';
  };

  return (
    <div className="px-4 pt-6 pb-4 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Schedule</h1>
          <p className="text-gray-600">Your timeline for focused work</p>
        </div>

        {/* Enhanced Schedule List */}
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-gray-400" />
            </div>
            <h2 className="font-semibold text-gray-900 mb-2">No scheduled tasks</h2>
            <p className="text-gray-600">
              Add tasks from the Today tab to see your schedule here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map(date => {
              const dateTasks = tasksByDate[date];
              const scheduledTasks = dateTasks.filter(t => t.scheduledTime);
              const flexibleTasks = dateTasks.filter(t => !t.scheduledTime);
              
              return (
                <div key={date} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <span>{formatDate(date)}</span>
                    <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                  </h2>
                  
                  {/* Enhanced Scheduled Tasks Timeline */}
                  {scheduledTasks.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Scheduled
                      </h3>
                      {scheduledTasks
                        .sort((a, b) => new Date(a.scheduledTime!).getTime() - new Date(b.scheduledTime!).getTime())
                        .map(task => (
                        <div
                          key={task.id}
                          className={`rounded-xl border transition-all duration-200 hover:shadow-md ${getTaskStatusColor(task)}`}
                        >
                          <div className="p-5">
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
                                <div className="flex items-center mt-3 space-x-3">
                                  <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                                    {formatTime(task.scheduledTime!)}
                                  </span>
                                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                    {task.duration} min
                                  </span>
                                  <Timer size={14} className="text-gray-500" />
                                </div>
                                {!task.completed && (
                                  <div className="mt-4 flex items-center space-x-2">
                                    {task.status !== 'active' ? (
                                      <button
                                        onClick={() => onUpdateTaskStatus(task.id, 'active')}
                                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                                      >
                                        <Play size={14} />
                                        <span>Start Task</span>
                                      </button>
                                    ) : (
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                          <span className="text-sm text-blue-600 font-semibold">Active</span>
                                        </div>
                                        <button
                                          onClick={() => onUpdateTaskStatus(task.id, 'not-started')}
                                          className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                                        >
                                          <Pause size={14} />
                                          <span>Pause</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Enhanced Flexible Tasks */}
                  {flexibleTasks.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                        Flexible
                      </h3>
                      {flexibleTasks.map(task => (
                        <div
                          key={task.id}
                          className={`rounded-xl border transition-all duration-200 hover:shadow-md ${getTaskStatusColor(task)}`}
                        >
                          <div className="p-5">
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
                                <div className="flex items-center mt-3 space-x-3">
                                  <span className="text-sm font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-lg">
                                    Flexible timing
                                  </span>
                                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                    {task.duration} min
                                  </span>
                                  <Waves size={14} className="text-purple-500" />
                                </div>
                                {!task.completed && (
                                  <div className="mt-4 flex items-center space-x-2">
                                    {task.status !== 'active' ? (
                                      <button
                                        onClick={() => onUpdateTaskStatus(task.id, 'active')}
                                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                                      >
                                        <Play size={14} />
                                        <span>Start Task</span>
                                      </button>
                                    ) : (
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                          <span className="text-sm text-blue-600 font-semibold">Active</span>
                                        </div>
                                        <button
                                          onClick={() => onUpdateTaskStatus(task.id, 'not-started')}
                                          className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                                        >
                                          <Pause size={14} />
                                          <span>Pause</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
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
  );
};

export default Schedule;