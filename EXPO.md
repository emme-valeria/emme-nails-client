# Emme Studio with Expo

## Local development

```sh
npm install
npm run web
```

`npm run web` starts Expo only. Open the URL printed by Metro (usually `http://localhost:8081`). Use `npm run ios` or `npm run android` for a simulator. No API server or internet connection is required for the prototype flows.

The older Vite source remains available through the `legacy:*` scripts. The current Expo commands no longer start the Express server.

## Current Expo coverage

The Expo Router client includes a local-development phone entry flow, Home, appointments, chat, profile, services, booking, and photo-quote screens. All current external integrations use deterministic local fixtures: chat, image analysis, Google sign-in, Calendar and Sheets. The phone code is a demo and does not send SMS or authenticate with Firebase. Booking entries and the local client profile persist on-device. No live API endpoints are called by the Expo frontend. Production Gemini, OAuth/OTP and account synchronization remain to be integrated.
