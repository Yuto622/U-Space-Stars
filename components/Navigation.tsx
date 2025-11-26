import React from 'react';
import { Compass, Calendar, BookOpen, Home } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: AppView.HOME, icon: Home, label: 'ホーム' },
    { id: AppView.SKY_MAP, icon: Compass, label: '星空' },
    { id: AppView.CALENDAR, icon: Calendar, label: 'イベント' },
    { id: AppView.LOGBOOK, icon: BookOpen, label: 'ログ' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel z-50 pb-safe pt-2 px-4 rounded-t-2xl border-t border-white/10">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${
                isActive ? 'text-cyan-400 -translate-y-2' : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-full transition-all ${isActive ? 'bg-cyan-500/20 shadow-lg shadow-cyan-500/20' : ''}`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;