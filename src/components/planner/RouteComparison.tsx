import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, ArrowRight, ShieldCheck, Clock, IndianRupee, Layers, Zap } from 'lucide-react';
import { RouteModeComparison } from './RouteModeComparison';

export const RouteComparison: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { routes, selectedRoute, setSelectedRoute, startLiveTrip } = useApp();
  const [viewTab, setViewTab] = useState<'mode_compare' | 'table_matrix'>('mode_compare');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A] dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2166F3]" />
              <span>Multimodal Route Comparison</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compare travel times, worst-case variance, fares, and delays across Train, Bus, and Taxi
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Tab Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setViewTab('mode_compare')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  viewTab === 'mode_compare'
                    ? 'bg-white dark:bg-slate-700 text-[#0B1F3A] dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Train vs Bus vs Taxi
              </button>
              <button
                onClick={() => setViewTab('table_matrix')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  viewTab === 'table_matrix'
                    ? 'bg-white dark:bg-slate-700 text-[#0B1F3A] dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Ranked Plans Table
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => setViewTab('mode_compare')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center cursor-pointer ${
              viewTab === 'mode_compare'
                ? 'bg-[#2166F3] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Train · Bus · Taxi
          </button>
          <button
            onClick={() => setViewTab('table_matrix')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center cursor-pointer ${
              viewTab === 'table_matrix'
                ? 'bg-[#2166F3] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Full Matrix
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {viewTab === 'mode_compare' ? (
            <RouteModeComparison 
              onStartTrip={() => onClose()}
              onWhyRoute={() => onClose()}
            />
          ) : (
            <div className="space-y-4">
              {/* Key trade-off highlight box */}
              {routes.length >= 2 && (
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 rounded-2xl p-4 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-[#2166F3]">Decision Engine Trade-off Highlight: </span>
                    <span>
                      <b>{routes[0]?.title}</b> is <b>{Math.abs(routes[0]?.p50Minutes - routes[1]?.p50Minutes)} min {routes[0]?.p50Minutes < routes[1]?.p50Minutes ? 'faster' : 'slower'}</b>, 
                      saving <b>₹{Math.abs(routes[3]?.costInr - routes[0]?.costInr)}</b> compared to direct cab options.
                    </span>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-3 font-semibold">Route Option</th>
                      <th className="py-3 px-3 font-semibold">Time (P50/P90)</th>
                      <th className="py-3 px-3 font-semibold">Total Cost</th>
                      <th className="py-3 px-3 font-semibold">Safety Score</th>
                      <th className="py-3 px-3 font-semibold">Crowd Level</th>
                      <th className="py-3 px-3 font-semibold">Confidence</th>
                      <th className="py-3 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {routes.map((plan) => {
                      const isCur = selectedRoute?.id === plan.id;
                      return (
                        <tr 
                          key={plan.id}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                            isCur ? 'bg-blue-50/40 dark:bg-blue-950/30 font-medium' : ''
                          }`}
                        >
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-[#0B1F3A] dark:text-white flex items-center gap-1.5">
                              {plan.title}
                              {plan.recommended && (
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-[#2166F3] dark:text-blue-200 font-bold px-1.5 py-0.5 rounded">
                                  Best
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {plan.summary}
                            </div>
                          </td>

                          <td className="py-3.5 px-3 font-mono-numbers">
                            <div className="font-bold text-[#0B1F3A] dark:text-white">{plan.p50Minutes} min</div>
                            <div className="text-[10px] text-slate-500">Worst: {plan.p90Minutes}m</div>
                          </td>

                          <td className="py-3.5 px-3 font-mono-numbers">
                            <div className="font-bold text-slate-900 dark:text-slate-100">₹{plan.costInr}</div>
                            <div className="text-[10px] text-slate-500">Transit: ₹{plan.costBreakdown.transitFare}</div>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="font-bold text-emerald-700 dark:text-emerald-400 font-mono-numbers">
                              {plan.safetyScore}/100
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Flood: {plan.floodExposure}
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                            {plan.crowdLevel}
                          </td>

                          <td className="py-3.5 px-3 font-bold text-[#2166F3] dark:text-blue-400 font-mono-numbers">
                            {plan.confidencePercent}%
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedRoute(plan);
                                startLiveTrip(plan);
                                onClose();
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-[#2166F3] hover:bg-[#1c55cc] rounded-lg transition-colors cursor-pointer"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            P50 & P90 travel time quantile predictions calibrated with Mumbai transport live feeds
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[40px]"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
