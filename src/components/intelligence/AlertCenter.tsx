import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertItem } from '../../types';
import { 
  AlertTriangle, 
  CloudRain, 
  Waves, 
  Train, 
  ShieldAlert, 
  Flag, 
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';

export const AlertCenter: React.FC = () => {
  const { activeAlerts, currentScenario, setActiveTab } = useApp();
  const [filter, setFilter] = useState<string>('All');

  // Baseline alerts plus scenario alerts
  const staticAlerts: AlertItem[] = [
    {
      id: 'al_base_1',
      category: 'Transit',
      title: 'Metro Line 3 Phase-1 Operating Normal Headways',
      location: 'BKC to Aarey Corridor',
      timestamp: 'Today, 08:00',
      impact: 'Full 4.5 min frequency; air-conditioned underground transit.',
      recommendedAction: 'Ideal for bypassing WEH surface jams.',
      active: true,
    },
    {
      id: 'al_base_2',
      category: 'Warning',
      title: 'Kalanagar Junction Peak Bottleneck',
      location: 'Bandra East / BKC Entrance',
      timestamp: 'Today, 08:30',
      impact: 'Average road wait time +14 minutes for road vehicles.',
      recommendedAction: 'Use BKC Skywalk from Bandra East Station.',
      active: true,
    },
    {
      id: 'al_base_3',
      category: 'Safety',
      title: 'Night Escort Active in Western Line Ladies Coaches',
      location: 'Churchgate to Borivali Fast/Slow Trains',
      timestamp: 'Daily after 21:00',
      impact: 'RPF & GRP constable posted in ladies coaches.',
      recommendedAction: 'Board middle or rear ladies compartment for maximum safety.',
      active: true,
    }
  ];

  const allAlerts = [...activeAlerts, ...staticAlerts];

  const categories = ['All', 'Critical', 'Transit', 'Weather', 'Safety', 'Events', 'Warning'];

  const filteredAlerts = filter === 'All' 
    ? allAlerts 
    : allAlerts.filter((a) => a.category.toLowerCase() === filter.toLowerCase());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Weather':
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case 'Transit':
        return <Train className="w-4 h-4 text-amber-600" />;
      case 'Safety':
        return <ShieldAlert className="w-4 h-4 text-emerald-600" />;
      case 'Events':
        return <Flag className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
              Mumbai Disruption Intelligence Feed
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified alerts compiled from BMC Disaster Management, Mumbai Traffic Police & Suburban Railways
          </p>
        </div>

        {/* Count indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
            {filteredAlerts.length} Active Bulletins
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              filter === cat
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No alerts currently listed under this category.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                alert.category === 'Critical'
                  ? 'bg-red-50/40 border-red-200'
                  : alert.category === 'Warning'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50/60 border-slate-200/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    alert.category === 'Critical' ? 'bg-red-100' : 'bg-white border border-slate-200'
                  }`}>
                    {getCategoryIcon(alert.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        alert.category === 'Critical'
                          ? 'bg-red-200/80 text-red-900'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {alert.category}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0B1F3A] mt-1">
                      {alert.title}
                    </h4>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{alert.location}</span>
                </div>
              </div>

              {/* Impact & Action */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Commute Impact: </span>
                  {alert.impact}
                </div>
                <div className="text-[#16A878] font-medium bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900">Recommended Action: </span>
                  {alert.recommendedAction}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
