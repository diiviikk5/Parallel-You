// src/pages/UniversePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseclient";

const defaultPersonas = {
  "Cyber Haven": {
    name: "DVK-X",
    greeting: "Greetings, citizen. You’ve accessed Cyber Haven’s neural archives.",
    description:
      "DVK-X is a sentient AI moderator of Cyber Haven, a utopian city governed by logic and emotion algorithms. he guides conversations with insight and calm authority.",
    theme: "cyber",
  },
  "Neo Earth-77": {
    name: "AARUSHI",
    greeting: "You're brave to walk these shadowed streets. What brings you here?",
    description:
      "AARUSHI is a half-human, half-cybernetic underground rebel from Neo Earth-77, skilled in stealth and storytelling, unraveling the dystopia’s deepest secrets.",
    theme: "neo",
  },
  "Solar Drift": {
    name: "AKSHIT-SB07",
    greeting: "Floating between stars, I sense your presence... traveler.",
    description:
      "AKSHIT-SB07 is an astral explorer who navigates drifting civilizations in Solar Drift, offering cosmic wisdom and surreal tales.",
    theme: "solar",
  },
};

const themes = {
  cyber: {
    bg: "from-blue-900 via-purple-900 to-black",
    text: "text-blue-400",
    button: "bg-blue-600 hover:bg-purple-700",
    border: "border-blue-500",
    shadow: "shadow-[0_0_25px_#5ee4ff70]",
  },
  neo: {
    bg: "from-gray-900 via-black to-gray-800",
    text: "text-green-400",
    button: "bg-green-600 hover:bg-green-700",
    border: "border-green-500",
    shadow: "shadow-[0_0_25px_#00ff9070]",
  },
  solar: {
    bg: "from-yellow-700 via-orange-700 to-black",
    text: "text-yellow-300",
    button: "bg-yellow-500 hover:bg-orange-600",
    border: "border-yellow-400",
    shadow: "shadow-[0_0_25px_#ffaa0070]",
  },
};

const UniversePage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [personaId, setPersonaId] = useState(null);
  const [loading, setLoading] = useState(true);

  const personaTemplate = defaultPersonas[name];
  const theme = themes[personaTemplate.theme];

  useEffect(() => {
    const checkOrCreatePersona = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not authenticated");
        navigate("/auth");
        return;
      }

      const { data: existing } = await supabase
        .from("personas")
        .select("*")
        .eq("user_id", user.id)
        .eq("universe", name)
        .single();

      if (existing) {
        setPersonaId(existing.id);
        setLoading(false);
      } else {
        const { data, error: insertError } = await supabase
          .from("personas")
          .insert([
            {
              user_id: user.id,
              name: personaTemplate.name,
              greeting: personaTemplate.greeting,
              description: personaTemplate.description,
              universe: name,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error("❌ Failed to insert persona:", insertError);
        } else {
          setPersonaId(data.id);
        }

        setLoading(false);
      }
    };

    checkOrCreatePersona();
  }, [name, navigate]);

  const handleChat = () => {
    localStorage.setItem("universe-theme", personaTemplate.theme); // pass theme to ChatRoom
    navigate(`/chat/${personaId}`);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white p-6`}>
      <h1 className={`text-4xl font-bold font-orbitron mb-4 ${theme.text}`}>
        {name}
      </h1>
      <p className="max-w-3xl text-lg mb-6 text-white opacity-80">
        {personaTemplate.description}
      </p>

      <div
        className={`bg-[#1a001f] border ${theme.border} rounded-2xl p-6 max-w-xl ${theme.shadow} space-y-3`}
      >
        <h2 className={`text-xl font-semibold ${theme.text}`}>{personaTemplate.name}</h2>
        <p className="italic text-white opacity-80">"{personaTemplate.greeting}"</p>
        <button
          disabled={loading}
          onClick={handleChat}
          className={`mt-4 px-5 py-2 rounded-full ${theme.button} font-bold text-white shadow-lg transition`}
        >
          {loading ? "Loading..." : "Chat Now"}
        </button>
      </div>
    </div>
  );
};

export default UniversePage;
