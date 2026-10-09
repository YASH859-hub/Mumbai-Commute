import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  User,
  ShieldAlert
} from 'lucide-react';

interface NavItem {
  id: 'home' | 'plan' | 'trips' | 'alerts' | 'profile';
  label: string;
  icon: any;
  badge?: string;
  badgeCount?: number;
}

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, activeAlerts, isTripActive } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan', label: 'Planner', icon: Navigation },
    { 
      id: 'trips', 
      label: isTripActive ? 'Live Trip' : 'Trips', 
      icon: MapPin,
      badge: isTripActive ? 'LIVE' : undefined
    },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: AlertTriangle,
      badgeCount: activeAlerts.length > 0 ? activeAlerts.length : undefined 
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-t border-white/60 dark:border-slate-800 shadow-2xl">
      <div className="grid grid-cols-5 h-16 items-center px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors cursor-pointer relative ${
                isActive ? 'text-[#2166F3]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-4 bg-emerald-500 text-white text-[9px] font-bold px-1 rounded-full leading-tight">
                    {item.badge}
                  </span>
                )}
                {item.badgeCount && (
                  <span className="absolute -top-1 -right-2.5 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 truncate max-w-[64px] ${
                isActive ? 'font-bold text-[#2166F3]' : 'font-medium'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 bg-[#2166F3] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
