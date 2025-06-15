import React from 'react';
import { Target, TrendingUp, Award, Calendar, Trophy, Star, Zap, Leaf, Flame } from 'lucide-react';
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

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Ready to ignite your streak?";
    if (currentStreak === 1) return "Great start! Keep the momentum going.";
    if (currentStreak < 7) return "Building incredible momentum...";
    if (currentStreak < 30) return "You're absolutely crushing it!";
    return "Legendary productivity master!";
  };

  const getMotivationalMessage = () => {
    if (currentStreak === 0) return "Every journey begins with a single step. Start your streak today!";
    if (currentStreak < 3) return "You're building something amazing!";
    if (currentStreak < 7) return "Consistency is your superpower!";
    if (currentStreak < 30) return "You're unstoppable! Keep this energy flowing!";
    return "You've achieved something truly extraordinary!";
  };

  const getStreakEmoji = () => {
    if (currentStreak === 0) return <Leaf size={32} className="text-purple-600" />;
    if (currentStreak < 7) return <Flame size={32} className="text-orange-600" />;
    if (currentStreak < 30) return <Zap size={32} className="text-yellow-500" />;
    return <Trophy size={32} className="text-yellow-600" />;
  };

  const getAchievementLevel = () => {
    if (currentStreak >= 30) return { title: "Productivity Legend", color: "from-yellow-400 to-orange-500", icon: Trophy };
    if (currentStreak >= 14) return { title: "Consistency Champion", color: "from-purple-400 to-pink-500", icon: Award };
    if (currentStreak >= 7) return { title: "Week Warrior", color: "from-blue-400 to-indigo-500", icon: Star };
    return null;
  };

  const achievement = getAchievementLevel();
  const AchievementIcon = achievement?.icon;

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-md mx-auto">
          {/* Beautiful Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-[#007BFF] to-[#0056b3] rounded-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-secondary">Progress</h1>
                <p className="text-gray-600 text-base">Track your productivity journey</p>
              </div>
            </div>
          </div>

          {/* Beautiful Current Streak */}
          <div className="mb-8 animate-scale-in">
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-lg p-8 text-white shadow-beautiful-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Current Streak</h2>
                  <div className="text-4xl animate-bounce-gentle">
                    {getStreakEmoji()}
                  </div>
                </div>
                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-6xl font-bold text-white">{currentStreak}</span>
                  <span className="text-2xl text-white/90 font-semibold">
                    day{currentStreak !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xl text-white/95 font-semibold mb-4">
                  {getStreakMessage()}
                </p>
                <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(currentStreak * 8, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Achievement Badge */}
          {achievement && (
            <div className="mb-8 animate-bounce-gentle">
              <div className={`bg-gradient-to-r ${achievement.color} rounded-lg p-6 text-white shadow-beautiful-lg`}>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    {AchievementIcon && (
                      <AchievementIcon size={32} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Achievement Unlocked!</h3>
                    <p className="text-lg text-white/95 font-semibold">{achievement.title}</p>
                    <p className="text-white/80 text-sm mt-1">
                      {currentStreak} days of consistent productivity!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Beautiful Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="stats-card animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target size={20} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Today</h3>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="stats-number text-blue-600">{stats.today.completed}</span>
                <span className="text-xl text-gray-500 font-semibold">/{stats.today.total}</span>
              </div>
              <p className="stats-label">Tasks completed</p>
            </div>

            <div className="stats-card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar size={20} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">This Week</h3>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="stats-number text-purple-600">{stats.thisWeek.completed}</span>
                <span className="text-xl text-gray-500 font-semibold">/{stats.thisWeek.total}</span>
              </div>
              <p className="stats-label">Tasks completed</p>
            </div>
          </div>

          {/* Beautiful Overall Progress */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="card-beautiful p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Overall Progress</h3>
                </div>
                <span className="text-4xl font-bold text-gradient-primary">
                  {Math.round(completionRate)}%
                </span>
              </div>
              <div className="progress-beautiful mb-4">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#007BFF] to-[#0056b3]"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  <span className="font-bold text-gray-900">{totalCompleted}</span> of <span className="font-bold text-gray-900">{totalTasks}</span> tasks completed
                </span>
                <div className="flex items-center space-x-1">
                  <Zap size={16} className="text-yellow-500" />
                  <span className="font-semibold text-gray-700">
                    {completionRate >= 80 ? 'Excellent!' : completionRate >= 60 ? 'Great!' : 'Keep going!'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Motivational Message */}
          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-[#F4F6F8] rounded-lg p-8 text-center border border-indigo-100 shadow-beautiful">
              <div className="w-16 h-16 bg-gradient-to-r from-[#007BFF] to-[#0056b3] rounded-lg flex items-center justify-center mx-auto mb-6 animate-float">
                <Star size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {getMotivationalMessage()}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {currentStreak === 0 ? 
                  "Every productivity master started exactly where you are now. Take the first step and watch your momentum build!" :
                  "Your consistency is building something powerful. Each completed task strengthens your habits and brings you closer to your goals."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Streaks;