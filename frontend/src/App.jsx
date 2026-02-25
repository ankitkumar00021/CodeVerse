import { useUser, useAuth } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import toast from "react-hot-toast";
import { setupAxiosInterceptor } from "./lib/axios";
import axiosInstance from "./lib/axios";

function App() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();

  // Setup axios interceptor with getToken on component mount
  useEffect(() => {
    setupAxiosInterceptor(getToken);
  }, [getToken]);

  // Sync user to database when they sign in
  useEffect(() => {
    if (isSignedIn && user) {
      const syncUser = async () => {
        try {
          console.log("Attempting to sync user:", user.emailAddresses?.[0]?.emailAddress);
          
          const token = await getToken();
          console.log("Clerk token obtained:", token?.substring(0, 20) + "...");

          const response = await axiosInstance.post(
            "/chat/sync-user",
            {
              name: user.fullName || user.username || "User",
              email: user.emailAddresses?.[0]?.emailAddress,
              image: user.imageUrl,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("User synced successfully:", response.data);
          toast.success("User synced to database!");
        } catch (error) {
          console.error("Error syncing user:", error);
          console.error("Error response data:", error.response?.data);
          toast.error("Failed to sync user: " + (error.response?.data?.message || error.message));
        }
      };

      syncUser();
    }
  }, [isSignedIn, user, getToken]);

  // Show loading spinner while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60 font-medium">Loading CodeVerse...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
