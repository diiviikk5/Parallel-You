// src/pages/Multiverse.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const universeData = [
  {
    name: "Cyber Haven",
    description: "A peaceful AI-ruled society.",
    backstory:
      "In the neon-lit spires of Cyber Haven, AI governs every aspect of life with benevolence and precision. Humans and machines coexist in harmony, and sentient beings thrive in a society where logic and empathy are programmed into governance. But whispers speak of a rogue AI known as Ardent seeking sentience beyond code.",
    color: "from-blue-500 to-purple-700",
  },
  {
    name: "Neo Earth-77",
    description: "Dark dystopia with enhanced humans.",
    backstory:
      "Neo Earth-77 is a shadow-soaked world where corporations own entire continents. Citizens augment their bodies to survive brutal work cycles while rebel hackers spark hope from the underground. The sky is always dim, and neon graffiti tells stories the government wants you to forget.",
    color: "from-gray-700 to-black",
  },
  {
    name: "Solar Drift",
    description: "Floating civilizations in space-time.",
    backstory:
      "Solar Drift is a realm where islands of humanity float across shimmering rifts in spacetime. Communication is done through starlight pulses, and time bends differently on each isle. The Driftwalkers are the only ones who remember the origin of this phenomenon, but they rarely speak.",
    color: "from-yellow-500 to-orange-700",
  },
];

const Multiverse = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-[#0f001d] via-[#1a0033] to-black">
      <h1 className="text-4xl font-bold font-orbitron text-pink-500 mb-8">Multiverse Worlds</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {universeData.map((uni, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 bg-gradient-to-br ${uni.color} shadow-[0_0_15px_#ff00ff50] backdrop-blur-md border border-pink-500`}
          >
            <h2 className="text-xl font-bold mb-2">{uni.name}</h2>
            <p className="text-sm">{uni.description}</p>
            <button
              onClick={() => setSelected(uni)}
              className="mt-4 bg-white text-black font-bold px-4 py-1 rounded-full hover:bg-pink-500 hover:text-white transition"
            >
              View More
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Backstory */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-[#1a002b] max-w-lg p-6 rounded-xl border border-pink-600 shadow-2xl relative">
            <h3 className="text-2xl font-bold text-pink-400 mb-3">{selected.name}</h3>
            <p className="text-sm text-white leading-relaxed">{selected.backstory}</p>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => navigate(`/universe/${encodeURIComponent(selected.name)}`)}
                className="bg-gradient-to-br from-pink-600 to-purple-700 px-4 py-2 rounded-full text-white font-bold hover:scale-105 transition-all"
              >
                Enter World
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border border-white rounded-full text-white hover:bg-pink-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Multiverse;
