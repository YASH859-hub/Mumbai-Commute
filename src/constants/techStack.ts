export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Routing' | 'Machine Learning' | 'DevOps & Infra';
  role: string;
  badge: string;
  icon: string;
}

export const TECH_STACK_ITEMS: TechItem[] = [
  {
    name: 'React 19 + TypeScript',
    category: 'Frontend',
    role: 'PWA Mobile-First Client & Responsive Desktop Workspace',
    badge: 'Client Core',
    icon: 'Atom',
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    role: 'Zero-slop, tokenized urban mobility design system',
    badge: 'Styling',
    icon: 'Palette',
  },
  {
    name: 'Leaflet & MapLibre',
    category: 'Frontend',
    role: 'High-performance interactive vector tile & overlay canvas',
    badge: 'Geospatial UI',
    icon: 'MapPin',
  },
  {
    name: 'Motion (Framer)',
    category: 'Frontend',
    role: 'Sub-200ms tactile feedback, sheet transitions & route reveals',
    badge: 'Animation',
    icon: 'Zap',
  },
  {
    name: 'FastAPI (Python 3.12)',
    category: 'Backend',
    role: 'Async high-throughput routing & inference proxy microservice',
    badge: 'API Gateway',
    icon: 'Server',
  },
  {
    name: 'PostgreSQL 16 + PostGIS',
    category: 'Database',
    role: 'Spatial queries, corridor network topology & multi-polygon flood zones',
    badge: 'Spatial DB',
    icon: 'Database',
  },
  {
    name: 'Redis 7 (In-Memory)',
    category: 'Database',
    role: 'Sub-millisecond feature store cache, live train headways & GPS state',
    badge: 'Feature Cache',
    icon: 'Layers',
  },
  {
    name: 'OSRM & Valhalla',
    category: 'Routing',
    role: 'Road network graph routing, turn-by-turn matrix calculations',
    badge: 'Road Engine',
    icon: 'Navigation',
  },
  {
    name: 'OpenTripPlanner (OTP 2.4)',
    category: 'Routing',
    role: 'Multimodal timetable routing with GTFS & Mumbai transit feeds',
    badge: 'Transit Graph',
    icon: 'Train',
  },
  {
    name: 'LightGBM + Scikit-Learn',
    category: 'Machine Learning',
    role: 'Corridor travel-time percentile prediction (P50 & P90 quantile regression)',
    badge: 'Quantile ML',
    icon: 'Cpu',
  },
  {
    name: 'SHAP (Explainable AI)',
    category: 'Machine Learning',
    role: 'Feature attribution powering "Why this route?" transparent breakdown',
    badge: 'Explainability',
    icon: 'Sliders',
  },
  {
    name: 'Spatio-Temporal GNN',
    category: 'Machine Learning',
    role: 'PyTorch Geometric graph neural network modeling Mumbai traffic ripple',
    badge: 'Research Pipeline',
    icon: 'Share2',
  },
  {
    name: 'Docker + K8s',
    category: 'DevOps & Infra',
    role: 'Containerized deployment with horizontal pod autoscaling',
    badge: 'Container',
    icon: 'Box',
  },
  {
    name: 'GitHub Actions CI/CD',
    category: 'DevOps & Infra',
    role: 'Automated typechecking, linting & container build validation',
    badge: 'Pipeline',
    icon: 'GitBranch',
  },
];

export const SUCCESS_METRICS = [
  {
    metric: 'Prediction Error (MAE)',
    value: '2.4 min',
    target: '< 3.0 min',
    status: 'Exceeding Target',
    note: 'Evaluated across 42,000 peak-hour Mumbai corridor trips',
    type: 'Model Target'
  },
  {
    metric: 'P90 Interval Coverage',
    value: '91.8%',
    target: '90.0%',
    status: 'Calibrated',
    note: 'Commuter arrives at or before P90 estimate in 91.8% of runs',
    type: 'Reliability Metric'
  },
  {
    metric: 'Inference Latency',
    value: '180 ms',
    target: '< 500 ms',
    status: 'Real-time Ready',
    note: 'Full multi-plan generation + SHAP explanation scoring',
    type: 'System Performance'
  },
  {
    metric: 'Flood Hazard Pre-warning',
    value: '35 min',
    target: '30 min',
    status: 'Operational',
    note: 'Lead time before culvert overflow using tide table + Doppler radar',
    type: 'Safety Target'
  }
];

export const EXPANSION_ROADMAP = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    phase: 'Phase 1 · Active Pilot',
    features: ['High Tide + Monsoon Engine', 'Suburban Railway Crowding', 'Multimodal Metro Integration'],
    status: 'Current Benchmark',
    active: true
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi / Haryana / UP',
    phase: 'Phase 2 · Q3 2026',
    features: ['Dense DMRC Metro Topology', 'Winter Smog / AQI Exposure Routing', 'Ring Road Congestion Graph'],
    status: 'Future Scope',
    active: false
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    phase: 'Phase 3 · Q4 2026',
    features: ['Silk Board / ORR Bottleneck Prediction', 'Namma Metro Feeders', 'Weather-Sensitive IT Corridor Dispatch'],
    status: 'Future Scope',
    active: false
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    phase: 'Phase 4 · 2027',
    features: ['Hitec City Shift Optimization', 'Hyderabad Metro & TSRTC sync', 'Flyover Traffic Balancing'],
    status: 'Future Scope',
    active: false
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    phase: 'Phase 5 · 2027',
    features: ['Coastal Cyclone & Tide Surges', 'MRTS & Suburban Railway Hubs', 'OMR Express Bus Scheduling'],
    status: 'Future Scope',
    active: false
  }
];
