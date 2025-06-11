import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseclient";

// Universe themes
const universeThemes = {
  "Cyber Haven": {
    bg: "from-[#001f3f] via-[#002f4f] to-[#001428]",
    userBubble: "bg-blue-500 shadow-blue-500/50",
    aiBubble: "bg-purple-700 shadow-purple-500/50",
    border: "border-blue-500",
    accent: "bg-blue-500 hover:bg-blue-600",
    pulse: "text-blue-400",
  },
  "Neo Earth-77": {
    bg: "from-[#111111] via-[#1a1a1a] to-black",
    userBubble: "bg-rose-600 shadow-rose-500/50",
    aiBubble: "bg-gray-800 shadow-gray-500/50",
    border: "border-rose-600",
    accent: "bg-rose-600 hover:bg-rose-700",
    pulse: "text-rose-400",
  },
  "Solar Drift": {
    bg: "from-[#3b2400] via-[#ff9f1c] to-[#662200]",
    userBubble: "bg-yellow-500 shadow-yellow-400/50",
    aiBubble: "bg-orange-700 shadow-orange-500/50",
    border: "border-yellow-500",
    accent: "bg-yellow-500 hover:bg-yellow-600",
    pulse: "text-yellow-300",
  },
};

// Default for user personas
const defaultTheme = {
  bg: "from-[#0f001d] via-[#1a0033] to-black",
  userBubble: "bg-pink-600 shadow-pink-500/50",
  aiBubble: "bg-purple-700 shadow-purple-500/50",
  border: "border-pink-500",
  accent: "bg-pink-600 hover:bg-pink-700",
  pulse: "text-pink-400",
};

const ChatRoom = () => {
  const { id } = useParams();
  const [persona, setPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  // Fetch persona
  useEffect(() => {
    const fetchPersona = async () => {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error("❌ Error fetching persona:", error);
      else setPersona(data);
    };
    fetchPersona();
  }, [id]);

  // Fetch messages and subscribe
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("persona_id", id)
        .order("created_at", { ascending: true });
      if (error) console.error("❌ Error fetching messages:", error);
      else setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("message-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new;
          if (String(newMsg.persona_id) === String(id)) {
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === newMsg.id);
              return exists ? prev : [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("❌ User not authenticated");
      return;
    }

    const userMsg = {
      user_id: user.id,
      persona_id: id,
      content: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, { ...userMsg, id: Date.now() }]);
    setInput("");
    await supabase.from("messages").insert([userMsg]);
    setIsTyping(true);

    try {
      const prompt = `
You are strictly roleplaying as a character named "${persona?.name}" from an alternate universe.

Description: ${persona?.description || "No description provided."}
Greeting: ${persona?.greeting || "Hello there."}

🎭 You MUST stay fully in character.
❌ You must NEVER say you're an AI, program, assistant, or chatbot.
✅ Always respond as ${persona?.name} would — with personality, context, and emotions from their universe.
💬 The user is engaging with you as another real person.
🌌 Speak casually, with charm, curiosity, or humor — behave fully like a real entity.

Now, the user says: "${input}"

Reply as ${persona?.name} would.
`;

const res = await fetch("http://localhost:3001/api/ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt, persona }),
});

let data;
try {
  data = await res.json();
} catch (err) {
  console.error("❌ Failed to parse response JSON", err);
  throw new Error("Invalid server response format");
}

if (!res.ok) {
  const detailedError = typeof data.error === "object"
    ? JSON.stringify(data.error)
    : data.error || "Unknown error";
  console.error("❌ Server returned error:", JSON.stringify(data, null, 2));
throw new Error(data.error || JSON.stringify(data));

}


const reply = data.response;

if (!reply) {
  console.error("❌ No reply field in backend response:", data);
  throw new Error("AI did not respond.");
}


      const aiMsg = {
        user_id: user.id,
        persona_id: id,
        content: reply,
        sender: "persona",
      };

      setMessages((prev) => [...prev, { ...aiMsg, id: Date.now() }]);
      setIsTyping(false);
      await supabase.from("messages").insert([aiMsg]);
    } catch (err) {
      console.error("❌ AI fetch failed:", err.message);
      setIsTyping(false);
    }
  };

  const theme =
    persona?.universe && universeThemes[persona.universe]
      ? universeThemes[persona.universe]
      : defaultTheme;

  return (
    <div className={`min-h-screen flex flex-col p-6 font-sans text-white bg-gradient-to-br ${theme.bg}`}>
      {/* Character Name */}
      <h2 className={`text-3xl font-bold mb-4 drop-shadow-lg ${theme.pulse}`}>
        {persona?.name}
      </h2>

      {/* New Chat for Universe Personas */}
      {persona?.universe && (
        <button
          onClick={async () => {
            const confirmClear = window.confirm("Start a new chat with this persona?");
            if (confirmClear) {
              const { error } = await supabase
                .from("messages")
                .delete()
                .eq("persona_id", id);
              if (error) {
                console.error("❌ Failed to clear chat:", error);
              } else {
                setMessages([]);
              }
            }
          }}
          className={`mb-4 self-end px-4 py-2 text-sm rounded-full text-white shadow ${theme.accent}`}
        >
          + New Chat
        </button>
      )}

      {/* Chat Window */}
      <div className={`flex-1 overflow-y-auto bg-black/30 p-4 rounded-lg space-y-3 border ${theme.border} shadow-xl`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-md px-4 py-3 rounded-xl break-words transition-all duration-300 transform ${
              msg.sender === "user"
                ? `${theme.userBubble} self-end ml-auto`
                : `${theme.aiBubble} self-start mr-auto`
            }`}
          >
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className={`flex items-center space-x-2 text-sm ${theme.pulse} animate-pulse ml-2`}>
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-current animate-bounce delay-100" />
            <span className="w-2 h-2 rounded-full bg-current animate-bounce delay-200" />
            <span>Typing...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex">
        <input
          type="text"
          className={`flex-1 p-3 rounded-l-lg bg-black border ${theme.border} text-white focus:outline-none placeholder:text-gray-400`}
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className={`px-6 rounded-r-lg text-white font-bold transition-all ${theme.accent}`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
