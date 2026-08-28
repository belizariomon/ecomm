import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProductCard } from '../components/ProductCard'
import { getProduct, products } from '../features/products/productData'
import { useCart } from '../features/cart/CartProvider'
import { useAuth } from '../features/auth/AuthProvider'
import type { Category } from '../types'
import { useState, type ReactNode } from 'react'

const money = (n: number) => `$${n.toFixed(2)}`
function Catalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'All' | Category>('All')
  const [sort, setSort] = useState('default')
  // useState suits these small, page-local filter controls; they do not need app-wide Context.
  const list = products
    .filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0))
  return (
    <section>
      <div className="page-title">
        <p className="eyebrow">The everyday collection</p>
        <h1>Small things, well made.</h1>
      </div>
      <div className="filters">
        <label>
          Search
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'All' | Category)}
          >
            <option>All</option>
            {['Home', 'Office', 'Travel', 'Wellness'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <p className="results">{list.length} products</p>
      <div className="grid">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Designed for daily life</p>
          <h1>Objects that make room for what matters.</h1>
          <p>Considered essentials for your home, desk and journeys.</p>
          <a className="button" href="/products">
            Explore the collection
          </a>
        </div>
      </section>
      <Catalog />
    </>
  )
}
function Detail() {
  const { id = '' } = useParams()
  const product = getProduct(id)
  const { add } = useCart()
  if (!product) return <Navigate to="/products" replace />
  return (
    <section className="detail">
      <img src={product.image} alt="" />
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong className="price">{money(product.price)}</strong>
        <p>{product.stock} in stock</p>
        <button onClick={() => add(product)}>Add to cart</button>
      </div>
    </section>
  )
}
function Cart() {
  const { items, dispatch, total } = useCart()
  if (!items.length)
    return (
      <section className="empty">
        <h1>Your cart is waiting.</h1>
        <p>Add a few things you love.</p>
        <a className="button" href="/products">
          Browse products
        </a>
      </section>
    )
  return (
    <section className="cart">
      <h1>Your cart</h1>
      {items.map((item) => (
        <article className="cart-item" key={item.id}>
          <img src={item.image} alt="" />
          <div>
            <h2>{item.name}</h2>
            <p>{money(item.price)}</p>
            <div>
              <button
                aria-label={`Decrease ${item.name}`}
                onClick={() => dispatch({ type: 'DECREASE', id: item.id })}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                aria-label={`Increase ${item.name}`}
                onClick={() => dispatch({ type: 'INCREASE', id: item.id })}
              >
                +
              </button>
              <button
                className="link-button"
                onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
              >
                Remove
              </button>
            </div>
          </div>
          <strong>{money(item.price * item.quantity)}</strong>
        </article>
      ))}
      <aside className="summary">
        <p>
          Subtotal <strong>{money(total)}</strong>
        </p>
        <p>
          Shipping <strong>Free</strong>
        </p>
        <h2>
          Total <strong>{money(total)}</strong>
        </h2>
        <a className="button" href="/checkout">
          Checkout
        </a>
        <button className="link-button" onClick={() => dispatch({ type: 'CLEAR' })}>
          Clear cart
        </button>
      </aside>
    </section>
  )
}
function Login() {
  const { user, login, error, loading } = useAuth()
  const navigate = useNavigate()
  if (user) return <Navigate to="/profile" replace />
  if (loading)
    return (
      <section className="auth">
        <p>Checking your session…</p>
      </section>
    )
  const providers = [
    ['google-oauth2', 'Google'],
    ['facebook', 'Facebook'],
    ['windowslive', 'Microsoft'],
  ] as const
  return (
    <section className="auth">
      <p className="eyebrow">Welcome back</p>
      <h1>Sign in to continue</h1>
      <p>Use the account you prefer. In demo mode, any option signs you in locally.</p>
      {providers.map(([id, name]) => (
        <button
          key={id}
          className="oauth"
          onClick={async () => {
            await login(id)
            navigate('/profile')
          }}
        >
          Continue with {name}
        </button>
      ))}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}
function Profile() {
  const { user, loading } = useAuth()
  if (loading)
    return (
      <section className="auth">
        <p>Loading your profile…</p>
      </section>
    )
  return user ? (
    <section className="auth">
      <p className="eyebrow">Your account</p>
      {user.avatar && <img className="profile-avatar" src={user.avatar} alt="" />}
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </section>
  ) : (
    <Navigate to="/login" replace />
  )
}
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading)
    return (
      <section className="auth">
        <p>Checking your session…</p>
      </section>
    )
  return user ? <>{children}</> : <Navigate to="/login" replace />
}
function Checkout() {
  const { items, total, dispatch } = useCart()
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)
  if (orderId) return <Navigate to="/order-success" state={{ orderId }} replace />
  if (!items.length) return <Navigate to="/cart" replace />
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (!data.get('name') || !data.get('email') || !data.get('address')) {
      setError('Please complete your shipping details.')
      return
    }
    setOrderId(`MC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
    dispatch({ type: 'CLEAR' })
  }
  return (
    <section className="checkout">
      <form onSubmit={submit}>
        <p className="eyebrow">Checkout</p>
        <h1>Shipping details</h1>
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Address
          <input name="address" required />
        </label>
        <label>
          City
          <input name="city" required />
        </label>
        {error && <p role="alert">{error}</p>}
        <button>Place order · {money(total)}</button>
      </form>
      <aside className="summary">
        <h2>Order summary</h2>
        {items.map((item) => (
          <p key={item.id}>
            {item.quantity} × {item.name} <strong>{money(item.price * item.quantity)}</strong>
          </p>
        ))}
        <h2>
          Total <strong>{money(total)}</strong>
        </h2>
      </aside>
    </section>
  )
}
function Success() {
  const location = useLocation()
  const orderId = (location.state as { orderId?: string } | null)?.orderId
  return (
    <section className="empty">
      <p className="eyebrow">Order confirmed</p>
      <h1>Thank you for your order.</h1>
      <p>
        {orderId
          ? `Order ${orderId} is being prepared.`
          : 'We will send your delivery details shortly.'}
      </p>
      <a className="button" href="/products">
        Keep shopping
      </a>
    </section>
  )
}
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Catalog />} />
        <Route path="/products/:id" element={<Detail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-success" element={<Success />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
