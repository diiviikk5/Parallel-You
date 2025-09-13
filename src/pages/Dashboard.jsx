// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseclient";

// ==================== PARTICLE SYSTEM ====================
const ParticleSystem = ({ count = 50 }) => {
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
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      color: ['#ff00ff', '#00ffff', '#ff0080', '#8000ff'][Math.floor(Math.random() * 4)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += particle.pulseSpeed;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle with glow
        const glowSize = particle.size * (2 + Math.sin(particle.pulse));
        const finalOpacity = particle.opacity * (0.7 + Math.sin(particle.pulse) * 0.3);
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        gradient.addColorStop(0, `${particle.color}${Math.floor(finalOpacity * 100).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${particle.color}00`);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}ff`;
        ctx.fill();
        
        // Connect nearby particles
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${particle.color}${Math.floor((1 - distance / 100) * 50).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [count]);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// ==================== MATRIX RAIN ====================
const MatrixRain = () => {
  const canvasRef = useRef(null);
  const dropsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const columns = Math.floor(canvas.width / 20);
      dropsRef.current = Array.from({ length: columns }, () => ({
        y: Math.random() * canvas.height,
        speed: Math.random() * 3 + 1,
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: Math.random() * 0.5 + 0.1,
      }));
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '14px monospace';
      
      dropsRef.current.forEach((drop, i) => {
        const x = i * 20;
        
        // Random character change
        if (Math.random() > 0.95) {
          drop.char = chars[Math.floor(Math.random() * chars.length)];
        }
        
        // Draw character with neon glow
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(0, 255, 65, ${drop.opacity})`;
        ctx.fillText(drop.char, x, drop.y);
        
        // Move drop
        drop.y += drop.speed;
        
        // Reset if off screen
        if (drop.y > canvas.height) {
          drop.y = -20;
          drop.speed = Math.random() * 3 + 1;
          drop.opacity = Math.random() * 0.5 + 0.1;
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
    />
  );
};

// ==================== GLITCH TEXT ====================
const GlitchText = ({ children, className = "", intensity = 1 }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    const startGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    };

    intervalRef.current = setInterval(startGlitch, 3000 + Math.random() * 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <span 
        className={`inline-block transition-all duration-150 ${
          isGlitching ? 'animate-pulse' : ''
        }`}
        style={{
          textShadow: isGlitching 
            ? `${intensity}px 0 #ff00ff, -${intensity}px 0 #00ffff, 0 ${intensity}px #ffff00`
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
            className="absolute inset-0 text-pink-500 opacity-70"
            style={{
              transform: `translateX(${Math.random() * 6 - 3}px)`,
              clipPath: 'inset(0 0 50% 0)'
            }}
          >
            {children}
          </span>
          <span 
            className="absolute inset-0 text-cyan-500 opacity-70"
            style={{
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

// ==================== HOLOGRAM CARD ====================
const HologramCard = ({ children, className = "", glowColor = "pink" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  }, []);

  const glowColors = {
    pink: 'rgba(255, 0, 255, 0.3)',
    cyan: 'rgba(0, 255, 255, 0.3)',
    purple: 'rgba(128, 0, 255, 0.3)',
    yellow: 'rgba(255, 255, 0, 0.3)',
  };

  return (
    <div
      ref={cardRef}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* Hologram effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x}% ${50 + mousePos.y}%, ${glowColors[glowColor]}, transparent 50%)`,
          transform: `rotateX(${mousePos.y * 0.1}deg) rotateY(${mousePos.x * 0.1}deg)`,
        }}
      />
      
      {/* Scan lines */}
      <div className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]"
          style={{ animation: 'scan 2s linear infinite' }}
        />
      </div>
      
      {/* Content */}
      <div 
        className="relative z-10 backdrop-blur-md bg-[rgba(18,0,23,0.8)] border border-pink-500/40 rounded-2xl transition-transform duration-300"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * 0.05}deg) rotateY(${mousePos.x * 0.05}deg)`,
        }}
      >
        {children}
      </div>

      <style>
        {`@keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}
      </style>
    </div>
  );
};

// ==================== NEON BUTTON ====================
const NeonButton = ({ children, onClick, className = "", variant = "pink", disabled = false, ...props }) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const colors = {
    pink: {
      border: 'border-pink-500',
      bg: 'bg-pink-500/20',
      hover: 'hover:bg-pink-500/40',
      shadow: 'shadow-[0_0_20px_#ff00ff80]',
      text: 'text-pink-200',
    },
    cyan: {
      border: 'border-cyan-500',
      bg: 'bg-cyan-500/20',
      hover: 'hover:bg-cyan-500/40',
      shadow: 'shadow-[0_0_20px_#00ffff80]',
      text: 'text-cyan-200',
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-500/20',
      hover: 'hover:bg-purple-500/40',
      shadow: 'shadow-[0_0_20px_#8000ff80]',
      text: 'text-purple-200',
    },
  };

  const handleClick = (e) => {
    if (disabled) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    if (onClick) onClick(e);
  };

  const colorSet = colors[variant];

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-300
        ${colorSet.border} ${colorSet.bg} ${colorSet.hover} ${colorSet.shadow} ${colorSet.text}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500
        ${className}
      `}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animation: 'ripple 0.6s linear',
          }}
        />
      ))}
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
      
      <style>
        {`@keyframes ripple { 
          to { 
            transform: scale(20); 
            opacity: 0; 
          } 
        }`}
      </style>
    </button>
  );
};

// ==================== DATA STREAM ====================
const DataStream = ({ className = "" }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        value: Math.random().toString(16).substring(2, 8).toUpperCase(),
        type: ['CPU', 'RAM', 'NET', 'GPU'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.8 ? 'ERROR' : 'OK',
      }));
      setData(newData);
    };

    generateData();
    const interval = setInterval(generateData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`font-mono text-xs space-y-1 ${className}`}>
      {data.map(item => (
        <div 
          key={item.id}
          className={`flex justify-between opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards] ${
            item.status === 'ERROR' ? 'text-red-400' : 'text-green-400'
          }`}
          style={{ animationDelay: `${Math.random() * 0.5}s` }}
        >
          <span>[{item.type}]</span>
          <span>{item.value}</span>
          <span className={item.status === 'ERROR' ? 'text-red-500 animate-pulse' : 'text-green-500'}>
            {item.status}
          </span>
        </div>
      ))}
      
      <style>
        {`@keyframes fadeInUp { 
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
          } 
        }`}
      </style>
    </div>
  );
};

// ==================== QUANTUM TOGGLE ====================
const QuantumToggle = ({ enabled, onChange, label }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    onChange(!enabled);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-white/90 font-medium">{label}</span>
      <button
        onClick={handleToggle}
        className={`
          relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2
          ${enabled 
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_20px_#ff00ff80]' 
            : 'bg-gray-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
          }
        `}
      >
        <div
          className={`
            absolute top-1 w-6 h-6 rounded-full transition-all duration-300
            ${enabled 
              ? 'translate-x-8 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' 
              : 'translate-x-1 bg-gray-300'
            }
            ${isAnimating ? 'animate-bounce' : ''}
          `}
        >
          {/* Quantum particles */}
          {enabled && (
            <div className="absolute inset-0 rounded-full">
              <div className="absolute w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ top: '20%', left: '20%' }} />
              <div className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ top: '70%', right: '20%', animationDelay: '0.2s' }} />
              <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ top: '50%', left: '10%', animationDelay: '0.4s' }} />
            </div>
          )}
        </div>
        
        {/* Energy field */}
        {enabled && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 animate-pulse" />
        )}
      </button>
    </div>
  );
};

// ==================== STATS DISPLAY ====================
const CyberStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="relative group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <HologramCard className="animate-[slideInUp_0.6s_ease-out_forwards] opacity-0" glowColor={stat.color}>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className={`text-sm font-medium ${
                stat.color === 'pink' ? 'text-pink-300' :
                stat.color === 'cyan' ? 'text-cyan-300' :
                stat.color === 'purple' ? 'text-purple-300' :
                'text-yellow-300'
              }`}>
                {stat.label}
              </div>
              <div className="text-xs text-white/60 mt-1">{stat.subtitle}</div>
            </div>
          </HologramCard>
        </div>
      ))}
      
      <style>
        {`@keyframes slideInUp { 
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
          } 
        }`}
      </style>
    </div>
  );
};

// ==================== MAIN DASHBOARD COMPONENT ====================
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [mood, setMood] = useState('');
  const [isMultiverseOn, setIsMultiverseOn] = useState(true);
  const [lastChat, setLastChat] = useState(null);
  const [systemStats, setSystemStats] = useState({});
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showMatrix, setShowMatrix] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const moods = [
    'Cyberpunk', 'Neon Noir', 'Techno Mystic', 'Quantum Flux', 'Digital Dream',
    'Astral Core', 'Synthwave Pulse', 'Future Glitch', 'Lunar Echo', 'Solar Data',
    'Neural Storm', 'Data Phantom', 'Electric Soul', 'Binary Dreams', 'Void Walker'
  ];

  const stats = useMemo(() => [
    { 
      label: "User ID", 
      value: userData?.username || "---", 
      subtitle: "Identity Matrix",
      color: "pink" 
    },
    { 
      label: "Mode", 
      value: isMultiverseOn ? "∞" : "1", 
      subtitle: isMultiverseOn ? "Multiverse" : "Solo",
      color: "cyan" 
    },
    { 
      label: "Mood", 
      value: mood.split(' ') || "---", 
      subtitle: "Neural State",
      color: "purple" 
    },
    { 
      label: "Sessions", 
      value: lastChat ? "ACTIVE" : "IDLE", 
      subtitle: "Chat Status",
      color: "yellow" 
    }
  ], [userData, isMultiverseOn, mood, lastChat]);

  // Initialize session and user data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return navigate("/auth");
      
      const user = sessionData.session.user;
      const { data: userProfile } = await supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .single();

      setUserData({
        id: user.id,
        email: user.email,
        username: userProfile?.username || "Unknown User",
      });
    };

    fetchUser();
    setMood(moods[Math.floor(Math.random() * moods.length)]);
  }, [navigate]);

  // Fetch recent chat
  useEffect(() => {
    const fetchRecentChat = async () => {
      if (!userData?.id) return;
      const { data, error } = await supabase
        .from("messages")
        .select("persona_id, content, sender, created_at")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (!error && data?.length) setLastChat(data);
    };
    fetchRecentChat();
  }, [userData]);

  // System stats simulation
  useEffect(() => {
    const updateStats = () => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        quantum: Math.floor(Math.random() * 100),
      });
    };
    
    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Audio setup
  useEffect(() => {
    if (audioEnabled && !audioRef.current) {
      audioRef.current = new Audio('/cyberpunk-ambient.mp3'); // Add your audio file
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(console.error);
    } else if (!audioEnabled && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [audioEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'g':
          setIsMultiverseOn(true);
          navigate('/multiverse');
          break;
        case 'c':
          if (lastChat?.persona_id) navigate(`/chat/${lastChat.persona_id}`);
          break;
        case 'l':
          handleLogout();
          break;
        case 'm':
          setShowMatrix(!showMatrix);
          break;
        case 'p':
          setShowParticles(!showParticles);
          break;
        case 'a':
          setAudioEnabled(!audioEnabled);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lastChat, navigate, showMatrix, showParticles, audioEnabled]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen relative text-white font-sans overflow-hidden bg-black">
      {/* Background Effects */}
      {showMatrix && <MatrixRain />}
      {showParticles && <ParticleSystem count={75} />}
      
      {/* Static Background Layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient overlays */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-2xl opacity-25 bg-gradient-to-l from-purple-800 via-pink-600 to-indigo-800" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-cyan-500 to-pink-500 animate-pulse" />
        
        {/* Scan lines */}
        <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.15)_0px,rgba(255,255,255,0.15)_1px,transparent_1px,transparent_4px)]" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.3),transparent_70%)]" />
        
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0010] via-[#150025] to-[#000005]" />
      </div>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <NeonButton
          onClick={handleLogout}
          variant="pink"
          className="text-xs px-3 py-1"
        >
          Logout (L)
        </NeonButton>
        <NeonButton
          onClick={() => setShowMatrix(!showMatrix)}
          variant={showMatrix ? "cyan" : "purple"}
          className="text-xs px-3 py-1"
        >
          Matrix (M)
        </NeonButton>
        <NeonButton
          onClick={() => setShowParticles(!showParticles)}
          variant={showParticles ? "cyan" : "purple"}
          className="text-xs px-3 py-1"
        >
          Particles (P)
        </NeonButton>
        <NeonButton
          onClick={() => setAudioEnabled(!audioEnabled)}
          variant={audioEnabled ? "cyan" : "purple"}
          className="text-xs px-3 py-1"
        >
          Audio (A)
        </NeonButton>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <div className="text-center mb-6">
            <GlitchText className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PARALLEL YOU
            </GlitchText>
            
            <div className="flex justify-center items-center gap-4 text-sm">
              <div className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-200">
                ◉ ONLINE
              </div>
              <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-200">
                v2.1.3-ALPHA
              </div>
              <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200">
                {userData?.username || "UNKNOWN"}
              </div>
            </div>
          </div>

          {/* System Monitor */}
          <HologramCard className="mb-6" glowColor="cyan">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-cyan-300 font-bold">SYSTEM MONITOR</h3>
                <div className="text-xs text-cyan-200/60">Real-time Neural Metrics</div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(systemStats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs text-white/60 uppercase tracking-wide mb-1">{key}</div>
                    <div className="text-2xl font-bold text-cyan-300">{value}%</div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-1000 ${
                          value > 80 ? 'bg-red-500' : 
                          value > 60 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </HologramCard>
        </header>

        {/* Stats Grid */}
        <CyberStats stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <HologramCard glowColor="pink">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                    <GlitchText className="text-2xl font-bold text-pink-300">
                      NEURAL INTERFACE
                    </GlitchText>
                  </div>
                  <div className="text-xs text-pink-200/60">Shortcut: C</div>
                </div>

                {lastChat ? (
                  <NeonButton
                    onClick={() => navigate(`/chat/${lastChat.persona_id}`)}
                    className="w-full p-6 text-left"
                    variant="pink"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-pink-500/60 bg-gradient-to-br from-pink-400/40 to-purple-500/30 shadow-[0_0_15px_#ff00ff88] flex items-center justify-center">
                        <span className="text-white font-bold">
                          {lastChat.sender === 'user' ? 'YOU' : 'AI'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-pink-200/90 text-sm mb-1">
                          Last Neural Exchange • {new Date(lastChat.created_at).toLocaleString()}
                        </p>
                        <p className="text-white text-lg line-clamp-2">
                          {lastChat.content}
                        </p>
                      </div>
                      <div className="text-pink-300 font-bold text-xl">→</div>
                    </div>
                  </NeonButton>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🧠</div>
                    <p className="text-pink-200 text-lg">No neural patterns detected</p>
                    <p className="text-pink-200/60 text-sm">Initialize first connection</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-pink-500/20">
                  <DataStream className="max-h-32 overflow-hidden" />
                </div>
              </div>
            </HologramCard>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Multiverse Control */}
            <HologramCard glowColor="purple">
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">
                  <GlitchText>MULTIVERSE CORE</GlitchText>
                </h3>
                
                <QuantumToggle
                  enabled={isMultiverseOn}
                  onChange={(enabled) => {
                    setIsMultiverseOn(enabled);
                    if (enabled) navigate('/multiverse');
                  }}
                  label="Quantum State"
                />
                
                <div className="mt-4 text-xs text-purple-200/70">
                  {isMultiverseOn 
                    ? "∞ Infinite realities accessible" 
                    : "1 Single timeline active"
                  }
                </div>
                
                <div className="mt-4 text-xs text-purple-200/50">
                  Press G to activate Multiverse mode
                </div>
              </div>
            </HologramCard>

            {/* Persona Hub */}
            <HologramCard glowColor="cyan">
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-4">
                  <GlitchText>PERSONA HUB</GlitchText>
                </h3>
                
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4727/4727425.png"
                      alt="Cyber Phantom"
                      className="w-20 h-20 rounded-full border-3 border-cyan-500 shadow-[0_0_25px_#00ffff88] object-cover"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-transparent animate-pulse" />
                  </div>
                  <div className="mt-3">
                    <div className="text-white font-bold text-lg">Cyber Phantom</div>
                    <div className="text-cyan-200/70 text-sm">Primary Neural Identity</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <NeonButton
                    onClick={() => navigate('/create-persona')}
                    variant="cyan"
                    className="text-xs py-2"
                  >
                    NEW
                  </NeonButton>
                  <NeonButton
                    onClick={() => navigate('/settings')}
                    variant="cyan"
                    className="text-xs py-2"
                  >
                    EDIT
                  </NeonButton>
                  <NeonButton
                    onClick={() => {
                      if (lastChat?.persona_id) navigate(`/chat/${lastChat.persona_id}`);
                      else navigate('/chat');
                    }}
                    variant="cyan"
                    className="text-xs py-2"
                  >
                    CHAT
                  </NeonButton>
                </div>
              </div>
            </HologramCard>

            {/* Quick Actions */}
            <HologramCard glowColor="yellow">
              <div className="p-6">
                <h3 className="text-xl font-bold text-yellow-300 mb-4">
                  <GlitchText>QUICK ACCESS</GlitchText>
                </h3>
                
                <div className="space-y-3">
                  <NeonButton
                    onClick={() => navigate('/storytelling')}
                    variant="purple"
                    className="w-full text-sm"
                  >
                    📖 Story Mode
                  </NeonButton>
                  <NeonButton
                    onClick={() => navigate('/safe-space')}
                    variant="cyan"
                    className="w-full text-sm"
                  >
                    🛡️ Safe Space
                  </NeonButton>
                  <NeonButton
                    onClick={() => navigate('/productivity')}
                    variant="pink"
                    className="w-full text-sm"
                  >
                    📊 Productivity
                  </NeonButton>
                </div>
              </div>
            </HologramCard>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-xs text-white/40">
          <div className="flex justify-center items-center gap-6">
            <span>Neural Network Status: OPTIMAL</span>
            <span>•</span>
            <span>Quantum Coherence: {Math.floor(Math.random() * 100)}%</span>
            <span>•</span>
            <span>Reality Index: {isMultiverseOn ? '∞' : '1'}</span>
          </div>
        </footer>
      </div>

      {/* Global Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
          
          .font-orbitron { font-family: 'Orbitron', monospace; }
          
          @keyframes spin-slow { 
            from { transform: rotate(0deg); } 
            to { transform: rotate(360deg); } 
          }
          
          .animate-spin-slow { 
            animation: spin-slow 20s linear infinite; 
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          @media (prefers-reduced-motion: reduce) {
            * { animation-duration: 0.01ms !important; }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
