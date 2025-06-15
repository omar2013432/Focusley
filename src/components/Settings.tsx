import React from 'react';
import { Settings as SettingsIcon, RotateCcw, Clock, Zap, User, Palette } from 'lucide-react';
import { Settings } from '../types';

interface SettingsProps {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  onResetAllData: () => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ 
  settings, 
  onUpdateSettings, 
  onResetAllData 
}) => {
  const handleToggleAutoScheduling = () => {
    onUpdateSettings({ ...settings, enableAutoScheduling: !settings.enableAutoScheduling });
  };

  const handleTimeFormatChange = (format: '12h' | '24h') => {
    onUpdateSettings({ ...settings, timeFormat: format });
  };

  const handleNicknameChange = (nickname: string) => {
    onUpdateSettings({ ...settings, nickname });
  };

  const handleFocusHoursChange = (field: 'start' | 'end', value: string) => {
    onUpdateSettings({ 
      ...settings, 
      focusHours: { ...settings.focusHours, [field]: value }
    });
  };

  const handleMaxHoursChange = (maxHours: number) => {
    onUpdateSettings({ ...settings, maxHoursPerDay: maxHours });
  };

  const handleDefaultDurationChange = (duration: number) => {
    onUpdateSettings({ ...settings, defaultTaskDuration: duration });
  };

  const handleReset = () => {
    if (window.confirm('This will clear all your tasks and reset settings. Are you sure?')) {
      onResetAllData();
    }
  };

  return (
    <div className="px-4 pt-6 pb-4 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your Focusly experience</p>
        </div>

        {/* Enhanced Settings Groups */}
        <div className="space-y-6">
          {/* Enhanced Personal Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-5">
              <div className="p-2 bg-blue-100 rounded-full">
                <User size={20} className="text-blue-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Personal</h2>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nickname (optional)
              </label>
              <input
                type="text"
                value={settings.nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                placeholder="How should we address you?"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-2">
                This will appear in your daily greeting
              </p>
            </div>
          </div>

          {/* Enhanced Focus Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-5">
              <div className="p-2 bg-green-100 rounded-full">
                <Clock size={20} className="text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Focus Hours</h2>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.focusHours.start}
                    onChange={(e) => handleFocusHoursChange('start', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.focusHours.end}
                    onChange={(e) => handleFocusHoursChange('end', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Deep Work Hours Per Day
                </label>
                <select
                  value={settings.maxHoursPerDay}
                  onChange={(e) => handleMaxHoursChange(Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
                    <option key={hours} value={hours}>{hours} hour{hours !== 1 ? 's' : ''}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Prevents over-scheduling and burnout
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Default Task Duration
                </label>
                <select
                  value={settings.defaultTaskDuration}
                  onChange={(e) => handleDefaultDurationChange(Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {[15, 25, 30, 45, 60, 90, 120].map(minutes => (
                    <option key={minutes} value={minutes}>{minutes} minutes</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Used when no duration is specified
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-5">
              <div className="p-2 bg-purple-100 rounded-full">
                <Palette size={20} className="text-purple-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Preferences</h2>
            </div>
            
            <div className="space-y-6">
              {/* Enhanced Auto Scheduling */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Zap size={18} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Auto-Scheduling</h3>
                    <p className="text-sm text-gray-600">
                      Automatically assign optimal times to timed tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleAutoScheduling}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                    settings.enableAutoScheduling ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.enableAutoScheduling ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Enhanced Time Format */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Clock size={18} className="text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Time Format</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: '12h', label: '12 Hour', example: '2:30 PM' },
                    { value: '24h', label: '24 Hour', example: '14:30' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleTimeFormatChange(option.value as '12h' | '24h')}
                      className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                        settings.timeFormat === option.value
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-xs opacity-75 mt-1">{option.example}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Data Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-5">
              <div className="p-2 bg-red-100 rounded-full">
                <RotateCcw size={20} className="text-red-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Data Management</h2>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <button
                onClick={handleReset}
                className="flex items-center justify-center w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                <RotateCcw size={18} className="mr-2" />
                Reset All Data
              </button>
              <p className="text-xs text-red-600 mt-3 text-center">
                This will permanently delete all your tasks and reset all settings to defaults.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced App Info */}
        <div className="mt-8 text-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <SettingsIcon size={24} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Focusly v2.0</h3>
          <p className="text-sm text-gray-600">
            Natural language productivity for mindful work
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;