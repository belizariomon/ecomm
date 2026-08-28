import type { CartItem, Product } from '../../types'
export type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'INCREASE'; id: string }
  | { type: 'DECREASE'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' }

type CartHandler<Action extends CartAction> = (state: CartItem[], action: Action) => CartItem[]

// It's easier to read and makes the code cleaner if you use a mapper instead of a switch case.
const cartHandlers = {
  ADD_ITEM: (state, action) => {
    const existing = state.find((item) => item.id === action.product.id)

    if (!existing) return [...state, { ...action.product, quantity: 1 }]

    return state.map((item) =>
      item.id === action.product.id && item.quantity < item.stock
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    )
  },
  INCREASE: (state, action) =>
    state.map((item) =>
      item.id === action.id && item.quantity < item.stock
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    ),
  DECREASE: (state, action) =>
    state.flatMap((item) =>
      item.id !== action.id
        ? item
        : item.quantity === 1
          ? []
          : [{ ...item, quantity: item.quantity - 1 }],
    ),
  REMOVE: (state, action) => state.filter((item) => item.id !== action.id),
  CLEAR: () => [],
} satisfies {
  [Type in CartAction['type']]: CartHandler<Extract<CartAction, { type: Type }>>
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  return cartHandlers[action.type](state, action as never)
}
