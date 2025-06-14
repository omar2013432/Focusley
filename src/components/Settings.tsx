import React from 'react';
import { RotateCcw, Clock, Zap } from 'lucide-react';
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
    <div className="px-4 pt-8 pb-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your Focusly experience</p>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {/* Personal */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h2 className="font-medium text-gray-900 mb-4">Personal</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname (optional)
              </label>
              <input
                type="text"
                value={settings.nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                placeholder="How should we address you?"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Focus Settings */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h2 className="font-medium text-gray-900 mb-4">Focus Hours</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.focusHours.start}
                    onChange={(e) => handleFocusHoursChange('start', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.focusHours.end}
                    onChange={(e) => handleFocusHoursChange('end', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Deep Work Hours Per Day
                </label>
                <select
                  value={settings.maxHoursPerDay}
                  onChange={(e) => handleMaxHoursChange(Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
                    <option key={hours} value={hours}>{hours} hour{hours !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Task Duration
                </label>
                <select
                  value={settings.defaultTaskDuration}
                  onChange={(e) => handleDefaultDurationChange(Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[15, 25, 30, 45, 60, 90, 120].map(minutes => (
                    <option key={minutes} value={minutes}>{minutes} minutes</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h2 className="font-medium text-gray-900 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              {/* Auto Scheduling */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap size={20} className="text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Auto-Scheduling</h3>
                    <p className="text-sm text-gray-600">
                      Automatically assign times to timed tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleAutoScheduling}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableAutoScheduling ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableAutoScheduling ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Time Format */}
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Clock size={20} className="text-gray-600" />
                  <h3 className="font-medium text-gray-900">Time Format</h3>
                </div>
                <div className="flex space-x-2">
                  {[
                    { value: '12h', label: '12 Hour' },
                    { value: '24h', label: '24 Hour' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleTimeFormatChange(option.value as '12h' | '24h')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        settings.timeFormat === option.value
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h2 className="font-medium text-gray-900 mb-4">Data</h2>
            <button
              onClick={handleReset}
              className="flex items-center justify-center w-full py-3 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={16} className="mr-2" />
              Reset All Data
            </button>
            <p className="text-xs text-gray-500 mt-2">
              This will permanently delete all your tasks and reset settings.
            </p>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Focusly v2.0</p>
          <p className="text-xs text-gray-400 mt-1">
            Natural language productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;