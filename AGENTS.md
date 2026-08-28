# Development rules

- Keep this client-side React prototype simple; no backend or unnecessary layers.
- Prefer focused components and native React state. Context is only for auth and cart.
- Explain non-obvious React mechanisms with concise educational comments.
- Never expose OAuth secrets; only public Supabase config may use `VITE_*` variables.
- Run `npm run build` and `npm test` after changes.
