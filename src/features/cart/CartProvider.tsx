import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../../types'
import { cartReducer, type CartAction } from './cartReducer'
type Value = {
  items: CartItem[]
  add: (product: Product) => void
  dispatch: Dispatch<CartAction>
  count: number
  total: number
}
const CartContext = createContext<Value | null>(null)
const key = 'mercado-claro-cart'
const initialCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}
// Context shares cart state across unrelated route components, avoiding prop drilling.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, initialCart)
  // useEffect synchronizes state with localStorage, a browser API outside React's state system.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items))
  }, [items])
  return (
    <CartContext.Provider
      value={{
        items,
        dispatch,
        add: (product) => dispatch({ type: 'ADD_ITEM', product }),
        count: items.reduce((n, item) => n + item.quantity, 0),
        total: items.reduce((n, item) => n + item.price * item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
// Kept beside its provider so this small feature has one obvious public entry point.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
