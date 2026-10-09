import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RoutePlan, TransportMode } from '../../types';
import { MUMBAI_LOCATIONS, LocationNode } from '../../constants/mumbaiData';
import { 
  Train, 
  Bus, 
  Car, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  ArrowUpDown, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Play, 
  Info, 
  Zap, 
  Leaf, 
  AlertTriangle, 
  Footprints,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingDown,
  Navigation
} from 'lucide-react';

interface RouteModeComparisonProps {
  onStartTrip?: (plan: RoutePlan) => void;
  onWhyRoute?: (plan: RoutePlan) => void;
  className?: string;
  isEmbedded?: boolean;
}

export const RouteModeComparison: React.FC<RouteModeComparisonProps> = ({
  onStartTrip,
  onWhyRoute,
  className = '',
  isEmbedded = false
}) => {
  const {
    routes,
    selectedRoute,
    setSelectedRoute,
    startLiveTrip,
    setIsWhyRouteOpen,
    originId,
    setOriginId,
    destinationId,
    setDestinationId,
    targetTime,
    setTargetTime,
    currentScenario
  } = useApp();

  const [activeModeTab, setActiveModeTab] = useState<'train' | 'bus' | 'cab' | 'all'>('train');
  const [showFullMatrix, setShowFullMatrix] = useState(false);

  // Popular commute pairs in Mumbai
  const popularPairs = [
    { from: 'andheri_west', to: 'bkc', label: 'Andheri ⇄ BKC' },
    { from: 'dadar', to: 'churchgate', label: 'Dadar ⇄ Churchgate' },
    { from: 'powai', to: 'bkc', label: 'Powai ⇄ BKC' },
    { from: 'bandra_west', to: 'marine_drive', label: 'Bandra ⇄ Marine Drive' },
    { from: 'kurla', to: 'dadar', label: 'Kurla ⇄ Dadar' },
  ];

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
  };

  // Find candidate plans for the 3 primary modes: Train, Bus, Taxi (plus Metro & Auto)
  const trainPlan = useMemo(() => {
    return routes.find((r) => r.primaryMode === 'train' || r.modes.includes('train')) || routes[1] || routes[0];
  }, [routes]);

  const busPlan = useMemo(() => {
    return routes.find((r) => r.primaryMode === 'bus' || r.modes.includes('bus')) || routes[2] || routes[0];
  }, [routes]);

  const taxiPlan = useMemo(() => {
    return routes.find((r) => r.primaryMode === 'cab' || r.modes.includes('cab')) || routes[3] || routes[0];
  }, [routes]);

  const metroPlan = useMemo(() => {
    return routes.find((r) => r.primaryMode === 'metro' || r.modes.includes('metro'));
  }, [routes]);

  // Current mode active plan
  const activePlan = useMemo(() => {
    if (activeModeTab === 'train') return trainPlan;
    if (activeModeTab === 'bus') return busPlan;
    if (activeModeTab === 'cab') return taxiPlan;
    return selectedRoute || trainPlan;
  }, [activeModeTab, trainPlan, busPlan, taxiPlan, selectedRoute]);

  // Sync selectedRoute whenever user clicks a mode tab
  const handleSelectMode = (mode: 'train' | 'bus' | 'cab') => {
    setActiveModeTab(mode);
    let target = trainPlan;
    if (mode === 'bus') target = busPlan;
    if (mode === 'cab') target = taxiPlan;
    if (target) {
      setSelectedRoute(target);
    }
  };

  // Calculate maximum travel time for the comparative bar chart
  const maxTime = Math.max(
    trainPlan?.p50Minutes || 30,
    busPlan?.p50Minutes || 45,
    taxiPlan?.p50Minutes || 40,
    60
  );

  const fastestPlan = useMemo(() => {
    const list = [trainPlan, busPlan, taxiPlan].filter(Boolean) as RoutePlan[];
    return list.reduce((prev, curr) => (curr.p50Minutes < prev.p50Minutes ? curr : prev), list[0]);
  }, [trainPlan, busPlan, taxiPlan]);

  const originNode = MUMBAI_LOCATIONS.find((l) => l.id === originId) || MUMBAI_LOCATIONS[0];
  const destNode = MUMBAI_LOCATIONS.find((l) => l.id === destinationId) || MUMBAI_LOCATIONS[1];

  const renderModeIcon = (mode: TransportMode | 'train' | 'bus' | 'cab') => {
    switch (mode) {
      case 'train':
        return <Train className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'cab':
        return <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Navigation className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* 1. Chosen Route Selection Box */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2166F3]">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-[#0B1F3A] dark:text-white">
              Multimodal Travel Time Comparison
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono-numbers">
            {currentScenario?.weather.condition || 'Live Traffic Active'}
          </span>
        </div>

        {/* Origin & Destination Selectors */}
        <div className="space-y-2">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5">
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
              className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-600 shadow-2xs"
              title="Swap From and To"
              aria-label="Swap origin and destination"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5">
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

        {/* Quick Commute Route Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">Quick routes:</span>
          {popularPairs.map((pair, idx) => {
            const isMatch = originId === pair.from && destinationId === pair.to;
            return (
              <button
                key={idx}
                onClick={() => {
                  setOriginId(pair.from);
                  setDestinationId(pair.to);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isMatch
                    ? 'bg-[#2166F3] text-white shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pair.label}
              </button>
            );
          })}
        </div>

        {/* Target Time & Scenario Bar */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Target arrival:</span>
            <input
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 font-bold px-2 py-0.5 rounded-md text-[#0B1F3A] dark:text-white outline-none font-mono-numbers cursor-pointer text-xs"
            />
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            P50 / P90 Live Variance
          </span>
        </div>
      </div>

      {/* 2. Visual Travel Time Relative Comparison Bars */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#0B1F3A] dark:text-white">
            Travel Time Relative Speeds
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Typical (P50) vs Worst-Case (P90)
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Train Bar */}
          {trainPlan && (
            <div 
              onClick={() => handleSelectMode('train')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                activeModeTab === 'train' || selectedRoute?.id === trainPlan.id
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-transparent hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 font-bold text-rose-950 dark:text-rose-200">
                  <Train className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Suburban Local Train</span>
                  {fastestPlan?.id === trainPlan.id && (
                    <span className="text-[10px] bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold px-1.5 py-0.2 rounded">
                      FASTEST
                    </span>
                  )}
                </div>
                <div className="text-xs font-extrabold font-mono-numbers text-rose-900 dark:text-rose-200">
                  {trainPlan.p50Minutes} min <span className="text-[10px] font-normal text-slate-500">(P90: {trainPlan.p90Minutes}m)</span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-rose-600 dark:bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (trainPlan.p50Minutes / maxTime) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>Fare: ₹{trainPlan.costInr} · Dedicated tracks</span>
                <span>{trainPlan.onTimeProbability}% on-time</span>
              </div>
            </div>
          )}

          {/* Bus Bar */}
          {busPlan && (
            <div 
              onClick={() => handleSelectMode('bus')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                activeModeTab === 'bus' || selectedRoute?.id === busPlan.id
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-transparent hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-200">
                  <Bus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>BEST AC Express Bus</span>
                  {busPlan.p50Minutes < (taxiPlan?.p50Minutes || 99) && (
                    <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold px-1.5 py-0.2 rounded">
                      CHEAPEST AC
                    </span>
                  )}
                </div>
                <div className="text-xs font-extrabold font-mono-numbers text-amber-900 dark:text-amber-200">
                  {busPlan.p50Minutes} min <span className="text-[10px] font-normal text-slate-500">(P90: {busPlan.p90Minutes}m)</span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-amber-500 dark:bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (busPlan.p50Minutes / maxTime) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>Fare: ₹{busPlan.costInr} · Sit-down AC</span>
                <span>{busPlan.onTimeProbability}% on-time</span>
              </div>
            </div>
          )}

          {/* Taxi Bar */}
          {taxiPlan && (
            <div 
              onClick={() => handleSelectMode('cab')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                activeModeTab === 'cab' || selectedRoute?.id === taxiPlan.id
                  ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-transparent hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 font-bold text-blue-950 dark:text-blue-200">
                  <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Taxi / Cab (Expressway)</span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold px-1.5 py-0.2 rounded">
                    DOOR-TO-DOOR
                  </span>
                </div>
                <div className="text-xs font-extrabold font-mono-numbers text-blue-900 dark:text-blue-200">
                  {taxiPlan.p50Minutes} min <span className="text-[10px] font-normal text-slate-500">(P90: {taxiPlan.p90Minutes}m)</span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (taxiPlan.p50Minutes / maxTime) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>Fare: ₹{taxiPlan.costInr} · Traffic dependent</span>
                <span>{taxiPlan.onTimeProbability}% on-time</span>
              </div>
            </div>
          )}
        </div>

        {/* Trade-off summary insight banner */}
        {trainPlan && taxiPlan && (
          <div className="mt-2 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <span className="font-extrabold text-[#2166F3]">Decision Insight: </span>
            {trainPlan.p50Minutes <= taxiPlan.p50Minutes ? (
              <span>
                <b>Local Train</b> is <b>{taxiPlan.p50Minutes - trainPlan.p50Minutes} min faster</b> than a Taxi and saves <b>₹{taxiPlan.costInr - trainPlan.costInr}</b> by avoiding surface traffic.
              </span>
            ) : (
              <span>
                <b>Taxi</b> is <b>{trainPlan.p50Minutes - taxiPlan.p50Minutes} min faster</b> door-to-door, but costs <b>₹{taxiPlan.costInr - trainPlan.costInr} more</b> and has higher delay risk during rain.
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. Three Mode Option Cards (Interactive Selection) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Train Card */}
        {trainPlan && (
          <div
            onClick={() => handleSelectMode('train')}
            className={`p-4 rounded-2xl transition-all cursor-pointer border relative flex flex-col justify-between ${
              activeModeTab === 'train' || selectedRoute?.id === trainPlan.id
                ? 'bg-white dark:bg-slate-900 border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <Train className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                  Suburban Rail
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#0B1F3A] dark:text-white">
                Local Train
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                Fast & Slow Corridor
              </p>

              {/* Big Travel Time */}
              <div className="mt-3">
                <div className="text-2xl font-black text-[#0B1F3A] dark:text-white font-mono-numbers">
                  {trainPlan.p50Minutes} <span className="text-xs font-normal text-slate-500">mins</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-numbers">
                  Worst-case: {trainPlan.p90Minutes}m (buffer {trainPlan.p90Minutes - trainPlan.p50Minutes}m)
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Fare</span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono-numbers">₹{trainPlan.costInr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Reliability</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers">{trainPlan.onTimeProbability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Frequency</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Every 3-4m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">CO₂ footprint</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{trainPlan.carbonKg} kg</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectMode('train');
              }}
              className={`w-full mt-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeModeTab === 'train' || selectedRoute?.id === trainPlan.id
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {activeModeTab === 'train' || selectedRoute?.id === trainPlan.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected Option</span>
                </>
              ) : (
                <span>Select Train</span>
              )}
            </button>
          </div>
        )}

        {/* Bus Card */}
        {busPlan && (
          <div
            onClick={() => handleSelectMode('bus')}
            className={`p-4 rounded-2xl transition-all cursor-pointer border relative flex flex-col justify-between ${
              activeModeTab === 'bus' || selectedRoute?.id === busPlan.id
                ? 'bg-white dark:bg-slate-900 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Bus className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  BEST Electric
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#0B1F3A] dark:text-white">
                BEST AC Bus
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                Express Sit-Down
              </p>

              {/* Big Travel Time */}
              <div className="mt-3">
                <div className="text-2xl font-black text-[#0B1F3A] dark:text-white font-mono-numbers">
                  {busPlan.p50Minutes} <span className="text-xs font-normal text-slate-500">mins</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-numbers">
                  Worst-case: {busPlan.p90Minutes}m (buffer {busPlan.p90Minutes - busPlan.p50Minutes}m)
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Fare</span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono-numbers">₹{busPlan.costInr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Reliability</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers">{busPlan.onTimeProbability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Frequency</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Every 8-10m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">CO₂ footprint</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{busPlan.carbonKg} kg</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectMode('bus');
              }}
              className={`w-full mt-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeModeTab === 'bus' || selectedRoute?.id === busPlan.id
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {activeModeTab === 'bus' || selectedRoute?.id === busPlan.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected Option</span>
                </>
              ) : (
                <span>Select Bus</span>
              )}
            </button>
          </div>
        )}

        {/* Taxi Card */}
        {taxiPlan && (
          <div
            onClick={() => handleSelectMode('cab')}
            className={`p-4 rounded-2xl transition-all cursor-pointer border relative flex flex-col justify-between ${
              activeModeTab === 'cab' || selectedRoute?.id === taxiPlan.id
                ? 'bg-white dark:bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Road Cab
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#0B1F3A] dark:text-white">
                Taxi / Cab
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                Door-to-Door Private
              </p>

              {/* Big Travel Time */}
              <div className="mt-3">
                <div className="text-2xl font-black text-[#0B1F3A] dark:text-white font-mono-numbers">
                  {taxiPlan.p50Minutes} <span className="text-xs font-normal text-slate-500">mins</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-numbers">
                  Worst-case: {taxiPlan.p90Minutes}m (buffer {taxiPlan.p90Minutes - taxiPlan.p50Minutes}m)
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Fare</span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono-numbers">₹{taxiPlan.costInr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Reliability</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono-numbers">{taxiPlan.onTimeProbability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Frequency</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">3-5m pickup</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">CO₂ footprint</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{taxiPlan.carbonKg} kg</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectMode('cab');
              }}
              className={`w-full mt-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeModeTab === 'cab' || selectedRoute?.id === taxiPlan.id
                  ? 'bg-[#2166F3] hover:bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {activeModeTab === 'cab' || selectedRoute?.id === taxiPlan.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected Option</span>
                </>
              ) : (
                <span>Select Taxi</span>
              )}
            </button>
          </div>
        )}

      </div>

      {/* 4. Active Selected Plan Itinerary & Delay Breakdown */}
      {activePlan && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4.5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected Itinerary Breakdown
              </div>
              <h4 className="text-sm font-bold text-[#0B1F3A] dark:text-white mt-0.5">
                {activePlan.title}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-[#2166F3] dark:text-blue-400 font-mono-numbers">
                Leave at {activePlan.leaveByTime || 'Now'}
              </span>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Arrive by {activePlan.arriveByTime || targetTime}
              </div>
            </div>
          </div>

          {/* Real-time Delay / Traffic Advisory */}
          {activePlan.delayReason && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Live Condition: </span>
                {activePlan.delayReason}
              </div>
            </div>
          )}

          {/* Leg by leg sequence */}
          <div className="space-y-2 pt-1">
            {activePlan.legs.map((leg, index) => (
              <div 
                key={leg.id}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-2xs shrink-0 mt-0.5">
                  {leg.mode === 'walk' ? (
                    <Footprints className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : leg.mode === 'train' ? (
                    <Train className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  ) : leg.mode === 'bus' ? (
                    <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  ) : leg.mode === 'cab' ? (
                    <Car className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>
                      {leg.mode === 'walk' ? 'Walk' : leg.mode === 'train' ? 'Board Local Train' : leg.mode === 'bus' ? 'Ride BEST Bus' : 'Drive Cab'}
                    </span>
                    <span className="font-mono-numbers text-slate-500 dark:text-slate-400">
                      {leg.durationMin} min · {leg.distanceKm} km
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {leg.instructions}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Bar for Selected Mode */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsWhyRouteOpen(true);
                if (onWhyRoute) onWhyRoute(activePlan);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#2166F3] py-2 px-2 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-[#2166F3]" />
              <span>Why this route?</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFullMatrix(!showFullMatrix)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                {showFullMatrix ? 'Hide Full Table' : 'Compare All Metrics'}
              </button>

              <button
                type="button"
                onClick={() => {
                  startLiveTrip(activePlan);
                  if (onStartTrip) onStartTrip(activePlan);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2166F3] hover:bg-blue-600 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer min-h-[38px]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Live Navigation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Comprehensive Metric Comparison Table (Expandable) */}
      {showFullMatrix && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-x-auto space-y-2 animate-slide-up">
          <div className="text-xs font-bold text-[#0B1F3A] dark:text-white pb-1">
            Complete Mode Comparison Matrix
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-2 font-semibold">Metric</th>
                <th className="py-2.5 px-2 font-semibold text-rose-700 dark:text-rose-400">🚆 Local Train</th>
                <th className="py-2.5 px-2 font-semibold text-amber-700 dark:text-amber-400">🚌 BEST Bus</th>
                <th className="py-2.5 px-2 font-semibold text-blue-700 dark:text-blue-400">🚕 Taxi / Cab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2 px-2 text-slate-500 font-medium">Typical Travel Time</td>
                <td className="py-2 px-2 font-bold font-mono-numbers text-rose-900 dark:text-rose-200">{trainPlan?.p50Minutes} min</td>
                <td className="py-2 px-2 font-bold font-mono-numbers text-amber-900 dark:text-amber-200">{busPlan?.p50Minutes} min</td>
                <td className="py-2 px-2 font-bold font-mono-numbers text-blue-900 dark:text-blue-200">{taxiPlan?.p50Minutes} min</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-500 font-medium">Worst-Case (P90)</td>
                <td className="py-2 px-2 font-mono-numbers">{trainPlan?.p90Minutes} min</td>
                <td className="py-2 px-2 font-mono-numbers">{busPlan?.p90Minutes} min</td>
                <td className="py-2 px-2 font-mono-numbers">{taxiPlan?.p90Minutes} min</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-500 font-medium">Total Cost</td>
                <td className="py-2 px-2 font-bold font-mono-numbers">₹{trainPlan?.costInr}</td>
                <td className="py-2 px-2 font-bold font-mono-numbers">₹{busPlan?.costInr}</td>
                <td className="py-2 px-2 font-bold font-mono-numbers">₹{taxiPlan?.costInr}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-500 font-medium">On-Time Punctuality</td>
                <td className="py-2 px-2 font-bold text-emerald-600 font-mono-numbers">{trainPlan?.onTimeProbability}%</td>
                <td className="py-2 px-2 font-bold text-emerald-600 font-mono-numbers">{busPlan?.onTimeProbability}%</td>
                <td className="py-2 px-2 font-bold text-blue-600 font-mono-numbers">{taxiPlan?.onTimeProbability}%</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-500 font-medium">Departure (Leave by)</td>
                <td className="py-2 px-2 font-mono-numbers">{trainPlan?.leaveByTime || 'Now'}</td>
                <td className="py-2 px-2 font-mono-numbers">{busPlan?.leaveByTime || 'Now'}</td>
                <td className="py-2 px-2 font-mono-numbers">{taxiPlan?.leaveByTime || 'Now'}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-500 font-medium">Flood / Waterlogging Risk</td>
                <td className="py-2 px-2">{trainPlan?.floodExposure}</td>
                <td className="py-2 px-2">{busPlan?.floodExposure}</td>
                <td className="py-2 px-2">{taxiPlan?.floodExposure}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-500 font-medium">Seating Comfort</td>
                <td className="py-2 px-2">High crowd General / AC</td>
                <td className="py-2 px-2">Sit-down AC Express</td>
                <td className="py-2 px-2">Private door-to-door</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-slate-500 font-medium">CO₂ Emissions</td>
                <td className="py-2 px-2 font-bold text-emerald-600">{trainPlan?.carbonKg} kg</td>
                <td className="py-2 px-2 font-bold text-emerald-600">{busPlan?.carbonKg} kg</td>
                <td className="py-2 px-2 font-bold text-rose-600">{taxiPlan?.carbonKg} kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
