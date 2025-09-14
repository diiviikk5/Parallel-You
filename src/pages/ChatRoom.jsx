// src/pages/ChatRoom.jsx - FULL-SCREEN IMMERSIVE DESIGN
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseclient";
import { getAIResponse } from "../services/aiService";

// ==================== GLITCH TEXT COMPONENT ====================
const GlitchText = ({ children, className = "", intensity = 1, color = "pink" }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const startGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    };

    const interval = setInterval(startGlitch, 4000 + Math.random() * 3000);
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

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      color: theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += particle.pulseSpeed;
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        const currentSize = particle.size * (0.8 + Math.sin(particle.pulse) * 0.4);
        const currentOpacity = particle.opacity * (0.7 + Math.sin(particle.pulse) * 0.3);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
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
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// ==================== TYPING INDICATOR ====================
const TypingIndicator = ({ theme }) => {
  return (
    <div className="flex items-start space-x-4 mb-8 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">🤖</span>
      </div>
      <div className="flex-1 max-w-4xl">
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full animate-bounce"
                style={{
                  backgroundColor: theme.typingColor,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: `0 0 10px ${theme.typingColor}80`
                }}
              />
            ))}
            <span className="text-white/70 text-sm ml-4">
              {theme.typingText || 'Thinking...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== FULL-SCREEN MESSAGE BUBBLE ====================
const FullScreenMessage = ({ message, theme, isUser, character }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const messageLength = message.content.length;
  const isLongMessage = messageLength > 200;

  return (
    <div 
      className={`
        flex items-start space-x-4 mb-8 transition-all duration-500 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isUser ? 'flex-row-reverse space-x-reverse' : ''}
      `}
    >
      {/* Avatar */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser 
          ? 'bg-gradient-to-r from-pink-600 to-purple-600' 
          : 'bg-gradient-to-r from-purple-600 to-indigo-600'
        }
      `}>
        <span className="text-white font-bold text-sm">
          {isUser ? '👤' : (character?.avatar || '🤖')}
        </span>
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-none">
        <div className={`
          rounded-3xl p-6 backdrop-blur-sm border transition-all duration-300
          ${isUser 
            ? 'bg-gradient-to-br from-pink-600/20 to-purple-600/20 border-pink-500/20' 
            : 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20'
          }
          hover:border-opacity-40 hover:backdrop-blur-md
        `}
          style={{
            boxShadow: isUser 
              ? '0 8px 32px rgba(236, 72, 153, 0.1)' 
              : '0 8px 32px rgba(124, 58, 237, 0.1)',
          }}
        >
          {/* Message Header (for long messages) */}
          {isLongMessage && (
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div className="text-xs text-white/60">
                {messageLength} characters • {Math.ceil(messageLength / 500)} min read
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-white/60 hover:text-white/80 transition-colors"
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
          )}

          {/* Message Text */}
          <div className={`
            text-white leading-relaxed font-medium
            ${isLongMessage && !isExpanded ? 'line-clamp-4' : ''}
            prose prose-invert max-w-none
          `}>
            <div className="text-base md:text-lg" style={{ lineHeight: '1.7' }}>
              {message.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Expand Button (for collapsed long messages) */}
          {isLongMessage && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Read full message →
            </button>
          )}

          {/* Message Timestamp */}
          <div className="mt-4 pt-2 border-t border-white/5">
            <span className="text-xs text-white/40">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== UNIVERSE THEMES ====================
const universeThemes = {
  default: {
    name: "Neural Interface",
    bg: "from-[#0a0015] via-[#1a0030] to-black",
    overlay: "bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,0,255,0.03)_2px,rgba(255,0,255,0.03)_4px)]",
    particleColors: ["#ff00ff", "#00ffff", "#ff0080", "#8000ff"],
    accentColor: "#ff00ff",
    typingColor: "#ff00ff",
    typingText: "Processing neural patterns...",
  },
  'Cyber Haven': {
    name: "Digital Paradise",
    bg: "from-[#001122] via-[#003366] to-[#000011]",
    overlay: "bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.1),transparent_70%)]",
    particleColors: ["#00ffff", "#0080ff", "#40c0ff", "#80e0ff"],
    accentColor: "#00ffff",
    typingColor: "#00ffff",
    typingText: "AI consciousness synchronizing...",
  },
  'Neo Earth-77': {
    name: "Corporate Wasteland",
    bg: "from-[#1a0000] via-[#330000] to-black",
    overlay: "bg-[repeating-linear-gradient(45deg,transparent,transparent_1px,rgba(255,0,0,0.05)_1px,rgba(255,0,0,0.05)_2px)]",
    particleColors: ["#ff0000", "#ff4040", "#ff8080", "#cc0000"],
    accentColor: "#ff0040",
    typingColor: "#ff4040",
    typingText: "Decrypting corporate data...",
  },
  'Solar Drift': {
    name: "Stellar Pathways",
    bg: "from-[#2d1b00] via-[#5c3317] to-[#1a0f00]",
    overlay: "bg-[radial-gradient(circle_at_50%_50%,rgba(255,204,0,0.15),transparent_60%)]",
    particleColors: ["#ffcc00", "#ff9900", "#ffaa00", "#ff6600"],
    accentColor: "#ffcc00",
    typingColor: "#ffcc00",
    typingText: "Navigating stellar currents...",
  },
  'Quantum Void': {
    name: "Reality Nexus",
    bg: "from-[#0d0015] via-[#1a003d] to-[#000000]",
    overlay: "bg-[conic-gradient(from_0deg_at_center,transparent_0deg,rgba(128,0,255,0.1)_90deg,transparent_180deg)]",
    particleColors: ["#8000ff", "#a040ff", "#c080ff", "#4000ff"],
    accentColor: "#8000ff",
    typingColor: "#a040ff",
    typingText: "Quantum thoughts materializing...",
  },
  'Crystal Gardens': {
    name: "Resonant Sanctuary",
    bg: "from-[#001a0d] via-[#003d20] to-[#000a05]",
    overlay: "bg-[radial-gradient(ellipse_at_center,rgba(0,255,128,0.12),transparent_65%)]",
    particleColors: ["#00ff80", "#40ff99", "#80ffcc", "#00cc66"],
    accentColor: "#00ff80",
    typingColor: "#40ff99",
    typingText: "Harmonizing crystal frequencies...",
  },
  'Nightmare Forge': {
    name: "Fear Manifestation",
    bg: "from-[#200000] via-[#400000] to-[#100000]",
    overlay: "bg-[repeating-conic-gradient(from_0deg_at_center,rgba(255,0,0,0.05)_0deg,transparent_30deg,rgba(255,0,0,0.05)_60deg)]",
    particleColors: ["#ff0000", "#cc0000", "#ff4040", "#800000"],
    accentColor: "#ff0000",
    typingColor: "#ff4040",
    typingText: "Manifesting deepest fears...",
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
  const inputRef = useRef(null);

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
          console.log("Checking localStorage for persona...");
          const savedPersonas = JSON.parse(localStorage.getItem('user_personas') || '[]');
          const localPersona = savedPersonas.find(p => p.id === id);
          
          if (localPersona) {
            setPersona(localPersona);
          } else {
            console.error("Persona not found");
            navigate('/dashboard');
          }
        } else {
          setPersona(data);
        }
      } catch (error) {
        console.error("Fetch persona error:", error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPersona();
  }, [id, navigate]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("persona_id", id)
          .order("created_at", { ascending: true });
        
        if (error) {
          const savedMessages = JSON.parse(localStorage.getItem(`messages_${id}`) || '[]');
          setMessages(savedMessages);
        } else {
          setMessages(data);
        }
      } catch (error) {
        const savedMessages = JSON.parse(localStorage.getItem(`messages_${id}`) || '[]');
        setMessages(savedMessages);
      }
    };

    if (persona) {
      fetchMessages();
    }

    // Real-time subscription
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
  }, [id, persona]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send message function
  const sendMessage = async () => {
    if (!input.trim() || isTyping || !persona) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const userMsg = {
        id: Date.now(),
        user_id: user?.id || 'local_user',
        persona_id: id,
        content: input,
        sender: "user",
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMsg]);
      const currentInput = input;
      setInput("");

      // Save user message
      try {
        if (user) {
          await supabase.from("messages").insert([{
            user_id: user.id,
            persona_id: id,
            content: currentInput,
            sender: "user"
          }]);
        } else {
          const savedMessages = JSON.parse(localStorage.getItem(`messages_${id}`) || '[]');
          savedMessages.push(userMsg);
          localStorage.setItem(`messages_${id}`, JSON.stringify(savedMessages));
        }
      } catch (error) {
        const savedMessages = JSON.parse(localStorage.getItem(`messages_${id}`) || '[]');
        savedMessages.push(userMsg);
        localStorage.setItem(`messages_${id}`, JSON.stringify(savedMessages));
      }

      setIsTyping(true);

      try {
        const aiResponse = await getAIResponse(persona, currentInput);

        const aiMsg = {
          id: Date.now() + 1,
          user_id: user?.id || 'local_user',
          persona_id: id,
          content: aiResponse,
          sender: "persona",
          created_at: new Date().toISOString()
        };

        setMessages((prev) => [...prev, aiMsg]);

        // Save AI message
        try {
          if (user) {
            await supabase.from("messages").insert([{
              user_id: user.id,
              persona_id: id,
              content: aiResponse,
              sender: "persona"
            }]);
          } else {
            const savedMessages = JSON.parse(localStorage.getItem(`messages_${id}`) || '[]');
            savedMessages.push(aiMsg);
            localStorage.setItem(`messages_${id}`, JSON.stringify(savedMessages));
          }
        } catch (error) {
          const savedMessages = JSON.parse(localStorage.getItem(`messages_${id}`) || '[]');
          savedMessages.push(aiMsg);
          localStorage.setItem(`messages_${id}`, JSON.stringify(savedMessages));
        }

      } catch (error) {
        console.error("AI Response Error:", error);
        
        const errorMsg = {
          id: Date.now() + 2,
          content: "I'm having trouble connecting right now. Please try again!",
          sender: "system",
          created_at: new Date().toISOString()
        };
        
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }

    } catch (error) {
      console.error("Send message error:", error);
      setIsTyping(false);
    }
  };

  // Clear chat
  const clearChat = async () => {
    const confirmClear = window.confirm("Start a new conversation? This will clear all messages.");
    if (confirmClear) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase
            .from("messages")
            .delete()
            .eq("persona_id", id);
        } else {
          localStorage.removeItem(`messages_${id}`);
        }
        
        setMessages([]);
      } catch (error) {
        localStorage.removeItem(`messages_${id}`);
        setMessages([]);
      }
    }
  };

  // Handle input
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.bg}`}>
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-6" 
            style={{ borderColor: theme.accentColor, borderTopColor: 'transparent' }} 
          />
          <div className="text-white text-xl">Loading neural interface...</div>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.bg}`}>
        <div className="text-center">
          <div className="text-8xl mb-8">❌</div>
          <div className="text-white text-2xl mb-6">Persona not found</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${theme.bg} relative`}>
      {/* Background Effects */}
      <ParticleSystem theme={theme} count={20} />
      <div className={`absolute inset-0 ${theme.overlay}`} />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-lg bg-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
          >
            <div 
              className="w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ 
                borderColor: theme.accentColor, 
                boxShadow: `0 0 20px ${theme.accentColor}20`
              }}
            >
              ←
            </div>
            <span className="font-medium">Exit {theme.name}</span>
          </button>

          <div className="text-center">
            <GlitchText 
              className="text-4xl md:text-5xl font-bold text-white"
              color={theme.accentColor === '#ff00ff' ? 'pink' : 'blue'}
            >
              {persona?.name}
            </GlitchText>
            <div className="text-white/60 text-sm mt-2">
              {theme.name} • Unrestricted AI • Full Memory
            </div>
          </div>

          <button
            onClick={clearChat}
            className="px-6 py-3 rounded-xl font-bold transition-all duration-300 text-white hover:scale-105"
            style={{ 
              background: `linear-gradient(45deg, ${theme.accentColor}80, ${theme.accentColor}40)`,
              boxShadow: `0 0 20px ${theme.accentColor}40`
            }}
          >
            New Chat
          </button>
        </div>
      </header>

      {/* Main Chat Area - Full Screen */}
      <main className="flex-1 relative z-10 overflow-hidden">
        <div className="h-full max-w-6xl mx-auto flex flex-col">
          {/* Messages Area - Full Height */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-0">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-2xl">
                  <div className="text-8xl mb-8">{persona.avatar || '🤖'}</div>
                  <GlitchText 
                    className="text-4xl font-bold text-white mb-6"
                    color={theme.accentColor === '#ff00ff' ? 'pink' : 'blue'}
                  >
                    {persona.greeting || `Hello! I'm ${persona.name}.`}
                  </GlitchText>
                  <div className="text-xl text-white/70 leading-relaxed">
                    {persona.description || "I'm here to chat with you about anything and everything. What would you like to talk about?"}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <FullScreenMessage
                key={msg.id || index}
                message={msg}
                theme={theme}
                isUser={msg.sender === "user"}
                character={persona}
              />
            ))}

            {isTyping && <TypingIndicator theme={theme} />}
            <div ref={bottomRef} />
          </div>

          {/* Input Area - Fixed at Bottom */}
          <div className="p-6 border-t border-white/10 backdrop-blur-lg bg-black/20">
            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  className="w-full px-6 py-4 rounded-2xl text-white placeholder-white/50 resize-none transition-all duration-300 bg-black/40 border border-white/20 backdrop-blur-sm focus:outline-none focus:border-opacity-60 focus:bg-black/60 min-h-[60px] max-h-[200px]"
                  placeholder={`Message ${persona?.name || 'persona'}... (Press Enter to send, Shift+Enter for new line)`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isTyping}
                  rows={1}
                  style={{
                    borderColor: theme.accentColor + '40',
                    boxShadow: `0 0 20px ${theme.accentColor}20`,
                  }}
                />
                <div className="absolute bottom-2 right-2 text-xs text-white/40">
                  {input.length}/2000
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={isTyping || !input.trim()}
                className="px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
                style={{
                  background: `linear-gradient(45deg, ${theme.accentColor}, ${theme.accentColor}80)`,
                  boxShadow: `0 0 20px ${theme.accentColor}40`,
                }}
              >
                {isTyping ? (
                  <>
                    <div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" 
                    />
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <span className="text-sm">↵</span>
                  </>
                )}
              </button>
            </div>

            {/* Status */}
            <div className="text-center mt-4">
              <div className="text-xs text-white/50">
                🧠 Full Memory Active • 🔓 Unrestricted Mode • ⚡ {persona.name} Ready
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatRoom;
