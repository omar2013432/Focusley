import React from 'react';
import { Flame, Target, TrendingUp } from 'lucide-react';
import { Task } from '../types';

interface StreaksProps {
  tasks: Task[];
}

const Streaks: React.FC<StreaksProps> = ({ tasks }) => {
  const calculateDailyStats = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const todayTasks = tasks.filter(task => 
      task.scheduledTime && new Date(task.scheduledTime).toDateString() === today
    );
    
    const yesterdayTasks = tasks.filter(task => 
      task.scheduledTime && new Date(task.scheduledTime).toDateString() === yesterday
    );
    
    const thisWeekTasks = tasks.filter(task => 
      task.scheduledTime && new Date(task.scheduledTime) >= thisWeek
    );
    
    const todayCompleted = todayTasks.filter(task => task.completed).length;
    const yesterdayCompleted = yesterdayTasks.filter(task => task.completed).length;
    const thisWeekCompleted = thisWeekTasks.filter(task => task.completed).length;
    
    return {
      today: { completed: todayCompleted, total: todayTasks.length },
      yesterday: { completed: yesterdayCompleted, total: yesterdayTasks.length },
      thisWeek: { completed: thisWeekCompleted, total: thisWeekTasks.length }
    };
  };

  const calculateCurrentStreak = () => {
    // Get all completed tasks grouped by date
    const completedByDate = tasks
      .filter(task => task.completed && task.scheduledTime)
      .reduce((acc, task) => {
        const date = new Date(task.scheduledTime!).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const dates = Object.keys(completedByDate).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    if (dates.length === 0) return 0;

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    // Start counting from today or yesterday if we completed tasks
    const startDate = dates.includes(today) ? today :
                     dates.includes(yesterday) ? yesterday : null;

    if (!startDate) return 0;

    const currentDate = new Date(startDate);
    
    while (true) {
      const dateStr = currentDate.toDateString();
      if (completedByDate[dateStr] && completedByDate[dateStr] > 0) {
        streak++;
      } else {
        break;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const stats = calculateDailyStats();
  const currentStreak = calculateCurrentStreak();
  
  const totalCompleted = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Progress</h1>
          <p className="text-gray-600">Track your productivity journey</p>
        </div>

        {/* Current Streak */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-orange-900">Current Streak</h2>
            <Flame size={24} className="text-orange-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-orange-800">{currentStreak}</span>
            <span className="text-orange-700">day{currentStreak !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-sm text-orange-600 mt-2">
            {currentStreak === 0 ? 'Complete a task to start your streak!' :
             currentStreak === 1 ? 'Great start! Keep it going tomorrow.' :
             currentStreak < 7 ? 'Building momentum...' :
             currentStreak < 30 ? 'Fantastic consistency!' :
             'Incredible dedication! 🎉'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Target size={16} className="text-blue-600" />
              <h3 className="font-medium text-gray-900">Today</h3>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">{stats.today.completed}</span>
              <span className="text-sm text-gray-600">/{stats.today.total}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Tasks completed</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp size={16} className="text-green-600" />
              <h3 className="font-medium text-gray-900">This Week</h3>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">{stats.thisWeek.completed}</span>
              <span className="text-sm text-gray-600">/{stats.thisWeek.total}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Tasks completed</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Overall Progress</h3>
            <span className="text-sm text-gray-600">
              {Math.round(completionRate)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {totalCompleted} of {totalTasks} tasks completed
          </p>
        </div>

        {/* Motivational Message */}
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-gray-700 font-medium mb-1">
            {currentStreak === 0 ? "Ready to start your journey?" :
             currentStreak < 3 ? "You're building great habits!" :
             currentStreak < 7 ? "Consistency is key - you're doing great!" :
             currentStreak < 30 ? "You're on fire! Keep up the momentum!" :
             "You're a productivity champion! 🏆"}
          </p>
          <p className="text-sm text-gray-600">
            {currentStreak === 0 ? "Complete your first task to begin tracking your streak." :
             "Every completed task builds your momentum."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Streaks;