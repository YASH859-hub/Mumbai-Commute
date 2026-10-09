import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  Moon, 
  Sun, 
  Sparkles, 
  ChevronDown,
  Satellite,
  Building2,
  BarChart3,
  User,
  MapPin,
  Map,
  Code2,
  Smartphone,
  Monitor
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isNightMode, 
    setIsNightMode,
    setIsAssistantOpen,
    setIsTechStackModalOpen,
    setIsMapSettingsOpen,
    mapTileStyle,
    setMapTileStyle,
    mapTilerApiKey,
    currentScenario,
    viewMode,
    setViewMode
  } = useApp();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-2xs px-4 sm:px-6 h-14 transition-colors">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        
        {/* Left: App Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2166F3] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-[#0B1F3A] dark:text-white block leading-tight">
                Mumbai Commute Copilot
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block leading-none">
                Real-Time Transit Decision Engine
              </span>
            </div>
          </button>
        </div>

        {/* Center: Clean Consumer Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => setActiveTab('home')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'home' || activeTab === 'plan' 
                ? 'text-[#2166F3] dark:text-blue-400 font-bold border-b-2 border-[#2166F3]' 
                : 'hover:text-[#2166F3] dark:hover:text-white'
            }`}
          >
            Commute
          </button>

          <button 
            onClick={() => setActiveTab('trips')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'trips' 
                ? 'text-[#2166F3] dark:text-blue-400 font-bold border-b-2 border-[#2166F3]' 
                : 'hover:text-[#2166F3] dark:hover:text-white'
            }`}
          >
            Trips & Safety
          </button>

          <button 
            onClick={() => setActiveTab('alerts')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'alerts' 
                ? 'text-[#2166F3] dark:text-blue-400 font-bold border-b-2 border-[#2166F3]' 
                : 'hover:text-[#2166F3] dark:hover:text-white'
            }`}
          >
            Disruptions
          </button>

          {/* Clean "More" Dropdown Menu for Secondary Tools */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex items-center gap-1 py-1 transition-colors cursor-pointer ${
                ['b2b', 'analytics', 'profile'].includes(activeTab) || isMoreOpen
                  ? 'text-[#2166F3] dark:text-blue-400 font-bold'
                  : 'hover:text-[#2166F3] dark:hover:text-white'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-1.5 z-50 animate-fade-in text-xs">
                <button
                  onClick={() => {
                    setActiveTab('b2b');
                    setIsMoreOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                    activeTab === 'b2b' ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2166F3] font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#2166F3]" />
                  <div>
                    <div className="font-semibold">B2B Fleet Dispatch</div>
                    <div className="text-[10px] text-slate-400">Enterprise employee transit</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setIsMoreOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                    activeTab === 'analytics' ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2166F3] font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">City Transit Analytics</div>
                    <div className="text-[10px] text-slate-400">Ward congestion & tide sensors</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsMoreOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                    activeTab === 'profile' ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2166F3] font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4 text-indigo-500" />
                  <div>
                    <div className="font-semibold">Commuter Profile</div>
                    <div className="text-[10px] text-slate-400">Passes & emergency contacts</div>
                  </div>
                </button>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  onClick={() => {
                    setIsMapSettingsOpen(true);
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <Map className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-semibold">Map Tiles & Satellite</div>
                    <div className="text-[10px] text-slate-400">MapTiler Key & Hybrid styles</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsTechStackModalOpen(true);
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="font-semibold">System Architecture</div>
                    <div className="text-[10px] text-slate-400">Nexathon 2026 tech stack</div>
                  </div>
                </button>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  onClick={() => {
                    setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop');
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  {viewMode === 'desktop' ? (
                    <>
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="font-semibold">Preview Phone PWA Frame</div>
                        <div className="text-[10px] text-slate-400">390×844 device preview</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Monitor className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="font-semibold">Full Web Desktop View</div>
                        <div className="text-[10px] text-slate-400">Expand to edge-to-edge web</div>
                      </div>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Status Indicator & Quick Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Subtle Live Weather Condition (Quiet metadata, zero pill slop) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>🌧️ High Tide {currentScenario.tide.highTideTime} ({currentScenario.tide.highTideHeightM}m)</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>{currentScenario.weather.rainfallMmPerHour} mm/h</span>
          </div>

          {/* Quick Satellite Hybrid Toggle */}
          <button
            onClick={() => {
              if (mapTileStyle === 'maptiler_satellite') {
                setMapTileStyle('auto');
              } else {
                setMapTileStyle('maptiler_satellite');
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer min-h-[36px] ${
              mapTileStyle === 'maptiler_satellite'
                ? 'bg-slate-900 text-amber-300 dark:bg-amber-400/20 dark:text-amber-300 ring-1 ring-amber-400/50'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title="Toggle Satellite Hybrid Aerial Photography"
          >
            <Satellite className={`w-3.5 h-3.5 ${mapTileStyle === 'maptiler_satellite' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Satellite</span>
          </button>

          {/* Night Mode Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            aria-label="Toggle Night Mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title={isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          >
            {isNightMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Ask Copilot Button */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2166F3] hover:bg-[#1a55cc] active:scale-[0.98] text-white font-bold text-xs shadow-xs transition-all cursor-pointer min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Copilot</span>
          </button>

        </div>

      </div>
    </header>
  );
};
