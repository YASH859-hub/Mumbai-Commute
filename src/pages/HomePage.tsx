import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MUMBAI_LOCATIONS, LocationNode } from '../constants/mumbaiData';
import { MumbaiInteractiveMap } from '../components/map/MumbaiInteractiveMap';
import { WhyThisRouteSheet } from '../components/pwa/WhyThisRouteSheet';
import { RouteModeComparison } from '../components/planner/RouteModeComparison';
import { RouteBottomSheet } from '../components/pwa/RouteBottomSheet';
import { 
  Compass, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ArrowUpDown,
  Sparkles, 
  Waves, 
  Train, 
  Bus,
  Car,
  ShieldCheck, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Satellite,
  Map,
  Zap,
  Layers,
  Play,
  Info,
  CheckCircle2,
  Footprints
} from 'lucide-react';
import { TransportMode } from '../types';

export const HomePage: React.FC = () => {
  const { 
    originId, 
    setOriginId, 
    destinationId, 
    setDestinationId, 
    targetTime, 
    setTargetTime, 
    runRouteSearch,
    routes,
    selectedRoute,
    setSelectedRoute,
    startLiveTrip,
    setIsWhyRouteOpen,
    currentScenario,
    setScenario,
    currentScenarioId,
    mapLayers,
    toggleMapLayer,
    mapTileStyle,
    setMapTileStyle,
    setIsMapSettingsOpen,
    leaveByRecommendation,
    setIsComparisonOpen,
    setActiveTab
  } = useApp();

  // Floating panel tab: 'best' (Primary Journey) | 'compare' (Train vs Bus vs Taxi) | 'all' (All candidates)
  const [activePanelTab, setActivePanelTab] = useState<'best' | 'compare' | 'all'>('best');
  const [isPanelExpanded, setIsPanelExpanded] = useState<boolean>(true);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);
  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState<boolean>(false);

  // Quick swap origin and destination
  const handleSwap = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
    runRouteSearch();
  };

  const handleSearch = () => {
    runRouteSearch();
    setIsPanelExpanded(true);
    setActivePanelTab('best');
  };

  // Best recommended route (top candidate or selected)
  const bestRoute = selectedRoute || routes[0];

  const scenarios = [
    { id: 'normal', label: 'Normal Peak' },
    { id: 'monsoon_tide', label: 'Monsoon + 4.58m Tide' },
    { id: 'train_disruption', label: 'Western Line Delay' },
    { id: 'night_traveller', label: 'Night Safe Mode' },
  ];

  const renderModeIcon = (mode: TransportMode, idx: number) => {
    switch (mode) {
      case 'walk':
        return <Footprints key={idx} className="w-3.5 h-3.5 text-emerald-600" />;
      case 'metro':
        return <Train key={idx} className="w-3.5 h-3.5 text-blue-600" />;
      case 'train':
        return <Train key={idx} className="w-3.5 h-3.5 text-red-600" />;
      case 'bus':
        return <Bus key={idx} className="w-3.5 h-3.5 text-amber-600" />;
      case 'auto':
      case 'cab':
      case 'car':
        return <Car key={idx} className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />;
      default:
        return <Footprints key={idx} className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-56px)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      
      {/* ======================================================== */}
      {/* 1. LARGE INTERACTIVE MUMBAI MAP (FULL CANVAS)            */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-0">
        <MumbaiInteractiveMap showControls={false} className="w-full h-full" />
      </div>

      {/* ======================================================== */}
      {/* 2. FLOATING MAP CONTROLS (TOP RIGHT OVERLAY)             */}
      {/* ======================================================== */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
        
        {/* Main Floating Tool Strip */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 text-xs font-medium">
          
          {/* Quick Satellite Hybrid Toggle */}
          <button
            onClick={() => {
              if (mapTileStyle === 'maptiler_satellite') {
                setMapTileStyle('auto');
              } else {
                setMapTileStyle('maptiler_satellite');
              }
            }}
            className={`p-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
              mapTileStyle === 'maptiler_satellite'
                ? 'bg-slate-900 text-amber-300 dark:bg-amber-400/20 dark:text-amber-300 ring-1 ring-amber-400/60 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Toggle Satellite Hybrid Photography (MapTiler hybrid-v4)"
          >
            <Satellite className={`w-4 h-4 ${mapTileStyle === 'maptiler_satellite' ? 'text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Satellite</span>
          </button>

          {/* Map Layer Switches */}
          <button
            onClick={() => toggleMapLayer('traffic')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              mapLayers.traffic
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 font-bold'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Live Traffic"
          >
            <Car className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleMapLayer('transit')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              mapLayers.transit
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Rail & Metro Lines"
          >
            <Train className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleMapLayer('flood')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              mapLayers.flood
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 font-bold'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Monsoon Waterlogging & Tide Hotspots"
          >
            <Waves className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleMapLayer('safety')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              mapLayers.safety
                ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Night Well-Lit Safety Corridors"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* Quick Scenario Picker Popover */}
          <div className="relative">
            <button
              onClick={() => setIsScenarioMenuOpen(!isScenarioMenuOpen)}
              className="p-2 px-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              title="Test Live Disruption Scenarios"
            >
              <span>Scenario</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isScenarioMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isScenarioMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-1.5 z-50 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1">
                  Simulation Presets
                </div>
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setScenario(sc.id);
                      setIsScenarioMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                      currentScenarioId === sc.id
                        ? 'bg-[#2166F3] text-white font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Weather / High Tide Float Badge (Quiet text metadata) */}
        <div className="pointer-events-auto bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-200/80 dark:border-slate-800 shadow-sm text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span>Live Feed: <strong>{currentScenario.weather.condition}</strong></span>
          <span>·</span>
          <span>High Tide @ {currentScenario.tide.highTideTime} ({currentScenario.tide.highTideHeightM}m)</span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. FLOATING COMMUTE PLANNER + ROUTE RECOMMENDATION PANEL */}
      {/* ======================================================== */}
      <aside aria-label="Route planning overlay" className="absolute top-4 left-4 z-20 w-[calc(100%-32px)] sm:w-[420px] max-h-[calc(100%-32px)] pointer-events-none flex flex-col">
        <div className="pointer-events-auto w-full flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-300">
          
          {/* Panel Header & Minimize Control */}
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#2166F3]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A] dark:text-white">
                Mumbai Commute Planner
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                className="p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                title={isPanelExpanded ? 'Minimize Panel to View Map' : 'Expand Planner'}
              >
                {isPanelExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* COLLAPSED FLOATING STATE */}
          {!isPanelExpanded ? (
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0B1F3A] dark:text-white">
                <span>{MUMBAI_LOCATIONS.find((l) => l.id === originId)?.shortName || 'Origin'} → {MUMBAI_LOCATIONS.find((l) => l.id === destinationId)?.shortName || 'Destination'}</span>
                <span className="text-[#2166F3] font-mono-numbers">{bestRoute?.p50Minutes} min</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Leave by {leaveByRecommendation}</span>
                <button
                  onClick={() => setIsPanelExpanded(true)}
                  className="text-xs font-bold text-[#2166F3] hover:underline cursor-pointer"
                >
                  Expand Planner
                </button>
              </div>
            </div>
          ) : (
            /* EXPANDED FULL COMMUTER WORKFLOW */
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[calc(100vh-140px)] scrollbar-thin">
              
              {/* PRIMARY STEP 1: WHERE ARE YOU GOING? */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Where are you going?
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Step 1 of 3
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-2.5 px-3 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  
                  {/* Origin */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block leading-none mb-1">
                        From
                      </span>
                      <select
                        value={originId}
                        onChange={(e) => setOriginId(e.target.value)}
                        className="w-full bg-transparent font-bold text-xs sm:text-sm text-[#0B1F3A] dark:text-white outline-none cursor-pointer truncate"
                      >
                        {MUMBAI_LOCATIONS.map((loc: LocationNode) => (
                          <option key={loc.id} value={loc.id} className="dark:bg-slate-800 text-slate-900 dark:text-white">
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleSwap}
                      className="p-1.5 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Swap Origin and Destination"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="h-[1px] bg-slate-200/60 dark:bg-slate-700/60" />

                  {/* Destination */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0B1F3A] dark:bg-white shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block leading-none mb-1">
                        To
                      </span>
                      <select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        className="w-full bg-transparent font-bold text-xs sm:text-sm text-[#0B1F3A] dark:text-white outline-none cursor-pointer truncate"
                      >
                        {MUMBAI_LOCATIONS.map((loc: LocationNode) => (
                          <option key={loc.id} value={loc.id} className="dark:bg-slate-800 text-slate-900 dark:text-white">
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* PRIMARY STEP 2: WHEN DO YOU NEED TO ARRIVE? */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 p-2.5 px-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="shrink-0 text-slate-500">Arrive by</span>
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-[#0B1F3A] dark:text-white outline-none font-mono-numbers cursor-pointer"
                  />
                </div>

                {/* PRIMARY STEP 3: FIND BEST ROUTE CTA */}
                <button
                  onClick={handleSearch}
                  className="h-11 px-5 rounded-2xl bg-[#2166F3] hover:bg-[#1a55cc] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
                >
                  <span>Find Route</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* TABS: BEST ROUTE vs ⚡ COMPARE MODES vs ALL OPTIONS */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400">
                <button
                  onClick={() => setActivePanelTab('best')}
                  className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer text-center ${
                    activePanelTab === 'best'
                      ? 'bg-white dark:bg-slate-700 text-[#0B1F3A] dark:text-white font-bold shadow-2xs'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Best Option
                </button>

                <button
                  onClick={() => setActivePanelTab('compare')}
                  className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                    activePanelTab === 'compare'
                      ? 'bg-white dark:bg-slate-700 text-[#2166F3] dark:text-blue-300 font-bold shadow-2xs'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Compare Modes</span>
                </button>

                <button
                  onClick={() => setActivePanelTab('all')}
                  className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer text-center ${
                    activePanelTab === 'all'
                      ? 'bg-white dark:bg-slate-700 text-[#0B1F3A] dark:text-white font-bold shadow-2xs'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Routes ({routes.length})
                </button>
              </div>

              {/* ======================================================== */}
              {/* TAB 1: THE BEST COMMUTE OPTION (CORE WORKFLOW)           */}
              {/* ======================================================== */}
              {activePanelTab === 'best' && bestRoute && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* STEP 4: SEE BEST OPTION CARD */}
                  <div className="bg-gradient-to-b from-blue-50/70 to-white dark:from-slate-800/80 dark:to-slate-900 rounded-2xl p-4.5 border border-blue-200/80 dark:border-blue-900/60 shadow-xs space-y-3.5">
                    
                    {/* Header: Kicker & Confidence */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#2166F3] dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Recommended Best Option</span>
                      </span>
                      <span className="text-slate-500 font-mono-numbers text-[11px] font-medium">
                        {bestRoute.confidencePercent}% on-time confidence
                      </span>
                    </div>

                    {/* Prominent Travel Time & Departure */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <div className="text-3xl font-extrabold text-[#0B1F3A] dark:text-white font-mono-numbers tracking-tight">
                          {bestRoute.p50Minutes} <span className="text-base font-semibold text-slate-500">min</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          Leave by <strong className="text-slate-900 dark:text-white font-mono-numbers">{leaveByRecommendation}</strong> · Arrive ~{targetTime}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
                          ₹{bestRoute.costInr}
                        </div>
                        <div className="text-[11px] text-slate-500">Total fare</div>
                      </div>
                    </div>

                    {/* Multimodal Legs Sequence */}
                    <div className="flex items-center gap-1.5 p-2 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-slate-100 dark:border-slate-700/80 text-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 px-1">Via</span>
                      {bestRoute.modes.map((mode, idx) => (
                        <React.Fragment key={idx}>
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                            {renderModeIcon(mode, idx)}
                            <span className="capitalize">{mode}</span>
                          </span>
                          {idx < bestRoute.modes.length - 1 && (
                            <span className="text-slate-300 dark:text-slate-600">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Clean unboxed metadata (zero-pill discipline) */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-0.5">
                      <span className={bestRoute.floodExposure === 'None' ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-amber-700 dark:text-amber-400'}>
                        {bestRoute.floodExposure === 'None' ? 'Zero flood risk' : 'Low flood risk'}
                      </span>
                      <span>·</span>
                      <span>{bestRoute.crowdLevel === 'Low' ? 'Light crowd' : bestRoute.crowdLevel === 'Moderate' ? 'Moderate crowd' : `${bestRoute.crowdLevel} crowd`}</span>
                      <span>·</span>
                      <span className="font-mono-numbers">Safety score {bestRoute.safetyScore}</span>
                    </div>

                    {/* STEP 5: UNDERSTAND WHY */}
                    <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-blue-100 dark:border-slate-700 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#2166F3] dark:text-blue-400">
                        Why this route?
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        {bestRoute.whyReasons[0] || 'Optimized multimodal transit route avoiding choke points.'}
                      </p>
                      <button
                        onClick={() => setIsWhyRouteOpen(true)}
                        className="text-xs font-bold text-[#2166F3] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Understand full decision reasoning</span>
                      </button>
                    </div>

                    {/* STEP 6: START JOURNEY CTA */}
                    <div className="pt-2">
                      <button
                        onClick={() => startLiveTrip(bestRoute)}
                        className="w-full h-12 rounded-2xl bg-[#2166F3] hover:bg-[#1a55cc] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Start Journey Now</span>
                      </button>
                    </div>

                  </div>

                  {/* Quick Compare Modes Link */}
                  <button
                    onClick={() => setActivePanelTab('compare')}
                    className="w-full p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#2166F3]" />
                    <span>Compare with Local Train, BEST Bus & Taxi options</span>
                  </button>

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: TRAIN vs BUS vs TAXI MODE COMPARISON              */}
              {/* ======================================================== */}
              {activePanelTab === 'compare' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between pb-1">
                    <span>Train vs Bus vs Taxi Speeds</span>
                    <button
                      onClick={() => setIsComparisonOpen(true)}
                      className="text-[#2166F3] text-xs font-bold hover:underline cursor-pointer"
                    >
                      Full Matrix ↗
                    </button>
                  </div>

                  <RouteModeComparison isEmbedded={true} />
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: ALL MULTIMODAL ROUTE ALTERNATIVES                 */}
              {/* ======================================================== */}
              {activePanelTab === 'all' && (
                <div className="space-y-3 animate-fade-in">
                  <RouteBottomSheet />
                </div>
              )}

            </div>
          )}

        </div>
      </aside>

      {/* WHY THIS ROUTE EXPLANATION MODAL SHEET */}
      <WhyThisRouteSheet />

    </div>
  );
};
