# Task: Fix Clerk SignUp UI Not Rendering

## Steps

- [x] Replace `ClerkProviderWithRoutes` bridge in `main.jsx` with the exact requested `<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>`
- [x] Update `App.jsx` routing so the app opens directly on `/register` for guests
- [x] Update `AuthPage.jsx` to use Clerk default virtual routing so `<SignUp />` fully renders (name, email, password, continue, social, verification)
- [x] Verify changes (build / run dev server)
