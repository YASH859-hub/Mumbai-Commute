import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PersonaType } from '../../types';
import { MUMBAI_LOCATIONS } from '../../constants/mumbaiData';
import { 
  X, 
  ArrowRight, 
  Check, 
  GraduationCap, 
  Briefcase, 
  Shield, 
  Compass, 
  Sliders, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const OnboardingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    persona, 
    setPersona, 
    preferences, 
    updateWeight, 
    originId, 
    setOriginId, 
    destinationId, 
    setDestinationId,
    targetTime,
    setTargetTime,
    runRouteSearch
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const personas: { id: PersonaType; title: string; subtitle: string; icon: any }[] = [
    { id: 'PROFESSIONAL', title: 'Professional', subtitle: 'Punctuality, meetings & AC comfort', icon: Briefcase },
    { id: 'STUDENT', title: 'Student', subtitle: 'Cost-sensitive, metro, local train & bus', icon: GraduationCap },
    { id: 'NIGHT_TRAVELLER', title: 'Night Traveller', subtitle: 'Safety-first, well-lit roads & sharing', icon: Shield },
    { id: 'FLEET_EMPLOYER', title: 'Fleet / Shift Worker', subtitle: 'Multi-stop predictability & shift timing', icon: Compass },
  ];

  const handleFinish = () => {
    runRouteSearch();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Visual Hero Header */}
        <div className="relative h-36 bg-gradient-to-r from-[#0B1F3A] to-[#1e467d] overflow-hidden p-6 text-white flex flex-col justify-end">
          <img 
            src="/src/assets/images/mumbai_sea_link_commute_1791521435486.jpg" 
            alt="Mumbai Sea Link Commute" 
            className="absolute inset-0 w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10">
            <span className="text-[10px] font-bold tracking-wider text-blue-300 uppercase">
              Step {step} of 3 · Onboarding
            </span>
            <h2 className="text-xl font-extrabold text-white mt-0.5">
              {step === 1 && 'How do you travel in Mumbai?'}
              {step === 2 && 'What matters most in your commute?'}
              {step === 3 && 'Set your usual Mumbai route'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          
          {/* STEP 1: Persona */}
          {step === 1 && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500">
                Choose your primary commute profile. Recommendations will automatically bias towards your safety, time, or cost needs.
              </p>
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {personas.map((p) => {
                  const Icon = p.icon;
                  const isSel = persona === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                        isSel
                          ? 'border-[#2166F3] bg-blue-50/60 ring-2 ring-[#2166F3]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSel ? 'bg-[#2166F3] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#0B1F3A]">{p.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{p.subtitle}</div>
                      </div>
                      {isSel && <Check className="w-5 h-5 text-[#2166F3] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Priorities */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Adjust how the scoring engine balances trade-offs. Your routes re-rank dynamically as weights shift.
              </p>

              <div className="space-y-3 pt-1">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Travel Time Priority</span>
                    <span className="font-mono-numbers">{Math.round(preferences.timeWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={preferences.timeWeight}
                    onChange={(e) => updateWeight('timeWeight', parseFloat(e.target.value))}
                    className="w-full accent-[#2166F3] cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Cost & Budget Sensitivity</span>
                    <span className="font-mono-numbers">{Math.round(preferences.costWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={preferences.costWeight}
                    onChange={(e) => updateWeight('costWeight', parseFloat(e.target.value))}
                    className="w-full accent-[#2166F3] cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Night Safety & Lighting</span>
                    <span className="font-mono-numbers">{Math.round(preferences.safetyWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={preferences.safetyWeight}
                    onChange={(e) => updateWeight('safetyWeight', parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Comfort & Low Crowding</span>
                    <span className="font-mono-numbers">{Math.round(preferences.comfortWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={preferences.comfortWeight}
                    onChange={(e) => updateWeight('comfortWeight', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Setup Origin & Destination */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Pick your regular commute nodes. We'll run initial congestion, flood, and suburban train predictions.
              </p>

              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">From Origin</label>
                  <select
                    value={originId}
                    onChange={(e) => setOriginId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-[#2166F3]"
                  >
                    {MUMBAI_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">To Destination</label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-[#2166F3]"
                  >
                    {MUMBAI_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Arrival Time</label>
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono-numbers font-medium text-slate-800 outline-none focus:border-[#2166F3]"
                  >
                  </input>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your recommendations will adapt to your priorities.</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer min-h-[40px]"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#2166F3] hover:bg-[#1a55cc] rounded-xl transition-colors cursor-pointer min-h-[40px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#153463] rounded-xl shadow-xs transition-colors cursor-pointer min-h-[40px]"
            >
              <span>Build My Commute</span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
