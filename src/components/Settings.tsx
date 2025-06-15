import React from 'react';
import { Settings as SettingsIcon, RotateCcw, Clock, Zap, User, Palette, Shield, Bell, Smartphone } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F4F6F8]">
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-md mx-auto">
          {/* Beautiful Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-[#007BFF] to-[#0056b3] rounded-lg">
                <SettingsIcon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">Settings</h1>
                <p className="text-gray-600 text-base">Customize your Focusly experience</p>
              </div>
            </div>
          </div>

          {/* Beautiful Settings Groups */}
          <div className="space-y-6">
            {/* Beautiful Personal Section */}
            <div className="settings-section animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="settings-header">
                <div className="settings-icon bg-blue-100">
                  <User size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Personal</h2>
              </div>
              <div>
                <label className="form-label">
                  Nickname (optional)
                </label>
                <input
                  type="text"
                  value={settings.nickname}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  placeholder="How should we address you?"
                  className="input-beautiful placeholder-gray-600"
                />
                <p className="form-help">
                  This will appear in your daily greeting and make the experience more personal
                </p>
              </div>
            </div>

            {/* Beautiful Focus Settings */}
            <div className="settings-section animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="settings-header">
                <div className="settings-icon bg-orange-100">
                  <Clock size={20} className="text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Focus Hours</h2>
              </div>
              
              <div className="form-section">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      value={settings.focusHours.start}
                      onChange={(e) => handleFocusHoursChange('start', e.target.value)}
                      className="input-beautiful"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      value={settings.focusHours.end}
                      onChange={(e) => handleFocusHoursChange('end', e.target.value)}
                      className="input-beautiful"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Max Deep Work Hours Per Day</label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={settings.maxHoursPerDay}
                    onChange={(e) => handleMaxHoursChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm font-semibold mt-1">{settings.maxHoursPerDay} h</div>
                  <p className="form-help">
                    Prevents over-scheduling and helps maintain sustainable productivity
                  </p>
                </div>

                <div>
                  <label className="form-label">Default Task Duration</label>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={5}
                    value={settings.defaultTaskDuration}
                    onChange={(e) => handleDefaultDurationChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm font-semibold mt-1">{settings.defaultTaskDuration} min</div>
                  <p className="form-help">
                    Used when no duration is specified in your task description
                  </p>
                </div>
              </div>
            </div>

            {/* Beautiful Preferences */}
            <div className="settings-section animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="settings-header">
                <div className="settings-icon bg-orange-100">
                  <Palette size={20} className="text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
              </div>
              
              <div className="form-section">
                {/* Beautiful Auto Scheduling Toggle */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-4">
                    <div className="settings-icon bg-yellow-100">
                      <Zap size={20} className="text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Auto-Scheduling</h3>
                      <p className="text-gray-600 text-sm">
                        Automatically assign optimal times to timed tasks
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleAutoScheduling}
                    className={`toggle-switch ${
                      settings.enableAutoScheduling ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`toggle-switch-thumb ${
                        settings.enableAutoScheduling ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Beautiful Time Format Selection */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="settings-icon bg-indigo-100">
                      <Clock size={18} className="text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Time Format</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: '12h', label: '12 Hour', example: '2:30 PM' },
                      { value: '24h', label: '24 Hour', example: '14:30' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleTimeFormatChange(option.value as '12h' | '24h')}
                        className={`p-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          settings.timeFormat === option.value
                            ? 'bg-gradient-to-r from-[#007BFF] to-[#0056b3] text-white shadow-beautiful-lg transform scale-105'
                            : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-beautiful'
                        }`}
                      >
                        <div className="font-bold text-lg">{option.label}</div>
                        <div className="text-sm opacity-80 mt-1">{option.example}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Beautiful Data Management Section */}
            <div className="settings-section animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="settings-header">
                <div className="settings-icon bg-red-100">
                  <Shield size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <RotateCcw size={20} className="text-red-600" />
                  <h3 className="font-bold text-red-900 text-lg">Reset All Data</h3>
                </div>
                <p className="text-red-700 text-sm mb-6 leading-relaxed">
                  This will permanently delete all your tasks, reset your streak, and restore all settings to their defaults. This action cannot be undone.
                </p>
                <button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-lg font-bold transition-all duration-300 shadow-beautiful hover:shadow-beautiful-lg transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <RotateCcw size={20} />
                    <span>Reset All Data</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Beautiful App Info */}
          <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="card-beautiful p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#007BFF] to-[#0056b3] rounded-lg flex items-center justify-center mx-auto mb-6 animate-float">
                <SettingsIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gradient-primary mb-2">Focusly v2.0</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Natural language productivity for mindful work
              </p>
              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Smartphone size={16} />
                  <span>Mobile First</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bell size={16} />
                  <span>Smart Scheduling</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap size={16} />
                  <span>AI Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;