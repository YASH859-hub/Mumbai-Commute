import React from 'react';
import { useApp } from '../../context/AppContext';
import { CloudRain, Compass, Moon, AlertTriangle, Flag, Info } from 'lucide-react';

export const DemoScenarioBar: React.FC = () => {
  const { currentScenarioId, setScenario, currentScenario } = useApp();

  const scenarios = [
    {
      id: 'normal',
      label: '1. Normal Commute',
      badge: 'Baseline',
      icon: Compass,
      desc: 'Standard morning peak traffic',
    },
    {
      id: 'monsoon_tide',
      label: '2. Monsoon + High Tide',
      badge: 'Waterlogging Risk',
      icon: CloudRain,
      desc: '48mm/hr rain + 4.58m high tide',
    },
    {
      id: 'night_traveller',
      label: '3. Night Traveller',
      badge: 'Safety Priority',
      icon: Moon,
      desc: '11:30 PM well-lit corridor shield',
    },
    {
      id: 'train_disruption',
      label: '4. Train Wire Disruption',
      badge: '+35m Suburban Delay',
      icon: AlertTriangle,
      desc: 'Western line Dadar signal hold',
    },
    {
      id: 'event_shock',
      label: '5. Marathon & VIP Convoy',
      badge: '2.4x Traffic Spike',
      icon: Flag,
      desc: 'Bandra-Worli Sea Link diversion',
    },
  ];

  return (
    <aside aria-label="Demo scenarios" className="bg-[#0B1F3A] text-white border-b border-slate-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Indicator & Context */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-blue-600/30 text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-500/30 text-[10px] tracking-wide">
            SIMULATED DEMO LAB
          </span>
          <span className="text-slate-300 hidden sm:inline text-xs font-medium">
            Test Mumbai conditions:
          </span>
        </div>

        {/* Center: Scenario buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isActive = currentScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
                  isActive
                    ? 'bg-[#2166F3] text-white shadow-sm ring-1 ring-blue-300/40'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={sc.desc}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Active Condition Tag */}
        <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[11px] shrink-0">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[260px] text-slate-300">
            {currentScenario.shortDesc}
          </span>
        </div>

      </div>
    </aside>
  );
};
