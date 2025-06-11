// src/pages/Setting.jsx
import { useEffect, useState } from "react";
import supabase from "../supabaseclient";

const Setting = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");

  // Fetch current user and their settings
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        setStatus("❌ Not logged in");
        return;
      }

      const { id, email } = session.user;
      setEmail(email);
      setUserId(id);

      const { data, error: fetchError } = await supabase
        .from("users")
        .select("username")
        .eq("id", id)
        .single();

      if (!fetchError && data) {
        setUsername(data.username || "");
      }
    };

    fetchUserData();
  }, []);

  // Save user settings to DB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    const { error } = await supabase
      .from("users")
      .upsert({ id: userId, username });

    if (error) {
      console.error("❌ Save error:", error);
      setStatus("❌ Failed to save.");
    } else {
      setStatus("✅ Saved successfully!");
    }
  };

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-[#0f001d] via-[#1a0033] to-black font-sans">
      <h1 className="text-4xl font-bold font-orbitron text-pink-500 mb-8">
        Settings
      </h1>

      <div className="bg-[#1a001f]/70 border border-pink-500 rounded-2xl p-8 max-w-3xl mx-auto shadow-[0_0_15px_#ff00ff50] backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-pink-300 mb-6">
          Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-pink-200 mb-1">Display Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-4 py-2 bg-[#2e003f]/80 border border-pink-500 rounded-md text-white focus:outline-none placeholder-pink-300"
              required
            />
          </div>

          {/* Email Display (readonly) */}
          <div>
            <label className="block text-pink-200 mb-1">Your Email</label>
            <input
              type="text"
              value={email}
              readOnly
              className="w-full px-4 py-2 bg-[#2e003f]/60 border border-pink-500 rounded-md text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 transition-colors px-6 py-2 rounded-xl text-white font-bold"
          >
            Save Settings
          </button>

          {/* Save status */}
          {status && <p className="text-sm mt-2 text-pink-300">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default Setting;
