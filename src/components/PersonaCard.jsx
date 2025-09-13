// src/components/PersonaCard.jsx
import { useNavigate } from "react-router-dom";

const PersonaCard = ({ persona }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#22002c] p-4 rounded-xl border border-pink-500 shadow-md">
      <h3 className="text-2xl font-bold text-pink-400">{persona.name}</h3>
      <p className="text-white mt-2">{persona.traits || "No traits set"}</p>
      <button
        onClick={() => navigate(`/chat/${persona.id}`)}
        className="mt-4 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-white"
      >
        Chat
      </button>
    </div>
  );
};

export default PersonaCard;
