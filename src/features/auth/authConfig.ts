export const authMode = import.meta.env.VITE_AUTH_MODE ?? 'auth0'
export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN as string | undefined,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined,
}
