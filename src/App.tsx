import { useState, useEffect } from 'react';
import { Home, Calendar, Flame, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import Streaks from './components/Streaks';
import SettingsPage from './components/Settings';
import { Task, Settings as SettingsType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<SettingsType>({
    focusHours: { start: '08:00', end: '18:00' },
    maxHoursPerDay: 4,
    defaultTaskDuration: 30,
    enableAutoScheduling: true,
    timeFormat: '12h',
    nickname: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('focusly-tasks');
    const savedSettings = localStorage.getItem('focusly-settings');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('focusly-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focusly-settings', JSON.stringify(settings));
  }, [settings]);

  const parseTaskInput = (input: string): { title: string; duration: number } => {
    // Extract duration from common patterns
    const durationPatterns = [
      /\((\d+)\s*(?:minutes?|mins?|m)\)/i,
      /\((\d+)\s*(?:hours?|hrs?|h)\)/i,
      /(\d+)\s*(?:minutes?|mins?|m)$/i,
      /(\d+)\s*(?:hours?|hrs?|h)$/i
    ];

    let duration = settings.defaultTaskDuration;
    let title = input.trim();

    for (const pattern of durationPatterns) {
      const match = input.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        // Convert hours to minutes if needed
        duration = pattern.source.includes('hours?|hrs?|h') ? value * 60 : value;
        title = input.replace(match[0], '').trim();
        break;
      }
    }

    return { title, duration };
  };

  const generateScheduleTime = (tasks: Task[], newTaskDuration: number): string | undefined => {
    if (!settings.enableAutoScheduling) return undefined;

    const today = new Date();
    const [startHour, startMinute] = settings.focusHours.start.split(':').map(Number);
    const [endHour, endMinute] = settings.focusHours.end.split(':').map(Number);

    // Get today's scheduled tasks
    const todayTasks = tasks.filter(task => 
      task.scheduledTime && 
      new Date(task.scheduledTime).toDateString() === today.toDateString()
    ).sort((a, b) => new Date(a.scheduledTime!).getTime() - new Date(b.scheduledTime!).getTime());

    // Calculate total scheduled time
    const totalScheduled = todayTasks.reduce((sum, task) => sum + task.duration, 0) + newTaskDuration;
    if (totalScheduled > settings.maxHoursPerDay * 60) {
      return undefined; // Exceeds daily limit
    }

    // Find next available slot
    let currentTime = new Date(today);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(today);
    endTime.setHours(endHour, endMinute, 0, 0);

    for (const task of todayTasks) {
      const taskStart = new Date(task.scheduledTime!);
      const taskEnd = new Date(taskStart.getTime() + task.duration * 60000);

      if (currentTime.getTime() + newTaskDuration * 60000 <= taskStart.getTime()) {
        // Found a slot before this task
        break;
      }
      currentTime = new Date(Math.max(currentTime.getTime(), taskEnd.getTime()));
    }

    // Check if we have enough time before end of focus hours
    if (currentTime.getTime() + newTaskDuration * 60000 <= endTime.getTime()) {
      return currentTime.toISOString();
    }

    return undefined;
  };

  const addTask = (input: string, isTimedTask: boolean = true) => {
    const { title, duration } = parseTaskInput(input);
    
    if (!title) return;

    const scheduledTime = isTimedTask ? generateScheduleTime(tasks, duration) : undefined;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      duration,
      scheduledTime,
      completed: false,
      isTimedTask,
      priority: 'medium',
      status: 'not-started',
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            status: !task.completed ? 'done' : 'not-started'
          }
        : task
    ));
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const rescheduleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newScheduledTime = generateScheduleTime(
      tasks.filter(t => t.id !== taskId), 
      task.duration
    );

    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, scheduledTime: newScheduledTime }
        : t
    ));
  };

  const resetAllData = () => {
    setTasks([]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTaskComplete}
            onUpdateTaskStatus={updateTaskStatus}
            onDeleteTask={deleteTask}
            onRescheduleTask={rescheduleTask}
            settings={settings}
          />
        );
      case 'schedule':
        return (
          <Schedule 
            tasks={tasks}
            onToggleTask={toggleTaskComplete}
            onUpdateTaskStatus={updateTaskStatus}
            onDeleteTask={deleteTask}
            settings={settings}
          />
        );
      case 'streaks':
        return (
          <Streaks 
            tasks={tasks}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            settings={settings}
            onUpdateSettings={setSettings}
            onResetAllData={resetAllData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Main Content */}
      <div className="pb-24">
        {renderContent()}
      </div>

      {/* Beautiful Bottom Navigation */}
      <nav className="nav-beautiful px-6 py-4 safe-area-pb">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { id: 'dashboard', icon: Home, label: 'Today', gradient: 'from-[#1a1a1a] to-[#000000]' },
            { id: 'schedule', icon: Calendar, label: 'Schedule', gradient: 'from-[#1a1a1a] to-[#000000]' },
            { id: 'streaks', icon: Flame, label: 'Progress', gradient: 'from-[#1a1a1a] to-[#000000]' },
            { id: 'settings', icon: Settings, label: 'Settings', gradient: 'from-[#1a1a1a] to-[#000000]' }
          ].map(({ id, icon: Icon, label, gradient }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? 'page' : undefined}
              className={`flex flex-col items-center py-3 px-5 rounded-2xl transition-all duration-300 ${
                activeTab === id
                  ? `bg-gradient-to-r ${gradient} text-white shadow-beautiful-lg transform scale-110 ring-2 ring-blue-200`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-beautiful'
              }`}
            >
              <Icon size={24} className={`mb-1 ${activeTab === id ? 'animate-bounce-gentle' : ''}`} />
              <span className={`text-xs font-semibold ${activeTab === id ? 'font-bold' : ''}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;