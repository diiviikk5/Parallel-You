import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseclient';

const FuturisticDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        navigate('/auth');
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f001d] via-[#1a0033] to-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#12001e]/70 border-r border-pink-500 p-6 space-y-6 shadow-[4px_0_15px_#ff00ff50] backdrop-blur-md">
        <h1 className="text-2xl font-bold text-pink-400 font-orbitron">Parallel You</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-pink-300 hover:text-white transition"
        >
          ← Back to Dashboard
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-pink-400 mb-6 font-orbitron">Multiverse Control Center</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Simulation */}
          <section className="lg:col-span-2 bg-[#1a001f]/70 border border-pink-500 p-6 rounded-2xl shadow-[0_0_15px_#ff00ff50]">
            <h2 className="text-xl text-pink-300 font-semibold mb-4">Simulated Chat</h2>
            <div className="h-64 overflow-y-auto space-y-3">
              <div className="text-left bg-[#3d005b]/70 p-4 rounded-xl">
                I'm you, from the future.
              </div>
              <div className="text-right bg-[#2b0c36]/70 p-4 rounded-xl ml-auto">
                Who are you?!
              </div>
            </div>
          </section>

          {/* Persona Display */}
          <section className="bg-[#1a001f]/70 border border-pink-500 p-6 rounded-2xl shadow-[0_0_15px_#ff00ff50] text-center">
            <h2 className="text-xl text-pink-300 font-semibold mb-4">Cyber Phantom</h2>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4727/4727425.png"
              alt="Cyber Persona"
              className="w-24 h-24 mx-auto rounded-full border-4 border-pink-600 shadow-lg"
            />
            <p className="mt-3 text-lg font-medium">Your Future Self</p>
            <button className="mt-4 text-pink-300 border border-pink-500 px-4 py-1 rounded-full hover:bg-pink-500 hover:text-white transition">
              + Add
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FuturisticDashboard;
