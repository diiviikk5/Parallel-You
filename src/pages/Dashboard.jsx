// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseclient';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [mood, setMood] = useState('');
  const [isMultiverseOn, setIsMultiverseOn] = useState(true);
  const [lastChat, setLastChat] = useState(null);
  const navigate = useNavigate();

  const moods = [
    'Cyberpunk', 'Neon Noir', 'Techno Mystic', 'Quantum Flux', 'Digital Dream',
    'Astral Core', 'Synthwave Pulse', 'Future Glitch', 'Lunar Echo', 'Solar Data'
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return navigate('/auth');

      const user = sessionData.session.user;

      const { data: userProfile } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();

      setUserData({
        id: user.id,
        email: user.email,
        username: userProfile?.username || 'Unknown User',
      });
    };

    fetchUser();
    setMood(moods[Math.floor(Math.random() * moods.length)]);
  }, [navigate]);

  useEffect(() => {
    const fetchRecentChat = async () => {
      if (!userData?.id) return;

      const { data, error } = await supabase
        .from('messages')
        .select('persona_id, content, sender, created_at')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data.length) {
        setLastChat(data[0]);
      }
    };

    fetchRecentChat();
  }, [userData]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f001d] via-[#1a0033] to-black text-white p-6 font-sans relative">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-500 opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-800 opacity-30 rounded-full blur-2xl z-0" />
      <div className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-3xl opacity-50 animate-spin-slow" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 z-10 bg-gradient-to-br from-red-500 to-pink-700 px-4 py-2 rounded-xl shadow-[0_0_20px_#ff006e] hover:scale-105 transition-all text-sm font-semibold"
      >
        Logout
      </button>

      {/* Header */}
      <h1 className="text-4xl font-bold text-white tracking-wider drop-shadow-[0_2px_12px_rgba(255,0,200,0.6)] z-10 mb-4 animate-pulse">
        Welcome to{' '}
        <span className="text-pink-400 animate-typing overflow-hidden whitespace-nowrap border-r-2 border-pink-500 pr-2">
          Parallel You
        </span>
      </h1>

      {/* User Info */}
      {userData && (
        <div className="text-sm text-gray-300 mb-6 z-10">
          Logged in as{' '}
          <span className="font-semibold text-white">{userData.username}</span>{' '}
          <span className="text-pink-300">({userData.email})</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 z-10 relative">
        <div className="bg-[#180020] p-4 rounded-2xl shadow-[0_0_25px_#aa00ff70] border border-purple-500 text-center hover:scale-105 transition-all">
          <h3 className="text-purple-400 font-orbitron mb-2">Your Username</h3>
          <p className="text-2xl font-semibold">{userData?.username}</p>
        </div>
        <div className="bg-[#180020] p-4 rounded-2xl shadow-[0_0_25px_#00ffff70] border border-cyan-500 text-center hover:scale-105 transition-all">
          <h3 className="text-cyan-300 font-orbitron mb-2">Active Mode</h3>
          <p className="text-xl font-semibold">{isMultiverseOn ? 'Multiverse' : 'Solo'}</p>
        </div>
        <div className="bg-[#180020] p-4 rounded-2xl shadow-[0_0_25px_#ff990070] border border-yellow-500 text-center hover:scale-105 transition-all">
          <h3 className="text-yellow-400 font-orbitron mb-2">Mood</h3>
          <p className="text-lg italic">{mood}</p>
        </div>
      </div>

      {/* Chat Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 z-10 relative">
        {/* Chat Card (Latest) */}
        <div className="col-span-2 bg-[#120017]/80 border border-pink-600 rounded-2xl p-6 space-y-4 shadow-[0_0_40px_#ff00ff80] backdrop-blur-md shiny">
          <h2 className="text-xl font-semibold text-pink-300 font-orbitron">🧠 Most Recent Chat</h2>

          {lastChat ? (
            <div
              onClick={() => navigate(`/chat/${lastChat.persona_id}`)}
              className="cursor-pointer p-4 bg-[#2e003f]/80 border border-pink-500 rounded-lg shadow-[0_0_15px_#ff00ff50] hover:bg-pink-600/30 transition"
            >
              <p className="text-sm text-white">
                <span className="text-pink-400 font-bold">{lastChat.sender === 'user' ? 'You' : 'AI'}:</span>{' '}
                {lastChat.content}
              </p>
              <p className="text-right text-xs text-pink-300 mt-2">Tap to continue</p>
            </div>
          ) : (
            <p className="text-pink-200">No recent chats found.</p>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Multiverse Toggle */}
          <div className="bg-[#1a001f]/70 border border-pink-500 rounded-2xl p-6 shadow-[0_0_20px_#ff00ff80] backdrop-blur-md shiny">
            <h2 className="text-xl font-semibold text-pink-300 font-orbitron mb-3">Multiverse Mode</h2>
            <div className="flex items-center justify-between">
              <span className="text-white">Toggle</span>
              <button
                onClick={() => {
                  const newState = !isMultiverseOn;
                  setIsMultiverseOn(newState);
                  if (newState) navigate('/multiverse');
                }}
                className={`w-16 h-8 rounded-full relative transition-colors duration-300 ${
                  isMultiverseOn ? 'bg-pink-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full absolute top-1 ${
                    isMultiverseOn ? 'right-1' : 'left-1'
                  } transition-all duration-300`}
                />
              </button>
            </div>
          </div>

          {/* Persona Card */}
          <div className="bg-[#1a001f]/70 border border-pink-500 rounded-2xl p-6 shadow-[0_0_20px_#ff00ff80] backdrop-blur-md shiny">
            <h2 className="text-xl font-semibold text-pink-300 font-orbitron mb-4">Your Persona</h2>
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4727/4727425.png"
                alt="Cyber Phantom"
                className="w-24 h-24 rounded-full border-4 border-pink-600 shadow-[0_0_20px_#ff00ff80]"
              />
              <span className="text-white font-medium text-lg mt-2">Cyber Phantom</span>
              <button
                onClick={() => navigate('/create-persona')}
                className="mt-4 text-pink-300 border border-pink-500 px-4 py-1 rounded-full hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_10px_#ff00ff80]"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
