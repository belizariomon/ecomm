import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../features/cart/CartProvider'
import { useAuth } from '../features/auth/AuthProvider'
export function Layout() {
  const { count } = useCart()
  const { user, logout, loading } = useAuth()
  return (
    <>
      <header>
        <Link className="brand" to="/">
          Ecomm the no-fee market
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/cart">Cart ({count})</NavLink>
          {loading ? (
            <span aria-live="polite">Checking session…</span>
          ) : user ? (
            <>
              <NavLink to="/profile">
                {user.avatar && <img className="avatar" src={user.avatar} alt="" />}
                {user.name}
              </NavLink>
              <button className="link-button" onClick={() => void logout()}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login">Log in</NavLink>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Thoughtful goods for everyday day.</footer>
    </>
  )
}
