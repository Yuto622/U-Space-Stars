import React, { useEffect, useState } from 'react';
import { getTonightForecast } from '../services/geminiService';
import { MOCK_EVENTS } from '../constants';
import { CloudMoon, ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { AppView } from '../types';

interface TonightFeedProps {
  onNavigate: (view: AppView) => void;
  userLocation: { lat: number, lon: number } | null;
}

const TonightFeed: React.FC<TonightFeedProps> = ({ onNavigate, userLocation }) => {
  const [forecast, setForecast] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate forecast once location is known or default to Tokyo
    const locName = userLocation ? `${userLocation.lat.toFixed(1)}, ${userLocation.lon.toFixed(1)}` : "東京";
    const dateStr = new Date().toLocaleDateString('ja-JP');
    
    getTonightForecast(dateStr, locName).then(text => setForecast(text));
  }, [userLocation]);

  const todaysEvent = MOCK_EVENTS.find(e => e.date === 'TODAY');

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24 pt-6 px-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight mb-1">U-Space</h1>
           <p className="text-sm text-gray-400 flex items-center gap-1">
             <MapPin size={12} />
             {userLocation ? "現在地周辺の星空" : "位置情報を取得中..."}
           </p>
        </div>
        <div className="text-right">
           <div className="text-xs text-cyan-400 font-mono">{new Date().toLocaleDateString('ja-JP')}</div>
           <div className="text-xl font-mono">{new Date().toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
      </header>

      {/* Main Card: Tonight's AI Forecast */}
      <div className="mb-6 relative group cursor-pointer" onClick={() => onNavigate(AppView.SKY_MAP)}>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="glass-panel relative p-6 rounded-2xl border-white/10">
          <div className="flex items-center gap-2 mb-3 text-cyan-300">
            <CloudMoon size={20} />
            <h2 className="font-bold">今夜の星空予報</h2>
          </div>
          
          <div className="min-h-[100px] text-sm leading-7 text-gray-100">
            {forecast ? (
              <p>{forecast}</p>
            ) : (
              <div className="flex items-center justify-center h-24 text-gray-500 gap-2">
                 <Loader2 className="animate-spin" />
                 <span>AIが空を分析中...</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-1 text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition">
               空を見る <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Highlight Event */}
      {todaysEvent && (
        <div className="mb-6">
           <h3 className="text-lg font-bold mb-3 px-1">今夜のハイライト</h3>
           <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border-l-4 border-yellow-500 shadow-lg">
              <div className="flex justify-between items-start">
                 <div>
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">EVENT</span>
                    <h4 className="text-xl font-bold mt-1">{todaysEvent.title}</h4>
                    <p className="text-sm text-gray-400 mt-2">{todaysEvent.description}</p>
                 </div>
                 <div className="bg-black/30 p-2 rounded text-center min-w-[60px]">
                    <div className="text-xs text-gray-400">TIME</div>
                    <div className="font-mono text-sm font-bold text-yellow-400">{todaysEvent.time?.split(' - ')[0]}</div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate(AppView.SKY_MAP)} className="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition flex flex-col justify-between h-32">
           <div className="bg-purple-500/20 w-8 h-8 rounded-lg flex items-center justify-center text-purple-300">
             <span className="text-lg">🪐</span>
           </div>
           <div>
             <div className="font-bold text-lg">惑星を探す</div>
             <div className="text-xs text-gray-400">木星・土星が見頃です</div>
           </div>
        </button>
        <button onClick={() => onNavigate(AppView.CALENDAR)} className="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition flex flex-col justify-between h-32">
           <div className="bg-blue-500/20 w-8 h-8 rounded-lg flex items-center justify-center text-blue-300">
             <span className="text-lg">🛰️</span>
           </div>
           <div>
             <div className="font-bold text-lg">ISS トラッカー</div>
             <div className="text-xs text-gray-400">次の通過まで 4時間</div>
           </div>
        </button>
      </div>
    </div>
  );
};

export default TonightFeed;