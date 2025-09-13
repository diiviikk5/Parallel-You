// src/pages/CreatePersona.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseclient";

// ==================== NEURAL SCANNER ANIMATION ====================
const NeuralScanner = ({ isActive, onComplete }) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [brainwaves, setBrainwaves] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    // Generate brainwave data
    const waves = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      frequency: Math.random() * 10 + 1,
      amplitude: Math.random() * 50 + 10,
      phase: Math.random() * Math.PI * 2,
      color: ['#ff00ff', '#00ffff', '#ff0080', '#8000ff'][Math.floor(Math.random() * 4)],
    }));
    setBrainwaves(waves);

    // Animate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  return (
    <div className="relative w-full h-64 bg-black/50 rounded-2xl overflow-hidden border border-cyan-500/30">
      {/* Brain outline */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px #00ffff80)' }}
      >
        <path
          d="M100 30 C120 30, 140 50, 140 80 C150 90, 150 110, 140 120 C140 140, 120 160, 100 160 C80 160, 60 140, 60 120 C50 110, 50 90, 60 80 C60 50, 80 30, 100 30 Z"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          className="animate-pulse"
        />
        
        {/* Neural pathways */}
        {brainwaves.map(wave => (
          <g key={wave.id}>
            <path
              d={`M${70 + Math.sin(wave.phase) * 20} ${60 + wave.id * 2} Q${100 + Math.cos(wave.phase) * 30} ${80 + Math.sin(wave.phase * 2) * 20} ${130 + Math.sin(wave.phase) * 20} ${60 + wave.id * 2}`}
              fill="none"
              stroke={wave.color}
              strokeWidth="1"
              opacity={0.6}
              className="animate-pulse"
              style={{ animationDelay: `${wave.id * 0.1}s` }}
            />
          </g>
        ))}
      </svg>

      {/* Scan line */}
      {isActive && (
        <div 
          className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{ 
            top: `${scanProgress * 2.4}px`,
            boxShadow: '0 0 20px #00ffff',
            transition: 'top 0.05s linear'
          }}
        />
      )}

      {/* Progress display */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-center text-cyan-300 text-sm mb-2">
          <span>Neural Pattern Analysis</span>
          <span>{scanProgress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="h-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full transition-all duration-100"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ==================== DNA HELIX AVATAR PICKER ====================
const DNAHelixAvatarPicker = ({ selectedAvatar, onSelect }) => {
  const [rotationSpeed, setRotationSpeed] = useState(1);

  const avatars = [
    { id: 'cyber-samurai', name: 'Cyber Samurai', url: 'https://cdn-icons-png.flaticon.com/512/4727/4727425.png', color: '#ff00ff' },
    { id: 'neon-oracle', name: 'Neon Oracle', url: 'https://cdn-icons-png.flaticon.com/512/4727/4727386.png', color: '#00ffff' },
    { id: 'quantum-hacker', name: 'Quantum Hacker', url: 'https://cdn-icons-png.flaticon.com/512/4727/4727424.png', color: '#8000ff' },
    { id: 'digital-phantom', name: 'Digital Phantom', url: 'https://cdn-icons-png.flaticon.com/512/4727/4727432.png', color: '#ff0080' },
    { id: 'neural-ghost', name: 'Neural Ghost', url: 'https://cdn-icons-png.flaticon.com/512/4727/4727445.png', color: '#00ff80' },
    { id: 'void-walker', name: 'Void Walker', url: 'https://cdn-icons-png.flaticon.com/512/4727/4727456.png', color: '#ff8000' },
  ];

  return (
    <div className="relative h-96 overflow-hidden">
      {/* DNA Helix Background */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(255,0,255,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(0,255,255,0.3) 0%, transparent 50%)
          `,
          animation: `helixRotate ${10 / rotationSpeed}s linear infinite`
        }}
      />

      {/* Avatar Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {avatars.map((avatar, index) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar)}
            onMouseEnter={() => setRotationSpeed(3)}
            onMouseLeave={() => setRotationSpeed(1)}
            className={`
              relative group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110
              ${selectedAvatar?.id === avatar.id 
                ? 'border-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.8)]' 
                : 'border-white/20 bg-white/5 hover:border-white/40'
              }
            `}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInScale 0.6s ease-out forwards',
              opacity: 0
            }}
          >
            {/* Hologram effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div 
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `conic-gradient(from 0deg, ${avatar.color}40, transparent, ${avatar.color}40)`,
                  animation: 'spin 3s linear infinite'
                }}
              />
            </div>

            <div className="relative z-10 text-center">
              <div className="relative inline-block mb-3">
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ filter: `drop-shadow(0 0 10px ${avatar.color}80)` }}
                />
                {selectedAvatar?.id === avatar.id && (
                  <div className="absolute inset-0 rounded-full border-2 border-white animate-ping" />
                )}
              </div>
              <div className="text-sm font-medium text-white">{avatar.name}</div>
              <div className="text-xs text-white/60 mt-1">Neural Archetype</div>
            </div>
          </button>
        ))}
      </div>

      <style>
        {`
          @keyframes helixRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

// ==================== PERSONALITY TRAIT MIXER ====================
const PersonalityMixer = ({ traits, onTraitChange }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [particleSystem, setParticleSystem] = useState([]);

  const traitCategories = {
    'Cognitive': ['Analytical', 'Creative', 'Logical', 'Intuitive', 'Strategic'],
    'Social': ['Empathetic', 'Assertive', 'Diplomatic', 'Rebellious', 'Charismatic'],
    'Emotional': ['Optimistic', 'Mysterious', 'Passionate', 'Calm', 'Intense'],
    'Behavioral': ['Adventurous', 'Methodical', 'Spontaneous', 'Cautious', 'Bold']
  };

  useEffect(() => {
    // Create particle system for personality visualization
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 2,
      color: Object.keys(traitCategories)[i % 4],
    }));
    setParticleSystem(particles);
  }, []);

  const analyzePersonality = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const getTraitColor = (category) => {
    const colors = {
      'Cognitive': '#ff00ff',
      'Social': '#00ffff', 
      'Emotional': '#ff0080',
      'Behavioral': '#8000ff'
    };
    return colors[category] || '#ffffff';
  };

  return (
    <div className="space-y-6">
      {/* Personality Visualization */}
      <div className="relative h-64 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl overflow-hidden border border-purple-500/30">
        <canvas
          width="400"
          height="300"
          className="absolute inset-0 w-full h-full"
          ref={canvas => {
            if (!canvas || particleSystem.length === 0) return;
            
            const ctx = canvas.getContext('2d');
            const animate = () => {
              ctx.clearRect(0, 0, 400, 300);
              
              particleSystem.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x <= 0 || particle.x >= 400) particle.vx *= -1;
                if (particle.y <= 0 || particle.y >= 300) particle.vy *= -1;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = getTraitColor(particle.color);
                ctx.fill();
                
                // Draw connections
                particleSystem.forEach(other => {
                  if (other !== particle) {
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 80) {
                      ctx.beginPath();
                      ctx.moveTo(particle.x, particle.y);
                      ctx.lineTo(other.x, other.y);
                      ctx.strokeStyle = `${getTraitColor(particle.color)}40`;
                      ctx.stroke();
                    }
                  }
                });
              });
              
              requestAnimationFrame(animate);
            };
            
            animate();
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={analyzePersonality}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-purple-600/20 border border-purple-400 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-all duration-300 backdrop-blur-sm"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                Analyzing Neural Patterns...
              </span>
            ) : (
              'Analyze Personality Matrix'
            )}
          </button>
        </div>
      </div>

      {/* Trait Categories */}
      {Object.entries(traitCategories).map(([category, categoryTraits]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-lg font-bold" style={{ color: getTraitColor(category) }}>
            {category} Traits
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryTraits.map(trait => (
              <div key={trait} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-white/90 text-sm font-medium">{trait}</label>
                  <span className="text-xs text-white/60">{traits[trait] || 50}%</span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={traits[trait] || 50}
                    onChange={(e) => onTraitChange(trait, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${getTraitColor(category)} 0%, ${getTraitColor(category)} ${traits[trait] || 50}%, #374151 ${traits[trait] || 50}%, #374151 100%)`
                    }}
                  />
                  
                  {/* Glow effect */}
                  <div 
                    className="absolute top-0 h-2 rounded-lg pointer-events-none"
                    style={{
                      width: `${traits[trait] || 50}%`,
                      background: getTraitColor(category),
                      filter: `blur(4px)`,
                      opacity: 0.5
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>
        {`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
          
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
        `}
      </style>
    </div>
  );
};

// ==================== VOICE SYNTHESIZER ====================
const VoiceSynthesizer = ({ voiceSettings, onVoiceChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveform, setWaveform] = useState([]);

  useEffect(() => {
    // Generate waveform visualization
    const generateWaveform = () => {
      const data = Array.from({ length: 50 }, () => Math.random() * 100);
      setWaveform(data);
    };

    const interval = setInterval(generateWaveform, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playVoicePreview = async () => {
    setIsPlaying(true);
    
    // Simulate voice preview
    const sampleText = "Hello! I am your parallel universe twin. Ready to explore infinite possibilities together?";
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.pitch = voiceSettings.pitch / 100;
      utterance.rate = voiceSettings.speed / 100;
      utterance.volume = voiceSettings.volume / 100;
      
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Waveform Visualizer */}
      <div className="h-32 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-2xl p-4 border border-cyan-500/30">
        <div className="flex items-end justify-center h-full gap-1">
          {waveform.map((height, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t transition-all duration-100"
              style={{
                height: isPlaying ? `${height}%` : '10%',
                width: '3px',
                animationDelay: `${index * 20}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Voice Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="text-cyan-300 font-medium">Pitch</label>
          <div className="space-y-2">
            <input
              type="range"
              min="50"
              max="150"
              value={voiceSettings.pitch}
              onChange={(e) => onVoiceChange('pitch', parseInt(e.target.value))}
              className="w-full slider-cyan"
            />
            <div className="text-xs text-white/60">Current: {voiceSettings.pitch}%</div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-purple-300 font-medium">Speed</label>
          <div className="space-y-2">
            <input
              type="range"
              min="50"
              max="150"
              value={voiceSettings.speed}
              onChange={(e) => onVoiceChange('speed', parseInt(e.target.value))}
              className="w-full slider-purple"
            />
            <div className="text-xs text-white/60">Current: {voiceSettings.speed}%</div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-pink-300 font-medium">Volume</label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={voiceSettings.volume}
              onChange={(e) => onVoiceChange('volume', parseInt(e.target.value))}
              className="w-full slider-pink"
            />
            <div className="text-xs text-white/60">Current: {voiceSettings.volume}%</div>
          </div>
        </div>
      </div>

      {/* Voice Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Robotic', 'Human-like', 'Ethereal', 'Deep'].map(type => (
          <button
            key={type}
            onClick={() => onVoiceChange('type', type)}
            className={`
              p-3 rounded-lg border transition-all duration-300 text-sm font-medium
              ${voiceSettings.type === type
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_15px_#00ffff40]'
                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Play Button */}
      <div className="text-center">
        <button
          onClick={playVoicePreview}
          disabled={isPlaying}
          className={`
            px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
            ${isPlaying
              ? 'bg-red-600/20 border-red-400 text-red-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400 text-cyan-200 hover:from-cyan-600/40 hover:to-purple-600/40 shadow-[0_0_20px_#00ffff40]'
            }
          `}
        >
          {isPlaying ? (
            <span className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              Playing Voice Preview...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <span>🎵</span>
              Test Voice Preview
            </span>
          )}
        </button>
      </div>

      <style>
        {`
          .slider-cyan::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #00ffff;
            cursor: pointer;
            box-shadow: 0 0 10px #00ffff80;
          }
          
          .slider-purple::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #8000ff;
            cursor: pointer;
            box-shadow: 0 0 10px #8000ff80;
          }
          
          .slider-pink::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #ff00ff;
            cursor: pointer;
            box-shadow: 0 0 10px #ff00ff80;
          }
        `}
      </style>
    </div>
  );
};

// ==================== QUANTUM FORM FIELD ====================
const QuantumFormField = ({ label, value, onChange, placeholder, type = "text", multiline = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [chars, setChars] = useState([]);

  useEffect(() => {
    if (isFocused) {
      const characters = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        char: Math.random().toString(36).charAt(2),
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2,
      }));
      setChars(characters);
    } else {
      setChars([]);
    }
  }, [isFocused]);

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="relative space-y-2">
      <label className="text-white/90 font-medium text-sm">{label}</label>
      
      <div className="relative">
        {/* Floating characters */}
        {chars.map(char => (
          <div
            key={char.id}
            className="absolute text-cyan-400 text-xs pointer-events-none animate-pulse"
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              opacity: char.opacity,
              animation: `float 3s ease-in-out infinite ${char.id * 0.1}s`
            }}
          >
            {char.char}
          </div>
        ))}
        
        <InputComponent
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 bg-black/40 border rounded-lg text-white placeholder-white/40 transition-all duration-300 backdrop-blur-sm
            ${isFocused 
              ? 'border-cyan-400 shadow-[0_0_20px_#00ffff40] bg-black/60' 
              : 'border-white/20 hover:border-white/40'
            }
            ${multiline ? 'h-24 resize-none' : ''}
          `}
          rows={multiline ? 4 : undefined}
        />
        
        {/* Glow effect */}
        {isFocused && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 pointer-events-none" />
        )}
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
          }
        `}
      </style>
    </div>
  );
};

// ==================== PERSONA CARD COMPONENT ====================
const PersonaCard = ({ persona, onChat, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPersonaColor = () => {
    const colors = ['#ff00ff', '#00ffff', '#ff0080', '#8000ff', '#00ff80', '#ff8000'];
    return colors[Math.abs(persona.name.charCodeAt(0)) % colors.length];
  };

  const personaColor = getPersonaColor();

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          relative backdrop-blur-md bg-black/40 border-2 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105
          ${isHovered ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.6)]' : 'border-white/20'}
        `}
        style={{
          animation: 'fadeInUp 0.6s ease-out forwards',
        }}
      >
        {/* Hologram effect */}
        {isHovered && (
          <div className="absolute inset-0 rounded-2xl opacity-50">
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `conic-gradient(from 0deg, ${personaColor}40, transparent, ${personaColor}40)`,
                animation: 'spin 3s linear infinite'
              }}
            />
          </div>
        )}

        <div className="relative z-10">
          {/* Avatar */}
          <div className="text-center mb-4">
            <div 
              className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold mx-auto relative overflow-hidden"
              style={{ 
                borderColor: personaColor,
                backgroundColor: `${personaColor}20`,
                boxShadow: `0 0 20px ${personaColor}80`
              }}
            >
              {persona.name.charAt(0).toUpperCase()}
              
              {/* Scanning effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-scan"
              />
            </div>
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">{persona.name}</h3>
            {persona.universe && (
              <div className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                {persona.universe}
              </div>
            )}
            <p className="text-sm text-white/70 line-clamp-2 h-10">
              {persona.description || "A mysterious entity from the digital realm..."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onChat(persona)}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400 text-cyan-200 hover:from-cyan-600/40 hover:to-purple-600/40 shadow-[0_0_15px_#00ffff40]"
            >
              💬 Chat
            </button>
            <button
              onClick={() => onDelete(persona)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 bg-red-600/20 border border-red-400 text-red-200 hover:bg-red-600/40"
            >
              🗑️
            </button>
          </div>

          {/* Created Date */}
          <div className="text-xs text-white/40 text-center mt-2">
            Created: {new Date(persona.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
};

// ==================== PERSONAS GALLERY SECTION ====================
const PersonasGallery = ({ personas, onPersonaChat, onPersonaDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-300 mb-2">
            Your Created Personas
          </h2>
          <p className="text-white/70">Loading your digital consciousness collection...</p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-300 mb-2">
            Your Created Personas
          </h2>
          <p className="text-white/70">No personas found. Create your first digital consciousness above!</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-xl font-bold text-purple-300 mb-2">Empty Neural Network</h3>
          <p className="text-white/60">
            Your persona collection is waiting to be populated. Use the creation lab above to manifest your first parallel self.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-300 mb-2">
          Your Created Personas
        </h2>
        <p className="text-white/70">
          {personas.length} digital consciousness{personas.length !== 1 ? 'es' : ''} in your collection
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {personas.map((persona, index) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            onChat={onPersonaChat}
            onDelete={onPersonaDelete}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== MAIN CREATE PERSONA COMPONENT ====================
const CreatePersona = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [personasLoading, setPersonasLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: '',
    backstory: '',
    avatar: null,
    voiceSettings: {
      pitch: 100,
      speed: 100,
      volume: 80,
      type: 'Human-like'
    },
    traits: {},
    specialties: [],
    quirks: '',
    goals: '',
    fears: '',
    temperature: 0.7,
    maxTokens: 1000,
  });

  const steps = [
    { id: 1, title: 'Neural Scan', subtitle: 'Initialize consciousness mapping' },
    { id: 2, title: 'Avatar Selection', subtitle: 'Choose your digital manifestation' },
    { id: 3, title: 'Personality Matrix', subtitle: 'Define core behavioral patterns' },
    { id: 4, title: 'Voice Synthesis', subtitle: 'Configure vocal parameters' },
    { id: 5, title: 'Identity Framework', subtitle: 'Establish narrative foundation' },
    { id: 6, title: 'Final Compilation', subtitle: 'Quantum consciousness assembly' },
  ];

  // ✅ FIXED: Fetch user personas with proper filtering
  useEffect(() => {
    let channel;

    const fetchPersonas = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setPersonasLoading(false);
          return;
        }

        // ✅ Only fetch user-created personas (universe is null)
        const { data, error } = await supabase
          .from('personas')
          .select('*')
          .eq('user_id', user.id)
          .is('universe', null)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching personas:', error);
          setPersonas([]);
        } else {
          console.log('Fetched user personas:', data?.length || 0);
          setPersonas(data || []);
        }

        // ✅ FIXED: Set up real-time subscription inside async function
        channel = supabase
          .channel('user-personas-realtime')
          .on(
            'postgres_changes',
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'personas',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              const newPersona = payload.new;
              console.log('New persona created:', newPersona);
              
              // Only add if it's user-created (no universe)
              if (!newPersona.universe) {
                setPersonas(prev => {
                  const exists = prev.some(p => p.id === newPersona.id);
                  return exists ? prev : [newPersona, ...prev];
                });
              }
            }
          )
          .on(
            'postgres_changes',
            { 
              event: 'DELETE', 
              schema: 'public', 
              table: 'personas',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              const deletedPersona = payload.old;
              console.log('Persona deleted:', deletedPersona);
              setPersonas(prev => prev.filter(p => p.id !== deletedPersona.id));
            }
          )
          .subscribe();

      } catch (error) {
        console.error('Error in fetchPersonas:', error);
        setPersonas([]);
      } finally {
        setPersonasLoading(false);
      }
    };

    fetchPersonas();

    // Cleanup function
    return () => {
      if (channel) {
        console.log('Cleaning up realtime subscription');
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleStepComplete = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    handleStepComplete();
  };

  const handleGeneratePersona = async () => {
    setIsGenerating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in to create a persona');
        return;
      }

      console.log('Creating persona for user:', user.id);

      // ✅ Save to Supabase with proper fields
      const { data, error } = await supabase
        .from('personas')
        .insert([
          {
            user_id: user.id,
            name: formData.name.trim(),
            description: formData.description.trim(),
            greeting: `Hello! I'm ${formData.name}. ${formData.personality || 'Nice to meet you!'}`.trim(),
            avatar_url: formData.avatar?.url || null,
            traits: Object.keys(formData.traits).length > 0 ? JSON.stringify(formData.traits) : null,
            universe: null, // ✅ Explicitly null for user-created personas
            theme: 'user-created', // ✅ Add identifier
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating persona:', error);
        alert('Failed to create persona. Please try again.');
      } else {
        console.log('Persona created successfully:', data);
        
        // ✅ Add to local state with duplicate prevention
        setPersonas(prev => {
          const exists = prev.some(p => p.id === data.id);
          return exists ? prev : [data, ...prev];
        });
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          personality: '',
          backstory: '',
          avatar: null,
          voiceSettings: {
            pitch: 100,
            speed: 100,
            volume: 80,
            type: 'Human-like'
          },
          traits: {},
          specialties: [],
          quirks: '',
          goals: '',
          fears: '',
          temperature: 0.7,
          maxTokens: 1000,
        });
        
        // Reset to first step
        setCurrentStep(1);
        
        // Scroll to personas section
        setTimeout(() => {
          const personasSection = document.getElementById('personas-gallery');
          if (personasSection) {
            personasSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error creating persona:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePersonaChat = (persona) => {
    console.log('Opening chat with persona:', persona.name);
    navigate(`/chat/${persona.id}`);
  };

  const handlePersonaDelete = async (persona) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${persona.name}? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      console.log('Deleting persona:', persona.id);

      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', persona.id);

      if (error) {
        console.error('Error deleting persona:', error);
        alert('Failed to delete persona. Please try again.');
      } else {
        console.log('Persona deleted successfully');
        // Remove from local state
        setPersonas(prev => prev.filter(p => p.id !== persona.id));
      }
    } catch (error) {
      console.error('Error in handlePersonaDelete:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0030] to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-2xl opacity-15 bg-gradient-to-l from-purple-800 via-pink-600 to-indigo-800" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,0,255,0.03)_2px,rgba(255,0,255,0.03)_4px)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PERSONA CREATION LAB
            </h1>
            <p className="text-white/60 text-sm mt-1">Quantum Consciousness Engineering</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-white/60">Step {currentStep} of {steps.length}</div>
            <div className="text-lg font-bold text-cyan-300">{steps[currentStep - 1]?.title}</div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  relative w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${currentStep >= step.id 
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_15px_#00ffff40]' 
                    : 'border-white/20 bg-white/5 text-white/40'
                  }
                `}>
                  {currentStep > step.id ? '✓' : step.id}
                  
                  {currentStep === step.id && (
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 md:w-24 h-0.5 mx-2 transition-all duration-300
                    ${currentStep > step.id ? 'bg-cyan-400' : 'bg-white/20'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/20 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,255,0.2)] mb-12">
            
            {/* Step Content */}
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-cyan-300">Neural Pattern Recognition</h2>
                <p className="text-white/70">Initializing quantum consciousness scan to map your parallel self...</p>
                
                <NeuralScanner 
                  isActive={isScanning} 
                  onComplete={handleScanComplete}
                />
                
                {!isScanning && (
                  <button
                    onClick={() => setIsScanning(true)}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400 rounded-xl text-cyan-200 font-bold hover:from-cyan-600/40 hover:to-purple-600/40 transition-all duration-300 shadow-[0_0_20px_#00ffff40]"
                  >
                    Begin Neural Scan
                  </button>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-300">Avatar Matrix Selection</h2>
                  <p className="text-white/70">Choose the digital manifestation of your parallel consciousness</p>
                </div>
                
                <DNAHelixAvatarPicker 
                  selectedAvatar={formData.avatar}
                  onSelect={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
                />
                
                <div className="text-center">
                  <button
                    onClick={handleStepComplete}
                    disabled={!formData.avatar}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400 rounded-xl text-purple-200 font-bold hover:from-purple-600/40 hover:to-pink-600/40 transition-all duration-300 shadow-[0_0_20px_#8000ff40] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Avatar Selection
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-pink-300">Personality Matrix Configuration</h2>
                  <p className="text-white/70">Fine-tune the behavioral patterns and cognitive traits</p>
                </div>
                
                <PersonalityMixer 
                  traits={formData.traits}
                  onTraitChange={(trait, value) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      traits: { ...prev.traits, [trait]: value }
                    }))
                  }
                />
                
                <div className="text-center">
                  <button
                    onClick={handleStepComplete}
                    className="px-8 py-3 bg-gradient-to-r from-pink-600/20 to-red-600/20 border border-pink-400 rounded-xl text-pink-200 font-bold hover:from-pink-600/40 hover:to-red-600/40 transition-all duration-300 shadow-[0_0_20px_#ff00ff40]"
                  >
                    Lock Personality Matrix
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-cyan-300">Voice Synthesis Engine</h2>
                  <p className="text-white/70">Configure the vocal signature of your digital twin</p>
                </div>
                
                <VoiceSynthesizer 
                  voiceSettings={formData.voiceSettings}
                  onVoiceChange={(key, value) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      voiceSettings: { ...prev.voiceSettings, [key]: value }
                    }))
                  }
                />
                
                <div className="text-center">
                  <button
                    onClick={handleStepComplete}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400 rounded-xl text-cyan-200 font-bold hover:from-cyan-600/40 hover:to-blue-600/40 transition-all duration-300 shadow-[0_0_20px_#00ffff40]"
                  >
                    Synthesize Voice Profile
                  </button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-yellow-300">Identity Framework Assembly</h2>
                  <p className="text-white/70">Define the narrative foundation and core memories</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <QuantumFormField
                    label="Persona Name"
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                    placeholder="Enter the name of your parallel self..."
                  />
                  
                  <QuantumFormField
                    label="Core Specialty"
                    value={formData.personality}
                    onChange={(value) => setFormData(prev => ({ ...prev, personality: value }))}
                    placeholder="Primary expertise or focus area..."
                  />
                </div>

                <QuantumFormField
                  label="Backstory & Origin"
                  value={formData.backstory}
                  onChange={(value) => setFormData(prev => ({ ...prev, backstory: value }))}
                  placeholder="Describe the origin story and background of this persona..."
                  multiline
                />

                <QuantumFormField
                  label="Personality Description"
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  placeholder="Detailed description of personality, quirks, and behavioral patterns..."
                  multiline
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <QuantumFormField
                    label="Goals & Aspirations"
                    value={formData.goals}
                    onChange={(value) => setFormData(prev => ({ ...prev, goals: value }))}
                    placeholder="What does this persona strive for?"
                    multiline
                  />
                  
                  <QuantumFormField
                    label="Fears & Limitations"
                    value={formData.fears}
                    onChange={(value) => setFormData(prev => ({ ...prev, fears: value }))}
                    placeholder="What challenges or concerns them?"
                    multiline
                  />
                </div>
                
                <div className="text-center">
                  <button
                    onClick={handleStepComplete}
                    disabled={!formData.name || !formData.description}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400 rounded-xl text-yellow-200 font-bold hover:from-yellow-600/40 hover:to-orange-600/40 transition-all duration-300 shadow-[0_0_20px_#ffff0040] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Compile Identity Matrix
                  </button>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-8 text-center">
                <div>
                  <h2 className="text-3xl font-bold text-green-300 mb-2">Quantum Consciousness Assembly</h2>
                  <p className="text-white/70">Your parallel self is ready for manifestation</p>
                </div>

                {/* Persona Preview */}
                <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl p-8 border border-green-500/30">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                      <img
                        src={formData.avatar?.url}
                        alt={formData.avatar?.name}
                        className="w-32 h-32 rounded-full border-4 border-green-400 shadow-[0_0_30px_#00ff0080] object-cover"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-transparent animate-pulse" />
                    </div>
                    
                    <div className="text-left space-y-4 flex-1">
                      <h3 className="text-2xl font-bold text-green-300">{formData.name}</h3>
                      <p className="text-white/90">{formData.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-300 font-medium">Avatar:</span>
                          <span className="text-white/70 ml-2">{formData.avatar?.name}</span>
                        </div>
                        <div>
                          <span className="text-green-300 font-medium">Voice:</span>
                          <span className="text-white/70 ml-2">{formData.voiceSettings.type}</span>
                        </div>
                        <div>
                          <span className="text-green-300 font-medium">Specialty:</span>
                          <span className="text-white/70 ml-2">{formData.personality}</span>
                        </div>
                        <div>
                          <span className="text-green-300 font-medium">Traits:</span>
                          <span className="text-white/70 ml-2">{Object.keys(formData.traits).length} configured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generation Button */}
                <button
                  onClick={handleGeneratePersona}
                  disabled={isGenerating}
                  className={`
                    px-12 py-6 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105
                    ${isGenerating
                      ? 'bg-orange-600/20 border-orange-400 text-orange-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-400 text-green-200 hover:from-green-600/40 hover:to-blue-600/40 shadow-[0_0_30px_#00ff0080]'
                    }
                  `}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-4">
                      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      ASSEMBLING CONSCIOUSNESS...
                    </span>
                  ) : (
                    <span className="flex items-center gap-4">
                      <span>⚡</span>
                      MANIFEST PARALLEL SELF
                      <span>⚡</span>
                    </span>
                  )}
                </button>

                {isGenerating && (
                  <div className="text-center space-y-2 animate-pulse">
                    <div className="text-orange-300 font-medium">Neural pathways: ACTIVE</div>
                    <div className="text-orange-300 font-medium">Quantum entanglement: STABILIZING</div>
                    <div className="text-orange-300 font-medium">Consciousness matrix: COMPILING</div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* ✅ PERSONAS GALLERY SECTION - FIXED FILTERING */}
        <div id="personas-gallery" className="max-w-6xl mx-auto">
          <div className="bg-black/20 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,255,0.2)]">
            <PersonasGallery 
              personas={personas}
              onPersonaChat={handlePersonaChat}
              onPersonaDelete={handlePersonaDelete}
              loading={personasLoading}
            />
          </div>
        </div>
      </main>

      {/* Global Styles */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CreatePersona;
