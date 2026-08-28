import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './app/App'
import { AuthProvider } from './features/auth/AuthProvider'
import { CartProvider } from './features/cart/CartProvider'
import './style.css'
// HashRouter keeps the route after #, which lets this client-side app work on GitHub Pages without
// server rewrite rules for paths such as /profile and /checkout.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
