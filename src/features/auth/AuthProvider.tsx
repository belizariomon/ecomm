import { Auth0Provider, useAuth0, type User as Auth0User } from '@auth0/auth0-react'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '../../types'
import { auth0Config, authMode } from './authConfig'

type SocialConnection = 'google-oauth2' | 'facebook' | 'windowslive'
type Value = {
  user: User | null
  login: (connection: SocialConnection) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  loading: boolean
}

const AuthContext = createContext<Value | null>(null)
const demoUser: User = { id: 'demo-user', name: 'Alex Morgan', email: 'alex@example.com' }

function applicationBaseUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString()
}

function mapUser(user: Auth0User): User {
  return {
    id: user.sub ?? user.email ?? 'auth0-user',
    name: user.name ?? user.nickname ?? user.email?.split('@')[0] ?? 'Account user',
    email: user.email ?? 'No email address provided',
    avatar: user.picture,
  }
}

function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    localStorage.getItem('mercado-claro-user') ? demoUser : null,
  )
  const login = async () => {
    localStorage.setItem('mercado-claro-user', 'demo')
    setUser(demoUser)
  }
  const logout = async () => {
    localStorage.removeItem('mercado-claro-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error: null, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

function Auth0Bridge({ children }: { children: ReactNode }) {
  const {
    user,
    error,
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0()
  const login = async (connection: SocialConnection) => {
    await loginWithRedirect({
      appState: { returnTo: '/profile' },
      authorizationParams: { connection },
    })
  }
  const logout = async () => {
    auth0Logout({ logoutParams: { returnTo: applicationBaseUrl() } })
  }

  return (
    <AuthContext.Provider
      value={{
        user: isAuthenticated && user ? mapUser(user) : null,
        login,
        logout,
        error: error?.message ?? null,
        loading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Context keeps identity at application scope so navigation and protected pages share one user.
// Auth0Provider owns OAuth, PKCE, token renewal and the callback; this bridge exposes only the
// small application API that this prototype needs.
export function AuthProvider({ children }: { children: ReactNode }) {
  if (authMode === 'mock') return <MockAuthProvider>{children}</MockAuthProvider>

  if (!auth0Config.domain || !auth0Config.clientId) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          login: async () => undefined,
          logout: async () => undefined,
          error: 'Auth0 needs VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in .env.',
          loading: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      // The callback must be a real static URL. GitHub Pages cannot serve /profile directly,
      // so Auth0 returns to the app root and HashRouter then navigates to #/profile.
      authorizationParams={{ redirect_uri: applicationBaseUrl() }}
      onRedirectCallback={(appState) => {
        window.location.hash = appState?.returnTo ?? '/profile'
      }}
    >
      <Auth0Bridge>{children}</Auth0Bridge>
    </Auth0Provider>
  )
}

// A custom hook gives consumers a focused, safe API for the authentication Context.
// It intentionally lives with its provider so the small auth feature stays together.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
