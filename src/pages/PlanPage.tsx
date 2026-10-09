import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MUMBAI_LOCATIONS, LocationNode } from '../constants/mumbaiData';
import { RouteBottomSheet } from '../components/pwa/RouteBottomSheet';
import { WhyThisRouteSheet } from '../components/pwa/WhyThisRouteSheet';
import { PreferenceControls } from '../components/planner/PreferenceControls';
import { MumbaiInteractiveMap } from '../components/map/MumbaiInteractiveMap';
import { RouteModeComparison } from '../components/planner/RouteModeComparison';
import { 
  ArrowUpDown, 
  Compass, 
  SlidersHorizontal, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Layers
} from 'lucide-react';

export const PlanPage: React.FC = () => {
  const { 
    originId, 
    setOriginId, 
    destinationId, 
    setDestinationId, 
    targetTime, 
    setTargetTime,
    timeType,
    setTimeType,
    viewMode,
    setIsComparisonOpen
  } = useApp();

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [planViewTab, setPlanViewTab] = useState<'compare' | 'all'>('compare');

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
  };

  // DESKTOP WEB VIEW (When on desktop)
  if (viewMode === 'desktop') {
    return (
      <div className="w-full h-[calc(100vh-56px)] overflow-hidden relative bg-slate-100 dark:bg-slate-950">
        
        {/* Full Screen Interactive Map */}
        <div className="absolute inset-0 z-0">
          <MumbaiInteractiveMap showControls={false} className="w-full h-full" />
        </div>

        {/* Floating Planning & Comparison Panel */}
        <aside aria-label="Route preferences and options" className="absolute top-4 left-4 z-20 w-[460px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-84px)] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 space-y-4 rounded-3xl shadow-2xl scrollbar-thin">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#2166F3]" />
                <h1 className="text-base font-extrabold text-[#0B1F3A] dark:text-white">
                  Route Selection & Compare
                </h1>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsComparisonOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-xs font-bold text-[#2166F3] transition-colors cursor-pointer flex items-center gap-1"
                  title="Open Full Screen Matrix"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Matrix</span>
                </button>
                <button
                  onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Weights</span>
                  {isPreferencesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Origin & Destination Swapper */}
            <div className="space-y-2">
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div className="flex-1">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">From</span>
                  <select
                    value={originId}
                    onChange={(e) => setOriginId(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs text-[#0B1F3A] dark:text-white outline-none cursor-pointer"
                  >
                    {MUMBAI_LOCATIONS.map((loc: LocationNode) => (
                      <option key={loc.id} value={loc.id} className="dark:bg-slate-800">{loc.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSwap}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Swap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B1F3A] dark:bg-white shrink-0" />
                <div className="flex-1">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">To</span>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs text-[#0B1F3A] dark:text-white outline-none cursor-pointer"
                  >
                    {MUMBAI_LOCATIONS.map((loc: LocationNode) => (
                      <option key={loc.id} value={loc.id} className="dark:bg-slate-800">{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Target Time */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Target:</span>
                <input
                  type="time"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  className="bg-transparent font-bold text-xs text-[#0B1F3A] dark:text-white outline-none font-mono-numbers cursor-pointer"
                />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                P50 / P90 quantile scoring
              </span>
            </div>
          </div>

          {/* Expandable Preferences Slider Drawer */}
          {isPreferencesOpen && (
            <div className="animate-slide-up">
              <PreferenceControls />
            </div>
          )}

          {/* Tab Switcher: Compare Modes vs All Ranked Plans */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              onClick={() => setPlanViewTab('compare')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                planViewTab === 'compare'
                  ? 'bg-white dark:bg-slate-700 text-[#0B1F3A] dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#2166F3]" />
              <span>Compare Train · Bus · Taxi</span>
            </button>
            <button
              onClick={() => setPlanViewTab('all')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                planViewTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-[#0B1F3A] dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>All Ranked Plans</span>
            </button>
          </div>

          {/* Main Results View */}
          {planViewTab === 'compare' ? (
            <RouteModeComparison />
          ) : (
            <RouteBottomSheet />
          )}

        </aside>

        {/* Why This Route Modal Sheet */}
        <WhyThisRouteSheet />

      </div>
    );
  }

  // MOBILE PWA CANVAS (When on mobile view)
  return (
    <div className="max-w-lg mx-auto w-full space-y-4 pb-20 p-2 sm:p-4">
      
      {/* Top Search Glass Card */}
      <div className="glass-card rounded-3xl p-5 shadow-lg border border-white/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#2166F3]" />
            <h1 className="text-base font-extrabold text-[#0B1F3A]">
              Commute Planner
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-2 py-1 rounded-xl bg-blue-50 text-xs font-bold text-[#2166F3] cursor-pointer"
            >
              Matrix
            </button>
            <button
              onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Weights</span>
              {isPreferencesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Origin / Destination Swap */}
        <div className="space-y-2">
          <div className="bg-white/90 p-3 rounded-2xl border border-slate-200/80 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">From</span>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-[#0B1F3A] outline-none cursor-pointer"
              >
                {MUMBAI_LOCATIONS.map((loc: LocationNode) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSwap}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Swap"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white/90 p-3 rounded-2xl border border-slate-200/80 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B1F3A] shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">To</span>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-[#0B1F3A] outline-none cursor-pointer"
              >
                {MUMBAI_LOCATIONS.map((loc: LocationNode) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Time Selector */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="bg-white/90 px-3 py-2 rounded-xl border border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Target:</span>
            <input
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="bg-transparent font-bold text-xs text-[#0B1F3A] outline-none font-mono-numbers cursor-pointer"
            />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            90% confidence buffer
          </span>
        </div>
      </div>

      {/* Expandable Preferences Drawer */}
      {isPreferencesOpen && (
        <div className="animate-slide-up">
          <PreferenceControls />
        </div>
      )}

      {/* Mobile Tab Switcher: Compare Modes vs All Plans */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button
          onClick={() => setPlanViewTab('compare')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            planViewTab === 'compare'
              ? 'bg-white dark:bg-slate-700 text-[#0B1F3A] dark:text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#2166F3]" />
          <span>Compare Train · Bus · Taxi</span>
        </button>
        <button
          onClick={() => setPlanViewTab('all')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            planViewTab === 'all'
              ? 'bg-white dark:bg-slate-700 text-[#0B1F3A] dark:text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>All Plans</span>
        </button>
      </div>

      {/* Route Content */}
      {planViewTab === 'compare' ? (
        <RouteModeComparison />
      ) : (
        <RouteBottomSheet />
      )}

      {/* Why This Route Modal Sheet */}
      <WhyThisRouteSheet />

    </div>
  );
};
