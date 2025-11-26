import React from 'react';
import { MOCK_EVENTS } from '../constants';
import { Calendar as CalendarIcon, Star, Moon, Disc } from 'lucide-react';

const EventCalendar: React.FC = () => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'meteor': return <Star className="text-yellow-400" />;
      case 'moon': return <Moon className="text-gray-300" />;
      case 'planet': return <Disc className="text-orange-400" />;
      case 'iss': return <div className="font-bold text-xs border border-white rounded px-1">ISS</div>;
      default: return <Star className="text-white" />;
    }
  };

  return (
    <div className="pb-24 pt-8 px-4 w-full max-w-lg mx-auto h-full overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <CalendarIcon className="text-cyan-400" />
        <span>天文イベント</span>
      </h1>

      <div className="space-y-4">
        {MOCK_EVENTS.map((event) => (
          <div key={event.id} className="glass-panel p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {getIcon(event.type)}
                  </div>
                  <div>
                    <div className="text-xs text-cyan-300 font-medium">
                      {event.date === 'TODAY' ? '今日' : event.date}
                    </div>
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  </div>
               </div>
               {event.time && (
                 <div className="text-xs bg-cyan-900/50 px-2 py-1 rounded text-cyan-200">
                   {event.time}
                 </div>
               )}
            </div>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              {event.description}
            </p>
            <div className="mt-3 flex gap-2">
               <button className="flex-1 bg-white/5 py-2 rounded-lg text-xs hover:bg-white/10 transition">詳細を見る</button>
               <button className="flex-1 bg-cyan-600/20 py-2 rounded-lg text-xs text-cyan-300 hover:bg-cyan-600/30 transition">通知を設定</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-500">
        これ以降のイベントはまだありません
      </div>
    </div>
  );
};

export default EventCalendar;