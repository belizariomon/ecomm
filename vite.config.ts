import { defineConfig } from 'vite'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const githubPagesBase =
  process.env.GITHUB_ACTIONS === 'true' && repositoryName ? `/${repositoryName}/` : '/'

export default defineConfig({
  // GitHub Pages project sites are served from /<repository>/ rather than the domain root.
  // Vite uses this base to generate asset URLs that work both in Pages and local development.
  base: githubPagesBase,
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: true },
})
