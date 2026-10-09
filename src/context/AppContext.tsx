import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  AlertItem, 
  DemoScenario, 
  PersonaType, 
  RoutePlan, 
  SavedTrip, 
  TimeType, 
  TrustedContact, 
  UserPreferences 
} from '../types';
import { 
  BASE_TIDE, 
  BASE_WEATHER, 
  DEMO_SCENARIOS, 
  MUMBAI_LOCATIONS, 
  TRANSIT_LINES, 
  WATERLOGGING_HOTSPOTS 
} from '../constants/mumbaiData';
import { DEFAULT_PERSONA_PRESETS } from '../services/scoringEngine';
import { planCommuteApi } from '../services/mockApiService';

interface AppContextType {
  // Navigation & View
  activeTab: 'home' | 'plan' | 'trips' | 'alerts' | 'profile' | 'b2b' | 'analytics';
  setActiveTab: (tab: 'home' | 'plan' | 'trips' | 'alerts' | 'profile' | 'b2b' | 'analytics') => void;
  isDesktopLayout: boolean;

  // Persona & Preferences
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  updateWeight: (key: keyof UserPreferences, value: number) => void;

  // Origin / Destination / Time
  originId: string;
  setOriginId: (id: string) => void;
  destinationId: string;
  setDestinationId: (id: string) => void;
  timeType: TimeType;
  setTimeType: (t: TimeType) => void;
  targetTime: string;
  setTargetTime: (time: string) => void;
  selectedTransportFilter: string;
  setSelectedTransportFilter: (mode: string) => void;

  // Route Planning State
  routes: RoutePlan[];
  selectedRoute: RoutePlan | null;
  setSelectedRoute: (r: RoutePlan | null) => void;
  leaveByRecommendation: string;
  isPlanningLoading: boolean;
  activeAlerts: AlertItem[];
  runRouteSearch: () => Promise<void>;

  // Scenario Simulator
  currentScenarioId: string;
  setScenario: (scenarioId: string) => void;
  currentScenario: DemoScenario;

  // Night Mode
  isNightMode: boolean;
  setIsNightMode: (v: boolean) => void;

  // Live Trip & Dynamic Rerouting
  isTripActive: boolean;
  activeTripPlan: RoutePlan | null;
  tripProgressPercent: number;
  startLiveTrip: (plan?: RoutePlan) => void;
  endLiveTrip: () => void;
  rerouteOffer: {
    visible: boolean;
    reason: string;
    suggestedAlternative: RoutePlan | null;
    impactDescription: string;
  } | null;
  dismissReroute: () => void;
  applyReroute: () => void;

  // Trusted Contacts
  trustedContacts: TrustedContact[];
  toggleContactSharing: (id: string) => void;
  addTrustedContact: (name: string, relation: string, phone: string) => void;

  // Saved Trips
  savedTrips: SavedTrip[];
  saveCurrentTrip: () => void;

  // Modals & Sheets
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (v: boolean) => void;
  isTechStackModalOpen: boolean;
  setIsTechStackModalOpen: (v: boolean) => void;
  isRoadmapModalOpen: boolean;
  setIsRoadmapModalOpen: (v: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (v: boolean) => void;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (v: boolean) => void;
  isSplashVisible: boolean;
  setIsSplashVisible: (v: boolean) => void;
  isWhyRouteOpen: boolean;
  setIsWhyRouteOpen: (v: boolean) => void;

  // Mobile Map Layer Toggles
  mapLayers: {
    traffic: boolean;
    safety: boolean;
    flood: boolean;
    transit: boolean;
  };
  toggleMapLayer: (layer: 'traffic' | 'safety' | 'flood' | 'transit') => void;

  // Priority Chips
  activePriorityFilter: 'best' | 'fastest' | 'cheapest' | 'safer' | 'comfort';
  setActivePriorityFilter: (filter: 'best' | 'fastest' | 'cheapest' | 'safer' | 'comfort') => void;

  // Language
  language: 'en' | 'hi' | 'mr';
  setLanguage: (l: 'en' | 'hi' | 'mr') => void;

  // Responsive View Mode Toggle (Desktop Web vs Mobile Frame)
  viewMode: 'desktop' | 'mobile';
  setViewMode: (v: 'desktop' | 'mobile') => void;

  // Map Tile Style & API Key configuration
  mapTileStyle: 'auto' | 'maptiler_streets' | 'maptiler_dark' | 'maptiler_satellite' | 'maptiler_outdoor' | 'carto_voyager' | 'carto_dark' | 'osm_standard';
  setMapTileStyle: (style: 'auto' | 'maptiler_streets' | 'maptiler_dark' | 'maptiler_satellite' | 'maptiler_outdoor' | 'carto_voyager' | 'carto_dark' | 'osm_standard') => void;
  mapTilerApiKey: string;
  setMapTilerApiKey: (key: string) => void;
  isMapSettingsOpen: boolean;
  setIsMapSettingsOpen: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'plan' | 'trips' | 'alerts' | 'profile' | 'b2b' | 'analytics'>('home');
  const [persona, setPersonaState] = useState<PersonaType>('PROFESSIONAL');
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PERSONA_PRESETS['PROFESSIONAL']);

  const [originId, setOriginId] = useState<string>('andheri_west');
  const [destinationId, setDestinationId] = useState<string>('bkc');
  const [timeType, setTimeType] = useState<TimeType>('arrive_by');
  const [targetTime, setTargetTime] = useState<string>('09:30');
  const [selectedTransportFilter, setSelectedTransportFilter] = useState<string>('all');

  const [routes, setRoutes] = useState<RoutePlan[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RoutePlan | null>(null);
  const [leaveByRecommendation, setLeaveByRecommendation] = useState<string>('08:35');
  const [isPlanningLoading, setIsPlanningLoading] = useState<boolean>(false);
  const [activeAlerts, setActiveAlerts] = useState<AlertItem[]>([]);

  const [currentScenarioId, setCurrentScenarioId] = useState<string>('normal');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  // Live Trip
  const [isTripActive, setIsTripActive] = useState<boolean>(false);
  const [activeTripPlan, setActiveTripPlan] = useState<RoutePlan | null>(null);
  const [tripProgressPercent, setTripProgressPercent] = useState<number>(18);
  const [rerouteOffer, setRerouteOffer] = useState<{
    visible: boolean;
    reason: string;
    suggestedAlternative: RoutePlan | null;
    impactDescription: string;
  } | null>(null);

  // Modals & States
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState<boolean>(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [isSplashVisible, setIsSplashVisible] = useState<boolean>(true);
  const [isWhyRouteOpen, setIsWhyRouteOpen] = useState<boolean>(false);
  const [activePriorityFilter, setActivePriorityFilter] = useState<'best' | 'fastest' | 'cheapest' | 'safer' | 'comfort'>('best');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Map Tile Style & API Key configuration
  const DEFAULT_MAPTILER_KEY = 'Ms7NAh05h9A2EKCedGeR';
  const [mapTileStyle, setMapTileStyleState] = useState<'auto' | 'maptiler_streets' | 'maptiler_dark' | 'maptiler_satellite' | 'maptiler_outdoor' | 'carto_voyager' | 'carto_dark' | 'osm_standard'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('maptiler_tile_style');
      if (stored) return stored as any;
    }
    return 'maptiler_satellite';
  });

  const setMapTileStyle = (style: 'auto' | 'maptiler_streets' | 'maptiler_dark' | 'maptiler_satellite' | 'maptiler_outdoor' | 'carto_voyager' | 'carto_dark' | 'osm_standard') => {
    setMapTileStyleState(style);
    if (typeof window !== 'undefined') {
      localStorage.setItem('maptiler_tile_style', style);
    }
  };
  const [mapTilerApiKey, setMapTilerApiKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('maptiler_api_key');
      if (stored) return stored;
    }
    return (
      (import.meta as any).env?.VITE_MAPTILER_API_KEY || 
      (import.meta as any).env?.VITE_MAPTILES_API_KEY || 
      DEFAULT_MAPTILER_KEY
    );
  });
  const [isMapSettingsOpen, setIsMapSettingsOpen] = useState<boolean>(false);

  const setMapTilerApiKey = (key: string) => {
    const trimmed = key.trim();
    setMapTilerApiKeyState(trimmed);
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('maptiler_api_key', trimmed);
      } else {
        localStorage.removeItem('maptiler_api_key');
      }
    }
  };

  // Map Layer Toggles for mobile map
  const [mapLayers, setMapLayers] = useState({
    traffic: true,
    safety: true,
    flood: true,
    transit: true,
  });

  const toggleMapLayer = (layer: 'traffic' | 'safety' | 'flood' | 'transit') => {
    setMapLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Trusted Contacts
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([
    { id: 'tc1', name: 'Pooja (Sister)', relation: 'Family', phone: '+91 98201 12345', isSharingActive: true },
    { id: 'tc2', name: 'Rohan Sharma', relation: 'Colleague', phone: '+91 98190 67890', isSharingActive: false },
    { id: 'tc3', name: 'Home Safety Circle', relation: 'Emergency', phone: '+91 98330 45678', isSharingActive: true },
  ]);

  // Saved Trips History
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([
    {
      id: 'trip_hist_1',
      origin: 'Andheri (W), Lokhandwala',
      destination: 'Bandra Kurla Complex (BKC)',
      date: 'Today, 8:42 AM',
      modes: ['walk', 'metro', 'walk'],
      durationMin: 32,
      costInr: 40,
      safetyScore: 92,
      confidencePercent: 92,
    },
    {
      id: 'trip_hist_2',
      origin: 'Bandra (W), Hill Road',
      destination: 'Dadar, Shivaji Park',
      date: 'Yesterday, 6:15 PM',
      modes: ['auto', 'train', 'walk'],
      durationMin: 24,
      costInr: 15,
      safetyScore: 84,
      confidencePercent: 88,
    },
    {
      id: 'trip_hist_3',
      origin: 'Powai, Hiranandani',
      destination: 'BKC',
      date: '04 Oct, 9:10 AM',
      modes: ['cab'],
      durationMin: 48,
      costInr: 290,
      safetyScore: 88,
      confidencePercent: 78,
    }
  ]);

  const setPersona = (p: PersonaType) => {
    setPersonaState(p);
    setPreferences(DEFAULT_PERSONA_PRESETS[p]);
    if (p === 'NIGHT_TRAVELLER') {
      setIsNightMode(true);
    }
  };

  const updateWeight = (key: keyof UserPreferences, value: number) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setScenario = (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
    if (scenarioId === 'night_traveller') {
      setIsNightMode(true);
      setPersonaState('NIGHT_TRAVELLER');
      setPreferences(DEFAULT_PERSONA_PRESETS['NIGHT_TRAVELLER']);
    } else {
      setIsNightMode(false);
    }
  };

  const currentScenario = useMemo(() => {
    return DEMO_SCENARIOS[currentScenarioId] || DEMO_SCENARIOS.normal;
  }, [currentScenarioId]);

  // Execute Route Search
  const runRouteSearch = async () => {
    setIsPlanningLoading(true);
    try {
      const res = await planCommuteApi({
        originId,
        destinationId,
        timeType,
        targetTime,
        persona,
        weights: preferences,
        scenarioId: currentScenarioId,
      });

      setRoutes(res.plans);
      setSelectedRoute(res.plans[0] || null);
      setLeaveByRecommendation(res.leaveBy);
      setActiveAlerts(res.alerts);
    } finally {
      setIsPlanningLoading(false);
    }
  };

  // Re-run search whenever origin, destination, scenario or weights change
  useEffect(() => {
    runRouteSearch();
  }, [originId, destinationId, currentScenarioId, preferences]);

  // Handle Live Trip
  const startLiveTrip = (plan?: RoutePlan) => {
    const target = plan || selectedRoute || routes[0];
    if (!target) return;
    setActiveTripPlan(target);
    setIsTripActive(true);
    setTripProgressPercent(15);
    setActiveTab('trips');

    // Simulate potential disruption alert after 3 seconds for demo purposes
    if (currentScenarioId === 'monsoon_tide' || currentScenarioId === 'normal') {
      setTimeout(() => {
        const alt = routes.find((r) => r.id !== target.id && r.modes.includes('metro')) || routes[0];
        setRerouteOffer({
          visible: true,
          reason: 'Severe waterlogging detected near Andheri Subway & Milan flyover.',
          suggestedAlternative: alt,
          impactDescription: 'Switch to Metro Line 3 (+6 min, avoids waterlogging entirely with zero flood exposure).',
        });
      }, 3500);
    }
  };

  const endLiveTrip = () => {
    setIsTripActive(false);
    setActiveTripPlan(null);
    setRerouteOffer(null);
    setTripProgressPercent(0);
  };

  const dismissReroute = () => {
    setRerouteOffer(null);
  };

  const applyReroute = () => {
    if (rerouteOffer?.suggestedAlternative) {
      setActiveTripPlan(rerouteOffer.suggestedAlternative);
      setSelectedRoute(rerouteOffer.suggestedAlternative);
    }
    setRerouteOffer(null);
  };

  const toggleContactSharing = (id: string) => {
    setTrustedContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isSharingActive: !c.isSharingActive } : c))
    );
  };

  const addTrustedContact = (name: string, relation: string, phone: string) => {
    const newContact: TrustedContact = {
      id: 'tc_' + Date.now(),
      name,
      relation,
      phone,
      isSharingActive: true,
    };
    setTrustedContacts((prev) => [...prev, newContact]);
  };

  const saveCurrentTrip = () => {
    if (!selectedRoute) return;
    const origin = MUMBAI_LOCATIONS.find((l) => l.id === originId)?.shortName || 'Origin';
    const destination = MUMBAI_LOCATIONS.find((l) => l.id === destinationId)?.shortName || 'Destination';

    const newSaved: SavedTrip = {
      id: 'trip_' + Date.now(),
      origin,
      destination,
      date: 'Just now',
      modes: selectedRoute.modes,
      durationMin: selectedRoute.p50Minutes,
      costInr: selectedRoute.costInr,
      safetyScore: selectedRoute.safetyScore,
      confidencePercent: selectedRoute.confidencePercent,
    };
    setSavedTrips((prev) => [newSaved, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDesktopLayout: true,
        persona,
        setPersona,
        preferences,
        setPreferences,
        updateWeight,
        originId,
        setOriginId,
        destinationId,
        setDestinationId,
        timeType,
        setTimeType,
        targetTime,
        setTargetTime,
        selectedTransportFilter,
        setSelectedTransportFilter,
        routes,
        selectedRoute,
        setSelectedRoute,
        leaveByRecommendation,
        isPlanningLoading,
        activeAlerts,
        runRouteSearch,
        currentScenarioId,
        setScenario,
        currentScenario,
        isNightMode,
        setIsNightMode,
        isTripActive,
        activeTripPlan,
        tripProgressPercent,
        startLiveTrip,
        endLiveTrip,
        rerouteOffer,
        dismissReroute,
        applyReroute,
        trustedContacts,
        toggleContactSharing,
        addTrustedContact,
        savedTrips,
        saveCurrentTrip,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isTechStackModalOpen,
        setIsTechStackModalOpen,
        isRoadmapModalOpen,
        setIsRoadmapModalOpen,
        isAssistantOpen,
        setIsAssistantOpen,
        isComparisonOpen,
        setIsComparisonOpen,
        language,
        setLanguage,
        isSplashVisible,
        setIsSplashVisible,
        isWhyRouteOpen,
        setIsWhyRouteOpen,
        mapLayers,
        toggleMapLayer,
        activePriorityFilter,
        setActivePriorityFilter,
        viewMode,
        setViewMode,
        mapTileStyle,
        setMapTileStyle,
        mapTilerApiKey,
        setMapTilerApiKey,
        isMapSettingsOpen,
        setIsMapSettingsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
