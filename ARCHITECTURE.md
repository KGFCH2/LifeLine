# 🏗️ System Architecture

Mermaid-based architecture diagrams for **LifeLine+**, the real-time emergency response and crisis coordination platform.

## 🌍 High-Level System

```mermaid
graph TB
    User["👤 User / Patient"] --> PWA["📱 React PWA<br/>Vite + Tailwind"]

    subgraph Browser["🌐 Browser Capabilities"]
        Geo["📍 navigator.geolocation"]
        Speech["🎙️ Web Speech API"]
        Local["💾 localStorage fallback session"]
    end

    subgraph Frontend["⚛️ Frontend"]
        Router["React Router Pages"]
        MapView["MapView<br/>2D + tilted 3D + Traffic"]
        AuthUI["LoginModal<br/>Google + Email"]
        SocketHook["useSocket"]
    end

    subgraph Backend["🧠 Backend API"]
        Express["Express Server"]
        REST["REST Routes"]
        SocketIO["Socket.io Hub"]
        FirebaseAdmin["Firebase Admin<br/>optional Firestore"]
    end

    subgraph Google["☁️ Google Platform"]
        MapsJS["Google Maps JS API"]
        Places["Places API"]
        Directions["Directions API"]
        Distance["Distance Matrix API"]
        FirebaseAuth["Firebase Auth"]
        Gemini["Gemini 1.5 Flash"]
    end

    PWA --> Router
    PWA --> Geo
    PWA --> Speech
    PWA --> Local
    Router --> MapView
    Router --> AuthUI
    Router --> SocketHook
    MapView --> MapsJS
    AuthUI --> FirebaseAuth
    SocketHook <-->|"WebSocket / polling"| SocketIO
    PWA -->|"HTTPS /api"| Express
    Express --> REST
    REST --> Places
    REST --> Directions
    REST --> Distance
    REST --> Gemini
    REST --> FirebaseAdmin
    SocketIO --> PWA
```

## 🧩 Frontend Component Graph

```mermaid
graph LR
    Main["main.jsx"] --> AuthProvider["AuthProvider"]
    AuthProvider --> App["App.jsx Routes"]
    App --> Layout["Layout"]
    Layout --> BottomNav["BottomNav"]
    Layout --> SOS["SOSButton"]
    Layout --> Theme["DarkModeToggle"]

    Layout --> Home["Home"]
    Layout --> Emergency["Emergency"]
    Layout --> Doctors["Doctors"]
    Layout --> Dashboard["Dashboard"]
    Layout --> Profile["Profile"]
    Layout --> Static["About / Contact / FAQs"]

    Home --> MapView["MapView"]
    Emergency --> MapView
    Home --> Login["LoginModal"]
    Emergency --> Socket["useSocket"]
    Emergency --> AIChat["LifeLine+ AI Panel"]
    Doctors --> Booking["Slot Booking Modal"]
```

## 🧠 Backend Route Graph

```mermaid
graph TB
    Server["server.js"] --> Services["/api/nearest-services"]
    Server --> Routes["/api/routes"]
    Server --> Ambulance["/api/ambulance-request"]
    Server --> Verify["/api/verify"]
    Server --> Booking["/api/booking"]
    Server --> Police["/api/police"]
    Server --> Sockets["Socket.io handlers"]

    Services --> Places["Google Places"]
    Routes --> Directions["Google Directions"]
    Routes --> Matrix["Distance Matrix"]
    Ambulance --> Fleet["Zone Fleet State"]
    Ambulance --> SocketEvents["assignment + GPS events"]
    Verify --> Gemini["Gemini Verification + Chat"]
    Booking --> Places
    Booking --> Firestore["Optional Firestore"]
    Police --> Places
    Police --> SocketEvents
```

## 🚑 Emergency State Machine

```mermaid
stateDiagram-v2
    [*] --> AuthCheck: User taps Emergency
    AuthCheck --> DetectLocation: Authenticated
    AuthCheck --> Login: Missing session
    Login --> DetectLocation: Google or email fallback
    DetectLocation --> NearestHospital: Geolocation resolved
    NearestHospital --> RouteCalc: Places API hospital selected
    RouteCalc --> RouteSelect: Directions API alternatives ranked
    RouteSelect --> AmbulanceList: User confirms route
    AmbulanceList --> Searching: POST ambulance request
    Searching --> Tracking: Driver accepts
    Searching --> CivilianPrompt: No ambulance available
    CivilianPrompt --> CivilianVerify: User submits vehicle details
    CivilianVerify --> CivilianActive: Gemini approves
    CivilianVerify --> AmbulanceList: Gemini denies
    CivilianActive --> PoliceAlert: Alert stations along route
    PoliceAlert --> Tracking: Civilian GPS tracking
    Tracking --> [*]: Completed
```

## 📡 Socket.io Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `join_user` | Client to server | Subscribe to user-specific events |
| `join_request` | Client to server | Subscribe to ambulance request tracking |
| `join_ambulance` | Driver to server | Receive incoming ambulance requests |
| `join_civilian` | Client to server | Subscribe to civilian vehicle tracking |
| `new_ambulance_request` | Server to driver | Notify nearby ambulance rooms |
| `ambulance_assigned` | Server to client | Send driver and vehicle details |
| `ambulance_not_found` | Server to client | Trigger alternative/civilian flow |
| `location_update` | Server to client | Move ambulance marker in real time |
| `ambulance_arrived` | Server to client | Complete tracking phase |
| `track_civilian` | Client to server | Publish civilian emergency vehicle GPS |
| `civilian_location` | Server to client | Broadcast civilian GPS |
| `police_alert` | Server to clients | Notify route police alerts |

## 🔐 Security Boundaries

```mermaid
flowchart LR
    PublicKey["Public browser keys<br/>Maps + Firebase Web"] --> Browser["Frontend"]
    SecretKeys["Private server keys<br/>Gemini + Firebase Admin"] --> Backend["Backend only"]
    Browser -->|"Auth popup"| FirebaseAuth["Firebase Auth"]
    Browser -->|"REST without secrets"| Backend
    Backend -->|"Server-side key"| Gemini["Gemini"]
    Backend -->|"Server-side key"| Places["Google Maps Web Services"]
    Backend -->|"Service account"| Firestore["Firestore"]
```

## 🗃️ Runtime Data Model

```mermaid
erDiagram
    USER ||--o{ AMBULANCE_REQUEST : creates
    USER ||--o{ BOOKING : books
    AMBULANCE_REQUEST ||--o| AMBULANCE : assigns
    CIVILIAN_VERIFICATION ||--o{ POLICE_ALERT : triggers
    ROUTE ||--o{ POLICE_ALERT : informs

    USER {
      string id
      string name
      string email
      string provider
    }

    AMBULANCE_REQUEST {
      string id
      string userId
      object pickup
      object destination
      string status
      datetime expiresAt
    }

    AMBULANCE {
      string id
      string vehicleNumber
      object driver
      object location
      boolean available
    }

    BOOKING {
      string id
      string doctorId
      string slot
      string status
    }

    CIVILIAN_VERIFICATION {
      string tempVehicleId
      string vehicleNumber
      boolean verified
      object aiResult
    }

    POLICE_ALERT {
      string id
      string vehicleId
      object location
      string status
    }
```

## 🚀 Deployment View

```mermaid
graph LR
    Dev["Developer"] --> Git["GitHub Repo"]
    Git --> Vercel["Vercel Frontend"]
    Git --> Render["Render Backend"]
    Vercel --> Browser["User Browser"]
    Browser --> Render
    Render --> Google["Google APIs"]
    Render --> Firebase["Firebase"]
```

See [CORE_LOGIC.md](CORE_LOGIC.md) for process-level pipelines and [INSTRUCTIONS.md](INSTRUCTIONS.md) for file-by-file operations.
  
## License  
This project is licensed under the [LICENSE](LICENSE) file. 
