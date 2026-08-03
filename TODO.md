# Task TODO — Professional Clerk UserButton Menu

## Steps

- [x] 1. Update `client/src/Home.jsx`
  - Added `useClerk` + `useNavigate` imports
  - Defined `userButtonAppearance` matching the light theme (rounded-2xl, white bg, soft shadow, hover states, consistent typography)
  - Added menu items: My Profile (/profile), Manage Account (open="manageAccount"), Sign Out (signOut + redirect /login)
- [x] 2. Create `client/src/pages/Profile.jsx`
  - Displays avatar, full name, email, joined date (formatted from user.createdAt), Clerk User ID
  - Same UserButton menu for consistency, protected by SignedIn in the route
- [x] 3. Update `client/src/App.jsx`
  - Added `ProtectedRoute` wrapper and protected `/profile` route
- [x] 4. Verify build (no lint/syntax errors)
  - `npm run build` passed (88 modules, ✓ built in 1.15s)
  - `npm run lint` passed with no reported errors

## Complete ✅
