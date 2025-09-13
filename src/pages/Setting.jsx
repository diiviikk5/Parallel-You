// src/pages/Setting.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseclient";

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

// ==================== NEON BUTTON COMPONENT ====================
const NeonButton = ({ children, onClick, className = "", variant = "pink", disabled = false, loading = false, ...props }) => {
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
    green: {
      border: 'border-green-500',
      bg: 'bg-green-500/20',
      hover: 'hover:bg-green-500/40',
      shadow: 'shadow-[0_0_20px_#00ff0080]',
      text: 'text-green-200',
    },
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    
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
      disabled={disabled || loading}
      className={`
        relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-300
        ${colorSet.border} ${colorSet.bg} ${colorSet.hover} ${colorSet.shadow} ${colorSet.text}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
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
      
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </span>
      
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

// ==================== QUANTUM INPUT FIELD ====================
const QuantumInput = ({ label, value, onChange, placeholder, type = "text", readOnly = false, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isFocused && !readOnly) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.3,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isFocused, readOnly]);

  return (
    <div className="relative space-y-2">
      <label className="text-white/90 font-medium text-sm flex items-center gap-2">
        {label}
        {required && <span className="text-pink-400">*</span>}
      </label>
      
      <div className="relative">
        {/* Floating particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animation: `float 3s ease-in-out infinite ${particle.id * 0.2}s`
            }}
          />
        ))}
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 bg-black/40 border rounded-lg text-white placeholder-white/40 transition-all duration-300 backdrop-blur-sm
            ${readOnly 
              ? 'border-gray-600 cursor-not-allowed text-gray-400' 
              : isFocused 
                ? 'border-cyan-400 shadow-[0_0_20px_#00ffff40] bg-black/60' 
                : 'border-white/20 hover:border-white/40'
            }
          `}
        />
        
        {/* Glow effect */}
        {isFocused && !readOnly && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 pointer-events-none" />
        )}
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(180deg); }
          }
        `}
      </style>
    </div>
  );
};

// ==================== SYSTEM TOGGLE COMPONENT ====================
const SystemToggle = ({ label, description, enabled, onChange, variant = "cyan" }) => {
  const colors = {
    cyan: { bg: 'bg-cyan-500', shadow: 'shadow-[0_0_15px_#00ffff80]' },
    pink: { bg: 'bg-pink-500', shadow: 'shadow-[0_0_15px_#ff00ff80]' },
    green: { bg: 'bg-green-500', shadow: 'shadow-[0_0_15px_#00ff0080]' },
  };

  return (
    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10 hover:border-white/20 transition-all">
      <div className="flex-1">
        <div className="text-white font-medium">{label}</div>
        <div className="text-white/60 text-sm">{description}</div>
      </div>
      
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none
          ${enabled 
            ? `${colors[variant].bg} ${colors[variant].shadow}` 
            : 'bg-gray-700'
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
          `}
        >
          {/* Quantum particles for enabled state */}
          {enabled && (
            <div className="absolute inset-0 rounded-full">
              <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ top: '20%', left: '20%' }} />
              <div className="absolute w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ top: '70%', right: '20%', animationDelay: '0.2s' }} />
              <div className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ top: '50%', left: '10%', animationDelay: '0.4s' }} />
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

// ==================== PROFILE HOLOGRAM ====================
const ProfileHologram = ({ userData }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      {/* Hologram rings */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-cyan-400/30 rounded-full"
            style={{
              inset: `${i * 8}px`,
              animation: `holoRotate ${2 + i}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Profile Avatar */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-500/40 to-purple-500/40 backdrop-blur-sm border border-cyan-400/50 flex items-center justify-center overflow-hidden">
        <div className="text-4xl text-white">
          {userData?.username ? userData.username.charAt(0).toUpperCase() : '?'}
        </div>
        
        {/* Scan line effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
          style={{
            animation: 'scanVertical 2s linear infinite',
          }}
        />
      </div>

      {/* Data streams */}
      <div className="absolute -inset-8 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-4 bg-cyan-400 opacity-60"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + Math.sin(rotation * 0.1 + i) * 20}%`,
              animation: `dataStream 1s ease-in-out infinite ${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes holoRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes scanVertical {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes dataStream {
            0%, 100% { opacity: 0.6; transform: scaleY(1); }
            50% { opacity: 1; transform: scaleY(1.5); }
          }
        `}
      </style>
    </div>
  );
};

// ==================== MAIN SETTINGS COMPONENT ====================
const Setting = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "", email: "", id: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({ username: "" });
  
  // System preferences
  const [preferences, setPreferences] = useState({
    notifications: true,
    autoSave: true,
    enhancedEffects: true,
    darkMode: true,
    soundEffects: false,
    privacyMode: false,
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.user) {
          setStatus("❌ Authentication required");
          return;
        }

        const { id, email } = session.user;
        const newUserData = { id, email, username: "" };

        const { data, error: fetchError } = await supabase
          .from("users")
          .select("username")
          .eq("id", id)
          .single();

        if (!fetchError && data) {
          newUserData.username = data.username || "";
        }

        setUserData(newUserData);
        setFormData({ username: newUserData.username });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setStatus("❌ Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  // Save profile settings
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Synchronizing neural patterns...");

    try {
      const { error } = await supabase
        .from("users")
        .upsert({ id: userData.id, username: formData.username });

      if (error) throw error;

      setUserData(prev => ({ ...prev, username: formData.username }));
      setStatus("✅ Profile synchronized successfully!");
      
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setStatus("❌ Synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
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
            className="flex items-center gap-3 text-cyan-300 hover:text-cyan-200 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center group-hover:shadow-[0_0_15px_#00ffff40] transition-all">
              ←
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="text-center">
            <GlitchText className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              SYSTEM CONFIGURATION
            </GlitchText>
            <p className="text-white/60 text-sm mt-1">Neural Interface Settings • Profile Management</p>
          </div>

          <div className="text-right text-sm text-white/60">
            <div>User ID: {userData.id.slice(0, 8)}...</div>
            <div>Status: AUTHENTICATED</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-black/20 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,0,255,0.2)]">
              <h2 className="text-2xl font-bold text-pink-300 mb-6 text-center">
                <GlitchText>Neural Profile</GlitchText>
              </h2>

              <ProfileHologram userData={userData} />

              <div className="space-y-4 text-center">
                <div>
                  <div className="text-sm text-white/60">Identity Matrix</div>
                  <div className="text-white font-bold text-lg">{userData.username || "Unregistered"}</div>
                </div>
                
                <div>
                  <div className="text-sm text-white/60">Neural Link</div>
                  <div className="text-white/80 text-sm font-mono">{userData.email}</div>
                </div>
                
                <div>
                  <div className="text-sm text-white/60">Quantum ID</div>
                  <div className="text-white/80 text-xs font-mono">{userData.id}</div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <NeonButton
                    onClick={handleLogout}
                    variant="pink"
                    className="w-full"
                    loading={loading}
                  >
                    🚪 Disconnect Session
                  </NeonButton>
                </div>
              </div>
            </div>

            {/* Status Display */}
            {status && (
              <div className={`
                p-4 rounded-lg border backdrop-blur-sm
                ${status.includes('✅') 
                  ? 'bg-green-500/20 border-green-500/40 text-green-200' 
                  : status.includes('❌')
                  ? 'bg-red-500/20 border-red-500/40 text-red-200'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'
                }
              `}>
                <div className="text-sm font-medium">{status}</div>
              </div>
            )}
          </div>

          {/* Settings Panels */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Profile Settings */}
            <div className="bg-black/20 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.2)]">
              <h3 className="text-xl font-bold text-cyan-300 mb-6">
                <GlitchText>Identity Configuration</GlitchText>
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <QuantumInput
                  label="Display Name"
                  value={formData.username}
                  onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
                  placeholder="Enter your neural identity..."
                  required
                />

                <QuantumInput
                  label="Neural Link Address"
                  value={userData.email}
                  readOnly
                />

                <div className="flex justify-end">
                  <NeonButton
                    type="submit"
                    variant="cyan"
                    loading={loading}
                    disabled={!formData.username.trim()}
                  >
                    💾 Synchronize Profile
                  </NeonButton>
                </div>
              </form>
            </div>

            {/* System Preferences */}
            <div className="bg-black/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(128,0,255,0.2)]">
              <h3 className="text-xl font-bold text-purple-300 mb-6">
                <GlitchText>Neural Interface Preferences</GlitchText>
              </h3>

              <div className="space-y-4">
                <SystemToggle
                  label="Quantum Notifications"
                  description="Receive real-time system alerts and updates"
                  enabled={preferences.notifications}
                  onChange={(value) => setPreferences(prev => ({ ...prev, notifications: value }))}
                  variant="cyan"
                />

                <SystemToggle
                  label="Auto-Synchronization"
                  description="Automatically save changes to neural patterns"
                  enabled={preferences.autoSave}
                  onChange={(value) => setPreferences(prev => ({ ...prev, autoSave: value }))}
                  variant="green"
                />

                <SystemToggle
                  label="Enhanced Visual Effects"
                  description="Enable advanced holographic and particle effects"
                  enabled={preferences.enhancedEffects}
                  onChange={(value) => setPreferences(prev => ({ ...prev, enhancedEffects: value }))}
                  variant="pink"
                />

                <SystemToggle
                  label="Neural Audio Feedback"
                  description="Play system sounds and neural feedback tones"
                  enabled={preferences.soundEffects}
                  onChange={(value) => setPreferences(prev => ({ ...prev, soundEffects: value }))}
                  variant="cyan"
                />

                <SystemToggle
                  label="Privacy Shield"
                  description="Enhanced privacy mode for sensitive operations"
                  enabled={preferences.privacyMode}
                  onChange={(value) => setPreferences(prev => ({ ...prev, privacyMode: value }))}
                  variant="pink"
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-black/20 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,0,0.2)]">
              <h3 className="text-xl font-bold text-yellow-300 mb-6">
                <GlitchText>Advanced Configuration</GlitchText>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Data Management</h4>
                  <div className="space-y-2">
                    <NeonButton variant="cyan" className="w-full text-sm py-2">
                      📦 Export Neural Data
                    </NeonButton>
                    <NeonButton variant="pink" className="w-full text-sm py-2">
                      🗑️ Clear Cache Memory
                    </NeonButton>
                    <NeonButton variant="green" className="w-full text-sm py-2">
                      🔄 Sync Multiverse Data
                    </NeonButton>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">System Diagnostics</h4>
                  <div className="space-y-2">
                    <NeonButton variant="cyan" className="w-full text-sm py-2">
                      🔍 Run Neural Scan
                    </NeonButton>
                    <NeonButton variant="pink" className="w-full text-sm py-2">
                      ⚡ Test Quantum Link
                    </NeonButton>
                    <NeonButton variant="green" className="w-full text-sm py-2">
                      📊 Generate Report
                    </NeonButton>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Setting;
