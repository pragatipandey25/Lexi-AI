import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import App from "./App";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Clerk React Router integration: bridge Clerk's internal navigation
// with react-router so Clerk components (SignIn/SignUp) work with
// routing="path" and redirects land on the correct routes.
function ClerkProviderWithRoutes({ children }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {publishableKey ? (
        <ClerkProviderWithRoutes>
          <App />
        </ClerkProviderWithRoutes>
      ) : (
        <App />
      )}
    </BrowserRouter>
  </React.StrictMode>,
);
