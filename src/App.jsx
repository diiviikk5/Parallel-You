
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./supabaseclient";

// Components
import Auth from "./components/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Multiverse from "./pages/Multiverse";
import CreatePersona from "./pages/CreatePersona";
import Settings from "./pages/Setting"; // Correct spelling
import ChatRoom from "./pages/ChatRoom"; // ✅ New import
import FuturisticDashboard from "./pages/futuristicdashboard"; 
import UniversePage from "./pages/UniversePage";
import Narrative from "./pages/Narrative";



function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Auth route */}
        <Route
          path="/auth"
          element={!session ? <Auth onLogin={() => setSession(true)} /> : <Navigate to="/" />}
        />

        {/* Protected Routes under Dashboard Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute session={session}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="multiverse" element={<Multiverse />} />
          <Route path="create-persona" element={<CreatePersona />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute session={session}>
              <ChatRoom />
            </ProtectedRoute>
          }
        />
        <Route
  path="/futuristic"
  element={
    <ProtectedRoute session={session}>
      <FuturisticDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/narrative"
  element={
    <ProtectedRoute session={session}>
      <Narrative />
    </ProtectedRoute>
  }
/>
<Route path="/universe/:name" element={<UniversePage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
