import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../features/cart/CartProvider'
import { products } from '../features/products/productData'
import { ProductCard } from './ProductCard'
it('renders a product and adds it to the cart', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard product={products[0]} />
      </CartProvider>
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { name: products[0].name })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /add to cart/i }))
  expect(JSON.parse(localStorage.getItem('mercado-claro-cart') ?? '[]')[0].quantity).toBe(1)
})
