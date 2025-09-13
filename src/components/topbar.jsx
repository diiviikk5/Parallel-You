// src/components/Topbar.jsx
import { useEffect, useState } from "react";
import supabase from "../supabaseclient";

const Topbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  return (
    <div className="bg-[#1a001f] text-white px-6 py-3 flex justify-end items-center border-b border-pink-600 shadow">
      <span className="text-pink-400 text-sm font-neon">
        {user?.user_metadata?.full_name || user?.email || "Welcome!"}
      </span>
    </div>
  );
};

export default Topbar;
