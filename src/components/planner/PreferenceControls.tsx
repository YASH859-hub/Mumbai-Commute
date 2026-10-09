import React from 'react';
import { useApp } from '../../context/AppContext';
import { PersonaType } from '../../types';
import { GraduationCap, Shield, Briefcase, Truck, Sliders, RotateCcw } from 'lucide-react';
import { DEFAULT_PERSONA_PRESETS } from '../../services/scoringEngine';

export const PreferenceControls: React.FC = () => {
  const { 
    persona, 
    setPersona, 
    preferences, 
    updateWeight,
    setPreferences 
  } = useApp();

  const personas: { id: PersonaType; label: string; icon: any; note: string }[] = [
    {
      id: 'PROFESSIONAL',
      label: 'Professional',
      icon: Briefcase,
      note: 'Prioritizes punctuality & arrival confidence',
    },
    {
      id: 'STUDENT',
      label: 'Student',
      icon: GraduationCap,
      note: 'Cost-sensitive, budget transit',
    },
    {
      id: 'NIGHT_TRAVELLER',
      label: 'Night Traveller',
      icon: Shield,
      note: 'Safety-first, well-lit paths & tracking',
    },
    {
      id: 'FLEET_EMPLOYER',
      label: 'Fleet / Shift',
      icon: Truck,
      note: 'Shift planning & operational safety',
    },
  ];

  // Quick preset shortcuts
  const applyPreset = (type: 'fastest' | 'cheapest' | 'safer' | 'balanced') => {
    if (type === 'fastest') {
      setPreferences({ ...preferences, timeWeight: 0.7, costWeight: 0.1, safetyWeight: 0.1, comfortWeight: 0.1 });
    } else if (type === 'cheapest') {
      setPreferences({ ...preferences, timeWeight: 0.1, costWeight: 0.7, safetyWeight: 0.1, comfortWeight: 0.1 });
    } else if (type === 'safer') {
      setPreferences({ ...preferences, timeWeight: 0.1, costWeight: 0.1, safetyWeight: 0.7, comfortWeight: 0.1 });
    } else {
      setPreferences({ ...preferences, timeWeight: 0.3, costWeight: 0.25, safetyWeight: 0.25, comfortWeight: 0.2 });
    }
  };

  const resetWeights = () => {
    setPreferences(DEFAULT_PERSONA_PRESETS[persona]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      
      {/* Persona Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Commuter Persona
          </h2>
          <p className="text-sm font-semibold text-[#0B1F3A]">
            Tailors scoring weights to your journey priorities
          </p>
        </div>
        <button
          onClick={resetWeights}
          title="Reset to persona default weights"
          className="text-xs font-medium text-slate-500 hover:text-[#2166F3] flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Persona Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {personas.map((p) => {
          const Icon = p.icon;
          const isActive = persona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                isActive
                  ? 'border-[#2166F3] bg-blue-50/50 ring-1 ring-[#2166F3]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2166F3]' : 'text-slate-500'}`} />
                <span className={`text-xs font-bold ${isActive ? 'text-[#2166F3]' : 'text-slate-800'}`}>
                  {p.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                {p.note}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
        <span className="text-[11px] text-slate-500 font-medium shrink-0 mr-1">
          Quick Priority:
        </span>
        <button
          onClick={() => applyPreset('fastest')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          ⚡ Fastest
        </button>
        <button
          onClick={() => applyPreset('cheapest')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          💰 Cheapest
        </button>
        <button
          onClick={() => applyPreset('safer')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          🛡️ Safer
        </button>
        <button
          onClick={() => applyPreset('balanced')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          ⚖️ Balanced
        </button>
      </div>

      {/* Fine-Tuning Sliders */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            Fine-Tune Scoring Engine Weights
          </span>
          <span className="text-[11px] text-slate-500">Updates rankings live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Time Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Time Priority</span>
              <span className="font-mono-numbers text-slate-500">
                {Math.round(preferences.timeWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.05"
              value={preferences.timeWeight}
              onChange={(e) => updateWeight('timeWeight', parseFloat(e.target.value))}
              className="w-full accent-[#2166F3] cursor-pointer"
            />
          </div>

          {/* Cost Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Budget Priority</span>
              <span className="font-mono-numbers text-slate-500">
                {Math.round(preferences.costWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.05"
              value={preferences.costWeight}
              onChange={(e) => updateWeight('costWeight', parseFloat(e.target.value))}
              className="w-full accent-[#2166F3] cursor-pointer"
            />
          </div>

          {/* Safety Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Safety Priority</span>
              <span className="font-mono-numbers text-slate-500">
                {Math.round(preferences.safetyWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.05"
              value={preferences.safetyWeight}
              onChange={(e) => updateWeight('safetyWeight', parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Comfort Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Comfort & Seat</span>
              <span className="font-mono-numbers text-slate-500">
                {Math.round(preferences.comfortWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.05"
              value={preferences.comfortWeight}
              onChange={(e) => updateWeight('comfortWeight', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
