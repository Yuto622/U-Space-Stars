import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import SkyView from './components/SkyView';
import TonightFeed from './components/TonightFeed';
import EventCalendar from './components/EventCalendar';
import ObservationLog from './components/ObservationLog';
import { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);

  useEffect(() => {
    // Basic geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location error:", error);
          // Default to Tokyo if denied
          setUserLocation({ lat: 35.6762, lon: 139.6503 }); 
        }
      );
    } else {
       setUserLocation({ lat: 35.6762, lon: 139.6503 }); 
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <TonightFeed onNavigate={setCurrentView} userLocation={userLocation} />;
      case AppView.SKY_MAP:
        return <SkyView userLocation={userLocation} />;
      case AppView.CALENDAR:
        return <EventCalendar />;
      case AppView.LOGBOOK:
        return <ObservationLog />;
      default:
        return <TonightFeed onNavigate={setCurrentView} userLocation={userLocation} />;
    }
  };

  return (
    <div className="w-full h-screen bg-[#050510] text-white flex flex-col relative">
      {/* Background Stars (Static CSS for app feel) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
         <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>
         <div className="absolute top-40 right-20 w-1 h-1 bg-blue-200 rounded-full shadow-[0_0_5px_cyan]"></div>
         <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-white rounded-full opacity-60"></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative z-10">
        {renderView()}
      </main>

      {/* Navigation */}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}

export default App;