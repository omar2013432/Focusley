import React from 'react';
import { Calendar, CheckCircle2, Circle, Timer, Waves, Clock } from 'lucide-react';
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
    if (task.status === 'active') return 'border-blue-200 bg-blue-50';
    return 'border-gray-100';
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Schedule</h1>
          <p className="text-gray-600">Your timeline for focused work</p>
        </div>

        {/* Schedule List */}
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <Calendar size={32} className="mx-auto mb-3 text-gray-400" />
            <h2 className="font-medium text-gray-900 mb-2">No scheduled tasks</h2>
            <p className="text-gray-600">
              Add tasks from the Today tab to see your schedule here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => {
              const dateTasks = tasksByDate[date];
              const scheduledTasks = dateTasks.filter(t => t.scheduledTime);
              const flexibleTasks = dateTasks.filter(t => !t.scheduledTime);
              
              return (
                <div key={date}>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 px-1">
                    {formatDate(date)}
                  </h2>
                  
                  {/* Scheduled Tasks Timeline */}
                  {scheduledTasks.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h3 className="text-sm font-medium text-gray-700 px-1">Scheduled</h3>
                      {scheduledTasks
                        .sort((a, b) => new Date(a.scheduledTime!).getTime() - new Date(b.scheduledTime!).getTime())
                        .map(task => (
                        <div
                          key={task.id}
                          className={`bg-white rounded-xl border transition-all ${getTaskStatusColor(task)}`}
                        >
                          <div className="p-4">
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
                                <div className="flex items-center mt-2 space-x-3">
                                  <span className="text-sm font-medium text-gray-700">
                                    {formatTime(task.scheduledTime!)}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {task.duration} min
                                  </span>
                                  <Timer size={12} className="text-gray-500" />
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
                                  <div className="flex items-center space-x-2 mt-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-blue-600 font-medium">Active</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Flexible Tasks */}
                  {flexibleTasks.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-purple-700 px-1">Flexible</h3>
                      {flexibleTasks.map(task => (
                        <div
                          key={task.id}
                          className={`bg-white rounded-xl border transition-all ${getTaskStatusColor(task)}`}
                        >
                          <div className="p-4">
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
                                <div className="flex items-center mt-2 space-x-3">
                                  <span className="text-sm text-purple-600">
                                    Flexible timing
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {task.duration} min
                                  </span>
                                  <Waves size={12} className="text-purple-500" />
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
                                  <div className="flex items-center space-x-2 mt-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-blue-600 font-medium">Active</span>
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