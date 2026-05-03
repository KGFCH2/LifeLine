# 🛠️ Setup & Operations Guide

> Complete setup and working principles for LifeLine+ contributors and operators.

---

## 🌐 System Overview

LifeLine+ is a full-stack emergency response platform with these connected parts:

- **Frontend (React + Vite)** : Runs in the browser, handles UI, maps, auth, real-time tracking
- **Backend (Node + Express)** : REST API server, Socket.io hub, AI/Gemini integration
- **Google Maps APIs** : Provides real map data for places, routes, traffic
- **Gemini AI** : Verifies civilian emergency requests, powers chat assistant
- **Firebase Auth** : Primary Google Login with fallback email/name session in localStorage
- **Firebase Admin** : Optional Firestore persistence for bookings, alerts, ambulance requests, and civilian verifications
- **Socket.io** : Real-time ambulance tracking, notifications, status updates

---

## 📂 File-by-File Working Principles

### `backend/lib/googleMaps.js`

- Shared Google Maps helper for Places, Directions, Details, photos, and distance calculation
- Fails fast when `GOOGLE_MAPS_API_KEY` is missing
- Normalizes Google Places responses into frontend-friendly objects

### `backend/lib/firebaseAdmin.js`

- Initializes Firebase Admin only when service-account env variables exist
- Persists documents to Firestore when available
- Gracefully falls back to in-memory operation if Firebase Admin cannot initialize

### `backend/server.js`

- Express app + HTTP server + Socket.io
- Mounts all API route modules
- Injects `io` instance into every request via middleware so routes can emit events
- Health check at `GET /api/health`

### `backend/routes/services.js`

- `GET /api/nearest-services?lat=&lng=&type=&radius=`
- Calls Google Places API Nearby Search
- Returns cleaned results with distance calculation (Haversine formula)
- `GET /api/nearest-services/details/:placeId` fetches full place details

### `backend/routes/routes.js`

- `GET /api/routes/emergency` calls Google Directions API with `alternatives=true`
- Sorts routes by `duration_in_traffic` and marks the fastest route
- Returns distance, ETA, traffic status, encoded polylines, and cleaned step instructions

### `backend/routes/ambulance.js`

- Maintains stable zone-based ambulance fleets instead of changing random vehicles on every request
- `GET /api/ambulance-request/nearby` returns available ambulances around the user
- `POST /api/ambulance-request/request` creates a request, notifies ambulance rooms, and stores status
- Uses a 5-minute acceptance window in production and a configurable fast simulation in development
- Emits `ambulance_assigned`, `location_update`, and `ambulance_arrived` through Socket.io

### `backend/routes/verify.js`

- `POST /api/verify/civilian` sends vehicle details to Gemini 1.5 Flash
- Prompt instructs Gemini to return strict JSON with `approved`, `confidence`, `riskLevel`
- If parsing fails, verification is safely denied instead of auto-approved
- `POST /api/verify/chat` powers LifeLine+ AI chat through the backend so the Gemini key is not called directly from UI

### `backend/routes/booking.js`

- Uses Google Places API for nearby doctors/clinics and falls back only if Places is unavailable
- `GET /api/booking/doctors` supports specialty, availability, and rating filters
- `GET /api/booking/slots/:doctorId` returns deterministic same-day slot availability
- `POST /api/booking/appointment` stores booking in memory and optionally Firestore

### `backend/routes/police.js`

- `GET /api/police/stations` fetches real nearby police stations from Google Places
- `POST /api/police/alert` detects stations around route points, stores the alert, and broadcasts via Socket.io

### `backend/sockets/handlers.js`

- `join_user` and `join_request` room management
- `ambulance_location` relays driver GPS to all clients tracking that request
- `track_civilian` broadcasts civilian vehicle positions
- `emergency_trigger` global broadcast for SOS events

### `frontend/src/main.jsx`

- React 18 StrictMode + BrowserRouter + AuthProvider wraps entire app

### `frontend/src/App.jsx`

- Route definitions for all pages
- `initAuth()` runs on mount to restore localStorage session

### `frontend/src/context/AuthContext.jsx`

- Watches Firebase Auth state when configured
- `login()` normalizes Google or fallback email users and persists to `localStorage` as `lifeline_user`
- `logout()` signs out Firebase users when needed and clears local session
- `updateProfile()` merges updates and re-persists

### `frontend/src/lib/firebase.js`

- Reads `VITE_FIREBASE_*` values and initializes Firebase Web SDK
- Exposes Firebase Auth, Google provider, and analytics support check

### `frontend/src/lib/googleMaps.js`

- Loads Google Maps JS API dynamically from `VITE_GOOGLE_MAPS_API_KEY`
- Prevents duplicate script injection across pages

### `frontend/src/components/MapView.jsx`

- Google Maps JS API integration via global `window.google.maps`
- Supports 2D/3D toggle (3D = satellite with 45deg tilt)
- Dark mode map styles applied via `styles` option
- Traffic layer toggle
- Custom markers with SVG icons
- Route polylines decoded from Google encoding
- Zoom controls and recenter button overlays

### `frontend/src/components/Layout.jsx`

- Wraps all pages with BottomNav, SOSButton, DarkModeToggle
- Reads `lifeline_dark` from localStorage for theme persistence

### `frontend/src/components/SOSButton.jsx`

- Fixed floating action button with pulse animation
- Opens menu with Emergency Mode and Voice SOS options
- `webkitSpeechRecognition` listens for keywords: "help", "emergency", "sos", "bachao"

### `frontend/src/components/LoginModal.jsx`

- Two auth paths: Firebase Google popup and Email form
- Email form stores in localStorage via AuthContext
- Slide-up modal animation on mobile

### `frontend/src/pages/Home.jsx`

- Geolocation detection via `navigator.geolocation`
- Fetches nearby services from backend based on selected filter type
- Supports distance, rating, open-now, and specialty filters
- Displays interactive map + horizontal scroll service cards
- Emergency CTA redirects to `/emergency` or opens login

### `frontend/src/pages/Emergency.jsx`

- Auto-selects nearest open hospital and calculates live routes on entry
- **Phase machine**: `init` -> `route_calc` -> `ambulance_list` -> `searching` -> `tracking`
- Also supports `civilian_direct` -> `civilian_active` flow
- Integrates all emergency features: route calc, ambulance booking, civilian verify, police alert, AI chat
- Chat uses backend `/api/verify/chat` with Gemini 1.5 Flash for emergency guidance

### `frontend/src/pages/Doctors.jsx`

- Specialty filter pills (horizontal scroll)
- Doctor cards with call + book buttons
- Booking modal with slot grid (3 cols), patient form, confirmation state

### `frontend/src/pages/Dashboard.jsx`

- Stats cards: total requests, response time, active ambulances, police alerts
- Recent activity feed with status badges

### `frontend/src/pages/Profile.jsx`
- User info display with edit form
- Menu items for Emergency Contacts, Medical Records, Notifications, Privacy
- Sign Out button

---

## 🎨 Design System & Branding

LifeLine+ uses a premium, high-contrast design system to ensure clarity during emergencies.

### 🔴 Core Branding (Red)
- **Primary Color**: `#C8102E` (Medical Red)
- **Legal Headers**: Privacy Policy, Terms of Service, and FAQs use a persistent red gradient (`#C8102E` to `#a50d26`) across all themes.
- **Buttons**: Critical actions (SOS, Call, Book) use the brand red with subtle shadow glows.

### 🟣 Documentation (Violet)
- The Documentation page uses a unique **Violet-to-Indigo gradient** (`violet-600` to `indigo-800`) to visually distinguish technical guides from legal/emergency sections.

### ✨ Interaction Standards
- **Minimalist Hover**: All interactive icons and cards use a subtle `scale-105` transformation. Rotations and heavy scaling are avoided to maintain a professional, restrained aesthetic.
- **Tech Stack Reveal**: Tech stack icons in Documentation appear in grayscale and smoothly reveal their brand colors on hover.
- **Mobile Grid**: Complex layouts (like tech stacks) use a **2-column grid** on mobile to maximize information density without clutter.
- **Auto-Scroll to Status**: The platform automatically scrolls the content area to the top whenever a critical status change occurs (e.g., booking an ambulance or activating Civilian Mode), ensuring users never miss vital real-time updates.

---

## 🚀 Demo Simulation & "Wow" Factors

LifeLine+ is optimized for live demonstrations. The following "Demo Mode" behaviors are enabled by default to ensure a high-impact presentation:

### ⏱️ Accelerated Time-Warping
- **Ambulance Acceptance**: In production, drivers have several minutes to accept. In **Demo Mode**, the backend simulates a nearby driver acceptance in exactly **5 seconds**, allowing for an immediate transition to the live tracking view.
- **AI Verification**: Gemini AI verifications for Civilian Mode are optimized for <3s response times, providing near-instant approval/denial based on the user's input.
- **Real-time Map Movement**: The ambulance marker on the map uses a smooth animation library to simulate actual driving speeds, making the "live tracking" feel alive without requiring a real vehicle.

### ✨ Visual Demonstration Features
- **Dynamic Headers**: Each core section (Privacy, Documentation, Terms) has unique, theme-aware gradient headers designed to "wow" the audience at first glance.
- **Tech Stack Reveal**: On the Documentation page, grayscale icons colorize on hover to show professional attention to detail.
- **3D Map Tilt**: The MapView component supports a 45° tilted view (activated via the 3D toggle) to show depth and realism in urban environments.
- **Micro-Animations**: All interactions use subtle `scale-105` transitions and pulse effects (like the SOS button) to make the app feel responsive and "premium."

---

## ▶️ Running the Full Stack

### 1. Start Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 2. Start Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# Vite dev server on http://localhost:5173
```

### 3. Test Flow

1. Open `http://localhost:5173`
2. Allow location access
3. Sign in with email or Google
4. Tap "EMERGENCY - Get Help Now"
5. Tap on map to select destination
6. View calculated routes, pick fastest
7. Tap "Find Nearby Ambulances" -> "Book"
8. Wait 5 seconds for simulated driver acceptance
9. View live tracking + driver details
10. Or try "Civilian Mode" and submit form for AI verification

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render)

```bash
cd backend
# Set environment variables in Render dashboard
# Start command: node server.js
```

### ☁️ Google Cloud Run (Manual Deploy)

#### Step 1: Deploy Backend
```bash
gcloud run deploy lifeline-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_MAPS_API_KEY=YOUR_KEY,GEMINI_API_KEY=YOUR_KEY,FIREBASE_PROJECT_ID=YOUR_ID,FIREBASE_CLIENT_EMAIL=YOUR_EMAIL,FIREBASE_PRIVATE_KEY=\"YOUR_PRIVATE_KEY\""
```

#### Step 2: Deploy Frontend
```bash
cd frontend
# Ensure .env has VITE_BACKEND_URL set to your backend URL
gcloud run deploy lifeline-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

---

## 🧯 Troubleshooting

| Issue | Fix |
| ------- | ----- |
| Map not loading | Check `VITE_GOOGLE_MAPS_API_KEY` in `.env`, ensure Places/Directions/Geometry APIs enabled |
| CORS error | Ensure `FRONTEND_URL` in backend `.env` matches frontend origin |
| Socket not connecting | Backend must be running; check `VITE_BACKEND_URL` |
| AI verification fails | Check `GEMINI_API_KEY`; model name is `gemini-1.5-flash` |
| Build fails | Use Node >= 18; frontend uses `type: "module"` |
| Firebase popup blocked | Ensure Firebase authorized domains include `localhost` and deployed domain |
  
## License  
This project is licensed under the [LICENSE](LICENSE) file. 
