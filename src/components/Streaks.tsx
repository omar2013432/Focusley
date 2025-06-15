import React from 'react';
import { Flame, Target, TrendingUp, Award, Calendar } from 'lucide-react';
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
    let startDate = dates.includes(today) ? today : 
                   dates.includes(yesterday) ? yesterday : null;

    if (!startDate) return 0;

    let currentDate = new Date(startDate);
    
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

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Ready to start your journey?";
    if (currentStreak === 1) return "Great start! Keep it going tomorrow.";
    if (currentStreak < 7) return "Building momentum...";
    if (currentStreak < 30) return "Fantastic consistency!";
    return "Incredible dedication! 🎉";
  };

  const getMotivationalMessage = () => {
    if (currentStreak === 0) return "Complete your first task to begin tracking your streak.";
    if (currentStreak < 3) return "You're building great habits!";
    if (currentStreak < 7) return "Consistency is key - you're doing great!";
    if (currentStreak < 30) return "You're on fire! Keep up the momentum!";
    return "You're a productivity champion! 🏆";
  };

  return (
    <div className="px-4 pt-6 pb-4 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Progress</h1>
          <p className="text-gray-600">Track your productivity journey</p>
        </div>

        {/* Enhanced Current Streak */}
        <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border border-orange-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-orange-900">Current Streak</h2>
            <div className="p-2 bg-orange-100 rounded-full">
              <Flame size={24} className="text-orange-600" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-4xl font-bold text-orange-800">{currentStreak}</span>
            <span className="text-lg text-orange-700 font-medium">
              day{currentStreak !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-orange-700 font-medium mb-2">
            {getStreakMessage()}
          </p>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(currentStreak * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Target size={18} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Today</h3>
            </div>
            <div className="flex items-baseline space-x-1 mb-2">
              <span className="text-3xl font-bold text-gray-900">{stats.today.completed}</span>
              <span className="text-lg text-gray-600">/{stats.today.total}</span>
            </div>
            <p className="text-sm text-gray-600">Tasks completed</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar size={18} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">This Week</h3>
            </div>
            <div className="flex items-baseline space-x-1 mb-2">
              <span className="text-3xl font-bold text-gray-900">{stats.thisWeek.completed}</span>
              <span className="text-lg text-gray-600">/{stats.thisWeek.total}</span>
            </div>
            <p className="text-sm text-gray-600">Tasks completed</p>
          </div>
        </div>

        {/* Enhanced Overall Progress */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {Math.round(completionRate)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{totalCompleted}</span> of <span className="font-semibold">{totalTasks}</span> tasks completed
          </p>
        </div>

        {/* Enhanced Achievement Badge */}
        {currentStreak >= 7 && (
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Award size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900">Achievement Unlocked!</h3>
                <p className="text-sm text-yellow-700">
                  {currentStreak >= 30 ? "Productivity Master" : 
                   currentStreak >= 14 ? "Consistency Champion" : 
                   "Week Warrior"}
                </p>
              </div>
            </div>
            <p className="text-sm text-yellow-800">
              You've maintained your streak for {currentStreak} days straight!
            </p>
          </div>
        )}

        {/* Enhanced Motivational Message */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 text-center border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {getMotivationalMessage()}
          </h3>
          <p className="text-sm text-gray-600">
            {currentStreak === 0 ? 
              "Every expert was once a beginner. Start your journey today!" :
              "Every completed task builds your momentum and strengthens your habits."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Streaks;