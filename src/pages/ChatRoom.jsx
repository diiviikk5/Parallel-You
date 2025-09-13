// src/pages/ChatRoom.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseclient";

// ==================== GLITCH TEXT COMPONENT ====================
const GlitchText = ({ children, className = "", intensity = 1, color = "pink" }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const startGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    };

    const interval = setInterval(startGlitch, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const colorMap = {
    pink: { primary: '#ff00ff', secondary: '#00ffff', tertiary: '#ffff00' },
    blue: { primary: '#00ffff', secondary: '#0080ff', tertiary: '#ffffff' },
    red: { primary: '#ff0000', secondary: '#ff4040', tertiary: '#ffaa00' },
    green: { primary: '#00ff80', secondary: '#40ff99', tertiary: '#80ffcc' },
    purple: { primary: '#8000ff', secondary: '#a040ff', tertiary: '#c080ff' },
    yellow: { primary: '#ffff00', secondary: '#ffaa00', tertiary: '#ff8000' },
  };

  const colors = colorMap[color] || colorMap.pink;

  return (
    <div className={`relative ${className}`}>
      <span 
        className={`inline-block transition-all duration-150 ${
          isGlitching ? 'animate-pulse' : ''
        }`}
        style={{
          textShadow: isGlitching 
            ? `${intensity}px 0 ${colors.primary}, -${intensity}px 0 ${colors.secondary}, 0 ${intensity}px ${colors.tertiary}`
            : 'none',
          transform: isGlitching 
            ? `translateX(${Math.random() * 4 - 2}px) translateY(${Math.random() * 2 - 1}px)`
            : 'none'
        }}
      >
        {children}
      </span>
      {isGlitching && (
        <>
          <span 
            className="absolute inset-0 opacity-70"
            style={{
              color: colors.primary,
              transform: `translateX(${Math.random() * 6 - 3}px)`,
              clipPath: 'inset(0 0 50% 0)'
            }}
          >
            {children}
          </span>
          <span 
            className="absolute inset-0 opacity-70"
            style={{
              color: colors.secondary,
              transform: `translateX(${Math.random() * 6 - 3}px)`,
              clipPath: 'inset(50% 0 0 0)'
            }}
          >
            {children}
          </span>
        </>
      )}
    </div>
  );
};

// ==================== PARTICLE SYSTEM ====================
const ParticleSystem = ({ theme, count = 25 }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const frameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles based on theme
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * theme.particleSpeed,
      vy: (Math.random() - 0.5) * theme.particleSpeed,
      size: Math.random() * theme.particleSize + 1,
      opacity: Math.random() * 0.6 + 0.2,
      color: theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      shape: theme.particleShape,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += particle.pulseSpeed;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        const currentSize = particle.size * (0.8 + Math.sin(particle.pulse) * 0.4);
        const currentOpacity = particle.opacity * (0.7 + Math.sin(particle.pulse) * 0.3);
        
        if (particle.shape === 'circle') {
          // Circle particles
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `${particle.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        } else if (particle.shape === 'diamond') {
          // Diamond particles
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.pulse);
          ctx.beginPath();
          ctx.moveTo(0, -currentSize);
          ctx.lineTo(currentSize, 0);
          ctx.lineTo(0, currentSize);
          ctx.lineTo(-currentSize, 0);
          ctx.closePath();
          ctx.fillStyle = `${particle.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
          ctx.restore();
        } else if (particle.shape === 'square') {
          // Square particles
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.pulse);
          ctx.fillStyle = `${particle.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fillRect(-currentSize, -currentSize, currentSize * 2, currentSize * 2);
          ctx.restore();
        }
      });
      
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [theme, count]);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: theme.particleBlendMode || 'screen' }}
    />
  );
};

// ==================== TYPING INDICATOR ====================
const TypingIndicator = ({ theme }) => {
  return (
    <div className={`flex items-center space-x-3 p-4 rounded-2xl max-w-xs ${theme.aiBubble} animate-pulse`}>
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: theme.typingColor,
              animationDelay: `${i * 0.2}s`,
              boxShadow: `0 0 8px ${theme.typingColor}80`
            }}
          />
        ))}
      </div>
      <span className="text-sm font-medium" style={{ color: theme.typingColor }}>
        {theme.typingText}
      </span>
    </div>
  );
};

// ==================== MESSAGE BUBBLE ====================
const MessageBubble = ({ message, theme, isUser }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`
        max-w-md px-6 py-4 rounded-2xl break-words transition-all duration-500 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isUser 
          ? `${theme.userBubble} self-end ml-auto` 
          : `${theme.aiBubble} self-start mr-auto`
        }
      `}
      style={{
        boxShadow: isUser ? theme.userShadow : theme.aiShadow,
        border: `1px solid ${isUser ? theme.userBorder : theme.aiBorder}`,
      }}
    >
      <div className="text-white font-medium leading-relaxed">
        {message.content}
      </div>
      
      {/* Message effects based on theme */}
      {theme.messageEffects && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          {theme.messageEffects === 'scan' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan" />
          )}
          {theme.messageEffects === 'glow' && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
};

// ==================== UNIVERSE THEMES ====================
const universeThemes = {
  // CYBERPUNK NEON (Default for user personas)
  default: {
    name: "Neural Interface",
    bg: "from-[#0a0015] via-[#1a0030] to-black",
    overlay: "bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,0,255,0.03)_2px,rgba(255,0,255,0.03)_4px)]",
    userBubble: "bg-gradient-to-br from-pink-600/80 to-purple-600/80 backdrop-blur-sm",
    aiBubble: "bg-gradient-to-br from-purple-700/80 to-indigo-700/80 backdrop-blur-sm",
    userBorder: "#ff00ff80",
    aiBorder: "#8000ff80",
    userShadow: "0 0 20px #ff00ff80",
    aiShadow: "0 0 20px #8000ff80",
    inputBg: "bg-black/40 border-pink-500/50",
    inputFocus: "border-pink-400 shadow-[0_0_20px_#ff00ff40]",
    buttonBg: "bg-gradient-to-r from-pink-600 to-purple-600",
    buttonHover: "hover:from-pink-700 hover:to-purple-700",
    headerColor: "text-pink-400",
    accentColor: "#ff00ff",
    typingColor: "#ff00ff",
    typingText: "Processing neural patterns...",
    particleColors: ["#ff00ff", "#00ffff", "#ff0080", "#8000ff"],
    particleSpeed: 0.3,
    particleSize: 3,
    particleShape: "circle",
    particleBlendMode: "screen",
    messageEffects: "scan",
    glitchColor: "pink",
  },

  // CYBER HAVEN - AI Utopia
  "Cyber Haven": {
    name: "Digital Paradise",
    bg: "from-[#001122] via-[#003366] to-[#000011]",
    overlay: "bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.1),transparent_70%)]",
    userBubble: "bg-gradient-to-br from-cyan-500/70 to-blue-600/70 backdrop-blur-md",
    aiBubble: "bg-gradient-to-br from-blue-800/70 to-indigo-800/70 backdrop-blur-md",
    userBorder: "#00ffff60",
    aiBorder: "#0080ff60",
    userShadow: "0 0 25px #00ffff80, 0 0 50px #00ffff40",
    aiShadow: "0 0 25px #0080ff80, 0 0 50px #0080ff40",
    inputBg: "bg-black/30 border-cyan-500/50",
    inputFocus: "border-cyan-300 shadow-[0_0_25px_#00ffff60]",
    buttonBg: "bg-gradient-to-r from-cyan-500 to-blue-600",
    buttonHover: "hover:from-cyan-400 hover:to-blue-500",
    headerColor: "text-cyan-300",
    accentColor: "#00ffff",
    typingColor: "#00ffff",
    typingText: "AI consciousness synchronizing...",
    particleColors: ["#00ffff", "#0080ff", "#40c0ff", "#80e0ff"],
    particleSpeed: 0.2,
    particleSize: 4,
    particleShape: "diamond",
    particleBlendMode: "screen",
    messageEffects: "glow",
    glitchColor: "blue",
  },

  // NEO EARTH-77 - Dystopian Cyberpunk
  "Neo Earth-77": {
    name: "Corporate Wasteland",
    bg: "from-[#1a0000] via-[#330000] to-black",
    overlay: "bg-[repeating-linear-gradient(45deg,transparent,transparent_1px,rgba(255,0,0,0.05)_1px,rgba(255,0,0,0.05)_2px)]",
    userBubble: "bg-gradient-to-br from-red-600/80 to-orange-600/80 backdrop-blur-sm border border-red-500/30",
    aiBubble: "bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-red-400/20",
    userBorder: "#ff004080",
    aiBorder: "#666666",
    userShadow: "0 0 20px #ff0040, inset 0 0 10px #ff004040",
    aiShadow: "0 0 15px #66666680",
    inputBg: "bg-black/50 border-red-600/50",
    inputFocus: "border-red-400 shadow-[0_0_20px_#ff004080]",
    buttonBg: "bg-gradient-to-r from-red-600 to-orange-700",
    buttonHover: "hover:from-red-500 hover:to-orange-600",
    headerColor: "text-red-400",
    accentColor: "#ff0040",
    typingColor: "#ff4040",
    typingText: "Decrypting corporate data...",
    particleColors: ["#ff0000", "#ff4040", "#ff8080", "#cc0000"],
    particleSpeed: 0.5,
    particleSize: 2,
    particleShape: "square",
    particleBlendMode: "multiply",
    messageEffects: "scan",
    glitchColor: "red",
  },

  // SOLAR DRIFT - Golden Spaceways
  "Solar Drift": {
    name: "Stellar Pathways",
    bg: "from-[#2d1b00] via-[#5c3317] to-[#1a0f00]",
    overlay: "bg-[radial-gradient(circle_at_50%_50%,rgba(255,204,0,0.15),transparent_60%)]",
    userBubble: "bg-gradient-to-br from-yellow-500/70 to-orange-500/70 backdrop-blur-md border border-yellow-400/40",
    aiBubble: "bg-gradient-to-br from-orange-700/70 to-amber-800/70 backdrop-blur-md border border-orange-500/40",
    userBorder: "#ffcc0060",
    aiBorder: "#ff990040",
    userShadow: "0 0 25px #ffcc00, 0 0 50px #ffcc0040",
    aiShadow: "0 0 20px #ff9900, 0 0 40px #ff990040",
    inputBg: "bg-black/40 border-yellow-600/50",
    inputFocus: "border-yellow-400 shadow-[0_0_25px_#ffcc0060]",
    buttonBg: "bg-gradient-to-r from-yellow-500 to-orange-600",
    buttonHover: "hover:from-yellow-400 hover:to-orange-500",
    headerColor: "text-yellow-300",
    accentColor: "#ffcc00",
    typingColor: "#ffcc00",
    typingText: "Navigating stellar currents...",
    particleColors: ["#ffcc00", "#ff9900", "#ffaa00", "#ff6600"],
    particleSpeed: 0.4,
    particleSize: 5,
    particleShape: "circle",
    particleBlendMode: "screen",
    messageEffects: "glow",
    glitchColor: "yellow",
  },

  // QUANTUM VOID - Reality Bending
  "Quantum Void": {
    name: "Reality Nexus",
    bg: "from-[#0d0015] via-[#1a003d] to-[#000000]",
    overlay: "bg-[conic-gradient(from_0deg_at_center,transparent_0deg,rgba(128,0,255,0.1)_90deg,transparent_180deg)]",
    userBubble: "bg-gradient-to-br from-purple-600/60 to-violet-700/60 backdrop-blur-lg border border-purple-400/30",
    aiBubble: "bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-lg border border-indigo-500/30",
    userBorder: "#8000ff40",
    aiBorder: "#4000ff40",
    userShadow: "0 0 30px #8000ff, 0 0 60px #8000ff40",
    aiShadow: "0 0 25px #4000ff, 0 0 50px #4000ff40",
    inputBg: "bg-black/60 border-purple-600/40",
    inputFocus: "border-purple-400 shadow-[0_0_30px_#8000ff60]",
    buttonBg: "bg-gradient-to-r from-purple-600 to-indigo-700",
    buttonHover: "hover:from-purple-500 hover:to-indigo-600",
    headerColor: "text-purple-300",
    accentColor: "#8000ff",
    typingColor: "#a040ff",
    typingText: "Quantum thoughts materializing...",
    particleColors: ["#8000ff", "#a040ff", "#c080ff", "#4000ff"],
    particleSpeed: 0.1,
    particleSize: 6,
    particleShape: "diamond",
    particleBlendMode: "screen",
    messageEffects: "glow",
    glitchColor: "purple",
  },

  // CRYSTAL GARDENS - Harmonic Paradise
  "Crystal Gardens": {
    name: "Resonant Sanctuary",
    bg: "from-[#001a0d] via-[#003d20] to-[#000a05]",
    overlay: "bg-[radial-gradient(ellipse_at_center,rgba(0,255,128,0.12),transparent_65%)]",
    userBubble: "bg-gradient-to-br from-emerald-500/70 to-teal-600/70 backdrop-blur-md border border-emerald-400/50",
    aiBubble: "bg-gradient-to-br from-teal-700/70 to-green-800/70 backdrop-blur-md border border-teal-500/50",
    userBorder: "#00ff8060",
    aiBorder: "#00cc6650",
    userShadow: "0 0 25px #00ff80, 0 0 50px #00ff8040",
    aiShadow: "0 0 20px #00cc66, 0 0 40px #00cc6640",
    inputBg: "bg-black/30 border-emerald-500/50",
    inputFocus: "border-emerald-400 shadow-[0_0_25px_#00ff8060]",
    buttonBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
    buttonHover: "hover:from-emerald-400 hover:to-teal-500",
    headerColor: "text-emerald-300",
    accentColor: "#00ff80",
    typingColor: "#40ff99",
    typingText: "Harmonizing crystal frequencies...",
    particleColors: ["#00ff80", "#40ff99", "#80ffcc", "#00cc66"],
    particleSpeed: 0.15,
    particleSize: 4,
    particleShape: "diamond",
    particleBlendMode: "screen",
    messageEffects: "glow",
    glitchColor: "green",
  },

  // NIGHTMARE FORGE - Terror Realm
  "Nightmare Forge": {
    name: "Fear Manifestation",
    bg: "from-[#200000] via-[#400000] to-[#100000]",
    overlay: "bg-[repeating-conic-gradient(from_0deg_at_center,rgba(255,0,0,0.05)_0deg,transparent_30deg,rgba(255,0,0,0.05)_60deg)]",
    userBubble: "bg-gradient-to-br from-red-700/80 to-black/80 backdrop-blur-sm border border-red-500/60",
    aiBubble: "bg-gradient-to-br from-black/80 to-red-900/80 backdrop-blur-sm border border-red-600/40",
    userBorder: "#ff000080",
    aiBorder: "#800000",
    userShadow: "0 0 25px #ff0000, inset 0 0 15px #ff000040",
    aiShadow: "0 0 20px #800000, inset 0 0 10px #80000040",
    inputBg: "bg-black/70 border-red-700/60",
    inputFocus: "border-red-500 shadow-[0_0_30px_#ff000080]",
    buttonBg: "bg-gradient-to-r from-red-700 to-black",
    buttonHover: "hover:from-red-600 hover:to-gray-900",
    headerColor: "text-red-300",
    accentColor: "#ff0000",
    typingColor: "#ff4040",
    typingText: "Manifesting deepest fears...",
    particleColors: ["#ff0000", "#cc0000", "#ff4040", "#800000"],
    particleSpeed: 0.6,
    particleSize: 3,
    particleShape: "square",
    particleBlendMode: "multiply",
    messageEffects: "scan",
    glitchColor: "red",
  },
};

// ==================== MAIN CHATROOM COMPONENT ====================
const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [persona, setPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Determine theme
  const theme = persona?.universe && universeThemes[persona.universe] 
    ? universeThemes[persona.universe] 
    : universeThemes.default;

  // Fetch persona
  useEffect(() => {
    const fetchPersona = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("personas")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) {
          console.error("❌ Error fetching persona:", error);
        } else {
          setPersona(data);
        }
      } catch (error) {
        console.error("❌ Fetch persona error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPersona();
  }, [id]);

  // Fetch messages and subscribe
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("persona_id", id)
          .order("created_at", { ascending: true });
        
        if (error) {
          console.error("❌ Error fetching messages:", error);
        } else {
          setMessages(data);
        }
      } catch (error) {
        console.error("❌ Fetch messages error:", error);
      }
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

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

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
      const userInput = input;
      setInput("");
      await supabase.from("messages").insert([userMsg]);
      setIsTyping(true);

      // Enhanced prompt based on universe
      const universeContext = persona?.universe 
        ? `You are in the universe of ${persona.universe}. Respond according to that world's atmosphere, technology level, and social structure.`
        : '';

      const prompt = `
${universeContext}

You are strictly roleplaying as a character named "${persona?.name}" from ${persona?.universe ? `the universe "${persona.universe}"` : 'an alternate reality'}.

Description: ${persona?.description || "No description provided."}
Greeting: ${persona?.greeting || "Hello there."}

🎭 You MUST stay fully in character as ${persona?.name}.
❌ You must NEVER say you're an AI, program, assistant, or chatbot.
✅ Always respond as ${persona?.name} would — with personality, emotions, and context from their universe.
🌌 Be conversational, engaging, and authentic to your character.
💬 The user is talking to you as another real person in your universe.

The user says: "${userInput}"

Reply as ${persona?.name} would, staying true to your character and universe.
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
        console.error("❌ Server returned error:", data);
        throw new Error(data.error || "AI request failed");
      }

      const reply = data.response;
      if (!reply) {
        throw new Error("AI did not respond.");
      }

      const aiMsg = {
        user_id: user.id,
        persona_id: id,
        content: reply,
        sender: "persona",
      };

      setMessages((prev) => [...prev, { ...aiMsg, id: Date.now() + 1 }]);
      setIsTyping(false);
      await supabase.from("messages").insert([aiMsg]);
    } catch (err) {
      console.error("❌ AI fetch failed:", err.message);
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: Date.now(),
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "system",
      }]);
    }
  };

  // Clear chat
  const clearChat = async () => {
    const confirmClear = window.confirm("Start a new conversation? This will clear all messages.");
    if (confirmClear) {
      try {
        const { error } = await supabase
          .from("messages")
          .delete()
          .eq("persona_id", id);
        
        if (error) {
          console.error("❌ Failed to clear chat:", error);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("❌ Clear chat error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.bg}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: theme.accentColor, borderTopColor: 'transparent' }} />
          <div className="text-white">Loading neural interface...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative bg-gradient-to-br ${theme.bg}`}>
      {/* Background Particle System */}
      <ParticleSystem theme={theme} count={30} />
      
      {/* Background Overlay */}
      <div className={`absolute inset-0 ${theme.overlay}`} />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
          >
            <div 
              className="w-8 h-8 rounded-full border flex items-center justify-center group-hover:shadow-lg transition-all"
              style={{ 
                borderColor: theme.accentColor, 
                boxShadow: `0 0 0 ${theme.accentColor}00`
              }}
            >
              ←
            </div>
            <span className="font-medium">Exit {theme.name}</span>
          </button>

          <div className="text-center">
            <GlitchText 
              className={`text-3xl md:text-4xl font-bold ${theme.headerColor}`}
              color={theme.glitchColor}
            >
              {persona?.name || "Loading..."}
            </GlitchText>
            <div className="text-white/60 text-sm mt-1">{theme.name}</div>
          </div>

          <button
            onClick={clearChat}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300 text-white
              ${theme.buttonBg} ${theme.buttonHover}
            `}
            style={{ boxShadow: `0 0 15px ${theme.accentColor}40` }}
          >
            New Chat
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.id || index}
              message={msg}
              theme={theme}
              isUser={msg.sender === "user"}
            />
          ))}

          {isTyping && <TypingIndicator theme={theme} />}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10 backdrop-blur-sm">
          <div className="flex gap-4 max-w-4xl mx-auto">
            <input
              type="text"
              className={`
                flex-1 px-6 py-4 rounded-2xl text-white placeholder-white/50 transition-all duration-300
                ${theme.inputBg} border backdrop-blur-sm
                focus:outline-none focus:${theme.inputFocus}
              `}
              placeholder={`Message ${persona?.name || 'persona'}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              className={`
                px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                ${theme.buttonBg} ${theme.buttonHover}
              `}
              style={{ boxShadow: `0 0 20px ${theme.accentColor}60` }}
            >
              {isTyping ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending</span>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Global Styles */}
      <style>
        {`
          @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default ChatRoom;
