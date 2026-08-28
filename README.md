# Mercado Claro

A React 19 e-commerce prototype with a mock catalog, persistent cart, checkout confirmation and configurable social sign-in.

## Stack

Vite, React, TypeScript, React Router, Auth0, Vitest and React Testing Library. `src/features` owns cart, authentication, products and checkout; shared UI is in `components`; `app/App.tsx` owns simple routes.

The cart uses `useReducer` for its related add/increase/decrease/remove/clear transitions, Context to share it and `localStorage` persistence. Authentication has a small Context provider. React Router handles client-side routes.

## Commands

```bash
npm install
copy .env.example .env
npm run dev
npm run build
npm test
```

## OAuth

The default `VITE_AUTH_MODE=auth0` uses Auth0 Universal Login. Create an Auth0 **Single Page Application**, configure Google, Facebook and Microsoft connections, and set `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID`. In the Auth0 application, allow `http://localhost:5173/profile` as a callback URL plus the localhost origin for logout and web origins. These values are public browser configuration; connection secrets stay only in Auth0. `VITE_AUTH_MODE=mock` remains an explicit local demo mode, not OAuth.
