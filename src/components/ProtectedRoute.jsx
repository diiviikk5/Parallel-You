// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseclient";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    // Listen for session changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // Cleanup on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="text-white p-4">Loading...</div>;

  if (!session) return <Navigate to="/auth" replace />;

  return children;
};

export default ProtectedRoute;
