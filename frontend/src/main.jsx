import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppWithoutAuth } from "./AppWithoutAuth.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("⚠️ Clerk Publishable Key is missing. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {PUBLISHABLE_KEY && PUBLISHABLE_KEY !== "your_clerk_publishable_key" ? (
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <App />
          </ClerkProvider>
        ) : (
          <AppWithoutAuth />
        )}
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
