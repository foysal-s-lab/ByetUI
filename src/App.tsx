/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutGrid, 
  Home, 
  Pin, 
  Menu, 
  ArrowLeft, 
  CloudSunRain, 
  Youtube, 
  Facebook, 
  Disc, 
  Sparkles,
  MessageCircle,
  Play,
  Phone,
  PhoneOff,
  Cloud,
  Smartphone,
  Plus,
  ChevronRight,
  Aperture,
  Sun
} from 'lucide-react';
import { motion } from 'motion/react';
import Console from './components/Console';

const Dashboard = ({ 
  selectedIndex, 
  isMenuOpen, 
  menuSelectedIndex,
  onToggleMenu,
  onBack,
  focusArea,
  activeTab,
  activeCategory,
  apps,
  newCategoryApps,
  popularCategoryApps,
  showAbout,
  showWidgetInfo,
  menuItems
}: { 
  selectedIndex: number, 
  isMenuOpen: boolean, 
  menuSelectedIndex: number,
  onToggleMenu: () => void,
  onBack: () => void,
  focusArea: 'header' | 'grid',
  activeTab: number,
  activeCategory: 'none' | 'New' | 'Popular',
  apps: any[],
  newCategoryApps: number[],
  popularCategoryApps: number[],
  showAbout: boolean,
  showWidgetInfo: string | null,
  menuItems: string[]
}) => {
  const isSelected = selectedIndex !== -1;

  let displayName = '';
  if (isSelected && focusArea !== 'header') {
    if (activeTab === 0) {
      if (activeCategory === 'none') {
        if (selectedIndex === 0) displayName = 'New Apps';
        else if (selectedIndex === 4) displayName = 'Popular Apps';
        else if (selectedIndex >= 1 && selectedIndex <= 3) {
          displayName = apps[newCategoryApps[selectedIndex - 1]]?.name || '';
        } else if (selectedIndex >= 5 && selectedIndex <= 7) {
          displayName = apps[popularCategoryApps[selectedIndex - 5]]?.name || '';
        }
      } else {
        const list = activeCategory === 'New' ? newCategoryApps : popularCategoryApps;
        displayName = apps[list[selectedIndex]]?.name || '';
      }
    } else if (activeTab === 1) {
      displayName = apps[selectedIndex]?.name || '';
    } else if (activeTab === 2) {
      displayName = 'Add App';
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#1c1c1c] text-white overflow-hidden font-sans relative select-none">
      {/* Header */}
      <header className="flex items-center justify-center gap-2 pt-4 pb-2 shrink-0">
        <div className={`${activeTab === 0 ? 'bg-[#1a73e8] shadow-lg' : 'bg-transparent'} rounded-full px-5 py-1.5 flex items-center justify-center transition-colors`}>
          <div className="grid grid-cols-2 gap-[2px] w-[20px] h-[20px]">
            <div className="bg-white" />
            <div className="bg-white" />
            <div className="bg-white" />
            <div className="bg-white" />
          </div>
        </div>
        
        <div className={`${activeTab === 1 ? 'bg-[#1a73e8] shadow-lg' : 'bg-transparent'} rounded-full px-7 py-1 flex items-center justify-center transition-colors`}>
          <Home className="w-6 h-6 text-white fill-white" />
        </div>

        <div className={`${activeTab === 2 ? 'bg-[#1a73e8] shadow-lg' : 'bg-transparent'} rounded-full px-5 py-1.5 flex items-center justify-center transition-colors`}>
          <div className="rotate-45">
            <Pin className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
      </header>

      {/* Main Content / App Grid */}
      <main className="flex-1 min-h-0 relative px-2 py-1 flex flex-col justify-center overflow-hidden">
        {activeTab === 2 ? (
          <div className="flex-1 overflow-y-auto p-2 grid grid-cols-3 gap-2 content-start">
            {apps.filter(app => app.isPinned).map((app, index) => {
              const isFocused = focusArea === 'grid' && selectedIndex === index;
              return (
                <div key={app.id} className="flex flex-col items-center gap-1">
                  <div className={`w-[76px] h-[76px] rounded-[24px] flex items-center justify-center transition-all duration-200 ${isFocused ? 'bg-white/40 scale-105' : 'bg-white/10'}`}>
                    <div className="w-[64px] h-[64px] rounded-[20px] overflow-hidden">
                      {app.icon}
                    </div>
                  </div>
                  <span className="text-xs text-white truncate w-[76px] text-center">{app.name}</span>
                </div>
              );
            })}
            <div className={`w-[76px] h-[76px] rounded-[24px] flex items-center justify-center border-2 border-dashed border-white/40 transition-all duration-200 ${focusArea === 'grid' && selectedIndex === apps.filter(app => app.isPinned).length ? 'bg-white/40 scale-105' : 'bg-transparent'}`}>
              <Plus className="w-8 h-8 text-white/60" />
            </div>
          </div>
        ) : activeTab === 0 ? (
          activeCategory === 'none' ? (
            <div className="flex flex-col gap-2 h-full px-1 py-2 overflow-y-auto no-scrollbar">
              {/* New Section */}
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors ${focusArea === 'grid' && selectedIndex === 0 ? 'bg-[#1a73e8] text-white' : 'text-white'}`}>
                  <span className="font-bold text-lg leading-none">New</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2 justify-items-center">
                  {newCategoryApps.slice(0, 3).map((appIdx, i) => {
                    const app = apps[appIdx];
                    const isFocused = focusArea === 'grid' && selectedIndex === i + 1;
                    return (
                      <div key={app.id} className={`w-[76px] h-[76px] rounded-[24px] flex items-center justify-center relative transition-all duration-200 ${isFocused ? 'bg-white/40 scale-105' : 'bg-transparent'}`}>
                        <div className={`w-[64px] h-[64px] rounded-[20px] flex items-center justify-center overflow-hidden ${app.bg} shadow-md`}>
                          {app.icon}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Popular Section */}
              <div className="flex flex-col gap-1 mt-1">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors ${focusArea === 'grid' && selectedIndex === 4 ? 'bg-[#1a73e8] text-white' : 'text-white'}`}>
                  <span className="font-bold text-lg leading-none">Popular</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2 justify-items-center">
                  {popularCategoryApps.slice(0, 3).map((appIdx, i) => {
                    const app = apps[appIdx];
                    const isFocused = focusArea === 'grid' && selectedIndex === i + 5;
                    return (
                      <div key={app.id} className={`w-[76px] h-[76px] rounded-[24px] flex items-center justify-center relative transition-all duration-200 ${isFocused ? 'bg-white/40 scale-105' : 'bg-transparent'}`}>
                        <div className={`w-[64px] h-[64px] rounded-[20px] flex items-center justify-center overflow-hidden ${app.bg} shadow-md`}>
                          {app.icon}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 px-2 py-2 mb-2">
                <span className="font-bold text-xl text-white">{activeCategory} Apps</span>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-4 px-2">
                {(activeCategory === 'New' ? newCategoryApps : popularCategoryApps).map((appIdx, index) => {
                  const app = apps[appIdx];
                  const isFocused = focusArea === 'grid' && selectedIndex === index;
                  return (
                    <div key={app.id} className={`flex items-center gap-4 p-2 rounded-2xl transition-all duration-200 ${isFocused ? 'bg-[#1a73e8] text-white scale-[1.02] shadow-lg' : 'bg-[#2a2a2a] text-gray-200'}`}>
                      <div className={`w-[60px] h-[60px] rounded-[18px] flex items-center justify-center overflow-hidden shrink-0 ${app.bg} shadow-md`}>
                        {app.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg tracking-wide">{app.name}</span>
                        <span className="text-xs text-gray-400 truncate max-w-[200px]">
                          {app.widgetInfo ? (app.widgetInfo.length > 20 ? app.widgetInfo.substring(0, 20) + '...' : app.widgetInfo) : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-3 gap-x-2 gap-y-2 h-full content-start pt-2 justify-items-center">
            {apps.slice(Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9) * 9, (Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9) + 1) * 9).map((app, index) => {
              const actualIndex = Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9) * 9 + index;
              return (
                <div
                  key={app.id}
                  className={`w-[84px] h-[84px] rounded-[28px] flex items-center justify-center relative transition-all duration-200 ${
                    focusArea === 'grid' && selectedIndex === actualIndex ? 'bg-white/40 scale-105' : 'bg-transparent'
                  }`}
                >
                  <div className={`w-[72px] h-[72px] rounded-[22px] flex items-center justify-center overflow-hidden ${app.bg} shadow-md`}>
                    {app.icon}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Scroll Indicator Dots */}
        {activeTab === 1 && Math.ceil(apps.length / 9) > 0 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
            {Array.from({ length: Math.ceil(apps.length / 9) }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity duration-300 ${i === Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9) ? 'opacity-100' : 'opacity-40'}`} />
            ))}
          </div>
        )}

        {/* Menu Overlay */}
        {isMenuOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="absolute inset-0 bg-black z-50 flex flex-col"
          >
            {showAbout ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                  ByetUI 1.1
                </h2>
                <p className="text-xl text-gray-400">developed by foysal</p>
              </div>
            ) : showWidgetInfo ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <h2 className="text-2xl font-bold mb-4">Widget Info</h2>
                <p className="text-lg text-gray-300">{showWidgetInfo}</p>
              </div>
            ) : (
              menuItems.map((item, index) => (
                <div 
                  key={item}
                  className={`px-4 py-3 text-2xl font-bold transition-colors ${
                    menuSelectedIndex === index ? 'bg-[#1a73e8] text-white' : 'text-white'
                  }`}
                >
                  {item}
                </div>
              ))
            )}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black px-3 py-1.5 flex items-center justify-between shrink-0 h-12">
        <button onClick={onToggleMenu} className="hover:bg-white/10 p-1 rounded-lg transition-colors flex flex-col gap-[5px] items-center justify-center w-11">
          <div className="h-[3px] w-[30px] bg-white" />
          <div className="h-[3px] w-[30px] bg-white" />
          <div className="h-[3px] w-[30px] bg-white" />
        </button>
        <div className="flex items-center justify-center flex-1">
          {displayName === '' ? (
            <div className="w-5 h-5 rounded-full border-[2.5px] border-white" />
          ) : (
            <h1 className="text-[22px] font-bold tracking-wide text-white leading-none">
              {displayName}
            </h1>
          )}
        </div>
        <button onClick={onBack} className="hover:bg-white/10 p-1 rounded-lg transition-colors flex items-center justify-center w-11">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12H3" />
            <path d="M10 19l-7-7 7-7" />
          </svg>
        </button>
      </footer>
    </div>
  );
};

const KeypadButton = ({ children, subText, icon, onClick, onPointerDown, onPointerUp, onPointerLeave, className = "" }: { children: React.ReactNode, subText?: string, icon?: React.ReactNode, onClick?: () => void, onPointerDown?: () => void, onPointerUp?: () => void, onPointerLeave?: () => void, className?: string }) => (
  <button 
    onClick={onClick}
    onPointerDown={onPointerDown}
    onPointerUp={onPointerUp}
    onPointerLeave={onPointerLeave}
    className={`bg-[#262626] hover:bg-[#333] active:bg-[#444] rounded-lg flex flex-col items-center justify-center py-1 transition-colors border-b-2 border-black/40 shadow-inner ${className}`}
  >
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-medium text-gray-200">{children}</span>
      {icon && <div className="text-gray-400 scale-90">{icon}</div>}
    </div>
    {subText && <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{subText}</span>}
  </button>
);

export default function App() {
  const [apps, setApps] = React.useState<any[]>([]);
  const [newCategoryApps, setNewCategoryApps] = React.useState<number[]>([]);
  const [popularCategoryApps, setPopularCategoryApps] = React.useState<number[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showAbout, setShowAbout] = React.useState(false);
  const [showWidgetInfo, setShowWidgetInfo] = React.useState<string | null>(null);
  const [menuSelectedIndex, setMenuSelectedIndex] = React.useState(0);
  const [focusArea, setFocusArea] = React.useState<'header' | 'grid'>('grid');
  const [activeTab, setActiveTab] = React.useState(1);
  const [activeCategory, setActiveCategory] = React.useState<'none' | 'New' | 'Popular'>('none');
  const getSelectedApp = () => {
    if (activeTab === 2) {
      const pinnedApps = apps.filter(app => app.isPinned);
      return pinnedApps[selectedIndex];
    }
    if (activeTab === 0) {
      if (activeCategory === 'New') return apps[newCategoryApps[selectedIndex]];
      if (activeCategory === 'Popular') return apps[popularCategoryApps[selectedIndex]];
      return null;
    }
    return apps[selectedIndex];
  };

  const selectedApp = getSelectedApp();
  const isPinned = selectedApp?.isPinned;
  
  const menuItems = selectedIndex !== -1 
    ? [isPinned ? 'Unpin' : 'Pin', 'Widget Info', 'System', 'Quick Start', 'About'] 
    : ['About', 'Settings', 'Privacy'];

  React.useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch('/api/apps');
        if (res.ok) {
          const customApps = await res.json();
          
          let currentApps: any[] = [];
          let currentNew: number[] = [];
          let currentPopular: number[] = [];

          customApps.forEach((app: any) => {
            const newApp = {
              id: app.id,
              name: app.name,
              url: app.url,
              widgetInfo: app.widgetInfo,
              icon: <img src={app.iconSrc} alt={app.name} className="w-full h-full object-cover" />,
              bg: 'bg-white'
            };
            const newAppIndex = currentApps.length;
            currentApps.push(newApp);
            currentNew.push(newAppIndex);
            if (app.location === 'Popular') {
              currentPopular.push(newAppIndex);
            }
          });

          setApps(currentApps);
          setNewCategoryApps(currentNew);
          setPopularCategoryApps(currentPopular);
        }
      } catch (error) {
        console.error('Failed to fetch custom apps:', error);
      }
    };
    fetchApps();
  }, []);

  React.useEffect(() => {
    // Always start at Home and clear hash on reload
    setActiveTab(1);
    setSelectedIndex(-1);
    if (window.location.hash) {
      window.location.hash = '';
    }

    const handleHashChange = () => {
      if (window.location.hash === '#/console') {
        setIsConsoleOpen(true);
      } else {
        setIsConsoleOpen(false);
      }
    };

    // Check on initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setMenuSelectedIndex(0);
  };

  const handleBack = () => {
    if (isConsoleOpen) {
      window.location.hash = '';
    } else if (showAbout) {
      setShowAbout(false);
    } else if (showWidgetInfo) {
      setShowWidgetInfo(null);
    } else if (isMenuOpen) {
      setIsMenuOpen(false);
    } else if (activeTab === 0 && activeCategory !== 'none') {
      setActiveCategory('none');
      setSelectedIndex(activeCategory === 'New' ? 0 : 4);
    } else if (selectedIndex !== -1) {
      setSelectedIndex(-1);
    }
  };

  const handleOk = () => {
    if (isMenuOpen) {
      if (showAbout) {
        setShowAbout(false);
      } else if (menuItems[menuSelectedIndex] === 'About') {
        setShowAbout(true);
      } else if (menuItems[menuSelectedIndex] === 'Widget Info') {
        const app = getSelectedApp();
        setShowWidgetInfo(app?.widgetInfo || 'No widget info available.');
        setIsMenuOpen(false);
      } else if (menuItems[menuSelectedIndex] === 'Pin') {
        // Pin logic
        setApps(prevApps => prevApps.map((app) => 
          app.id === selectedApp?.id ? { ...app, isPinned: true } : app
        ));
        setIsMenuOpen(false);
      } else if (menuItems[menuSelectedIndex] === 'Unpin') {
        // Unpin logic
        setApps(prevApps => prevApps.map((app) => 
          app.id === selectedApp?.id ? { ...app, isPinned: false } : app
        ));
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(false);
      }
    } else if (focusArea === 'header') {
      setFocusArea('grid');
      if (activeTab === 2) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(activeTab === 0 ? 0 : activeTab === 1 ? 1 : 2);
      }
    } else if (selectedIndex !== -1) {
      if (activeTab === 2) {
        const pinnedApps = apps.filter(app => app.isPinned);
        if (selectedIndex >= 0 && selectedIndex < pinnedApps.length) {
          window.open(pinnedApps[selectedIndex].url, '_blank');
        } else {
          // Action for the + button in Pin view
          console.log("Add pinned app clicked");
        }
      } else if (activeTab === 0) {
        if (activeCategory === 'none') {
          if (selectedIndex === 0) {
            setActiveCategory('New');
            setSelectedIndex(0);
          } else if (selectedIndex === 4) {
            setActiveCategory('Popular');
            setSelectedIndex(0);
          } else {
            const appIndex = selectedIndex >= 5 ? popularCategoryApps[selectedIndex - 5] : newCategoryApps[selectedIndex - 1];
            if (apps[appIndex]) window.open(apps[appIndex].url, '_blank');
          }
        } else {
          const list = activeCategory === 'New' ? newCategoryApps : popularCategoryApps;
          if (apps[list[selectedIndex]]) window.open(apps[list[selectedIndex]].url, '_blank');
        }
      } else {
        if (apps[selectedIndex]) window.open(apps[selectedIndex].url, '_blank');
      }
    }
  };

  const handleHome = () => {
    setSelectedIndex(-1);
    setIsMenuOpen(false);
    setActiveTab(1);
    if (isConsoleOpen) {
      window.location.hash = '';
    }
  };

  const hashPressTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleHashPointerDown = () => {
    hashPressTimer.current = setTimeout(() => {
      window.location.hash = '#/console';
    }, 3000);
  };

  const handleHashPointerUpOrLeave = () => {
    if (hashPressTimer.current) {
      clearTimeout(hashPressTimer.current);
      hashPressTimer.current = null;
    }
  };

  const handleNav = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (isMenuOpen) {
      if (dir === 'up') {
        setMenuSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (dir === 'down') {
        setMenuSelectedIndex(prev => (prev < 2 ? prev + 1 : prev));
      }
      return;
    }

    if (focusArea === 'header') {
      if (dir === 'left') {
        setActiveTab(prev => Math.max(0, prev - 1));
      } else if (dir === 'right') {
        setActiveTab(prev => Math.min(2, prev + 1));
      } else if (dir === 'down') {
        setFocusArea('grid');
        if (activeTab === 2) {
          setSelectedIndex(0);
        } else {
          setSelectedIndex(prev => prev === -1 ? (activeTab === 0 ? 0 : activeTab === 1 ? 1 : 2) : prev);
        }
      }
      return;
    }

    // focusArea === 'grid'
    if (activeTab === 2) {
      const pinnedApps = apps.filter(app => app.isPinned);
      const maxIndex = pinnedApps.length; // + icon is at this index

      if (dir === 'up') {
        if (selectedIndex >= 3) {
          setSelectedIndex(prev => prev - 3);
        } else {
          setFocusArea('header');
        }
      } else if (dir === 'down') {
        if (selectedIndex + 3 <= maxIndex) {
          setSelectedIndex(prev => prev + 3);
        }
      } else if (dir === 'left') {
        if (selectedIndex % 3 !== 0) {
          setSelectedIndex(prev => prev - 1);
        } else {
          setActiveTab(1);
          setSelectedIndex(2);
        }
      } else if (dir === 'right') {
        if (selectedIndex % 3 !== 2 && selectedIndex < maxIndex) {
          setSelectedIndex(prev => prev + 1);
        }
      }
      return;
    }

    if (activeTab === 0) {
      if (activeCategory !== 'none') {
        const maxIndex = 5;
        if (dir === 'up') {
          if (selectedIndex === 0) {
            setFocusArea('header');
          } else {
            setSelectedIndex(prev => prev - 1);
          }
        } else if (dir === 'down') {
          setSelectedIndex(prev => Math.min(maxIndex, prev + 1));
        } else if (dir === 'left') {
          setActiveCategory('none');
          setSelectedIndex(activeCategory === 'New' ? 0 : 4);
        }
        return;
      }

      // Mixed view navigation
      if (dir === 'up') {
        if (selectedIndex === 0) {
          setFocusArea('header');
          setActiveTab(0);
        } else if (selectedIndex >= 1 && selectedIndex <= 3) {
          setSelectedIndex(0);
        } else if (selectedIndex === 4) {
          setSelectedIndex(1);
        } else if (selectedIndex >= 5 && selectedIndex <= 7) {
          setSelectedIndex(4);
        }
      } else if (dir === 'down') {
        if (selectedIndex === 0) setSelectedIndex(1);
        else if (selectedIndex >= 1 && selectedIndex <= 3) setSelectedIndex(4);
        else if (selectedIndex === 4) setSelectedIndex(5);
      } else if (dir === 'left') {
        if (selectedIndex === 0 || selectedIndex === 4) {
          // Do nothing
        } else if (selectedIndex === 1 || selectedIndex === 5) {
          setFocusArea('header');
        } else {
          setSelectedIndex(prev => prev - 1);
        }
      } else if (dir === 'right') {
        if (selectedIndex === 0 || selectedIndex === 4) {
          setActiveTab(1);
          setSelectedIndex(0);
        } else if (selectedIndex === 1 || selectedIndex === 2 || selectedIndex === 5 || selectedIndex === 6) {
          setSelectedIndex(prev => prev + 1);
        } else if (selectedIndex === 3 || selectedIndex === 7) {
          setActiveTab(1);
          setSelectedIndex(0);
        }
      }
      return;
    }

    // activeTab === 1
    if (dir === 'up' && (selectedIndex < 3 || apps.length === 0)) {
      setFocusArea('header');
      setActiveTab(1);
      return;
    }
    if (dir === 'left' && (selectedIndex % 3 === 0 || selectedIndex === -1 || apps.length === 0)) {
      setActiveTab(0);
      setSelectedIndex(0);
      return;
    }
    if (dir === 'right' && (selectedIndex % 3 === 2 || selectedIndex === -1 || apps.length === 0)) {
      setActiveTab(2);
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex(prev => {
      if (prev === -1) return 0; // Start at first app on any key press
      switch (dir) {
        case 'up': return prev - 3;
        case 'down': {
          if (prev + 3 < apps.length) return prev + 3;
          // If moving down exceeds length, but we are not on the last row, move to the last item
          const currentRow = Math.floor(prev / 3);
          const lastRow = Math.floor((apps.length - 1) / 3);
          if (currentRow < lastRow) return apps.length - 1;
          return prev;
        }
        case 'left': return prev - 1;
        case 'right': return prev + 1 < apps.length ? prev + 1 : prev;
        default: return prev;
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Phone Body - Even longer as per the image */}
      <div className="w-[380px] h-[940px] bg-[#1a1a1a] rounded-[60px] border-[8px] border-[#2a2a2a] shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative p-5 outline outline-1 outline-white/5">
        
        {/* Speaker Grill */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-2 bg-[#0a0a0a] rounded-full shadow-inner border-t border-white/5" />

        {/* Screen Area - Very tall for the elongated body */}
        <div className="mt-12 w-full aspect-[1/1.6] bg-black rounded-xl overflow-hidden border-[4px] border-[#222] shadow-[inset_0_0_30px_rgba(0,0,0,1)] relative">
          {isConsoleOpen ? (
            <Console 
              apps={apps}
              setApps={setApps}
              newCategoryApps={newCategoryApps}
              setNewCategoryApps={setNewCategoryApps}
              popularCategoryApps={popularCategoryApps}
              setPopularCategoryApps={setPopularCategoryApps}
              onClose={() => { window.location.hash = ''; }}
            />
          ) : (
            <Dashboard 
              selectedIndex={selectedIndex} 
              isMenuOpen={isMenuOpen}
              menuSelectedIndex={menuSelectedIndex}
              onToggleMenu={toggleMenu}
              onBack={handleBack}
              focusArea={focusArea}
              activeTab={activeTab}
              activeCategory={activeCategory}
              apps={apps}
              newCategoryApps={newCategoryApps}
              popularCategoryApps={popularCategoryApps}
              showAbout={showAbout}
              showWidgetInfo={showWidgetInfo}
              menuItems={menuItems}
            />
          )}
        </div>

        {/* Navigation Buttons Area */}
        <div className="mt-8 px-1 grid grid-cols-3 gap-x-2 gap-y-4">
          {/* Soft Keys */}
          <button 
            onClick={toggleMenu}
            className="h-14 bg-[#262626] hover:bg-[#333] active:bg-[#444] rounded-t-2xl flex items-center justify-center border-b-2 border-black/60 transition-colors"
          >
            <div className="w-12 h-[5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          </button>
          
          {/* D-Pad Frame */}
          <div className="row-span-2 flex items-center justify-center">
            <div className="w-28 h-28 bg-[#262626] rounded-[35px] border-2 border-[#333] flex items-center justify-center shadow-2xl relative">
              <button 
                onClick={handleOk}
                className="w-16 h-14 bg-[#1a1a1a] hover:bg-[#222] active:bg-[#000] rounded-xl border border-[#000] shadow-inner flex items-center justify-center transition-colors z-10"
              >
                <span className="text-[10px] font-bold text-white/40 tracking-widest">OK</span>
              </button>
              {/* D-Pad Directions */}
              <button onClick={() => handleNav('up')} className="absolute top-1 w-12 h-8 flex items-center justify-center hover:bg-white/10 active:bg-white/20 rounded-full transition-all group">
                <div className="w-8 h-3 bg-white/30 group-hover:bg-white/50 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
              </button>
              <button onClick={() => handleNav('down')} className="absolute bottom-1 w-12 h-8 flex items-center justify-center hover:bg-white/10 active:bg-white/20 rounded-full transition-all group">
                <div className="w-8 h-3 bg-white/30 group-hover:bg-white/50 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
              </button>
              <button onClick={() => handleNav('left')} className="absolute left-1 w-8 h-12 flex items-center justify-center hover:bg-white/10 active:bg-white/20 rounded-full transition-all group">
                <div className="w-3 h-8 bg-white/30 group-hover:bg-white/50 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
              </button>
              <button onClick={() => handleNav('right')} className="absolute right-1 w-8 h-12 flex items-center justify-center hover:bg-white/10 active:bg-white/20 rounded-full transition-all group">
                <div className="w-3 h-8 bg-white/30 group-hover:bg-white/50 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleBack}
            className="h-14 bg-[#262626] hover:bg-[#333] active:bg-[#444] rounded-t-2xl flex items-center justify-center border-b-2 border-black/60 transition-colors"
          >
            <div className="w-12 h-[5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          </button>

          {/* Call / End Call */}
          <button className="h-16 bg-[#262626] rounded-b-2xl flex items-center justify-center border-t border-white/5">
            <div className="w-12 h-6 border-[4px] border-green-500 rounded-full border-b-0 rotate-180" />
          </button>

          <button 
            onClick={handleHome}
            className="h-16 bg-[#262626] hover:bg-[#333] active:bg-[#444] rounded-b-2xl flex items-center justify-center border-t border-white/5 transition-colors"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="w-11 h-6 border-[4px] border-red-500 rounded-full border-b-0 rotate-180" />
              <div className="absolute w-1.5 h-5 bg-red-500 top-2" />
            </div>
          </button>
        </div>

        {/* Numeric Keypad */}
        <div className="mt-6 grid grid-cols-3 gap-2 px-1 flex-1 pb-8">
          <KeypadButton 
            icon={<div className="flex items-center gap-[1px]"><div className="w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-gray-400 rounded-full" /></div><div className="w-2.5 h-[1px] bg-gray-400" /><div className="w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-gray-400 rounded-full" /></div></div>}
          >1</KeypadButton>
          <KeypadButton subText="abc">2</KeypadButton>
          <KeypadButton subText="def">3</KeypadButton>
          
          <KeypadButton subText="ghi">4</KeypadButton>
          <KeypadButton subText="jkl">5</KeypadButton>
          <KeypadButton subText="mno">6</KeypadButton>
          
          <KeypadButton subText="pqrs">7</KeypadButton>
          <KeypadButton subText="tuv">8</KeypadButton>
          <KeypadButton subText="wxyz">9</KeypadButton>
          
          <KeypadButton 
            icon={
              <div className="flex items-center gap-1.5">
                <span className="text-lg text-gray-400">*</span>
                <div className="w-5 h-3 bg-gray-500 rounded-[1px] relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-base text-gray-400">+</span>
              </div>
            }
          >*</KeypadButton>
          <KeypadButton icon={<div className="w-6 h-3 border-b-2 border-x-2 border-gray-400 rounded-b-sm flex items-center justify-center"><div className="w-3 h-[1px] bg-gray-400" /></div>}>0</KeypadButton>
          <KeypadButton 
            icon={
              <div className="flex items-center gap-1.5">
                <span className="text-lg text-gray-400">#</span>
                <div className="flex flex-col gap-[2px] items-center">
                  <div className="w-2.5 h-2 border-l-2 border-t-2 border-gray-400 rotate-45 translate-y-0.5" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                </div>
              </div>
            }
            onPointerDown={handleHashPointerDown}
            onPointerUp={handleHashPointerUpOrLeave}
            onPointerLeave={handleHashPointerUpOrLeave}
          >#</KeypadButton>
        </div>

        {/* Bottom Mic Hole */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-6 h-2.5 bg-[#0a0a0a] rounded-full shadow-inner border-t border-white/5 flex items-center justify-center">
          <div className="w-3 h-1 bg-[#222] rounded-full" />
        </div>
      </div>
    </div>
  );
}
