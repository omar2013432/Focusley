export interface Task {
  id: string;
  title: string;
  duration: number; // minutes
  scheduledTime?: string;
  completed: boolean;
  isTimedTask: boolean; // true for fixed time slots, false for flexible
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'active' | 'done';
  createdAt: string;
}

export interface Settings {
  focusHours: {
    start: string; // "08:00"
    end: string;   // "18:00"
  };
  maxHoursPerDay: number;
  defaultTaskDuration: number;
  enableAutoScheduling: boolean;
  timeFormat: '12h' | '24h';
  nickname: string;
}

export interface DaySchedule {
  date: string;
  tasks: Task[];
  totalDuration: number;
}