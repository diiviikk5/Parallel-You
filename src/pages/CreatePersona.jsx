// src/pages/CreatePersona.jsx
import { useState, useEffect } from "react";
import supabase from "../supabaseclient";
import PersonaCard from "../components/PersonaCard";

const CreatePersona = () => {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [description, setDescription] = useState("");
  const [personas, setPersonas] = useState([]);

  // Fetch existing personas
  const fetchPersonas = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) return;
  
    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", user.id)
      .is("universe", null) // ← Exclude multiverse-linked personas
      .order("created_at", { ascending: false });
  
    if (error) console.error("❌ Error fetching personas:", error);
    else setPersonas(data);
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  // Create a new persona
  const handleCreate = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("personas").insert([
      {
        name,
        greeting,
        description,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("❌ Error creating persona:", error);
    } else {
      setName("");
      setGreeting("");
      setDescription("");
      fetchPersonas();
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-gradient-to-br from-[#0f001d] via-[#1a0033] to-black font-sans">
      <h2 className="text-4xl font-bold text-pink-400 mb-8 animate-pulse drop-shadow-[0_0_15px_#ff00ff60] font-orbitron">
        Create Your Persona
      </h2>

      <form
        onSubmit={handleCreate}
        className="space-y-6 bg-[#1a001f]/70 p-6 rounded-2xl border border-pink-500 shadow-[0_0_25px_#ff00ff60] max-w-xl"
      >
        <input
          type="text"
          value={name}
          placeholder="👤 Persona Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg bg-black text-white border border-pink-500 focus:outline-none placeholder:text-pink-300"
          required
        />
        <textarea
          value={greeting}
          placeholder="💬 Greeting (e.g., 'Hey, I’m Zeta from the Voidverse!')"
          onChange={(e) => setGreeting(e.target.value)}
          className="w-full p-3 rounded-lg bg-black text-white border border-pink-500 focus:outline-none placeholder:text-pink-300"
          rows={3}
          required
        />
        <textarea
          value={description}
          placeholder="📜 Persona Backstory / Description (optional)"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-lg bg-black text-white border border-pink-500 focus:outline-none placeholder:text-pink-300"
          rows={4}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-600 to-purple-700 hover:scale-105 transform transition px-6 py-3 rounded-lg text-white font-bold shadow-[0_0_15px_#ff00ff80] animate-glow"
        >
          ✨ Create Persona
        </button>
      </form>

      {personas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {personas.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatePersona;
