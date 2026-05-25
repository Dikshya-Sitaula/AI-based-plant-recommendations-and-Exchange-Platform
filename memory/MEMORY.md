# Leaf-Life Project Memory

## Smart Recommendation System (May 25, 2026)
- **144 Profile Logic:** Implemented a sophisticated recommendation engine that categorizes user environments into 144 unique profiles (4 Space Types × 3 Light Levels × 12 Monthly Climate Cycles).
- **Rule-Based Matching:**
    - Added explicit `rule` metadata to all 47 plants in `Backend/plantRules.js` (e.g., "Indoor, Low Light, 18-30°C").
    - Updated the backend `/api/recommend` endpoint to match plants based on these specific survival rules and current local climate.
- **Reverse Geocoding:** 
    - Enhanced the "Use My Location" feature using the OpenStreetMap Nominatim API.
    - The system now detects and displays precise neighborhood names (e.g., "Samakhusi, Kathmandu") instead of generic coordinates.
- **Frontend & Cart Integration:**
    - Fully refactored `src/pages/Recommendation.jsx` to fetch real-time data from the backend.
    - Integrated the Marketplace cart system into the recommendation results. Users can now "Add to Cart" directly from their recommended plant list.
    - Added a floating cart icon with a badge to the results view for a seamless shopping experience.
- **Backend Infrastructure:**
    - Configured `express.static` in `Backend/server.js` to serve plant images directly from the backend.
    - Updated database schema to include the `rule` column and implemented automatic seeding for the 47-plant library.
- **Git Branch:** Pushed all Smart Recommendation code to the `rishu-2.0` branch.

- **Text Change:** Replaced all occurrences of "Buy Now" with "Add to Cart" in `src/pages/Marketplace.jsx` and `src/pages/PlantDetail.jsx`.
- **Cart Functionality:**
    - Implemented a `cart` state in `Marketplace.jsx` and `PlantDetail.jsx` using `useState` and `useEffect` for `localStorage` persistence.
    - Added a floating cart icon with a dynamic badge (counter) in the top-right of the marketplace and plant detail headers.
    - **Streamlined Add to Cart:** Simplified the marketplace grid so clicking "Add to Cart" on a card immediately adds one plant to the cart without asking for quantity. This allows for faster shopping from the main view.
    - **Fixed Cart Persistence:** Resolved an issue where the cart count would reset during navigation. Initialized the `cart` state directly from `localStorage` in both `Marketplace.jsx` and `PlantDetail.jsx` to ensure data consistency between pages.
    - **Cart Modal:** Implemented a full cart overlay that opens when clicking the cart icon. It displays a grouped list of plants with their individual quantities, images, and a calculated total price, fulfilling the requirement to show "1 plant in 3 quantity" rather than 3 separate entries.
    - Updated the quantity selector confirmation to "Add to Cart" (on the details page modal), which updates the cart count instead of initiating immediate payment.
- **Git Branch:** Pushed these changes to the remote branch `rishu-2.0`.
