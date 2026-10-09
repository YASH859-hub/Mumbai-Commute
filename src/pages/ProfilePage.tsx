import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  MapPin, 
  Home, 
  Briefcase, 
  GraduationCap, 
  Dumbbell, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Globe, 
  Sparkles, 
  Building2, 
  BarChart3, 
  Cpu, 
  Milestone, 
  ChevronRight,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    persona, 
    setPersona, 
    isNightMode, 
    setIsNightMode,
    language,
    setLanguage,
    currentScenarioId,
    setScenario,
    setActiveTab,
    setIsTechStackModalOpen,
    setIsRoadmapModalOpen,
    setIsOnboardingOpen,
    setDestinationId
  } = useApp();

  const [savedPlaces, setSavedPlaces] = useState([
    { id: 'sp1', label: 'Home', address: 'Lokhandwala, Andheri (W)', destId: 'andheri_west', icon: Home },
    { id: 'sp2', label: 'Office', address: 'One BKC, Bandra East', destId: 'bkc', icon: Briefcase },
    { id: 'sp3', label: 'College', address: 'Mumbai University, Kalina', destId: 'bkc', icon: GraduationCap },
    { id: 'sp4', label: 'Gym', address: 'Gold’s Gym, Bandra West', destId: 'bandra_west', icon: Dumbbell },
  ]);

  const scenarios = [
    { id: 'normal', name: '1. Normal Peak Commute' },
    { id: 'monsoon_tide', name: '2. Monsoon + 4.58m High Tide' },
    { id: 'night_traveller', name: '3. Night Traveller Safety' },
    { id: 'train_disruption', name: '4. Western Railway Delay' },
    { id: 'event_shock', name: '5. Marathon & VIP Convoy' },
  ];

  return (
    <div className="max-w-lg lg:max-w-5xl mx-auto w-full space-y-5 pb-24 p-3 sm:p-6">
      
      {/* Profile Header Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-lg border border-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="/src/assets/images/commuter_avatar_rahul_1791521495946.jpg"
              alt="Yash"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
              ✓
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-[#0B1F3A] dark:text-white">Yash</h1>
            <p className="text-xs text-slate-500">Daily Mumbai Commuter · Western Suburban Line</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold bg-blue-100 text-[#2166F3] dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-md inline-block">
                Persona: {persona}
              </span>
              <span className="text-[10px] text-slate-400">
                PWA Local Cache Synchronized
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          Edit Priorities
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Saved Places */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xs border border-white/70 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Routine Places
            </h2>
            <span className="text-[11px] text-slate-400">Tap to set destination</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {savedPlaces.map((sp) => {
              const Icon = sp.icon;
              return (
                <button
                  key={sp.id}
                  onClick={() => {
                    setDestinationId(sp.destId);
                    setActiveTab('plan');
                  }}
                  className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left hover:border-[#2166F3] transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#2166F3] flex items-center justify-center mb-1.5 group-hover:bg-[#2166F3] group-hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-[#0B1F3A] dark:text-white">{sp.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{sp.address}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Demo Scenario Sandbox */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xs border border-white/70 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Simulated Demo Scenarios
            </h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded">
              Evaluator Lab
            </span>
          </div>

          <div className="space-y-1.5">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                className={`w-full p-2.5 px-3.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  currentScenarioId === sc.id
                    ? 'bg-[#2166F3] text-white shadow-xs'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white'
                }`}
              >
                <span>{sc.name}</span>
                {currentScenarioId === sc.id && <span>✓ Active</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Safety & App Preferences */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xs border border-white/70 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Safety & Language Preferences
          </h2>

          <div className="space-y-2">
            <div className="p-3 bg-white/80 dark:bg-slate-800 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                {isNightMode ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-slate-500" />}
                <div>
                  <div className="text-xs font-bold text-[#0B1F3A] dark:text-white">Night Safety Shield</div>
                  <div className="text-[10px] text-slate-500">Prioritizes well-lit, RPF patrolled paths</div>
                </div>
              </div>
              <button
                onClick={() => setIsNightMode(!isNightMode)}
                className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                  isNightMode ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isNightMode ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="p-3 bg-white/80 dark:bg-slate-800 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-xs font-bold text-[#0B1F3A] dark:text-white">App Language</div>
                  <div className="text-[10px] text-slate-500">Supports English, हिंदी, मराठी</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {(['en', 'hi', 'mr'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      language === l ? 'bg-[#0B1F3A] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Systems Architecture */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xs border border-white/70 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Enterprise & Systems Intelligence
          </h2>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('b2b')}
              className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-800 dark:text-slate-200 hover:border-[#2166F3] flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#2166F3]" />
              <span>B2B Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-800 dark:text-slate-200 hover:border-[#2166F3] flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>City Analytics</span>
            </button>

            <button
              onClick={() => setIsTechStackModalOpen(true)}
              className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-800 dark:text-slate-200 hover:border-[#2166F3] flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Architecture</span>
            </button>

            <button
              onClick={() => setIsRoadmapModalOpen(true)}
              className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-800 dark:text-slate-200 hover:border-[#2166F3] flex items-center gap-2 cursor-pointer"
            >
              <Milestone className="w-4 h-4 text-amber-600" />
              <span>Pan-India Scope</span>
            </button>
          </div>
        </div>

      </div>

      <div className="text-center text-[11px] text-slate-400 pt-2">
        Mumbai Commute Copilot · NEXATHON 2026 · TEAM HACKCARTEL
      </div>

    </div>
  );
};
