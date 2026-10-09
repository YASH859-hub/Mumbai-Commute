import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  CloudRain, 
  Waves, 
  Train, 
  ShieldAlert, 
  Flag, 
  MapPin, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { activeAlerts, currentScenario, setActiveTab } = useApp();
  const [filter, setFilter] = useState<string>('All');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const filterTabs = ['All', 'Critical', 'Safety', 'Weather', 'Transit', 'Events'];

  const staticAlerts = [
    {
      id: 'al_tide_high',
      category: 'Critical',
      title: 'Spring High Tide of 4.58m at 14:10',
      location: 'Marine Drive & Mahim Coastal Outlets',
      timestamp: 'Today 14:10',
      impact: 'BMC storm gates locked to prevent Arabian Sea backflow into suburban nullahs.',
      recommendedAction: 'Take Metro Line 3 or elevated Western Express Highway; avoid low subways.',
      active: true,
    },
    {
      id: 'al_rain_monsoon',
      category: 'Weather',
      title: 'Intermittent Monsoon Downpours',
      location: 'Andheri to Bandra Suburban Belt',
      timestamp: '15 min ago',
      impact: 'Surface water accumulation near Milan & Andheri Subways.',
      recommendedAction: 'Public rail and metro recommended over metered autos.',
      active: true,
    },
    {
      id: 'al_train_delay',
      category: 'Transit',
      title: `Western Railway: ${currentScenario.westernTrainStatus}`,
      location: 'Churchgate ↔ Dahanu Suburban Corridor',
      timestamp: 'Live Feed',
      impact: 'Overhead equipment speed restriction near Dadar junction.',
      recommendedAction: 'Shift to Metro Line 1 & Line 3 Aqua for zero-delay connections.',
      active: true,
    },
    {
      id: 'al_event_road',
      category: 'Events',
      title: 'Bandra-Worli Marathon Traffic Restriction',
      location: 'Sea Link & SV Road Corridor',
      timestamp: 'Scheduled Today',
      impact: 'Sea Link northbound lanes throttled; SV Road traffic multiplier 2.4x.',
      recommendedAction: 'Underground Metro Line 3 Aqua is running at full frequency.',
      active: true,
    },
  ];

  const allAlerts = [...activeAlerts, ...staticAlerts];

  const filtered = filter === 'All'
    ? allAlerts
    : allAlerts.filter((a) => a.category.toLowerCase() === filter.toLowerCase());

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Weather':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'Transit':
        return <Train className="w-4 h-4 text-amber-500" />;
      case 'Safety':
        return <ShieldAlert className="w-4 h-4 text-emerald-500" />;
      case 'Events':
        return <Flag className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-lg lg:max-w-5xl mx-auto w-full space-y-5 pb-24 p-3 sm:p-6">
      
      {/* Header Glass Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-lg border border-white/70 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-[#0B1F3A] dark:text-white">
            Mumbai Disruption Intelligence Feed
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified BMC Disaster Cell & Traffic Police bulletins
          </p>
        </div>
        <span className="text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-3 py-1 rounded-full">
          {filtered.length} Active Bulletins
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === tab
                ? 'bg-[#0B1F3A] text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'glass-pill text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications Grid (1 column on mobile, 2 columns on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isExpanded = selectedAlertId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedAlertId(isExpanded ? null : item.id)}
              className={`glass-card rounded-2xl p-4 sm:p-5 transition-all cursor-pointer border ${
                item.category === 'Critical'
                  ? 'border-red-200/80 bg-red-50/20'
                  : 'border-white/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.category)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      item.category === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-numbers">
                      {item.timestamp}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#0B1F3A] dark:text-white mt-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{item.location}</span>
                  </div>

                  {/* Expandable Impact & Action */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs animate-slide-up">
                      <div className="text-slate-600 dark:text-slate-300">
                        <b>Impact: </b>{item.impact}
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium">
                        <b>Recommended Action: </b>{item.recommendedAction}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('plan');
                        }}
                        className="text-xs font-bold text-[#2166F3] hover:underline block pt-1 cursor-pointer"
                      >
                        Plan Safer Route Around Disruption →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
