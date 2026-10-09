import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Waves, Train } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setIsSplashVisible, setIsOnboardingOpen } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white overflow-hidden select-none">
      {/* Background with Mumbai Sea Link dusk image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/mumbai_sea_link_commute_1791521435486.jpg"
          alt="Mumbai Sea Link"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transform animate-fade-in"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-radial at-top from-blue-600/20 via-transparent to-transparent" />
      </div>

      {/* Content Container (PWA Mobile Frame Max 430px) */}
      <div className="relative z-10 w-full max-w-[430px] h-full flex flex-col justify-between p-6 sm:p-8">
        
        {/* Top Branding Tag */}
        <div className="pt-8 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-slate-200">
              NEXATHON 2026 · HACKCARTEL
            </span>
          </div>

          <button
            onClick={() => setIsSplashVisible(false)}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 transition-colors cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Center / Bottom Hero Section */}
        <div className="space-y-6 pb-6">
          
          {/* App Icon Mark */}
          <div className="w-16 h-16 rounded-2xl bg-[#2166F3] text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-blue-400/30">
            <Compass className="w-8 h-8 stroke-[2.2]" />
          </div>

          {/* Headline & Promises */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Mumbai Commute<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">
                Copilot
              </span>
            </h1>
            <p className="text-base font-semibold text-slate-200">
              Smarter routes. Safer journeys. Better every day.
            </p>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed pt-1">
              "Not just the fastest route. The right route for you." — An AI decision engine weighing weather, high tide, crowd, safety & cost.
            </p>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="font-semibold block">Safety First</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
              <Waves className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <span className="font-semibold block">Tide & Flood</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
              <Train className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="font-semibold block">Crowd Pulse</span>
            </div>
          </div>

          {/* Primary & Secondary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                setIsSplashVisible(false);
                setIsOnboardingOpen(true);
              }}
              className="w-full h-13 rounded-2xl bg-[#2166F3] hover:bg-[#1a55cc] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Plan My Commute</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSplashVisible(false)}
              className="w-full h-12 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-slate-200 font-semibold text-xs flex items-center justify-center border border-white/15 transition-all cursor-pointer"
            >
              Explore Live Demo
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center text-[11px] text-slate-400 pt-1">
            Personalized Multimodal Commute Intelligence for Mumbai
          </div>

        </div>

      </div>
    </div>
  );
};
