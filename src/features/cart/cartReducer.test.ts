import { cartReducer } from './cartReducer'
import { products } from '../products/productData'
const product = products[0]
describe('cartReducer', () => {
  it('adds, changes quantities, removes and clears items', () => {
    const added = cartReducer([], { type: 'ADD_ITEM', product })
    expect(added[0].quantity).toBe(1)
    const raised = cartReducer(added, { type: 'INCREASE', id: product.id })
    expect(raised[0].quantity).toBe(2)
    const lowered = cartReducer(raised, { type: 'DECREASE', id: product.id })
    expect(lowered[0].quantity).toBe(1)
    expect(cartReducer(lowered, { type: 'REMOVE', id: product.id })).toEqual([])
    expect(cartReducer(added, { type: 'CLEAR' })).toEqual([])
  })
})
