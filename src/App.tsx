/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
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
  setSelectedIndex,
  isMenuOpen, 
  menuSelectedIndex,
  onToggleMenu,
  onMenuSelect,
  onBack,
  focusArea,
  activeTab,
  setActiveTab,
  activeCategory,
  setActiveCategory,
  apps,
  newCategoryApps,
  popularCategoryApps,
  showAbout,
  showWidgetInfo,
  menuItems
}: { 
  selectedIndex: number, 
  setSelectedIndex: (index: number) => void,
  isMenuOpen: boolean, 
  menuSelectedIndex: number,
  onToggleMenu: () => void,
  onMenuSelect: (index: number) => void,
  onBack: () => void,
  focusArea: 'header' | 'grid',
  activeTab: number,
  setActiveTab: (tab: number) => void,
  activeCategory: 'none' | 'New' | 'Popular' | 'Game' | 'Social' | 'Studies' | 'Education' | string,
  setActiveCategory: (category: string) => void,
  apps: any[],
  newCategoryApps: number[],
  popularCategoryApps: number[],
  showAbout: boolean,
  showWidgetInfo: string | null,
  menuItems: string[]
}) => {
  const isSelected = selectedIndex !== -1;
  
  const handleDragEnd = (event: any, info: any) => {
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    
    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      if (offsetX > 50) { // Swipe Right
        if (activeTab > 0) setActiveTab(activeTab - 1);
      } else if (offsetX < -50) { // Swipe Left
        if (activeTab < 2) setActiveTab(activeTab + 1);
      }
    } else {
      if (activeTab === 1) {
        if (offsetY < -50) { // Swipe Up (Next Page)
          const currentPage = Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9);
          const maxPage = Math.ceil(apps.length / 9) - 1;
          if (currentPage < maxPage) {
            setSelectedIndex((currentPage + 1) * 9);
          }
        } else if (offsetY > 50) { // Swipe Down (Prev Page)
          const currentPage = Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9);
          if (currentPage > 0) {
            setSelectedIndex((currentPage - 1) * 9);
          }
        }
      }
    }
  };

  let displayName = '';
  if (isSelected && focusArea !== 'header') {
    if (activeTab === 0) {
      if (activeCategory === 'none') {
        if (selectedIndex === 0) displayName = 'New Apps';
        else if (selectedIndex === 4) displayName = 'Popular Apps';
        else if (selectedIndex === 8) displayName = 'Social Apps';
        else if (selectedIndex === 9) displayName = 'News Apps';
        else if (selectedIndex === 10) displayName = 'Media Apps';
        else if (selectedIndex === 11) displayName = 'Tools Apps';
        else if (selectedIndex === 12) displayName = 'Game Apps';
        else if (selectedIndex === 13) displayName = 'All Apps';
        else if (selectedIndex >= 1 && selectedIndex <= 3) {
          displayName = apps[newCategoryApps[selectedIndex - 1]]?.name || '';
        } else if (selectedIndex >= 5 && selectedIndex <= 7) {
          displayName = apps[popularCategoryApps[selectedIndex - 5]]?.name || '';
        }
      } else {
        const categoryApps = apps.filter(app => (app.location || '').toLowerCase() === (activeCategory || '').toLowerCase());
        displayName = categoryApps[selectedIndex]?.name || '';
      }
    } else if (activeTab === 1) {
      displayName = apps[selectedIndex]?.name || '';
    } else if (activeTab === 2) {
      const pinnedApps = apps.filter(app => app.isPinned);
      if (selectedIndex < pinnedApps.length) {
        displayName = pinnedApps[selectedIndex]?.name || '';
      } else {
        displayName = 'Add App';
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#1c1c1c] text-white overflow-hidden font-sans relative select-none">
      {/* Header */}
      <header className="flex items-center justify-center gap-2 pt-1 pb-2 shrink-0">
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
      <motion.div 
        className="flex-1 min-h-0 relative px-2 py-1 flex flex-col justify-center overflow-hidden"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ touchAction: 'none' }}
      >
        {activeTab === 2 ? (
          <div className="flex-1 overflow-y-auto p-2 grid grid-cols-3 gap-2 content-start touch-pan-y">
            {apps.filter(app => app.isPinned).map((app, index) => {
              const isFocused = focusArea === 'grid' && selectedIndex === index;
              return (
                <div key={`${app.id}-${index}`} className="flex flex-col items-center gap-1" onClick={() => window.open(app.url, '_blank')} onPointerEnter={() => setSelectedIndex(index)}>
                  <div className={`w-[76px] h-[76px] rounded-[24px] flex items-center justify-center transition-all duration-200 ${isFocused ? 'bg-white/40 scale-105' : 'bg-white/10 hover:bg-white/20'}`}>
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
          <div className="flex flex-col gap-2 h-full px-1 py-2 overflow-y-auto no-scrollbar touch-pan-y">
            {activeCategory === 'none' ? (
              <>
                {/* New Section */}
                <div className="flex flex-col gap-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors cursor-pointer hover:bg-white/10 ${focusArea === 'grid' && selectedIndex === 0 ? 'bg-[#1a73e8] text-white' : 'text-white'}`} onClick={() => { setActiveCategory('New'); setSelectedIndex(0); }}>
                    <span className="font-bold text-lg leading-none">New</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-2 justify-items-center">
                    {newCategoryApps.slice(0, 3).map((appIdx, i) => {
                      const app = apps[appIdx];
                      const isFocused = focusArea === 'grid' && selectedIndex === i + 1;
                      return (
                        <div key={`${app.id}-${i}`} className={`w-[76px] h-[76px] rounded-[24px] flex items-center justify-center relative transition-all duration-200 ${isFocused ? 'bg-white/40 scale-105' : 'bg-transparent hover:bg-white/10'}`} onClick={() => window.open(app.url, '_blank')} onPointerEnter={() => setSelectedIndex(i + 1)}>
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
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors cursor-pointer hover:bg-white/10 ${focusArea === 'grid' && selectedIndex === 4 ? 'bg-[#1a73e8] text-white' : 'text-white'}`} onClick={() => { setActiveCategory('Popular'); setSelectedIndex(0); }}>
                    <span className="font-bold text-lg leading-none">Popular</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-2 justify-items-center">
                    {popularCategoryApps.slice(0, 3).map((appIdx, i) => {
                      const app = apps[appIdx];
                      const isFocused = focusArea === 'grid' && selectedIndex === i + 5;
                      return (
                        <div key={`${app.id}-${i}`} className={`w-[76px] h-[76px] rounded-[24px] flex items-center justify-center relative transition-all duration-200 ${isFocused ? 'bg-white/40 scale-105' : 'bg-transparent hover:bg-white/10'}`} onClick={() => window.open(app.url, '_blank')} onPointerEnter={() => setSelectedIndex(i + 5)}>
                          <div className={`w-[64px] h-[64px] rounded-[20px] flex items-center justify-center overflow-hidden ${app.bg} shadow-md`}>
                            {app.icon}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Social Section */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors cursor-pointer hover:bg-white/10 ${focusArea === 'grid' && selectedIndex === 8 ? 'bg-[#1a73e8] text-white' : 'text-white'}`} onClick={() => { setActiveCategory('Social'); setSelectedIndex(0); }}>
                    <span className="font-bold text-lg leading-none">Social</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* News Section */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors cursor-pointer hover:bg-white/10 ${focusArea === 'grid' && selectedIndex === 9 ? 'bg-[#1a73e8] text-white' : 'text-white'}`} onClick={() => { setActiveCategory('News'); setSelectedIndex(0); }}>
                    <span className="font-bold text-lg leading-none">News</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Media Section */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors cursor-pointer hover:bg-white/10 ${focusArea === 'grid' && selectedIndex === 10 ? 'bg-[#1a73e8] text-white' : 'text-white'}`} onClick={() => { setActiveCategory('Media'); setSelectedIndex(0); }}>
                    <span className="font-bold text-lg leading-none">Media</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Tools Section */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors cursor-pointer hover:bg-white/10 ${focusArea === 'grid' && selectedIndex === 11 ? 'bg-[#1a73e8] text-white' : 'text-white'}`} onClick={() => { setActiveCategory('Tools'); setSelectedIndex(0); }}>
                    <span className="font-bold text-lg leading-none">Tools</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Game Section */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors cursor-pointer hover:bg-white/10 ${focusArea === 'grid' && selectedIndex === 12 ? 'bg-[#1a73e8] text-white' : 'text-white'}`} onClick={() => { setActiveCategory('Game'); setSelectedIndex(0); }}>
                    <span className="font-bold text-lg leading-none">Game</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* All Section */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit transition-colors cursor-pointer hover:bg-white/10 ${focusArea === 'grid' && selectedIndex === 13 ? 'bg-[#1a73e8] text-white' : 'text-white'}`} onClick={() => { setActiveCategory('All'); setSelectedIndex(0); }}>
                    <span className="font-bold text-lg leading-none">All</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 px-4 py-2 mb-2">
                  <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <span className="font-bold text-xl text-white">{activeCategory} Apps</span>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-4 w-full">
                  {apps.filter(app => (app.location || '').toLowerCase() === (activeCategory || '').toLowerCase()).length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 mt-10">
                      No apps found in this category.
                    </div>
                  ) : (
                    apps.filter(app => (app.location || '').toLowerCase() === (activeCategory || '').toLowerCase()).map((app, index) => {
                      const isFocused = focusArea === 'grid' && selectedIndex === index;
                      return (
                        <div key={`${app.id}-${index}`} className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 ${isFocused ? 'bg-[#1a73e8] text-white' : 'bg-transparent text-gray-200 hover:bg-white/10'}`} onClick={() => window.open(app.url, '_blank')} onPointerEnter={() => setSelectedIndex(index)}>
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
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-2 gap-y-2 h-full content-start pt-2 justify-items-center">
            {apps.slice(Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9) * 9, (Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9) + 1) * 9).map((app, index) => {
              const actualIndex = Math.floor((selectedIndex === -1 ? 0 : selectedIndex) / 9) * 9 + index;
              return (
                <div
                  key={`${app.id}-${actualIndex}`}
                  className={`w-[84px] h-[84px] rounded-[28px] flex items-center justify-center relative transition-all duration-200 ${
                    focusArea === 'grid' && selectedIndex === actualIndex ? 'bg-white/40 scale-105' : 'bg-transparent hover:bg-white/10'
                  }`}
                  onClick={() => window.open(app.url, '_blank')}
                  onPointerEnter={() => setSelectedIndex(actualIndex)}
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
          <div 
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
                  key={`${item}-${index}`}
                  onClick={() => onMenuSelect(index)}
                  className={`px-4 py-3 text-2xl font-bold transition-colors ${
                    menuSelectedIndex === index ? 'bg-[#1a73e8] text-white' : 'text-white'
                  }`}
                >
                  {item}
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="bg-black px-3 py-1.5 flex items-center justify-between shrink-0 h-12">
        <button onClick={onToggleMenu} className="hover:bg-white/10 p-1 rounded-lg transition-colors flex flex-col items-center justify-center w-16">
          <div className="flex flex-col gap-[3px] items-center justify-center">
            <div className="h-[2px] w-[20px] bg-white" />
            <div className="h-[2px] w-[20px] bg-white" />
            <div className="h-[2px] w-[20px] bg-white" />
          </div>
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
        <button onClick={onBack} className="hover:bg-white/10 p-1 rounded-lg transition-colors flex flex-col items-center justify-center w-16">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  const [activeCategory, setActiveCategory] = React.useState<string>('none');
  const getSelectedApp = () => {
    if (activeTab === 2) {
      const pinnedApps = apps.filter(app => app.isPinned);
      return pinnedApps[selectedIndex];
    }
    if (activeTab === 0) {
      if (activeCategory !== 'none') {
        const categoryApps = apps.filter(app => (app.location || '').toLowerCase() === (activeCategory || '').toLowerCase());
        return categoryApps[selectedIndex];
      }
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
        const customApps = [
          {
            id: "Instagram",
            name: "Instagram",
            url: "https://www.instagram.com",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png",
            location: "Social",
            isPinned: true,
            order: 1
          },
          {
            id: "BBC News",
            name: "BBC News",
            url: "https://www.bbc.com/news",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/1024px-BBC_Logo_2021.svg.png",
            location: "News",
            isPinned: true,
            order: 2
          },
          {
            id: "CloudChat",
            name: "CloudChat",
            url: "https://cloudchat.com",
            iconSrc: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
            location: "Social",
            isPinned: true,
            order: 3
          },
          {
            id: "Weather",
            name: "Weather",
            url: "https://weather.com",
            iconSrc: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
            location: "Tools",
            isPinned: true,
            order: 4
          },
          {
            id: "YouTube",
            name: "YouTube",
            url: "https://www.youtube.com",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png",
            location: "Media",
            isPinned: true,
            order: 5
          },
          {
            id: "TikTok",
            name: "TikTok",
            url: "https://www.tiktok.com",
            iconSrc: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
            location: "Social",
            isPinned: true,
            order: 6
          },
          {
            id: "Facebook",
            name: "Facebook",
            url: "https://www.facebook.com",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png",
            location: "Social",
            isPinned: true,
            order: 7
          },
          {
            id: "Music",
            name: "Music",
            url: "https://music.youtube.com",
            iconSrc: "https://cdn-icons-png.flaticon.com/512/3024/3024593.png",
            location: "Media",
            isPinned: true,
            order: 8
          },
          {
            id: "Gemini",
            name: "Gemini",
            url: "https://gemini.google.com",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/1024px-Google_Gemini_logo.svg.png",
            location: "Tools",
            isPinned: true,
            order: 9
          },
          {
            id: "WhatsApp",
            name: "WhatsApp",
            url: "https://web.whatsapp.com/",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png",
            location: "Social",
            isPinned: true,
            order: 10
          },
          {
            id: "X",
            name: "X",
            url: "https://x.com/",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/512px-X_logo_2023.svg.png",
            location: "Social",
            isPinned: true,
            order: 11
          },
          {
            id: "Netflix",
            name: "Netflix",
            url: "https://www.netflix.com/",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Netflix_2015_N_logo.svg/512px-Netflix_2015_N_logo.svg.png",
            location: "Media",
            isPinned: true,
            order: 12
          },
          {
            id: "Spotify",
            name: "Spotify",
            url: "https://open.spotify.com/",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png",
            location: "Media",
            isPinned: true,
            order: 13
          },
          {
            id: "Google Maps",
            name: "Google Maps",
            url: "https://maps.google.com/",
            iconSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/512px-Google_Maps_icon_%282020%29.svg.png",
            location: "Tools",
            isPinned: true,
            order: 14
          }
        ];
        
        let currentApps: any[] = [];
        let currentNew: number[] = [];
        let currentPopular: number[] = [];

        customApps.forEach((app: any) => {
          let bg = 'bg-white';
          if (app.name === 'BBC News') bg = 'bg-black';
          else if (app.name === 'Weather') bg = 'bg-black';
          else if (app.name === 'TikTok') bg = 'bg-black';
          else if (app.name === 'Facebook') bg = 'bg-[#1877F2]';
          else if (app.name === 'X') bg = 'bg-black';
          else if (app.name === 'Netflix') bg = 'bg-black';
          else if (app.name === 'Spotify') bg = 'bg-black';

          const newApp = {
            id: app.id,
            name: app.name,
            url: app.url,
            widgetInfo: app.widgetInfo,
            icon: <img src={app.iconSrc} alt={app.name} className={`w-full h-full ${['Facebook', 'Instagram', 'TikTok', 'WhatsApp', 'X', 'Netflix', 'Spotify', 'Google Maps'].includes(app.name) ? 'object-cover' : 'object-contain'} ${bg === 'bg-white' && !['Facebook', 'Instagram', 'TikTok', 'WhatsApp', 'X', 'Netflix', 'Spotify', 'Google Maps'].includes(app.name) ? 'p-1' : ''} ${app.name === 'BBC News' ? 'invert' : ''} ${app.name === 'X' ? 'invert' : ''}`} />,
            bg,
            isPinned: app.isPinned ?? true
          };
          const newAppIndex = currentApps.length;
          currentApps.push(newApp);
          currentNew.push(newAppIndex);
          if ((app.location || '').toLowerCase() === 'popular') {
            currentPopular.push(newAppIndex);
          }
        });

        setApps(currentApps);
        setNewCategoryApps(currentNew);
        setPopularCategoryApps(currentPopular);
      } catch (error) {
        console.error('Failed to fetch custom apps:', error);
      }
    };
    fetchApps();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMenuOpen) {
        if (e.key === 'ArrowUp') handleNav('up');
        else if (e.key === 'ArrowDown') handleNav('down');
        else if (e.key === 'Enter' || e.key === '0') handleOk();
        else if (e.key === 'Backspace') handleBack();
        return;
      }

      switch (e.key) {
        case 'ArrowUp': handleNav('up'); break;
        case 'ArrowDown': handleNav('down'); break;
        case 'ArrowLeft': handleNav('left'); break;
        case 'ArrowRight': handleNav('right'); break;
        case 'Enter': handleOk(); break;
        case 'Backspace': handleBack(); break;
        case 'F1': toggleMenu(); break;
        case 'F2': handleBack(); break;
        case 'h': handleHome(); break;
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
        case '*': case '#':
          // Keypad logic can be added here if needed
          console.log(`Key pressed: ${e.key}`);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, focusArea, activeTab, activeCategory, selectedIndex, menuSelectedIndex, apps]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setMenuSelectedIndex(0);
  };

  const handleMenuSelect = (index: number) => {
    setMenuSelectedIndex(index);
    handleOk();
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
      const categoryIndexMap: Record<string, number> = {
        'New': 0,
        'Popular': 4,
        'Game': 8,
        'Social': 9,
        'Studies': 10,
        'Education': 11
      };
      setSelectedIndex(categoryIndexMap[activeCategory] ?? 0);
      setActiveCategory('none');
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
          } else if (selectedIndex === 8) {
            setActiveCategory('Social');
            setSelectedIndex(0);
          } else if (selectedIndex === 9) {
            setActiveCategory('News');
            setSelectedIndex(0);
          } else if (selectedIndex === 10) {
            setActiveCategory('Media');
            setSelectedIndex(0);
          } else if (selectedIndex === 11) {
            setActiveCategory('Tools');
            setSelectedIndex(0);
          } else if (selectedIndex === 12) {
            setActiveCategory('Game');
            setSelectedIndex(0);
          } else if (selectedIndex === 13) {
            setActiveCategory('All');
            setSelectedIndex(0);
          } else {
            const newApps = apps.filter(app => (app.location || '').toLowerCase() === 'new');
            const popularApps = apps.filter(app => (app.location || '').toLowerCase() === 'popular');
            const app = selectedIndex >= 5 ? popularApps[selectedIndex - 5] : newApps[selectedIndex - 1];
            if (app) window.open(app.url, '_blank');
          }
        } else {
          const categoryApps = apps.filter(app => (app.location || '').toLowerCase() === (activeCategory || '').toLowerCase());
          if (categoryApps[selectedIndex]) window.open(categoryApps[selectedIndex].url, '_blank');
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
          setActiveTab(prev => Math.max(0, prev - 1));
          setSelectedIndex(2);
        }
      } else if (dir === 'right') {
        if (selectedIndex % 3 !== 2 && selectedIndex < maxIndex) {
          setSelectedIndex(prev => prev + 1);
        } else {
          setActiveTab(prev => Math.min(2, prev + 1));
          setSelectedIndex(0);
        }
      }
      return;
    }

    if (activeTab === 0) {
      if (activeCategory !== 'none') {
        const categoryApps = apps.filter(app => (app.location || '').toLowerCase() === (activeCategory || '').toLowerCase());
        const maxIndex = Math.max(0, categoryApps.length - 1);
        if (dir === 'up') {
          if (selectedIndex === 0) {
            setFocusArea('header');
          } else {
            setSelectedIndex(prev => prev - 1);
          }
        } else if (dir === 'down') {
          setSelectedIndex(prev => Math.min(maxIndex, prev + 1));
        } else if (dir === 'left') {
          const categoryIndexMap: Record<string, number> = {
            'New': 0,
            'Popular': 4,
            'Social': 8,
            'News': 9,
            'Media': 10,
            'Tools': 11,
            'Game': 12,
            'All': 13
          };
          setSelectedIndex(categoryIndexMap[activeCategory] ?? 0);
          setActiveCategory('none');
        } else if (dir === 'right') {
          setActiveTab(1);
          setSelectedIndex(0);
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
        } else if (selectedIndex === 8) {
          setSelectedIndex(5); // Go to first app in Popular, or 4 if none
        } else if (selectedIndex >= 9 && selectedIndex <= 13) {
          setSelectedIndex(prev => prev - 1);
        }
      } else if (dir === 'down') {
        if (selectedIndex === 0) setSelectedIndex(1);
        else if (selectedIndex >= 1 && selectedIndex <= 3) setSelectedIndex(4);
        else if (selectedIndex === 4) setSelectedIndex(5);
        else if (selectedIndex >= 5 && selectedIndex <= 7) setSelectedIndex(8);
        else if (selectedIndex >= 8 && selectedIndex <= 12) setSelectedIndex(prev => prev + 1);
      } else if (dir === 'left') {
        if (selectedIndex === 0 || selectedIndex === 4 || (selectedIndex >= 8 && selectedIndex <= 13)) {
          // Do nothing
        } else if (selectedIndex === 1 || selectedIndex === 5) {
          setFocusArea('header');
        } else {
          setSelectedIndex(prev => prev - 1);
        }
      } else if (dir === 'right') {
        if (selectedIndex === 0 || selectedIndex === 4 || (selectedIndex >= 8 && selectedIndex <= 13)) {
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
    <div className="min-h-screen bg-black flex flex-col w-full h-full">
      <div className="flex-1 relative overflow-hidden">
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
            setSelectedIndex={setSelectedIndex}
            isMenuOpen={isMenuOpen}
            menuSelectedIndex={menuSelectedIndex}
            onToggleMenu={toggleMenu}
            onMenuSelect={handleMenuSelect}
            onBack={handleBack}
            focusArea={focusArea}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            apps={apps}
            newCategoryApps={newCategoryApps}
            popularCategoryApps={popularCategoryApps}
            showAbout={showAbout}
            showWidgetInfo={showWidgetInfo}
            menuItems={menuItems}
          />
        )}
      </div>
    </div>
  );
}
