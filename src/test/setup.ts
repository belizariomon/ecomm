import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Tests use the explicitly separate demo mode so they never need a live OAuth project.
vi.stubEnv('VITE_AUTH_MODE', 'mock')
