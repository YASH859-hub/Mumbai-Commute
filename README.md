# Mumbai Commute Copilot

**A Mumbai-first intelligent multimodal commute decision platform built to navigate the city's unique transit challenges.**

## Overview

Mumbai Commute Copilot is a Progressive Web App (PWA) designed to solve the complexities of daily travel in one of the world's most congested and dynamic cities. Originally developed as a hackathon project, Mumbai Commute Copilot explores how AI-assisted decision making can improve everyday urban mobility in Mumbai. Rather than just offering generic map directions, it functions as a highly context-aware decision engine that factors in the unique environmental and transit constraints of the city.

The application intelligently evaluates routes across Mumbai's massive multimodal network—including Suburban Local Trains, the rapidly expanding Metro lines, BEST Electric AC Buses, and private Cabs/Autos. By understanding the user's specific persona and current city conditions, it generates tailored recommendations that balance time, cost, safety, and comfort.

At its current stage, the project operates entirely as a sophisticated **client-side simulation**. A robust mock API layer dynamically calculates travel times, costs, and delays based on real-world Mumbai scenarios (like monsoon floods or train signal failures), allowing users to experience the intelligent routing logic without needing a live backend connection.

---

## Why This Exists

Navigating Mumbai is vastly different from navigating most global cities. Standard map applications often fail here because they rely primarily on surface road traffic algorithms. In Mumbai, the fastest route might involve three different modes of transport, and travel times are heavily influenced by hyper-local factors:

*   **Monsoon & Tides:** A heavy downpour during high tide often shuts down critical low-lying subways (e.g., Andheri, Milan, Sion), severely paralyzing road traffic.
*   **Suburban Rail Disruptions:** A single overhead wire failure on the Western or Central lines cascades into massive delays and crush-load crowding.
*   **Multimodal Reality:** The most efficient journey usually involves a first-mile auto rickshaw, a trunk journey on a fast local train or underground metro, and a last-mile walk.
*   **Night Safety:** Traveling late at night shifts the priority from speed to well-lit transit corridors and active hubs.

This platform exists to turn these complex variables into simple, personalized, and explainable commute decisions.

---

## What Makes It Different

**Traditional Navigation Apps:**
*"Here are 3 routes to BKC. One takes 45 mins, one takes 50 mins."*

**Mumbai Commute Copilot:**
*"Given the current 4.5m high tide and waterlogging at Andheri Subway, road travel is heavily delayed. As a professional prioritizing time and comfort, we recommend the underground Metro Line 3. It bypasses the flood zones entirely, gets you there in 42 minutes, costs ₹40, and guarantees 95% on-time reliability. You should leave by 08:35 AM."*

It doesn't just draw a line on a map; it explains *why* a route is optimal for *you*, right *now*.

---

## Core Features

### 🚇 Multimodal Commute Planning
Calculates integrated routes utilizing:
*   **Suburban Local Train** (Western/Central Rail)
*   **Metro** (Elevated Lines 1/2A/7 & Underground Line 3 Aqua)
*   **BEST AC Express Buses**
*   **Direct Cab / Taxi**
*   **Direct Auto Rickshaw**

### 🎯 Personalized Route Ranking
Routes are dynamically scored against distinct user personas, adjusting the weights for **Time, Cost, Safety,** and **Comfort**. 

### 💡 Explainable Recommendations
Every suggested route breaks down the rationale: showing exactly why it was chosen, outlining the cost breakdown, and highlighting any flood exposure or safety factors.

### 🌊 Mumbai Context Awareness (Simulated)
Factors in local data such as waterlogging hotspots (e.g., Hindmata, Kurla Kamani), tide schedules, weather downpours, and transit line statuses.

### 🕹️ Scenario Simulation
A built-in demo engine allows users to instantly toggle between different city states to see how the routing algorithm adapts in real-time.

### 🤖 AI Copilot (Simulated)
A natural language assistant interface designed to offer localized transit advice in English, Hindi, and Marathi based on the active scenario.

### 📍 Live Trip & Dynamic Rerouting
Simulates an active journey with a progress tracker and injects mid-trip disruption alerts (e.g., suggesting a switch to the Metro if a flood is detected ahead).

### 📱 Responsive PWA Design
Fully responsive desktop web workspace that includes a toggleable "Simulated Mobile Device Frame" (390x844) to preview the native mobile app experience side-by-side.

---

## How It Works

The platform makes decisions through a structured pipeline entirely within the client:

```text
User Input (Origin, Destination, Arrive-By Time)
       ↓
Commute Context (Active Scenario, Weather, Tide, Transit Status)
       ↓
Route Generation (Candidate Multimodal Paths via Mock API)
       ↓
Route Evaluation (Time penalties, surge pricing, flood exposure)
       ↓
Personalized Scoring (Weighted by Persona: Time vs Cost vs Safety vs Comfort)
       ↓
Explainability (Generating "Why Reasons" & Leave-By Times)
       ↓
Recommended Route Displayed to User
```

---

## Route Scoring & Decision Logic

The core intelligence lives in the `scoringEngine.ts`. The algorithm evaluates candidate routes by normalizing their core attributes (Time, Cost, Safety, Comfort) on a 0 to 1 scale. 

The composite score is calculated as:
`Score = (wTime * normTime) + (wCost * normCost) + (wSafety * (1 - normSafety)) + (wComfort * (1 - normComfort))`

*(Lower scores are better. Safety and Comfort are inverted so higher values reduce the penalty).*

The engine dynamically assigns recommendation tags like **FASTEST**, **CHEAPEST**, or **SAFEST** based on the dominant weights of the active persona. It also computes a statistical **Leave-By Time** by applying a P90 uncertainty buffer to the median travel time.

---

## Personas & Personalization

The app features pre-configured personas that drastically alter route rankings:

1.  **STUDENT:** Heavily prioritizes low Cost (50%) and Time (25%). Recommends local trains and buses.
2.  **PROFESSIONAL:** Prioritizes Time (50%) and Comfort (25%). Will often suggest Metro or AC Cabs.
3.  **NIGHT TRAVELLER:** Maximizes Safety (55%) and prioritizes well-lit corridors and active transit hubs over pure speed.
4.  **FLEET EMPLOYER:** Balances Time (35%) and Safety (25%) for B2B employee transport tracking.

---

## Scenario Simulation

The app includes 5 distinct mock scenarios (defined in `mumbaiData.ts`) to demonstrate the engine's adaptability:

### 1. Normal Peak Commute
*   **What changes:** Typical morning peak hours.
*   **App response:** Standard travel times, prioritizing fast local trains or Metros.

### 2. Monsoon + High Tide Warning
*   **What changes:** 45mm/hr downpour coinciding with a 4.5m high tide. Subways flood.
*   **App response:** Massive delays added to road transport (Cabs/Autos). Automatically recommends underground Metro or elevated rail, highlighting "Zero Flood Exposure".

### 3. Night Traveller Safety Mode
*   **What changes:** Late-night commute conditions.
*   **App response:** Automatically shifts to the Night Traveller persona. Recommends well-lit Metro skywalks and enables trusted contact trip-sharing features.

### 4. Western Line Overhead Wire Delay
*   **What changes:** A signal breakdown causes 35+ min delays on the Western Railway.
*   **App response:** The usually recommended Local Train drops in ranking. The app issues an alert and suggests switching to the Metro or AC Buses.

### 5. Bandra Marathon & VIP Movement
*   **What changes:** Sea Link and SV Road blocked due to an event.
*   **App response:** Applies a 2.4x traffic multiplier to road routes, steering users toward underground or rail options.

---

## AI Copilot

The **CopilotAssistantModal** is a multilingual chatbot interface designed to answer localized transit questions (e.g., *"Is it safe to travel through Sion right now?"*). 

**Implementation Note:** While the repository includes the `@google/genai` dependency indicating future LLM integration, the *current* implementation uses a robust local simulation to parse keywords and return highly contextual mock responses based on the active Demo Scenario. It supports mock voice inputs and returns actionable buttons that directly navigate the UI.

---

## Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI Framework |
| **TypeScript** | Type safety and domain modeling |
| **Vite 8** | Rapid development environment and build tool |
| **Tailwind CSS v4** | Utility-first styling and responsive design |
| **Lucide React** | Consistent, clean iconography |
| **Leaflet & MapTiler** | Interactive map rendering with custom transit tile layers |
| **Motion** | Fluid UI animations and transitions |
| **Bun** | Fast dependency management |

---

## Architecture

The project is structured as a completely frontend-driven application, designed so the mock services can seamlessly be swapped for production APIs in the future:

```text
Mumbai-Commute/
├── src/
│   ├── components/         # Reusable UI (Alerts, Planner, Maps, Modals)
│   ├── constants/          # Mumbai geography, hotspots, and scenario definitions
│   ├── context/            # AppContext.tsx (Global State Management)
│   ├── pages/              # Main route views (Home, Plan, Trips, Alerts)
│   ├── services/           
│   │   ├── mockApiService.ts  # Generates routes, delays, and coordinates based on scenarios
│   │   └── scoringEngine.ts   # Normalizes and ranks routes based on persona weights
│   ├── types/              # Comprehensive TypeScript interfaces
│   ├── App.tsx             # Main layout & Dual View (Desktop / Mobile Frame) controller
│   └── main.tsx            # React root
```

---

## 🏆 Hackathon / Competition

This project was originally developed for **NEXATHON 2026** by **Team Hackcartel**. 

We addressed the core problem of unpredictable urban mobility in Mumbai—where monsoon floods, high tides, and transit disruptions frequently paralyze the city. Our solution demonstrated an intelligent multimodal commute decision platform that doesn't just show routes, but explains *why* a specific route is recommended based on the user's priorities and the active city scenario.

Key technologies showcased during the competition included React 19, Vite, Tailwind CSS v4, and Leaflet for map rendering, driven by a robust client-side simulation engine designed to handle complex routing logic and a mock Copilot assistant.
