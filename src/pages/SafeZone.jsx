// src/pages/SafeZone.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseclient";

// ==================== BREATHING ANIMATION COMPONENT ====================
const BreathingOrb = ({ isActive, onComplete }) => {
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale, pause
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const breathingPattern = {
      inhale: { duration: 4000, next: 'hold', instruction: 'Breathe In' },
      hold: { duration: 2000, next: 'exhale', instruction: 'Hold' },
      exhale: { duration: 6000, next: 'pause', instruction: 'Breathe Out' },
      pause: { duration: 1000, next: 'inhale', instruction: 'Rest' }
    };

    const currentPhase = breathingPattern[breathPhase];
    let startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.ceil((currentPhase.duration - elapsed) / 1000);
      setTimeLeft(Math.max(0, remaining));

      if (elapsed >= currentPhase.duration) {
        setBreathPhase(currentPhase.next);
        if (currentPhase.next === 'inhale') {
          const newCount = cycleCount + 1;
          setCycleCount(newCount);
          if (newCount >= 5) {
            onComplete?.();
            return;
          }
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [breathPhase, cycleCount, isActive, onComplete]);

  const getOrbSize = () => {
    switch(breathPhase) {
      case 'inhale': return 'scale-150';
      case 'hold': return 'scale-150';
      case 'exhale': return 'scale-75';
      case 'pause': return 'scale-75';
      default: return 'scale-100';
    }
  };

  const getOrbColor = () => {
    switch(breathPhase) {
      case 'inhale': return 'from-cyan-400 to-blue-500';
      case 'hold': return 'from-purple-400 to-indigo-500';
      case 'exhale': return 'from-pink-400 to-rose-500';
      case 'pause': return 'from-green-400 to-emerald-500';
      default: return 'from-cyan-400 to-blue-500';
    }
  };

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="relative">
        <div 
          className={`
            w-40 h-40 rounded-full bg-gradient-to-br ${getOrbColor()} 
            transition-all duration-1000 ease-in-out ${getOrbSize()}
            shadow-[0_0_60px_rgba(0,255,255,0.6)] animate-pulse
          `}
        />
        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-spin" style={{ animationDuration: '8s' }} />
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-2">
          {breathPhase.charAt(0).toUpperCase() + breathPhase.slice(1)}
        </div>
        <div className="text-6xl font-bold text-cyan-400 mb-4">{timeLeft}</div>
        <div className="text-white/70">Cycle {cycleCount + 1} of 5</div>
      </div>
    </div>
  );
};

// ==================== AMBIENT SOUND PLAYER ====================
const AmbientPlayer = () => {
  const [currentSound, setCurrentSound] = useState(null);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef(null);

  const sounds = [
    { id: 'rain', name: '🌧️ Rain', description: 'Gentle rainfall sounds', color: '#00ffff' },
    { id: 'forest', name: '🌲 Forest', description: 'Birds and nature sounds', color: '#00ff80' },
    { id: 'ocean', name: '🌊 Ocean', description: 'Calming ocean waves', color: '#0080ff' },
    { id: 'fire', name: '🔥 Fireplace', description: 'Crackling fire sounds', color: '#ff8000' },
    { id: 'space', name: '🌌 Space', description: 'Cosmic ambient tones', color: '#8000ff' },
    { id: 'meditation', name: '🧘 Zen', description: 'Meditation singing bowls', color: '#ff00ff' },
  ];

  const playSound = (sound) => {
    if (currentSound === sound.id) {
      setCurrentSound(null);
      audioRef.current?.pause();
    } else {
      setCurrentSound(sound.id);
      // In a real app, you'd load and play actual audio files here
      console.log(`Playing: ${sound.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-300 mb-2">Ambient Soundscape</h3>
        <p className="text-white/70">Create your perfect relaxation atmosphere</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sounds.map(sound => (
          <button
            key={sound.id}
            onClick={() => playSound(sound)}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
              ${currentSound === sound.id 
                ? `border-white shadow-[0_0_25px_${sound.color}80] bg-white/10` 
                : 'border-white/20 bg-white/5 hover:border-white/40'
              }
            `}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{sound.name.split(' ')[0]}</div>
              <div className="font-medium text-white text-sm">{sound.name.split(' ').slice(1).join(' ')}</div>
              <div className="text-xs text-white/60 mt-1">{sound.description}</div>
            </div>
            
            {currentSound === sound.id && (
              <div className="absolute inset-0 rounded-2xl">
                <div 
                  className="absolute inset-0 rounded-2xl opacity-20"
                  style={{
                    background: `conic-gradient(from 0deg, ${sound.color}, transparent, ${sound.color})`,
                    animation: 'spin 4s linear infinite'
                  }}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {currentSound && (
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">Volume</span>
            <span className="text-cyan-400">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider-cyan"
          />
        </div>
      )}
    </div>
  );
};

// ==================== MOOD TRACKER ====================
const MoodTracker = () => {
  const [todayMood, setTodayMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  const moods = [
    { id: 'amazing', emoji: '🌟', label: 'Amazing', color: '#ffff00' },
    { id: 'happy', emoji: '😊', label: 'Happy', color: '#00ff80' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: '#00ffff' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#ffffff' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: '#8000ff' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: '#ff8000' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: '#0080ff' },
  ];

  const selectMood = (mood) => {
    setTodayMood(mood);
    const today = new Date().toDateString();
    const newEntry = { date: today, mood: mood.id, timestamp: new Date().toISOString() };
    
    // In a real app, this would save to Supabase
    setMoodHistory(prev => [newEntry, ...prev.filter(entry => entry.date !== today)]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-cyan-300 mb-2">Mood Check-in</h3>
        <p className="text-white/70">How are you feeling right now?</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
        {moods.map(mood => (
          <button
            key={mood.id}
            onClick={() => selectMood(mood)}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110
              ${todayMood?.id === mood.id 
                ? `border-white shadow-[0_0_25px_${mood.color}80] bg-white/10` 
                : 'border-white/20 bg-white/5 hover:border-white/40'
              }
            `}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="text-xs text-white font-medium">{mood.label}</div>
            </div>
          </button>
        ))}
      </div>

      {todayMood && (
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-2xl p-6 border border-green-500/30 text-center">
          <div className="text-2xl mb-2">{todayMood.emoji}</div>
          <div className="text-lg font-bold text-green-300 mb-2">Feeling {todayMood.label}</div>
          <p className="text-white/70 text-sm">Great! Your mood has been logged for today.</p>
        </div>
      )}
    </div>
  );
};

// ==================== INSPIRATIONAL QUOTES ====================
const QuoteDisplay = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const quotes = [
    { text: "In every parallel universe, there's a version of you living your dreams.", author: "Parallel You" },
    { text: "Your mental health is just as important as your physical health.", author: "Anonymous" },
    { text: "Taking care of yourself isn't selfish, it's essential.", author: "Anonymous" },
    { text: "Every small step forward is progress worth celebrating.", author: "Anonymous" },
    { text: "In the cyber realm of infinite possibilities, peace is always within reach.", author: "Digital Sage" },
    { text: "Sometimes the most productive thing you can do is rest.", author: "Anonymous" },
    { text: "Your feelings are valid, your struggles are real, and your healing matters.", author: "Anonymous" },
  ];

  const nextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
      setIsAnimating(false);
    }, 300);
  };

  const quote = quotes[currentQuote];

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-3xl p-8 border border-purple-500/30 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
      
      <div className={`relative z-10 transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
        <div className="text-6xl mb-6">💭</div>
        <blockquote className="text-xl md:text-2xl font-medium text-white mb-4 leading-relaxed">
          "{quote.text}"
        </blockquote>
        <cite className="text-purple-300 font-medium">— {quote.author}</cite>
      </div>

      <button
        onClick={nextQuote}
        className="mt-8 px-6 py-3 bg-purple-600/20 border border-purple-400 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-all duration-300 transform hover:scale-105"
      >
        ✨ New Inspiration
      </button>
    </div>
  );
};

// ==================== MAIN SAFE ZONE COMPONENT ====================
const SafeZone = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState('overview');
  const [isBreathing, setIsBreathing] = useState(false);

  const features = [
    { id: 'overview', title: 'Safe Space', icon: '🛡️', description: 'Your digital sanctuary' },
    { id: 'breathing', title: 'Breathe', icon: '🫁', description: 'Guided breathing exercises' },
    { id: 'sounds', title: 'Ambient', icon: '🎵', description: 'Relaxing soundscapes' },
    { id: 'mood', title: 'Mood', icon: '💭', description: 'Track your feelings' },
    { id: 'quotes', title: 'Inspire', icon: '✨', description: 'Daily motivation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0030] to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-gradient-to-l from-cyan-800 via-purple-600 to-indigo-800" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,255,255,0.02)_2px,rgba(0,255,255,0.02)_4px)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SAFE ZONE
            </h1>
            <p className="text-white/60 text-sm mt-1">Your Digital Sanctuary • Peace • Mindfulness • Healing</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-white/60">Mental Health</div>
            <div className="text-lg font-bold text-cyan-300">Priority One</div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex gap-2 overflow-x-auto">
              {features.map(feature => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                    ${activeFeature === feature.id
                      ? 'bg-gradient-to-r from-cyan-600/40 to-purple-600/40 text-white shadow-[0_0_20px_#00ffff40]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span>{feature.icon}</span>
                  <span>{feature.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            
            {activeFeature === 'overview' && (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="text-center space-y-6">
                  <div className="text-8xl mb-4">🛡️</div>
                  <h2 className="text-4xl font-bold text-cyan-300">Welcome to Your Safe Zone</h2>
                  <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                    In the vast digital multiverse, everyone deserves a place of peace and healing. 
                    This is your sanctuary—a space designed for mindfulness, reflection, and mental wellness.
                  </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  {features.slice(1).map((feature, index) => (
                    <button
                      key={feature.id}
                      onClick={() => setActiveFeature(feature.id)}
                      className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-cyan-400/50 hover:shadow-[0_0_25px_#00ffff30] transition-all duration-300 text-left group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/70">{feature.description}</p>
                    </button>
                  ))}
                </div>

                {/* Mental Health Reminder */}
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-3xl p-8 border border-green-500/30 text-center">
                  <div className="text-4xl mb-4">💚</div>
                  <h3 className="text-2xl font-bold text-green-300 mb-4">Remember</h3>
                  <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                    It's okay to not be okay. Taking care of your mental health is not selfish—it's necessary. 
                    You are worthy of love, care, and all the good things life has to offer.
                  </p>
                  <div className="mt-6 text-sm text-white/60">
                    If you're in crisis, please reach out to a mental health professional or crisis hotline.
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'breathing' && (
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-bold text-cyan-300">Breathing Exercise</h2>
                <p className="text-white/70 text-lg">
                  Follow the guided breathing pattern to reduce stress and find your center
                </p>

                {!isBreathing ? (
                  <div className="space-y-8">
                    <div className="text-6xl">🫁</div>
                    <div className="space-y-4">
                      <p className="text-white/80">Ready for a 5-cycle breathing exercise?</p>
                      <p className="text-white/60 text-sm">4 seconds in • 2 seconds hold • 6 seconds out • 1 second pause</p>
                    </div>
                    <button
                      onClick={() => setIsBreathing(true)}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400 rounded-xl text-cyan-200 font-bold hover:from-cyan-600/40 hover:to-blue-600/40 transition-all duration-300 shadow-[0_0_20px_#00ffff40]"
                    >
                      🧘‍♀️ Begin Breathing
                    </button>
                  </div>
                ) : (
                  <BreathingOrb 
                    isActive={isBreathing}
                    onComplete={() => setIsBreathing(false)}
                  />
                )}

                {!isBreathing && (
                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/30">
                    <h4 className="text-lg font-bold text-blue-300 mb-3">Benefits of Deep Breathing</h4>
                    <ul className="text-white/70 text-left space-y-2 max-w-md mx-auto">
                      <li>• Reduces stress and anxiety</li>
                      <li>• Lowers blood pressure</li>
                      <li>• Improves focus and clarity</li>
                      <li>• Promotes relaxation</li>
                      <li>• Helps regulate emotions</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeFeature === 'sounds' && <AmbientPlayer />}
            {activeFeature === 'mood' && <MoodTracker />}
            {activeFeature === 'quotes' && <QuoteDisplay />}

          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .slider-cyan::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #00ffff;
            cursor: pointer;
            box-shadow: 0 0 10px #00ffff80;
          }
        `}
      </style>
    </div>
  );
};

export default SafeZone;
