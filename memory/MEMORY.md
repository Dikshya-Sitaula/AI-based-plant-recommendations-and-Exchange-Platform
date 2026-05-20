# PlantApp Project Memory

## Features Implemented
- **Data Persistence & "Save Forever"**:
  - **Auth Persistence**: Implemented `localStorage` session management. Users stay logged in across browser restarts.
  - **QR Session Persistence**: Pending payment sessions are saved to `localStorage`. If the site is closed and reopened during payment, the QR prompt automatically restores.
  - **MySQL User Sync**: Integrated backend with MySQL database to store user credentials (Full Name, Email, Password) permanently.
- **Enhanced QR Payment Flow**:
  - **Dynamic IP Reachability**: The system automatically detects the laptop's LAN IP (`192.168.23.81`) and embeds it in QR codes, ensuring mobile phones can reach the payment page on local Wi-Fi.
  - **Polling with Expiry**: Dashboard/Purchase pages poll the bank server status and handle "expired" or "timeout" states gracefully.
- **High-Precision Location Detection**:
  - **Neighborhood Level**: Enabled `enableHighAccuracy` in Geolocation API to detect specific locations like "Maitidevi, Kathmandu".
  - **Dual-Layer Fallback**: Implemented IP-based geolocation (via `ipapi.co`) as a fallback if GPS is blocked or unavailable.
- **Specialized Care Guide**: Integrated a comprehensive care system for all 47 plant species.
  - **Structured Care Data**: Created `src/data/careTips.json` containing unique watering, sunlight, soil, and expert tips for every plant.
  - **Dynamic Display**: The Purchase page now dynamically loads and displays these specialized tips based on the selected plant.

## Bug Fixes
- **Login/Signup Page Crashes**: Resolved "useEffect is not defined" errors by fixing missing imports in `Login.jsx` and `Signup.jsx`.
- **Form Visibility**: Removed over-aggressive redirect logic that hid Login/Signup forms from authenticated users.
- **Internal Server Errors**: Added detailed backend logging and error handling for MySQL duplicate entries (e.g., "Email already exists").
- **QR Reachability**: Fixed "Site can't be reached" on mobile by moving away from `localhost` and using the current LAN IP dynamically.
- **Dashboard Collection Sync**: Resolved issue where purchased plants were not appearing on the Dashboard.

## Local Configuration
- **Active IP**: `192.168.23.81` (Update this in `server.js`, `Purchase.jsx`, and `Marketplace.jsx` if Wi-Fi changes).
- **Backend Port**: `5000`
- **Frontend Port**: `5173`
- **Database**: MySQL `plant_app` database on `localhost`.
