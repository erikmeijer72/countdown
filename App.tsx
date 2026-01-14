import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, LayoutGrid, Settings, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import EventCard from './components/EventCard';
import AddEventModal from './components/AddEventModal';
import ResultModal, { ResultType } from './components/ResultModal';
import Menu from './components/Menu';
import { EventItem } from './types';

// Helper to calculate Easter Date (Anonymous/Meeus/Jones/Butcher algorithm)
const getEaster = (year: number): Date => {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
};

const App: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((e: any) => ({ ...e, icon: e.icon || 'calendar' }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isDark, setIsDark] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('lumina_theme');
      return savedTheme === 'dark';
    } catch {
      return false;
    }
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Result Modal State
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    type: ResultType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showResult = (type: ResultType, title: string, message: string, onConfirm?: () => void) => {
    setResultModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm
    });
  };

  const closeResult = () => {
    setResultModal(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    localStorage.setItem('lumina_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lumina_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lumina_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    // Check if device is iOS
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIos(iosCheck);

    // Check if running in standalone mode (installed)
    const standaloneCheck = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsStandalone(standaloneCheck);

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    setIsMenuOpen(false);

    if (isIos) {
      showResult(
        'info', 
        'Installeren op iPhone/iPad', 
        'Tik op de "Delen" knop (vierkant met pijl) in je browserbalk en kies vervolgens voor "Zet op beginscherm".'
      );
      return;
    }

    if (!deferredPrompt) {
        // Fallback if button is clicked but no prompt available (should be handled by hiding button, but just in case)
        showResult('info', 'Installatie', 'Gebruik het menu van je browser om de app toe te voegen aan je startscherm.');
        return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setDeferredPrompt(null);
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  };

  const toggleTheme = () => setIsDark(!isDark);

  const addEvent = (name: string, date: string, color: string, icon: string) => {
    const newEvent: EventItem = {
      id: crypto.randomUUID(),
      name,
      date,
      color,
      icon,
      createdAt: Date.now(),
    };
    const updatedEvents = [...events, newEvent].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(updatedEvents);
  };

  const editEvent = (id: string, name: string, date: string, color: string, icon: string) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === id ? { ...event, name, date, color, icon } : event
      );
      return updatedEvents.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
    setEditingEvent(null);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const deleteAllEvents = () => {
    if (events.length === 0) return;
    
    setIsMenuOpen(false);
    showResult(
      'confirm',
      'Alles verwijderen?',
      'Weet je zeker dat je alle aftellers wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',
      () => {
        setEvents([]);
        setTimeout(() => {
            showResult('success', 'Verwijderd', 'Alle evenementen zijn succesvol verwijderd.');
        }, 300);
      }
    );
  };

  const handleAddHolidays = () => {
    setIsMenuOpen(false);
    const newEvents: EventItem[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentYear = now.getFullYear();
    const yearsToCheck = [currentYear, currentYear + 1];

    const fixedHolidays = [
      { name: "Nieuwjaarsdag", month: 0, day: 1, icon: 'party', color: 'purple' },
      { name: "Koningsdag", month: 3, day: 27, icon: 'party', color: 'orange' },
      { name: "Bevrijdingsdag", month: 4, day: 5, icon: 'party', color: 'blue' },
      { name: "1e Kerstdag", month: 11, day: 25, icon: 'party', color: 'emerald' },
      { name: "2e Kerstdag", month: 11, day: 26, icon: 'party', color: 'emerald' },
    ];

    const variableHolidays = [
      { name: "Goede Vrijdag", offset: -2, icon: 'star', color: 'blue' },
      { name: "1e Paasdag", offset: 0, icon: 'star', color: 'cyan' },
      { name: "2e Paasdag", offset: 1, icon: 'star', color: 'cyan' },
      { name: "Hemelvaartsdag", offset: 39, icon: 'plane', color: 'cyan' },
      { name: "1e Pinksterdag", offset: 49, icon: 'star', color: 'pink' },
      { name: "2e Pinksterdag", offset: 50, icon: 'star', color: 'pink' },
    ];

    const addedTypes = new Set<string>();

    yearsToCheck.forEach(year => {
      fixedHolidays.forEach(h => {
        if (addedTypes.has(h.name)) return;
        const date = new Date(year, h.month, h.day);
        if (date >= now) {
          const dateString = date.toLocaleDateString('en-CA');
          const exists = events.some(e => e.date === dateString && e.name === h.name);
          if (!exists) {
            newEvents.push({
              id: crypto.randomUUID(),
              name: h.name,
              date: dateString,
              color: h.color,
              icon: h.icon,
              createdAt: Date.now()
            });
          }
          addedTypes.add(h.name);
        }
      });

      const easter = getEaster(year);
      variableHolidays.forEach(h => {
        if (addedTypes.has(h.name)) return;
        const date = new Date(easter);
        date.setDate(easter.getDate() + h.offset);
        if (date >= now) {
          const dateString = date.toLocaleDateString('en-CA');
          const exists = events.some(e => e.date === dateString && e.name === h.name);
          if (!exists) {
            newEvents.push({
              id: crypto.randomUUID(),
              name: h.name,
              date: dateString,
              color: h.color,
              icon: h.icon,
              createdAt: Date.now()
            });
          }
          addedTypes.add(h.name);
        }
      });
    });

    if (newEvents.length > 0) {
      setEvents(prev => [...prev, ...newEvents].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      showResult('success', 'Feestdagen toegevoegd', `Er zijn ${newEvents.length} nieuwe feestdagen aan je lijst toegevoegd.`);
    } else {
      showResult('info', 'Geen nieuwe feestdagen', 'Alle aankomende feestdagen staan al in je lijst.');
    }
  };

  const handleExport = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const fileName = `countdown_${day}-${month}-${year}_${hours}-${minutes}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showResult('success', 'Back-up Gemaakt', 'Je evenementen zijn succesvol geëxporteerd.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
           setEvents(json);
           showResult('success', 'Back-up Hersteld', 'Je evenementen zijn succesvol geïmporteerd.');
        } else {
           showResult('error', 'Fout', 'Ongeldig bestandsformaat.');
        }
      } catch (err) {
        showResult('error', 'Fout', 'Kon het bestand niet lezen.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleOpenNewEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // Determine if we should show the install button (Header or Menu)
  const showInstallOption = !isStandalone && (!!deferredPrompt || isIos);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-white relative selection:bg-cyan-500/30">
      <Background />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-6 bg-white/70 dark:bg-[#1e293b]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="relative max-w-4xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            {/* Menu Button */}
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="p-2 rounded-xl text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
             >
               <Settings size={20} />
             </button>
          </div>

          {/* Centered Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-montserrat font-bold italic tracking-tight text-slate-800 dark:text-white drop-shadow-sm">
              Countdown
            </h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-2 w-20">
             {/* Install Button (Visible in Header) */}
             {showInstallOption && (
                <motion.button 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleInstallClick}
                  className="p-2 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors"
                  title="App Installeren"
                >
                  <Download size={18} />
                </motion.button>
             )}

             {/* Count */}
             {events.length > 0 && (
                <div className="text-xs font-bold text-slate-500 dark:text-white/60 bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 hidden sm:block">
                    {events.length}
                </div>
             )}
          </div>
        </div>
      </header>

      {/* Menu Dropdown */}
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
        onDeleteAll={deleteAllEvents}
        onAddHolidays={handleAddHolidays}
        onInstall={handleInstallClick}
        canInstall={showInstallOption}
        isDark={isDark}
        toggleTheme={toggleTheme}
        hasEvents={events.length > 0}
      />

      {/* Result Modal */}
      <ResultModal 
        isOpen={resultModal.isOpen}
        onClose={closeResult}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        onConfirm={resultModal.onConfirm}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-32">
        <AnimatePresence mode="wait">
          {events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-xl">
                <LayoutGrid size={40} className="text-slate-300 dark:text-white/30" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Nog geen aftellers</h2>
              <p className="text-slate-500 dark:text-white/50 mb-8 max-w-xs mx-auto leading-relaxed">
                Voeg je eerste evenement toe en begin met aftellen in stijl.
              </p>
              <button
                onClick={handleOpenNewEvent}
                className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Eerste evenement maken
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AnimatePresence>
                {events.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={deleteEvent}
                    onEdit={handleOpenEditEvent}
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
          onClick={handleOpenNewEvent}
          className="pointer-events-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-full shadow-2xl shadow-slate-900/20 dark:shadow-black/20 flex items-center gap-3 font-bold text-sm hover:shadow-slate-900/30 dark:hover:shadow-white/20 transition-all"
        >
          <Plus size={22} className="text-cyan-400 dark:text-cyan-600" />
          <span>Nieuw evenement</span>
        </motion.button>
      </div>

      <AddEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addEvent}
        onEdit={editEvent}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default App;