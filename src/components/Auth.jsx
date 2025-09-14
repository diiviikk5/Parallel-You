import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseclient';
import logo from '../assets/logo.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// ==================== ANIMATED BACKGROUND COMPONENT ====================
const CyberBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        color: ['#ff00ff', '#00ffff', '#ff0080', '#8000ff'][Math.floor(Math.random() * 4)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `${particle.color}20`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

// ==================== GLITCH TEXT COMPONENT ====================
const GlitchText = ({ children, className = "" }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    }, 3000);

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
            ? '2px 0 #ff00ff, -2px 0 #00ffff, 0 2px #ffff00'
            : '0 0 10px #ff00ff80',
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

// ==================== NEON BUTTON COMPONENT ====================
const NeonButton = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const variants = {
    primary: "bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-400 text-pink-200 hover:from-pink-500/40 hover:to-purple-600/40 shadow-[0_0_20px_#ff00ff40]",
    secondary: "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-cyan-200 hover:from-cyan-500/40 hover:to-blue-600/40 shadow-[0_0_20px_#00ffff40]",
    outline: "bg-transparent border-white/30 text-white/90 hover:border-pink-400 hover:text-pink-200 hover:shadow-[0_0_15px_#ff00ff60]"
  };

  const handleClick = (e) => {
    if (disabled) return;
    
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden px-6 py-3 rounded-xl font-bold border-2 transition-all duration-300 transform hover:scale-105
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
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
      
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// ==================== CYBER INPUT COMPONENT ====================
const CyberInput = ({ type, placeholder, value, onChange, icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isFocused) {
      const newParticles = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.3,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isFocused]);

  return (
    <div className="relative">
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-cyan-400 text-xs pointer-events-none animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animation: `float 2s ease-in-out infinite ${particle.id * 0.1}s`
          }}
        >
          ✦
        </div>
      ))}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 z-10">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-4 ${icon ? 'pl-12' : ''} 
            bg-black/40 border-2 rounded-xl text-white placeholder-white/50 
            transition-all duration-300 backdrop-blur-sm font-medium
            ${isFocused 
              ? 'border-pink-400 shadow-[0_0_25px_#ff00ff60] bg-black/60' 
              : 'border-white/20 hover:border-white/40'
            }
          `}
        />
        
        {/* Glow effect */}
        {isFocused && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

// ==================== MAIN AUTH COMPONENT ====================
const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0030] to-black text-white relative overflow-hidden">
        
        {/* Animated Background */}
        <CyberBackground />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,rgba(255,0,255,0.03)_50px,rgba(255,0,255,0.03)_52px)] bg-[repeating-linear-gradient(0deg,transparent,transparent_50px,rgba(0,255,255,0.03)_50px,rgba(0,255,255,0.03)_52px)]" />
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex">
          
          {/* Left Side - Landing Content */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
            
            {/* Hero Section */}
            <div className="max-w-2xl">
              <div className="mb-8">
                <img 
                  src={logo} 
                  alt="Parallel You Logo" 
                  className="h-20 mb-6 drop-shadow-[0_0_20px_#ff00ff80]" 
                />
              </div>

              <GlitchText className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                PARALLEL YOU
              </GlitchText>
              
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white/90 leading-tight">
                Create Infinite <span className="text-pink-400">Narrative Universes</span> & 
                Chat with <span className="text-cyan-400">AI Characters</span>
              </h2>
              
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                Design custom worlds, create unique characters with rich personalities, 
                and experience stories that come alive through advanced AI conversations.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400 flex items-center justify-center">
                    🌌
                  </div>
                  Infinite Universe Creation
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                    🎭
                  </div>
                  30+ Character Avatars
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center">
                    💬
                  </div>
                  AI-Powered Conversations
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-400 flex items-center justify-center">
                    🎨
                  </div>
                  Cyberpunk UI Design
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <NeonButton 
                  onClick={() => setShowAuth(true)}
                  variant="primary"
                  className="text-lg px-8 py-4"
                >
                   Start Creating ➡️
                </NeonButton>
                <NeonButton 
                  onClick={() => window.open('https://github.com/diiviikk5/Parallel-You', '_blank')}
                  variant="outline"
                  className="text-lg px-8 py-4"
                >
                  ⭐ View on GitHub
                </NeonButton>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Panel */}
          <div className={`
            w-full lg:w-96 flex items-center justify-center p-8 transition-all duration-500 transform
            ${showAuth ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'}
          `}>
            <div className="w-full max-w-md">
              
              {/* Auth Card */}
              <div className="bg-black/40 backdrop-blur-md border-2 border-pink-500/50 rounded-3xl p-8 shadow-[0_0_40px_#ff00ff40] relative overflow-hidden">
                
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5" />
                
                <div className="relative z-10">
                  {/* Auth Header */}
                  <div className="text-center mb-8">
                    <GlitchText className="text-3xl font-bold text-pink-300 mb-2">
                      {isLogin ? 'Welcome Back' : 'Join the Multiverse'}
                    </GlitchText>
                    <p className="text-white/60">
                      {isLogin ? 'Access your parallel universes' : 'Create your first universe'}
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 mb-6 text-red-200 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {/* Auth Form */}
                  <div className="space-y-6 mb-6">
                    <CyberInput
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon="📧"
                    />

                    <CyberInput
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon="🔒"
                    />

                    <NeonButton
                      onClick={handleAuth}
                      disabled={isLoading}
                      variant="primary"
                      className="w-full py-4 text-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          {isLogin ? ' Enter Multiverse' : '✨ Create Account'}
                        </>
                      )}
                    </NeonButton>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-black/40 text-white/60">or continue with</span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <div className="mb-6">
                    <div className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl p-3 transition-all duration-300 cursor-pointer">
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={(error) => setError('Google login failed')}
                        theme="filled_blue"
                        size="large"
                        width="100%"
                      />
                    </div>
                  </div>

                  {/* Toggle Auth Mode */}
                  <div className="text-center">
                    <p className="text-white/60 text-sm">
                      {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                      <button
                        className="text-pink-400 hover:text-pink-300 font-medium underline transition-colors"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setError('');
                        }}
                      >
                        {isLogin ? 'Create one' : 'Sign in'}
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Close Button */}
              {showAuth && (
                <button
                  onClick={() => setShowAuth(false)}
                  className="lg:hidden mt-4 w-full text-white/60 hover:text-white text-sm transition-colors"
                >
                  ← Back to Landing
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Global Styles */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(180deg); }
          }
          
          @keyframes ripple {
            to { transform: scale(20); opacity: 0; }
          }
        `}</style>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
