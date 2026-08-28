import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'
import { AuthProvider } from '../features/auth/AuthProvider'
import { CartProvider } from '../features/cart/CartProvider'
import { products } from '../features/products/productData'
it('shows cart information at checkout and confirms an order', async () => {
  localStorage.setItem('mercado-claro-user', 'demo')
  localStorage.setItem('mercado-claro-cart', JSON.stringify([{ ...products[0], quantity: 1 }]))
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={['/checkout']}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  )
  expect(screen.getByText(/Linen Desk Lamp/)).toBeInTheDocument()
  await user.type(screen.getByLabelText('Name'), 'Sam')
  await user.type(screen.getByLabelText('Email'), 'sam@example.com')
  await user.type(screen.getByLabelText('Address'), 'River Road 1')
  await user.type(screen.getByLabelText('City'), 'Austin')
  await user.click(screen.getByRole('button', { name: /place order/i }))
  expect(await screen.findByText(/thank you for your order/i)).toBeInTheDocument()
})
