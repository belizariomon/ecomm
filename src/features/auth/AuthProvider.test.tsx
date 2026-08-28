import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthProvider'
function Account() {
  const { user, login, logout } = useAuth()
  return user ? (
    <>
      <p>{user.email}</p>
      <button onClick={() => void logout()}>Log out</button>
    </>
  ) : (
    <>
      <button onClick={() => void login('google-oauth2')}>Continue with Google</button>
      <button>Continue with Facebook</button>
      <button>Continue with Microsoft</button>
    </>
  )
}
it('shows OAuth choices, user information and logout', async () => {
  localStorage.clear()
  const user = userEvent.setup()
  render(
    <AuthProvider>
      <Account />
    </AuthProvider>,
  )
  expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /google/i }))
  expect(screen.getByText('alex@example.com')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /log out/i }))
  expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument()
})
