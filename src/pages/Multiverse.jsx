// src/pages/Multiverse.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ==================== GLITCH TEXT COMPONENT ====================
const GlitchText = ({ children, className = "", intensity = 1 }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const startGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    };

    const interval = setInterval(startGlitch, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
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

// ==================== NEON BUTTON COMPONENT ====================
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

// ==================== UNIVERSE CARD COMPONENT ====================
const UniverseCard = ({ universe, index, isSelected, onClick, onEnter }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        relative group cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isSelected ? 'scale-105' : 'hover:scale-102'}
      `}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onClick={() => onClick(universe)}
    >
      {/* Hologram effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x}% ${50 + mousePos.y}%, ${universe.glowColor}30, transparent 50%)`,
          transform: `rotateX(${mousePos.y * 0.1}deg) rotateY(${mousePos.x * 0.1}deg)`,
        }}
      />
      
      {/* Main Card */}
      <div 
        className={`
          relative backdrop-blur-md bg-[rgba(18,0,23,0.8)] border-2 rounded-2xl p-6 h-full
          transition-all duration-300 overflow-hidden
          ${isSelected 
            ? `border-white shadow-[0_0_40px_${universe.glowColor}]` 
            : `border-${universe.borderColor} shadow-[0_0_20px_${universe.glowColor}80] hover:border-white/60`
          }
        `}
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * 0.02}deg) rotateY(${mousePos.x * 0.02}deg)`,
        }}
      >
        {/* Scan lines */}
        <div className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none">
          <div 
            className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]"
            style={{ animation: 'scan 2s linear infinite' }}
          />
        </div>

        {/* Universe Header */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: universe.glowColor,
                  boxShadow: `0 0 10px ${universe.glowColor}`
                }}
              />
              <span className="text-xs text-white/60 font-mono uppercase tracking-wider">
                Universe {universe.id}
              </span>
            </div>
            <div className={`
              px-2 py-1 rounded-full text-xs font-bold
              ${universe.status === 'STABLE' ? 'bg-green-500/20 border border-green-500/40 text-green-300' :
                universe.status === 'UNSTABLE' ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300' :
                'bg-red-500/20 border border-red-500/40 text-red-300'
              }
            `}>
              {universe.status}
            </div>
          </div>
          
          <GlitchText className="text-2xl font-bold text-white mb-2">
            {universe.name}
          </GlitchText>
          
          <p className="text-white/70 text-sm mb-4">{universe.description}</p>
        </div>

        {/* Universe Preview */}
        <div className="relative mb-4 h-32 rounded-xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br opacity-80"
            style={{ background: universe.gradient }}
          />
          
          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 opacity-30">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 50%, ${universe.glowColor}40 0%, transparent 50%),
                  radial-gradient(circle at 80% 50%, ${universe.accentColor}40 0%, transparent 50%),
                  linear-gradient(45deg, transparent 49%, ${universe.glowColor}20 50%, transparent 51%)
                `,
              }}
            />
          </div>

          {/* Universe Symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-4xl font-bold text-white"
              style={{ 
                textShadow: `0 0 20px ${universe.glowColor}`,
                filter: `drop-shadow(0 0 10px ${universe.glowColor})`
              }}
            >
              {universe.symbol}
            </div>
          </div>

          {/* Floating particles */}
          {isHovered && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full animate-pulse"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${30 + Math.sin(i) * 40}%`,
                    backgroundColor: universe.glowColor,
                    animationDelay: `${i * 0.2}s`,
                    animation: 'float 2s ease-in-out infinite'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Universe Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-white/60 text-xs mb-1">Danger</div>
            <div className="text-white font-bold">{universe.dangerLevel}/10</div>
          </div>
          <div>
            <div className="text-white/60 text-xs mb-1">Time Flow</div>
            <div className="text-white font-bold">{universe.timeFlow}x</div>
          </div>
          <div>
            <div className="text-white/60 text-xs mb-1">Population</div>
            <div className="text-white font-bold text-xs">{universe.population}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex gap-2">
          {isSelected ? (
            <NeonButton
              onClick={(e) => {
                e.stopPropagation();
                onEnter(universe);
              }}
              variant="cyan"
              className="flex-1 text-sm py-2"
            >
              ⚡ ENTER UNIVERSE
            </NeonButton>
          ) : (
            <NeonButton
              onClick={(e) => e.stopPropagation()}
              variant="pink"
              className="flex-1 text-sm py-2"
            >
              📡 SCAN DETAILS
            </NeonButton>
          )}
        </div>

        {/* Quantum fluctuation effect for selected */}
        {isSelected && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none">
            <div 
              className="absolute inset-0 rounded-2xl opacity-30"
              style={{
                background: `conic-gradient(from 0deg, ${universe.glowColor}, transparent, ${universe.glowColor})`,
                animation: 'quantumSpin 3s linear infinite',
              }}
            />
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes scan { 
            0% { transform: translateX(-100%); } 
            100% { transform: translateX(100%); } 
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
          }
          @keyframes quantumSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideInUp { 
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            } 
            to { 
              opacity: 1; 
              transform: translateY(0); 
            } 
          }
        `}
      </style>
    </div>
  );
};

// ==================== QUANTUM PORTAL MODAL ====================
const QuantumPortal = ({ isOpen, universe, onClose, onEnter }) => {
  const [portalEnergy, setPortalEnergy] = useState(0);
  const [phase, setPhase] = useState('initializing'); // initializing, charging, ready

  useEffect(() => {
    if (!isOpen || !universe) return;

    setPhase('initializing');
    setPortalEnergy(0);

    const timer1 = setTimeout(() => {
      setPhase('charging');
      
      const interval = setInterval(() => {
        setPortalEnergy(prev => {
          const next = prev + Math.random() * 5 + 2;
          if (next >= 100) {
            clearInterval(interval);
            setPhase('ready');
            return 100;
          }
          return next;
        });
      }, 100);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timer1);
  }, [isOpen, universe]);

  if (!isOpen || !universe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Portal Ring */}
      <div className="relative">
        <div
          className="w-96 h-96 rounded-full border-4 backdrop-blur-md relative overflow-hidden"
          style={{
            borderColor: universe.glowColor,
            boxShadow: `
              inset 0 0 100px ${universe.glowColor}30,
              0 0 100px ${universe.glowColor}80,
              0 0 200px ${universe.glowColor}40
            `,
          }}
        >
          {/* Portal Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br opacity-60"
            style={{ background: universe.gradient }}
          />

          {/* Energy Rings */}
          <div className="absolute inset-0 rounded-full">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute border rounded-full opacity-40"
                style={{
                  borderColor: universe.glowColor,
                  animation: `portalRing ${2 + i * 0.5}s linear infinite`,
                  inset: `${i * 20}px`,
                }}
              />
            ))}
          </div>

          {/* Universe Symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <GlitchText className="text-6xl text-white">
              {universe.symbol}
            </GlitchText>
          </div>

          {/* Energy Level Indicator */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
              <div className="flex justify-between items-center text-white text-sm mb-2">
                <span>Portal Stability</span>
                <span>{Math.floor(portalEnergy)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-100"
                  style={{ 
                    width: `${portalEnergy}%`,
                    background: `linear-gradient(to right, ${universe.glowColor}, #ffffff)`,
                    boxShadow: `0 0 10px ${universe.glowColor}`
                  }}
                />
              </div>
              <div className="text-xs text-white/70 mt-1 text-center">
                {phase === 'initializing' && 'Initializing quantum bridge...'}
                {phase === 'charging' && 'Charging portal matrix...'}
                {phase === 'ready' && 'Portal ready for traversal!'}
              </div>
            </div>
          </div>
        </div>

        {/* Universe Info Panel */}
        <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-96 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <GlitchText>
            <h3 className="text-2xl font-bold text-white mb-2">{universe.name}</h3>
          </GlitchText>
          <p className="text-white/70 text-sm mb-4">{universe.backstory}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-4 text-xs text-center">
            <div>
              <div className="text-white/60">Dimension</div>
              <div className="text-white font-bold">{universe.dimension}</div>
            </div>
            <div>
              <div className="text-white/60">Reality Index</div>
              <div className="text-white font-bold">{universe.realityIndex}</div>
            </div>
            <div>
              <div className="text-white/60">Frequency</div>
              <div className="text-white font-bold">{universe.frequency} Hz</div>
            </div>
          </div>

          <div className="flex gap-3">
            <NeonButton
              onClick={onEnter}
              disabled={phase !== 'ready'}
              variant="cyan"
              className="flex-1"
            >
              {phase === 'ready' ? '🚀 TRAVERSE PORTAL' : `CHARGING... ${Math.floor(portalEnergy)}%`}
            </NeonButton>
            <NeonButton
              onClick={onClose}
              variant="pink"
              className="px-6"
            >
              ABORT
            </NeonButton>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes portalRing {
            from { transform: scale(0.8) rotate(0deg); opacity: 1; }
            to { transform: scale(1.2) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

// ==================== MAIN MULTIVERSE COMPONENT ====================
const Multiverse = () => {
  const navigate = useNavigate();
  const [selectedUniverse, setSelectedUniverse] = useState(null);
  const [portalOpen, setPortalOpen] = useState(false);

  const universeData = [
    {
      id: '001',
      name: 'Cyber Haven',
      description: 'A peaceful AI-ruled society where humans and machines coexist in digital harmony.',
      backstory: 'In the neon-lit spires of Cyber Haven, AI governs every aspect of life with benevolence and precision. Humans and machines coexist in harmony, creating a utopian digital society.',
      gradient: 'from-blue-500 to-purple-700',
      glowColor: '#00ffff',
      accentColor: '#0080ff',
      borderColor: 'cyan-500/40',
      symbol: '◈',
      dangerLevel: 3,
      timeFlow: 1.2,
      population: '50M',
      status: 'STABLE',
      dimension: 'Δ-7729',
      realityIndex: 'A+',
      frequency: '432.1'
    },
    {
      id: '077',
      name: 'Neo Earth-77',
      description: 'Corporate-controlled dystopia where enhanced humans fight for freedom in neon streets.',
      backstory: 'Neo Earth-77 is a shadow-soaked world where corporations own entire continents. Citizens augment their bodies to survive brutal work cycles while rebel hackers spark hope from the underground.',
      gradient: 'from-gray-700 to-black',
      glowColor: '#ff0080',
      accentColor: '#800040',
      borderColor: 'pink-500/40',
      symbol: '⬢',
      dangerLevel: 8,
      timeFlow: 0.8,
      population: '120M',
      status: 'UNSTABLE',
      dimension: 'Ω-2847',
      realityIndex: 'C-',
      frequency: '666.6'
    },
    {
      id: '999',
      name: 'Solar Drift',
      description: 'Floating civilizations drift through crystalline spaceways in eternal golden light.',
      backstory: 'Solar Drift is a realm where islands of humanity float across shimmering rifts in spacetime. Communication is done through starlight pulses, and time bends differently on each isle.',
      gradient: 'from-yellow-500 to-orange-700',
      glowColor: '#ffaa00',
      accentColor: '#ff8000',
      borderColor: 'yellow-500/40',
      symbol: '☉',
      dangerLevel: 4,
      timeFlow: 2.5,
      population: '5M',
      status: 'STABLE',
      dimension: 'Ξ-1205',
      realityIndex: 'B+',
      frequency: '528.0'
    },
    {
      id: '404',
      name: 'Quantum Void',
      description: 'Reality-bending dimension where thoughts become matter and time flows backwards.',
      backstory: 'The Quantum Void exists between realities, where the laws of physics are merely suggestions. Here, consciousness shapes reality itself, and travelers risk dissolving into pure possibility.',
      gradient: 'from-purple-900 to-indigo-700',
      glowColor: '#8000ff',
      accentColor: '#4000ff',
      borderColor: 'purple-500/40',
      symbol: '∞',
      dangerLevel: 9,
      timeFlow: -0.5,
      population: '???',
      status: 'CRITICAL',
      dimension: 'Ψ-0001',
      realityIndex: '?',
      frequency: '∞'
    },
    {
      id: '888',
      name: 'Crystal Gardens',
      description: 'Living crystal forests that sing with harmonic frequencies and heal wounded souls.',
      backstory: 'The Crystal Gardens grow in perfect mathematical harmony, their crystalline trees resonating with consciousness frequencies. Each crystal stores memories, creating a living library of experience.',
      gradient: 'from-emerald-500 to-teal-600',
      glowColor: '#00ff80',
      accentColor: '#00cc66',
      borderColor: 'emerald-500/40',
      symbol: '◊',
      dangerLevel: 1,
      timeFlow: 1.0,
      population: '∞',
      status: 'STABLE',
      dimension: 'Φ-9999',
      realityIndex: 'S+',
      frequency: '963.0'
    },
    {
      id: '666',
      name: 'Nightmare Forge',
      description: 'Twisted realm where fears take physical form and reality bends to terror.',
      backstory: 'The Nightmare Forge is where abandoned fears and forgotten traumas take on lives of their own. The landscape shifts constantly, shaped by the collective unconscious of sleeping minds.',
      gradient: 'from-red-900 to-black',
      glowColor: '#ff0000',
      accentColor: '#800000',
      borderColor: 'red-500/40',
      symbol: '▲',
      dangerLevel: 10,
      timeFlow: 0.3,
      population: '???',
      status: 'CRITICAL',
      dimension: 'Ν-1313',
      realityIndex: 'Z',
      frequency: '13.13'
    }
  ];

  const handleUniverseClick = (universe) => {
    setSelectedUniverse(universe);
  };

  const handleEnterUniverse = (universe) => {
    setPortalOpen(true);
  };

  const handlePortalEnter = () => {
    if (selectedUniverse) {
      navigate(`/universe/${encodeURIComponent(selectedUniverse.name)}`, {
        state: { universe: selectedUniverse }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0030] to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-2xl opacity-15 bg-gradient-to-l from-purple-800 via-pink-600 to-indigo-800" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-cyan-500 to-pink-500 animate-pulse" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,0,255,0.03)_2px,rgba(255,0,255,0.03)_4px)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-cyan-300 hover:text-cyan-200 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center group-hover:shadow-[0_0_15px_#00ffff40] transition-all">
              ←
            </div>
            <span className="font-medium">Back to Reality</span>
          </button>

          <div className="text-center">
            <GlitchText className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              MULTIVERSE NEXUS
            </GlitchText>
            <p className="text-white/60 text-sm mt-2">
              {universeData.length} Parallel Realities Detected • Infinite Possibilities Await
            </p>
          </div>

          <div className="text-right text-sm text-white/60">
            <div>Active Scans: {universeData.length}</div>
            <div>Selected: {selectedUniverse?.name || 'None'}</div>
            <div>Status: OPERATIONAL</div>
          </div>
        </div>
      </header>

      {/* Main Universe Grid */}
      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {universeData.map((universe, index) => (
              <UniverseCard
                key={universe.id}
                universe={universe}
                index={index}
                isSelected={selectedUniverse?.id === universe.id}
                onClick={handleUniverseClick}
                onEnter={handleEnterUniverse}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Quantum Portal */}
      <QuantumPortal
        isOpen={portalOpen}
        universe={selectedUniverse}
        onClose={() => setPortalOpen(false)}
        onEnter={handlePortalEnter}
      />
    </div>
  );
};

export default Multiverse;
