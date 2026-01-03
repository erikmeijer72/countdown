import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import EventCard from './components/EventCard';
import AddEventModal from './components/AddEventModal';
import { EventItem } from './types';

const App: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_events');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumina_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (name: string, date: string, color: string) => {
    const newEvent: EventItem = {
      id: crypto.randomUUID(),
      name,
      date,
      color,
      createdAt: Date.now(),
    };
    // Sort events by date automatically
    const updatedEvents = [...events, newEvent].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(updatedEvents);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen font-sans text-gray-100 relative">
      <Background />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-6 bg-gradient-to-b from-[#0f172a]/90 to-transparent backdrop-blur-[2px]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Lumina
            </h1>
          </div>
          {events.length > 0 && (
             <div className="text-xs font-medium text-white/40 bg-white/5 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                {events.length} Upcoming
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-32">
        <AnimatePresence mode="wait">
          {events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <LayoutGrid size={32} className="text-white/20" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">No countdowns yet</h2>
              <p className="text-white/40 mb-8 max-w-xs mx-auto">
                Add an upcoming event to start tracking days in style.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all"
              >
                Create First Event
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {events.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={deleteEvent}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-2xl shadow-cyan-500/40 border border-white/20 backdrop-blur-md flex items-center gap-2 pr-6"
        >
          <Plus size={24} />
          <span className="font-semibold text-sm">New Event</span>
        </motion.button>
      </div>

      <AddEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addEvent} 
      />
    </div>
  );
};

export default App;