// src/components/Sidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUserAstronaut, FaRocket, FaCogs, FaHome, FaBook, FaShieldAlt, FaChartLine } from "react-icons/fa";
import neonHero from "../assets/logo.png";

// ==================== GLITCH TEXT COMPONENT ====================
const GlitchText = ({ children, className = "", intensity = 1 }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const startGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    };

    const interval = setInterval(startGlitch, 4000 + Math.random() * 2000);
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

// ==================== NEURAL ACTIVITY DISPLAY ====================
const NeuralActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const generateActivity = () => {
      const newActivity = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        height: Math.random() * 100,
        color: ['#ff00ff', '#00ffff', '#ff0080'][Math.floor(Math.random() * 3)],
        delay: Math.random() * 2
      }));
      setActivity(newActivity);
    };

    generateActivity();
    const interval = setInterval(generateActivity, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end justify-center h-12 gap-1 px-4 py-2 bg-black/30 rounded-lg border border-pink-500/20">
      {activity.map(bar => (
        <div
          key={bar.id}
          className="w-1 bg-gradient-to-t from-transparent to-current rounded-full transition-all duration-500"
          style={{
            height: `${bar.height}%`,
            color: bar.color,
            animationDelay: `${bar.delay}s`,
            boxShadow: `0 0 4px ${bar.color}80`
          }}
        />
      ))}
    </div>
  );
};

// ==================== QUANTUM STATUS INDICATOR ====================
const QuantumStatus = () => {
  const [status, setStatus] = useState('STABLE');
  const [energy, setEnergy] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEnergy = 70 + Math.random() * 30;
      setEnergy(Math.floor(newEnergy));
      
      if (newEnergy > 90) setStatus('OPTIMAL');
      else if (newEnergy > 75) setStatus('STABLE');
      else setStatus('FLUCTUATING');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'OPTIMAL': return '#00ff80';
      case 'STABLE': return '#00ffff';
      case 'FLUCTUATING': return '#ffaa00';
      default: return '#ff0080';
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-cyan-300 font-mono">QUANTUM STATUS</span>
        <div 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ 
            backgroundColor: getStatusColor(),
            boxShadow: `0 0 8px ${getStatusColor()}`
          }}
        />
      </div>
      
      <div className="text-xs font-mono text-white mb-1">{status}</div>
      
      <div className="w-full bg-gray-800 rounded-full h-1">
        <div 
          className="h-1 rounded-full transition-all duration-1000"
          style={{ 
            width: `${energy}%`,
            backgroundColor: getStatusColor(),
            boxShadow: `0 0 4px ${getStatusColor()}`
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-cyan-200/60 mt-1">
        <span>Energy</span>
        <span>{energy}%</span>
      </div>
    </div>
  );
};

// ==================== ENHANCED SIDEBAR LINK ====================
const SidebarLink = ({ to, icon, text, badge = null }) => {
  const location = useLocation();
  const [ripples, setRipples] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const linkRef = useRef(null);
  const isActive = location.pathname === to;

  const handleClick = (e) => {
    const rect = linkRef.current.getBoundingClientRect();
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
  };

  return (
    <NavLink
      ref={linkRef}
      to={to}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden group
        ${isActive
          ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-400/50 text-white shadow-[0_0_20px_#ff00ff40]'
          : 'hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-purple-600/20 text-pink-200/80 hover:text-white border border-transparent hover:border-pink-500/30'
        }
      `}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animation: 'ripple 0.6s linear',
          }}
        />
      ))}

      {/* Scan line effect for active */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan" />
      )}

      {/* Hologram effect on hover */}
      {isHovered && !isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
      )}

      {/* Icon with glow */}
      <span 
        className={`text-xl transition-all duration-300 ${
          isActive ? 'text-pink-300' : 'text-pink-400/70 group-hover:text-pink-300'
        }`}
        style={{
          filter: isActive ? 'drop-shadow(0 0 8px #ff00ff80)' : 'none'
        }}
      >
        {icon}
      </span>

      {/* Text */}
      <span className="font-medium text-sm relative z-10">
        {text}
      </span>

      {/* Badge */}
      {badge && (
        <span className="ml-auto px-2 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-xs text-cyan-300 animate-pulse">
          {badge}
        </span>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-pink-400 to-purple-500 rounded-r-full shadow-[0_0_10px_#ff00ff80]" />
      )}

      <style>
        {`
          @keyframes ripple { 
            to { 
              transform: scale(20); 
              opacity: 0; 
            } 
          }
          @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </NavLink>
  );
};

// ==================== MAIN SIDEBAR COMPONENT ====================
const Sidebar = () => {
  const [connectionStrength, setConnectionStrength] = useState(5);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate connection fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStrength(Math.floor(Math.random() * 3) + 4); // 4-6 bars
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    { to: "/dashboard", icon: <FaHome />, text: "Neural Hub", badge: null },
    { to: "/create-persona", icon: <FaUserAstronaut />, text: "Forge Identity", badge: "NEW" },
    { to: "/multiverse", icon: <FaRocket />, text: "Reality Shift", badge: "6" },
    { to: "/Narrative", icon: <FaBook />, text: "Narrative Mode", badge: null },
    { to: "/safe-space", icon: <FaShieldAlt />, text: "Safe Zone", badge: null },
    { to: "/productivity", icon: <FaChartLine />, text: "Enhancement", badge: null },
    { to: "/settings", icon: <FaCogs />, text: "System Config", badge: null },
    {}
  ];

  return (
    <div className="min-h-screen w-72 bg-gradient-to-b from-[#0a0015] via-[#1a0030] to-[#0a0015] text-white border-r border-pink-500/30 flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-500/10 to-transparent" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,0,255,0.02)_20px,rgba(255,0,255,0.02)_21px)]" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 p-6 border-b border-pink-500/20">
        <div className="text-center mb-6">
          <GlitchText className="text-3xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            PARALLEL YOU
          </GlitchText>
          <div className="text-xs text-pink-200/60 mt-1 font-mono">
            v2.1.3 • NEURAL INTERFACE
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-3">
          <QuantumStatus />
          
          {/* Connection Indicator */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-mono">SIGNAL STRENGTH</span>
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    i < connectionStrength 
                      ? 'bg-green-400 shadow-[0_0_4px_#4ade80]' 
                      : 'bg-gray-600'
                  }`}
                  style={{ height: `${(i + 1) * 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="relative z-10 flex-1 p-6 space-y-2">
        <div className="text-xs text-pink-300/60 uppercase tracking-wider mb-4 font-mono">
          Navigation Matrix
        </div>
        
        {navigationItems.map((item, index) => (
          <SidebarLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            text={item.text}
            badge={item.badge}
          />
        ))}
      </nav>

      {/* Neural Activity Monitor */}
      <div className="relative z-10 p-6 border-t border-pink-500/20">
        <div className="text-xs text-pink-300/60 uppercase tracking-wider mb-3 font-mono">
          Neural Activity
        </div>
        <NeuralActivity />
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 p-6 space-y-4">
        {/* Time Display */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
          <div className="text-xs text-purple-300/60 uppercase tracking-wider mb-1 font-mono">
            Reality Timestamp
          </div>
          <div className="font-mono text-sm text-white">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="font-mono text-xs text-purple-200/60">
            {currentTime.toLocaleDateString()}
          </div>
        </div>

        {/* Logo Section */}
        <div className="text-center">
          <div className="relative group">
            <img
              src={neonHero}
              alt="Parallel You AI"
              className="w-32 h-32 object-contain mx-auto opacity-70 group-hover:opacity-100 transition-all duration-300 rounded-lg"
              style={{
                filter: 'drop-shadow(0 0 10px #ff00ff40) drop-shadow(0 0 20px #00ffff20)',
              }}
            />
            
            {/* Scanning effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 animate-scan transition-opacity duration-300 rounded-lg" />
          </div>
          
          <div className="text-xs text-cyan-200/60 mt-2 font-mono">
            AI CORE • STATUS: ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
