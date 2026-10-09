import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/common/AppHeader';
import { BottomNavigation } from './components/common/BottomNavigation';
import { HomePage } from './pages/HomePage';
import { PlanPage } from './pages/PlanPage';
import { TripsPage } from './pages/TripsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { B2BPage } from './pages/B2BPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SplashScreen } from './components/pwa/SplashScreen';
import { TechStackModal } from './components/modals/TechStackModal';
import { RoadmapModal } from './components/modals/RoadmapModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { CopilotAssistantModal } from './components/assistant/CopilotAssistantModal';
import { MapSettingsModal } from './components/modals/MapSettingsModal';
import { RouteComparison } from './components/planner/RouteComparison';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    isNightMode,
    isSplashVisible,
    viewMode,
    isTechStackModalOpen,
    setIsTechStackModalOpen,
    isRoadmapModalOpen,
    setIsRoadmapModalOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isAssistantOpen,
    setIsAssistantOpen,
    isMapSettingsOpen,
    setIsMapSettingsOpen,
    isComparisonOpen,
    setIsComparisonOpen
  } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'plan':
        return <PlanPage />;
      case 'trips':
        return <TripsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'b2b':
        return <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-24"><B2BPage /></div>;
      case 'analytics':
        return <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-24"><AnalyticsPage /></div>;
      default:
        return <HomePage />;
    }
  };

  // If Simulated 390px Mobile View is selected on desktop
  if (viewMode === 'mobile') {
    return (
      <div className={`min-h-screen w-full flex flex-col justify-center items-center py-4 bg-slate-900/90 backdrop-blur-md text-[#0B1F3A] select-none transition-colors`}>
        {isSplashVisible && <SplashScreen />}
        
        {/* Subtle desktop toolbar with back to web button */}
        <div className="hidden lg:flex items-center gap-3 mb-3 text-xs text-white/80">
          <span>Simulated iPhone PWA Preview (390 × 844)</span>
          <button
            onClick={() => useApp().setViewMode('desktop')}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold cursor-pointer"
          >
            Switch to Full Web
          </button>
        </div>

        {/* 390 x 844 Mobile Device Frame */}
        <div className="w-[390px] h-[844px] rounded-[48px] border-[10px] border-slate-900 shadow-2xl overflow-hidden relative flex flex-col bg-[#F7F9FC] dark:bg-slate-950">
          
          {/* Top Speaker / Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-900 rounded-full z-40" />

          {/* Compact Mobile Header */}
          <AppHeader />

          {/* Screen Content */}
          <div className="flex-1 w-full overflow-y-auto relative">
            {renderActiveScreen()}
          </div>

          {/* Fixed Mobile Bottom Bar */}
          <BottomNavigation />

        </div>

        {/* Modals & Dialogs */}
        {isTechStackModalOpen && <TechStackModal onClose={() => setIsTechStackModalOpen(false)} />}
        {isRoadmapModalOpen && <RoadmapModal onClose={() => setIsRoadmapModalOpen(false)} />}
        {isOnboardingOpen && <OnboardingModal onClose={() => setIsOnboardingOpen(false)} />}
        {isAssistantOpen && <CopilotAssistantModal onClose={() => setIsAssistantOpen(false)} />}
        {isMapSettingsOpen && <MapSettingsModal onClose={() => setIsMapSettingsOpen(false)} />}
        {isComparisonOpen && <RouteComparison onClose={() => setIsComparisonOpen(false)} />}
      </div>
    );
  }

  // DEFAULT FULL RESPONSIVE DESKTOP WEB / TABLET / MOBILE VIEW
  return (
    <div className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-300 font-sans ${
      isNightMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F7FB] text-[#0B1F3A]'
    }`}>
      
      {/* 1. App-like Splash Screen on first launch */}
      {isSplashVisible && <SplashScreen />}

      {/* 2. Responsive App Header */}
      <AppHeader />

      {/* 3. Main Web Workspace Canvas */}
      <main className="flex-1 w-full flex flex-col relative overflow-hidden">
        {renderActiveScreen()}
      </main>

      {/* 4. Bottom Navigation Bar (Hidden on desktop lg+, visible on mobile touch) */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      {/* 5. Modals & Dialogs */}
      {isTechStackModalOpen && (
        <TechStackModal onClose={() => setIsTechStackModalOpen(false)} />
      )}
      {isRoadmapModalOpen && (
        <RoadmapModal onClose={() => setIsRoadmapModalOpen(false)} />
      )}
      {isOnboardingOpen && (
        <OnboardingModal onClose={() => setIsOnboardingOpen(false)} />
      )}
      {isAssistantOpen && (
        <CopilotAssistantModal onClose={() => setIsAssistantOpen(false)} />
      )}
      {isMapSettingsOpen && (
        <MapSettingsModal onClose={() => setIsMapSettingsOpen(false)} />
      )}
      {isComparisonOpen && (
        <RouteComparison onClose={() => setIsComparisonOpen(false)} />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
