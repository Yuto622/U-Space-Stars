import React, { useState } from 'react';
import { BookOpen, Plus, Star } from 'lucide-react';
import { ObservationLog } from '../types';

const ObservationLogBook: React.FC = () => {
  const [logs, setLogs] = useState<ObservationLog[]>([
    { id: '1', date: '2023-10-15', location: '自宅ベランダ', target: '木星', notes: '縞模様がうっすら見えた気がする。とても明るい。', rating: 4 }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAdd = () => {
    if (!newNote.trim()) return;
    const log: ObservationLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ja-JP'),
      location: '現在地',
      target: '自由観測',
      notes: newNote,
      rating: 5
    };
    setLogs([log, ...logs]);
    setNewNote('');
    setIsAdding(false);
  };

  return (
    <div className="pb-24 pt-8 px-4 w-full max-w-lg mx-auto h-full overflow-y-auto scrollbar-hide">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-cyan-400" />
          <span>観測ログ</span>
        </h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-full transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <div className="glass-panel p-4 rounded-xl mb-6 animate-in slide-in-from-top-5 fade-in">
          <textarea 
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-cyan-500"
            rows={3}
            placeholder="今日の空はどうでしたか？"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button onClick={handleAdd} className="bg-cyan-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold">保存</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-6 border-l-2 border-white/10 pb-6 last:pb-0">
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-cyan-500"></div>
             <div className="text-xs text-cyan-400 mb-1">{log.date} @ {log.location}</div>
             <div className="glass-panel p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{log.target}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(log.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
                <p className="text-sm text-gray-300">{log.notes}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObservationLogBook;