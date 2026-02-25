import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("⚠️ Clerk Publishable Key is missing. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
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

// Fallback component when Clerk is not configured
function AppWithoutAuth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center">
      <div className="max-w-md text-center p-8 bg-base-100/50 backdrop-blur rounded-2xl shadow-lg">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-base-content mb-2">Configuration Required</h1>
        <p className="text-base-content/70 mb-4">Please add your Clerk Publishable Key to the .env file:</p>
        <div className="bg-base-200 p-4 rounded-lg text-left text-sm font-mono mb-4">
          <p>VITE_CLERK_PUBLISHABLE_KEY=pk_live_...</p>
        </div>
        <p className="text-xs text-base-content/50">
          Get your key from <a href="https://dashboard.clerk.com" className="link">Clerk Dashboard</a>
        </p>
      </div>
    </div>
  );
}
