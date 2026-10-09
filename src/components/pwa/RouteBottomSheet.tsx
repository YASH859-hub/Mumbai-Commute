import React from 'react';
import { useApp } from '../../context/AppContext';
import { RoutePlan, TransportMode } from '../../types';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Info, 
  Footprints, 
  Train, 
  Bus, 
  Car, 
  ShieldCheck, 
  Clock, 
  IndianRupee, 
  Users, 
  SlidersHorizontal,
  Layers 
} from 'lucide-react';

export const RouteBottomSheet: React.FC = () => {
  const { 
    routes, 
    selectedRoute, 
    setSelectedRoute, 
    startLiveTrip, 
    setIsWhyRouteOpen,
    activePriorityFilter,
    setActivePriorityFilter,
    selectedTransportFilter,
    setSelectedTransportFilter,
    leaveByRecommendation,
    targetTime,
    setPreferences,
    preferences,
    setIsComparisonOpen
  } = useApp();

  const priorityOptions = [
    { id: 'best', label: 'Best for me', emoji: '✨' },
    { id: 'fastest', label: 'Fastest', emoji: '⚡' },
    { id: 'cheapest', label: 'Cheapest', emoji: '💰' },
    { id: 'safer', label: 'Safer', emoji: '🛡️' },
    { id: 'comfort', label: 'Less crowded', emoji: '🛋️' },
  ] as const;

  const transportOptions = [
    { id: 'all', label: 'All Modes' },
    { id: 'metro', label: '🚇 Metro' },
    { id: 'train', label: '🚆 Local' },
    { id: 'bus', label: '🚌 Bus' },
    { id: 'auto', label: '🚕 Auto' },
    { id: 'cab', label: '🚗 Cab' },
  ];

  const handlePriorityChange = (filterId: typeof activePriorityFilter) => {
    setActivePriorityFilter(filterId);
    if (filterId === 'fastest') {
      setPreferences({ ...preferences, timeWeight: 0.7, costWeight: 0.1, safetyWeight: 0.1, comfortWeight: 0.1 });
    } else if (filterId === 'cheapest') {
      setPreferences({ ...preferences, timeWeight: 0.1, costWeight: 0.7, safetyWeight: 0.1, comfortWeight: 0.1 });
    } else if (filterId === 'safer') {
      setPreferences({ ...preferences, timeWeight: 0.1, costWeight: 0.1, safetyWeight: 0.7, comfortWeight: 0.1 });
    } else if (filterId === 'comfort') {
      setPreferences({ ...preferences, timeWeight: 0.1, costWeight: 0.1, safetyWeight: 0.2, comfortWeight: 0.6 });
    } else {
      setPreferences({ ...preferences, timeWeight: 0.35, costWeight: 0.25, safetyWeight: 0.25, comfortWeight: 0.15 });
    }
  };

  const filteredRoutes = routes.filter((r) => {
    if (selectedTransportFilter === 'all') return true;
    return r.modes.includes(selectedTransportFilter as any);
  });

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
        return <Car key={idx} className="w-3.5 h-3.5 text-slate-700" />;
      default:
        return <Footprints key={idx} className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Priority Horizontal Scrollable Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {priorityOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handlePriorityChange(opt.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activePriorityFilter === opt.id
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'glass-pill text-slate-700 hover:bg-white'
            }`}
          >
            <span>{opt.emoji} {opt.label}</span>
          </button>
        ))}
      </div>

      {/* Floating Leave-By Glass Card */}
      <div className="glass-card rounded-2xl p-4 border border-white/60 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Confidence-Aware Departure
            </div>
            <div className="text-xl font-extrabold text-[#0B1F3A] font-mono-numbers mt-0.5">
              Leave at {leaveByRecommendation}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              90% on-time guarantee
            </span>
            <div className="text-[11px] text-slate-500 font-mono-numbers mt-1">
              for arrival by {targetTime}
            </div>
          </div>
        </div>
      </div>

      {/* Transport Modes Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {transportOptions.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTransportFilter(t.id)}
            className={`px-2.5 py-1 text-xs rounded-xl whitespace-nowrap font-medium transition-colors cursor-pointer ${
              selectedTransportFilter === t.id
                ? 'bg-[#2166F3] text-white font-bold shadow-xs'
                : 'glass-pill text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Route Cards Stack */}
      <div className="space-y-3 pt-1">
        {filteredRoutes.map((plan, index) => {
          const isSelected = selectedRoute?.id === plan.id;
          const isTop = index === 0;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedRoute(plan)}
              className={`glass-card rounded-2xl p-4.5 transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-[#2166F3] ring-2 ring-blue-500/20 shadow-md bg-white/95'
                  : 'hover:border-slate-300'
              }`}
            >
              {/* Recommendation Pill */}
              {isTop && (
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2166F3] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#2166F3]" />
                    <span>Best For You</span>
                  </div>
                  <span className="text-[11px] font-mono-numbers font-medium text-slate-500">
                    Confidence: {plan.confidencePercent}%
                  </span>
                </div>
              )}

              {/* Title & Modes Sequence */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">
                    {plan.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {plan.summary}
                  </div>
                </div>

                {/* Multimodal Flow Icons */}
                <div className="flex items-center gap-1 p-1.5 glass-pill rounded-xl shrink-0">
                  {plan.modes.map((m, idx) => (
                    <React.Fragment key={idx}>
                      {renderModeIcon(m, idx)}
                      {idx < plan.modes.length - 1 && (
                        <span className="text-[10px] text-slate-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Core Metrics Strip */}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-slate-100/90 text-center">
                <div className="bg-slate-50/80 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Travel Time</span>
                  <span className="text-sm font-extrabold text-[#0B1F3A] font-mono-numbers">
                    {plan.p50Minutes}m
                  </span>
                </div>
                <div className="bg-slate-50/80 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Total Cost</span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono-numbers">
                    ₹{plan.costInr}
                  </span>
                </div>
                <div className="bg-slate-50/80 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Safety</span>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono-numbers">
                    {plan.safetyScore}
                  </span>
                </div>
                <div className="bg-slate-50/80 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Comfort</span>
                  <span className="text-sm font-extrabold text-blue-700 font-mono-numbers">
                    {plan.comfortScore}
                  </span>
                </div>
              </div>

              {/* Clean Metadata (Zero-pill discipline: unboxed text with subtle bullet separators) */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-slate-500 font-medium">
                <span className={plan.floodExposure === 'None' ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-amber-700 dark:text-amber-400'}>
                  {plan.floodExposure === 'None' ? 'Zero flood risk' : 'Low flood exposure'}
                </span>
                <span>·</span>
                <span>{plan.crowdLevel === 'Low' ? 'Light crowd' : plan.crowdLevel === 'Moderate' ? 'Moderate crowd' : `${plan.crowdLevel} crowd`}</span>
                <span>·</span>
                <span className="font-mono-numbers">P90 upper: {plan.p90Minutes}m</span>
              </div>

              {/* Compact explanation */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed italic">
                "{plan.whyReasons[0] || 'Optimized multimodal transit route'}"
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoute(plan);
                      setIsWhyRouteOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B1F3A] py-1.5 px-2 transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-[#2166F3]" />
                    <span>Why?</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoute(plan);
                      setIsComparisonOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2166F3] py-1.5 px-2 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Compare</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoute(plan);
                    startLiveTrip(plan);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2166F3] hover:bg-[#1a55cc] rounded-xl shadow-xs transition-colors cursor-pointer min-h-[36px]"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Route</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
