import React, { useState } from 'react';
import { Plus, Target, X, Flame } from 'lucide-react';
import { Goal } from '../types';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'streak'>) => void;
}

const Goals: React.FC<GoalsProps> = ({ goals, onAddGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    frequency: 3,
    duration: 30,
    color: 'blue'
  });

  const colorOptions = [
    { name: 'blue', bg: 'bg-blue-500', label: 'Blue' },
    { name: 'purple', bg: 'bg-purple-500', label: 'Purple' },
    { name: 'indigo', bg: 'bg-indigo-500', label: 'Indigo' },
    { name: 'orange', bg: 'bg-orange-500', label: 'Orange' },
    { name: 'pink', bg: 'bg-pink-500', label: 'Pink' },
    { name: 'gray', bg: 'bg-gray-500', label: 'Gray' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAddGoal(formData);
      setFormData({ title: '', frequency: 3, duration: 30, color: 'blue' });
      setShowForm(false);
    }
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Goals</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <Target size={32} className="mx-auto mb-3 text-gray-400" />
            <h2 className="font-medium text-gray-900 mb-2">No goals yet</h2>
            <p className="text-gray-600 mb-4">
              Create your first goal to start building productive habits.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map(goal => (
              <div key={goal.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${goal.color}-500 mt-2`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{goal.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{goal.frequency}x/week</span>
                      <span>{goal.duration} min</span>
                      <span className="flex items-center space-x-1">
                        <Flame size={14} className="text-orange-600" />
                        <span>{goal.streak} day streak</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Goal Creation Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-xl w-full max-w-md p-6 transform transition-transform">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">New Goal</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Morning workout"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Times per week
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: Number(e.target.value) })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (min)
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[15, 30, 45, 60, 90, 120].map(min => (
                        <option key={min} value={min}>{min}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.name })}
                        className={`w-8 h-8 rounded-full ${color.bg} ${
                          formData.color === color.name 
                            ? 'ring-2 ring-gray-400 ring-offset-2' 
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Goal
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;