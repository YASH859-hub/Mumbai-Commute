import { 
  CityEvent, 
  DemoScenario, 
  TideCondition, 
  TransitLineStatus, 
  WaterloggingHotspot, 
  WeatherCondition 
} from '../types';

export interface LocationNode {
  id: string;
  name: string;
  shortName: string;
  category: 'transit_hub' | 'commercial' | 'residential' | 'suburb';
  lat: number;
  lng: number;
  address: string;
  stationNear?: string;
}

export const MUMBAI_LOCATIONS: LocationNode[] = [
  {
    id: 'andheri_west',
    name: 'Andheri (W), Lokhandwala',
    shortName: 'Andheri (W)',
    category: 'residential',
    lat: 19.1363,
    lng: 72.8277,
    address: 'Link Road, Andheri West, Mumbai',
    stationNear: 'Andheri Metro & Railway'
  },
  {
    id: 'bkc',
    name: 'Bandra Kurla Complex (BKC)',
    shortName: 'BKC',
    category: 'commercial',
    lat: 19.0657,
    lng: 72.8687,
    address: 'G Block, BKC, Bandra East, Mumbai',
    stationNear: 'BKC Metro Line 3 / Bandra Stn'
  },
  {
    id: 'bandra_west',
    name: 'Bandra (W), Hill Road',
    shortName: 'Bandra (W)',
    category: 'commercial',
    lat: 19.0544,
    lng: 72.8402,
    address: 'Hill Road, Bandra West, Mumbai',
    stationNear: 'Bandra Railway Station'
  },
  {
    id: 'dadar',
    name: 'Dadar, Shivaji Park',
    shortName: 'Dadar',
    category: 'transit_hub',
    lat: 19.0178,
    lng: 72.8478,
    address: 'Dadar Central & Western Interchange, Mumbai',
    stationNear: 'Dadar Terminus'
  },
  {
    id: 'kurla',
    name: 'Kurla (W), Phoenix Marketcity',
    shortName: 'Kurla',
    category: 'commercial',
    lat: 19.0883,
    lng: 72.8890,
    address: 'LBS Marg, Kurla West, Mumbai',
    stationNear: 'Kurla Station'
  },
  {
    id: 'powai',
    name: 'Powai, Hiranandani Gardens',
    shortName: 'Powai',
    category: 'commercial',
    lat: 19.1176,
    lng: 72.9060,
    address: 'Central Avenue, Hiranandani, Powai, Mumbai',
    stationNear: 'Kanjurmarg / JVLR'
  },
  {
    id: 'marine_drive',
    name: 'Marine Drive / Nariman Point',
    shortName: 'Marine Drive',
    category: 'commercial',
    lat: 18.9304,
    lng: 72.8230,
    address: 'Netaji Subhash Chandra Bose Rd, Mumbai',
    stationNear: 'Churchgate Station'
  },
  {
    id: 'churchgate',
    name: 'Churchgate Terminus',
    shortName: 'Churchgate',
    category: 'transit_hub',
    lat: 18.9322,
    lng: 72.8264,
    address: 'Maharshi Karve Rd, Churchgate, Mumbai',
    stationNear: 'Churchgate Railway Station'
  },
  {
    id: 'thane',
    name: 'Thane (W), Teen Hath Naka',
    shortName: 'Thane',
    category: 'suburb',
    lat: 19.1860,
    lng: 72.9634,
    address: 'Eastern Express Highway, Thane West',
    stationNear: 'Thane Railway Station'
  },
  {
    id: 'navi_mumbai',
    name: 'Vashi, Navi Mumbai',
    shortName: 'Navi Mumbai',
    category: 'commercial',
    lat: 19.0771,
    lng: 72.9986,
    address: 'Sector 30A, Vashi, Navi Mumbai',
    stationNear: 'Vashi Railway Station'
  }
];

export const WATERLOGGING_HOTSPOTS: WaterloggingHotspot[] = [
  {
    id: 'andheri_subway',
    name: 'Andheri Subway',
    area: 'Andheri',
    lat: 19.1197,
    lng: 72.8464,
    severity: 'Waterlogged',
    waterDepthCm: 38,
    pumpsActive: 4,
    trafficDiversionActive: true,
    description: 'Subway vehicular movement suspended due to monsoon runoff accumulation.'
  },
  {
    id: 'milan_subway',
    name: 'Milan Subway',
    area: 'Santacruz',
    lat: 19.0833,
    lng: 72.8417,
    severity: 'Watch',
    waterDepthCm: 15,
    pumpsActive: 3,
    trafficDiversionActive: false,
    description: 'High water volume monitoring. Flyover route recommended for light vehicles.'
  },
  {
    id: 'hindmata',
    name: 'Hindmata Flyover Junction',
    area: 'Dadar East',
    lat: 19.0116,
    lng: 72.8427,
    severity: 'Watch',
    waterDepthCm: 20,
    pumpsActive: 6,
    trafficDiversionActive: false,
    description: 'Underground holding tanks active; surface water clearing slowly.'
  },
  {
    id: 'sion_station_junction',
    name: 'Sion Railway Culvert',
    area: 'Sion',
    lat: 19.0390,
    lng: 72.8619,
    severity: 'Critical',
    waterDepthCm: 45,
    pumpsActive: 5,
    trafficDiversionActive: true,
    description: 'Tracks and low-lying road waterlogged; BEST buses rerouted via Sulochana Shetty Marg.'
  },
  {
    id: 'kurla_kamani',
    name: 'Kurla LBS / Kamani Junction',
    area: 'Kurla West',
    lat: 19.0728,
    lng: 72.8824,
    severity: 'Waterlogged',
    waterDepthCm: 28,
    pumpsActive: 3,
    trafficDiversionActive: true,
    description: 'Mithi river overflow threshold alert. Heavy traffic slowdown.'
  }
];

export const TRANSIT_LINES: TransitLineStatus[] = [
  {
    lineId: 'western_railway',
    name: 'Western Line (Churchgate ↔ Dahanu)',
    type: 'Local Train',
    operator: 'Western Railway',
    status: 'Minor Delay',
    delayMinutes: 8,
    crowdLevel: 'High',
    comfortTip: 'Board from platform 3 at Andheri for Dadar-bound fast trains.'
  },
  {
    lineId: 'central_railway',
    name: 'Central Line (CSMT ↔ Kalyan)',
    type: 'Local Train',
    operator: 'Central Railway',
    status: 'Normal',
    delayMinutes: 3,
    crowdLevel: 'High',
    comfortTip: 'AC local operating on 09:14 slot from Thane.'
  },
  {
    lineId: 'metro_line_1',
    name: 'Metro Line 1 (Versova ↔ Ghatkopar)',
    type: 'Metro',
    operator: 'MMRDA',
    status: 'Normal',
    delayMinutes: 0,
    crowdLevel: 'Moderate',
    comfortTip: 'Frequency every 3.5 mins during peak hours. Full AC comfort.'
  },
  {
    lineId: 'metro_line_2a_7',
    name: 'Metro Lines 2A & 7 (Dahisar ↔ Andheri E/W)',
    type: 'Metro',
    operator: 'MMRDA',
    status: 'Normal',
    delayMinutes: 0,
    crowdLevel: 'Moderate',
    comfortTip: 'Excellent connector between Link Road and Western Express Highway.'
  },
  {
    lineId: 'metro_line_3',
    name: 'Metro Line 3 Aqua (Aarey ↔ BKC)',
    type: 'Metro',
    operator: 'MMRDA',
    status: 'Normal',
    delayMinutes: 0,
    crowdLevel: 'Low',
    comfortTip: 'Underground high-speed link directly to BKC financial core.'
  },
  {
    lineId: 'best_bus',
    name: 'BEST City Buses (BKC & WEH Feeders)',
    type: 'BEST Bus',
    operator: 'BEST',
    status: 'Minor Delay',
    delayMinutes: 12,
    crowdLevel: 'High',
    comfortTip: 'Bus 310 from Bandra East to BKC running every 6 minutes.'
  }
];

export const BASE_WEATHER: WeatherCondition = {
  condition: 'Passing Showers',
  temperatureC: 29,
  rainfallMmPerHour: 6.5,
  windSpeedKmh: 18,
  visibilityKm: 7.2,
  aqi: 58,
  warningText: 'Intermittent moderate spells expected over Western suburbs.'
};

export const BASE_TIDE: TideCondition = {
  currentLevelM: 3.42,
  highTideTime: '14:10',
  highTideHeightM: 4.48,
  lowTideTime: '20:25',
  lowTideHeightM: 1.15,
  riskStatus: 'Moderate Risk',
  coastalAdvisory: 'High tide of 4.48m at 14:10. Combine with rainfall for drain backflow risk.'
};

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  normal: {
    id: 'normal',
    title: 'Scenario 1: Normal Peak Commute',
    shortDesc: 'Typical morning peak hours with standard Mumbai traffic and operational trains.',
    weather: {
      condition: 'Partly Cloudy',
      temperatureC: 31,
      rainfallMmPerHour: 0,
      windSpeedKmh: 12,
      visibilityKm: 9.5,
      aqi: 82
    },
    tide: {
      currentLevelM: 2.1,
      highTideTime: '16:45',
      highTideHeightM: 3.2,
      lowTideTime: '10:30',
      lowTideHeightM: 1.05,
      riskStatus: 'Normal',
      coastalAdvisory: 'Normal tidal cycle. No drainage restriction.'
    },
    westernTrainStatus: 'Normal',
    waterloggingActive: false,
    nightMode: false
  },
  monsoon_tide: {
    id: 'monsoon_tide',
    title: 'Scenario 2: Monsoon + High Tide Warning',
    shortDesc: 'Heavy 45mm/hr downpour coinciding with 4.5m high tide. Subways flooded.',
    weather: {
      condition: 'Heavy Monsoon Downpour',
      temperatureC: 26,
      rainfallMmPerHour: 48,
      windSpeedKmh: 34,
      visibilityKm: 2.1,
      aqi: 24,
      warningText: 'Orange alert: Intense waterlogging risk at low-lying subways.'
    },
    tide: {
      currentLevelM: 4.25,
      highTideTime: '14:10',
      highTideHeightM: 4.58,
      lowTideTime: '20:30',
      lowTideHeightM: 1.2,
      riskStatus: 'High Risk',
      coastalAdvisory: '4.58m spring tide: Flood gates shut at Love Grove and Britannia pumping stations.'
    },
    westernTrainStatus: 'Minor Delay',
    waterloggingActive: true,
    nightMode: false
  },
  night_traveller: {
    id: 'night_traveller',
    title: 'Scenario 3: Night Traveller Safety Mode',
    shortDesc: '11:30 PM late commute. Maximizes well-lit corridors, active transit hubs & live trip sharing.',
    weather: {
      condition: 'Clear Night',
      temperatureC: 27,
      rainfallMmPerHour: 0,
      windSpeedKmh: 8,
      visibilityKm: 8.0,
      aqi: 95
    },
    tide: {
      currentLevelM: 1.8,
      highTideTime: '03:15',
      highTideHeightM: 3.1,
      lowTideTime: '21:40',
      lowTideHeightM: 0.9,
      riskStatus: 'Normal',
      coastalAdvisory: 'Calm tidal conditions.'
    },
    westernTrainStatus: 'Normal',
    waterloggingActive: false,
    nightMode: true
  },
  train_disruption: {
    id: 'train_disruption',
    title: 'Scenario 4: Western Line Overhead Wire Delay',
    shortDesc: 'Signal breakdown near Dadar causes 35 min train delays; Metro & road alternatives surge.',
    weather: {
      condition: 'Humid & Overcast',
      temperatureC: 30,
      rainfallMmPerHour: 2,
      windSpeedKmh: 14,
      visibilityKm: 8.0,
      aqi: 74
    },
    tide: {
      currentLevelM: 2.4,
      highTideTime: '15:20',
      highTideHeightM: 3.6,
      lowTideTime: '09:10',
      lowTideHeightM: 1.1,
      riskStatus: 'Normal',
      coastalAdvisory: 'Normal sea conditions.'
    },
    westernTrainStatus: 'Suspended',
    waterloggingActive: false,
    nightMode: false
  },
  event_shock: {
    id: 'event_shock',
    title: 'Scenario 5: Bandra Marathon & VIP Movement',
    shortDesc: 'Bandra-Worli Sea Link and SV Road blocked; traffic multiplier +2.4x on road options.',
    weather: {
      condition: 'Pleasant Morning',
      temperatureC: 25,
      rainfallMmPerHour: 0,
      windSpeedKmh: 10,
      visibilityKm: 9.0,
      aqi: 65
    },
    tide: {
      currentLevelM: 2.2,
      highTideTime: '11:05',
      highTideHeightM: 3.4,
      lowTideTime: '17:30',
      lowTideHeightM: 1.2,
      riskStatus: 'Normal',
      coastalAdvisory: 'Normal tidal conditions.'
    },
    westernTrainStatus: 'Normal',
    waterloggingActive: false,
    nightMode: false,
    activeEvent: {
      id: 'marathon_2026',
      title: 'Mumbai City Half-Marathon & Sea Link Convoy',
      area: 'Bandra ↔ Worli Sea Link Corridor',
      type: 'Marathon',
      impactLevel: 'Severe',
      trafficMultiplier: 2.4,
      affectedCorridors: ['Bandra-Worli Sea Link', 'SV Road Bandra', 'Kalanagar Junction'],
      alternativeAdvice: 'Road vehicles diverted via Western Railway suburban or Metro Line 3 underground.'
    }
  }
};
