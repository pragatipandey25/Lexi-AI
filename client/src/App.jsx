import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import AuthPage from "./pages/AuthPage";

const clerkReady = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

// Keeps already-authenticated users away from /login and /register.
function PublicOnlyRoute({ mode }) {
  return (
    <>
      <SignedOut>
        <AuthPage mode={mode} clerkReady />
      </SignedOut>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
    </>
  );
}

// The website's first screen: guests are sent to the Register page,
// signed-in users see the Home page.
function LandingRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/register" replace />
      </SignedOut>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          clerkReady ? (
            <LandingRoute>
              <Home />
            </LandingRoute>
          ) : (
            <AuthPage mode="register" />
          )
        }
      />
      <Route
        path="/login"
        element={
          clerkReady ? (
            <PublicOnlyRoute mode="login" />
          ) : (
            <AuthPage mode="login" />
          )
        }
      />
      <Route
        path="/register"
        element={
          clerkReady ? (
            <PublicOnlyRoute mode="register" />
          ) : (
            <AuthPage mode="register" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
