import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Journal } from './pages/Journal';
import { Layout } from './components/layout/Layout';
import { supabase } from './lib/supabase';
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
          />
          <Route
            path="/journal"
            element={isAuthenticated ? <Journal /> : <Navigate to="/auth" />}
          />
          {/* Placeholder routes for future implementation */}
          <Route
            path="/calendar"
            element={
              <div className="container py-8">
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="mt-4 text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/analytics"
            element={
              <div className="container py-8">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="mt-4 text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="container py-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="mt-4 text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;