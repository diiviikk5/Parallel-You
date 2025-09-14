// src/pages/Enhancement.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseclient";

// ==================== NEURAL ENHANCEMENT SCANNER ====================
const NeuralScanner = ({ onScanComplete, isActive }) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedPatterns, setDetectedPatterns] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('initialization');

  const phases = [
    { name: 'initialization', duration: 2000, label: 'Initializing Neural Interface...' },
    { name: 'cognitive_scan', duration: 3000, label: 'Scanning Cognitive Patterns...' },
    { name: 'personality_analysis', duration: 2500, label: 'Analyzing Personality Matrix...' },
    { name: 'enhancement_mapping', duration: 3500, label: 'Mapping Enhancement Pathways...' },
    { name: 'optimization', duration: 2000, label: 'Optimizing Neural Networks...' },
    { name: 'complete', duration: 1000, label: 'Enhancement Protocol Ready!' }
  ];

  useEffect(() => {
    if (!isActive) return;

    let phaseIndex = 0;
    let startTime = Date.now();

    const updateScan = () => {
      const currentPhaseData = phases[phaseIndex];
      if (!currentPhaseData) return;

      const elapsed = Date.now() - startTime;
      const phaseProgress = Math.min(elapsed / currentPhaseData.duration, 1);
      
      // Calculate overall progress
      const overallProgress = ((phaseIndex + phaseProgress) / phases.length) * 100;
      setScanProgress(overallProgress);
      setCurrentPhase(currentPhaseData.name);

      // Generate patterns during cognitive scan
      if (currentPhaseData.name === 'cognitive_scan' && Math.random() > 0.7) {
        const patterns = [
          'Enhanced Pattern Recognition',
          'Accelerated Learning Pathways', 
          'Optimized Memory Consolidation',
          'Improved Focus Networks',
          'Creative Synthesis Boost'
        ];
        setDetectedPatterns(prev => {
          const newPattern = patterns[Math.floor(Math.random() * patterns.length)];
          return prev.includes(newPattern) ? prev : [...prev, newPattern];
        });
      }

      if (phaseProgress >= 1) {
        phaseIndex++;
        startTime = Date.now();
        if (phaseIndex >= phases.length) {
          onScanComplete();
          return;
        }
      }

      requestAnimationFrame(updateScan);
    };

    updateScan();
  }, [isActive, onScanComplete]);

  if (!isActive) return null;

  return (
    <div className="bg-black/40 backdrop-blur-md border border-cyan-500/50 rounded-3xl p-8 relative overflow-hidden">
      {/* Neural Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 grid-rows-8 gap-1 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div
              key={i}
              className={`bg-cyan-400 rounded-sm transition-all duration-300 ${
                Math.random() > 0.7 ? 'opacity-100 animate-pulse' : 'opacity-20'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Brain Visualization */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Brain outline */}
              <path
                d="M100 30 C130 30, 160 50, 160 90 C170 100, 170 120, 160 130 C160 150, 130 170, 100 170 C70 170, 40 150, 40 130 C30 120, 30 100, 40 90 C40 50, 70 30, 100 30 Z"
                fill="none"
                stroke="#00ffff"
                strokeWidth="3"
                className="animate-pulse"
                style={{ filter: 'drop-shadow(0 0 10px #00ffff80)' }}
              />
              
              {/* Neural pathways */}
              {detectedPatterns.map((_, index) => (
                <g key={index}>
                  <circle
                    cx={60 + (index * 20)}
                    cy={80 + (index * 15)}
                    r="3"
                    fill="#ff00ff"
                    className="animate-ping"
                  />
                  <line
                    x1={60 + (index * 20)}
                    y1={80 + (index * 15)}
                    x2={140 - (index * 15)}
                    y2={120 + (index * 10)}
                    stroke="#00ffff"
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                </g>
              ))}
              
              {/* Scanning beam */}
              <line
                x1="0"
                y1={100}
                x2="200"
                y2={100}
                stroke="#ffff00"
                strokeWidth="2"
                opacity="0.8"
                style={{
                  transform: `translateY(${(scanProgress / 100) * 140 - 70}px)`,
                  filter: 'drop-shadow(0 0 10px #ffff0080)'
                }}
              />
            </svg>
          </div>
        </div>

        {/* Scan Info */}
        <div className="text-center space-y-4 mb-6">
          <div className="text-2xl font-bold text-cyan-300">
            {phases.find(p => p.name === currentPhase)?.label}
          </div>
          <div className="text-4xl font-mono text-white">{Math.round(scanProgress)}%</div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 relative"
              style={{ width: `${scanProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Detected Patterns */}
        {detectedPatterns.length > 0 && (
          <div className="space-y-2">
            <div className="text-lg font-bold text-pink-300 mb-3">Detected Enhancement Patterns:</div>
            {detectedPatterns.map((pattern, index) => (
              <div
                key={pattern}
                className="flex items-center gap-3 text-green-300 text-sm animate-fadeInLeft"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>✓ {pattern}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== COGNITIVE ENHANCEMENT MODULES ====================
const CognitiveModule = ({ module, isUnlocked, onActivate, isActive }) => {
  const [level, setLevel] = useState(module.currentLevel || 1);
  const [experience, setExperience] = useState(module.experience || 0);

  const getModuleColor = () => {
    const colors = {
      'memory': '#ff00ff',
      'focus': '#00ffff', 
      'creativity': '#ff8000',
      'logic': '#8000ff',
      'learning': '#00ff80',
      'intuition': '#ff0080'
    };
    return colors[module.type] || '#ffffff';
  };

  const moduleColor = getModuleColor();
  const experienceToNext = level * 100;
  const progressPercent = (experience / experienceToNext) * 100;

  return (
    <div className={`
      relative bg-black/30 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-500
      ${isUnlocked 
        ? `border-white/40 hover:border-white hover:shadow-[0_0_30px_${moduleColor}60]` 
        : 'border-red-500/30 opacity-60'
      }
      ${isActive ? `shadow-[0_0_40px_${moduleColor}80] scale-105` : ''}
    `}>
      
      {/* Module Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl"
            style={{ 
              borderColor: moduleColor,
              backgroundColor: `${moduleColor}20`,
              boxShadow: `0 0 15px ${moduleColor}60`
            }}
          >
            {module.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{module.name}</h3>
            <div className="text-xs text-white/60">Level {level}</div>
          </div>
        </div>
        
        {isUnlocked && (
          <button
            onClick={() => onActivate(module)}
            disabled={isActive}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
              ${isActive
                ? 'bg-green-500/20 border border-green-400 text-green-200'
                : `bg-${moduleColor.slice(1)}/20 border hover:scale-105`
              }
            `}
            style={{ 
              borderColor: moduleColor,
              color: isActive ? '#4ade80' : moduleColor
            }}
          >
            {isActive ? '🟢 Active' : '⚡ Activate'}
          </button>
        )}
      </div>

      {/* Module Description */}
      <p className="text-white/70 text-sm mb-4">{module.description}</p>

      {/* Experience Progress */}
      {isUnlocked && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span>Experience</span>
            <span>{experience}/{experienceToNext} XP</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progressPercent}%`,
                backgroundColor: moduleColor,
                boxShadow: `0 0 10px ${moduleColor}60`
              }}
            />
          </div>
        </div>
      )}

      {/* Enhancement Effects */}
      {isActive && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
          <div className="text-green-300 text-sm font-medium mb-2">Active Effects:</div>
          <ul className="text-green-200 text-xs space-y-1">
            {module.effects.map((effect, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                {effect}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Unlock Requirements */}
      {!isUnlocked && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
          <div className="text-red-300 text-sm font-medium mb-2">🔒 Locked</div>
          <div className="text-red-200 text-xs">{module.unlockRequirement}</div>
        </div>
      )}
    </div>
  );
};

// ==================== SKILL TREE VISUALIZATION ====================
const SkillTree = ({ modules, unlockedModules, onModuleSelect }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Draw neural network connections
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Connection lines
    const connections = [
      { from: [100, 300], to: [300, 200], active: unlockedModules.includes('memory') },
      { from: [100, 300], to: [300, 400], active: unlockedModules.includes('focus') },
      { from: [300, 200], to: [500, 150], active: unlockedModules.includes('creativity') },
      { from: [300, 400], to: [500, 450], active: unlockedModules.includes('logic') },
      { from: [500, 150], to: [700, 300], active: unlockedModules.includes('learning') },
      { from: [500, 450], to: [700, 300], active: unlockedModules.includes('intuition') },
    ];

    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.from[0], conn.from[1]);
      ctx.lineTo(conn.to[0], conn.to[1]);
      ctx.strokeStyle = conn.active ? '#00ffff80' : '#ffffff20';
      ctx.lineWidth = conn.active ? 3 : 1;
      ctx.stroke();
      
      // Add animated particles on active connections
      if (conn.active) {
        const particles = 3;
        for (let i = 0; i < particles; i++) {
          const progress = (Date.now() / 1000 + i) % 2 / 2;
          const x = conn.from[0] + (conn.to[0] - conn.from[0]) * progress;
          const y = conn.from[1] + (conn.to[1] - conn.from[1]) * progress;
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#00ffff';
          ctx.fill();
        }
      }
    });

    const animationFrame = requestAnimationFrame(() => {
      // Redraw for particle animation
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [unlockedModules]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-96 border border-cyan-500/30 rounded-2xl bg-black/20 backdrop-blur-sm"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-cyan-300 font-bold text-lg mb-2">Neural Enhancement Network</div>
          <div className="text-white/60 text-sm">
            {unlockedModules.length} of {modules.length} modules unlocked
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN ENHANCEMENT COMPONENT ====================
const Enhancement = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [activeModules, setActiveModules] = useState([]);
  const [unlockedModules, setUnlockedModules] = useState(['memory', 'focus']);
  const [userStats, setUserStats] = useState({
    totalEnhancements: 0,
    activeTime: 0,
    experiencePoints: 150,
    level: 3
  });

  const enhancementModules = [
    {
      id: 'memory',
      name: 'Memory Amplifier',
      icon: '🧠',
      type: 'memory',
      description: 'Enhance memory retention, recall speed, and pattern recognition capabilities.',
      effects: [
        '+40% Information retention',
        '+25% Recall speed',
        'Enhanced pattern recognition',
        'Improved working memory'
      ],
      unlockRequirement: 'Complete initial neural scan',
      currentLevel: 2,
      experience: 75
    },
    {
      id: 'focus',
      name: 'Attention Matrix',
      icon: '🎯',
      type: 'focus',
      description: 'Boost concentration, reduce distractions, and maintain flow states longer.',
      effects: [
        '+60% Focus duration',
        'Distraction filtering',
        'Enhanced flow states',
        'Improved task switching'
      ],
      unlockRequirement: 'Complete initial neural scan',
      currentLevel: 1,
      experience: 40
    },
    {
      id: 'creativity',
      name: 'Creative Synthesis',
      icon: '🎨',
      type: 'creativity',
      description: 'Amplify creative thinking, idea generation, and innovative problem solving.',
      effects: [
        '+50% Idea generation',
        'Cross-domain thinking',
        'Enhanced imagination',
        'Pattern synthesis'
      ],
      unlockRequirement: 'Reach Memory Amplifier Level 2',
      currentLevel: 0,
      experience: 0
    },
    {
      id: 'logic',
      name: 'Logic Processor',
      icon: '⚡',
      type: 'logic',
      description: 'Enhance analytical thinking, problem-solving speed, and logical reasoning.',
      effects: [
        '+45% Processing speed',
        'Enhanced deduction',
        'Improved analysis',
        'Faster problem solving'
      ],
      unlockRequirement: 'Reach Focus Level 2',
      currentLevel: 0,
      experience: 0
    },
    {
      id: 'learning',
      name: 'Learning Accelerator',
      icon: '📚',
      type: 'learning',
      description: 'Accelerate skill acquisition, knowledge integration, and adaptive learning.',
      effects: [
        '+70% Learning speed',
        'Enhanced comprehension',
        'Skill transfer boost',
        'Adaptive learning'
      ],
      unlockRequirement: 'Unlock Creative Synthesis',
      currentLevel: 0,
      experience: 0
    },
    {
      id: 'intuition',
      name: 'Intuition Engine',
      icon: '🔮',
      type: 'intuition',
      description: 'Develop gut instincts, pattern sensing, and subconscious processing.',
      effects: [
        'Enhanced gut instincts',
        'Subconscious processing',
        'Pattern sensing',
        'Emotional intelligence'
      ],
      unlockRequirement: 'Unlock Logic Processor',
      currentLevel: 0,
      experience: 0
    }
  ];

  const views = [
    { id: 'overview', title: 'Overview', icon: '🏠', description: 'Enhancement dashboard' },
    { id: 'modules', title: 'Modules', icon: '⚡', description: 'Cognitive enhancements' },
    { id: 'progress', title: 'Progress', icon: '📊', description: 'Stats and achievements' },
    { id: 'research', title: 'Research', icon: '🔬', description: 'New enhancements' }
  ];

  const handleScanComplete = () => {
    setScanCompleted(true);
    setIsScanning(false);
    // Unlock basic modules
    setUnlockedModules(prev => [...new Set([...prev, 'memory', 'focus'])]);
  };

  const activateModule = (module) => {
    if (activeModules.length >= 3) {
      alert('Maximum 3 modules can be active simultaneously');
      return;
    }
    
    setActiveModules(prev => [...prev, module.id]);
    setUserStats(prev => ({
      ...prev,
      totalEnhancements: prev.totalEnhancements + 1,
      experiencePoints: prev.experiencePoints + 25
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0030] to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-gradient-to-l from-cyan-800 via-purple-600 to-indigo-800" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_3px,rgba(255,0,255,0.02)_3px,rgba(255,0,255,0.02)_6px)]" />
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
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              ENHANCEMENT LAB
            </h1>
            <p className="text-white/60 text-sm mt-1">Cognitive Augmentation • Neural Optimization • Peak Performance</p>
          </div>

          <div className="text-right space-y-1">
            <div className="text-sm text-white/60">Enhancement Level</div>
            <div className="text-2xl font-bold text-cyan-300">{userStats.level}</div>
            <div className="text-xs text-pink-400">{userStats.experiencePoints} XP</div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex gap-2 overflow-x-auto">
              {views.map(view => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                    ${currentView === view.id
                      ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white shadow-[0_0_20px_#ff00ff40]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span>{view.icon}</span>
                  <span>{view.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            
            {currentView === 'overview' && (
              <div className="space-y-8">
                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{activeModules.length}/3</div>
                    <div className="text-white/70 text-sm">Active Modules</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{unlockedModules.length}</div>
                    <div className="text-white/70 text-sm">Unlocked</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-2">{userStats.totalEnhancements}</div>
                    <div className="text-white/70 text-sm">Enhancements</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">{userStats.level}</div>
                    <div className="text-white/70 text-sm">Enhancement Level</div>
                  </div>
                </div>

                {/* Neural Scan Section */}
                {!scanCompleted ? (
                  <div className="text-center space-y-8">
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold text-purple-300">Neural Interface Required</h2>
                      <p className="text-white/80 text-lg max-w-3xl mx-auto">
                        Before we can begin cognitive enhancement, we need to map your unique neural patterns. 
                        This advanced scan will identify your strengths and optimize enhancement pathways.
                      </p>
                    </div>

                    {!isScanning ? (
                      <button
                        onClick={() => setIsScanning(true)}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400 rounded-xl text-purple-200 font-bold hover:from-purple-600/40 hover:to-pink-600/40 transition-all duration-300 shadow-[0_0_20px_#8000ff40] text-lg transform hover:scale-105"
                      >
                        🧠 Initialize Neural Scan
                      </button>
                    ) : (
                      <NeuralScanner isActive={isScanning} onScanComplete={handleScanComplete} />
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Active Modules */}
                    <div className="bg-black/40 backdrop-blur-md border border-green-500/30 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-green-300 mb-4">🟢 Active Enhancements</h3>
                      {activeModules.length > 0 ? (
                        <div className="space-y-3">
                          {activeModules.map(moduleId => {
                            const module = enhancementModules.find(m => m.id === moduleId);
                            return (
                              <div key={moduleId} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                                <span className="text-2xl">{module.icon}</span>
                                <div>
                                  <div className="font-medium text-green-200">{module.name}</div>
                                  <div className="text-xs text-green-300">Level {module.currentLevel} • Active</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-white/60">
                          <div className="text-4xl mb-2">⚡</div>
                          <p>No active enhancements. Visit the Modules tab to activate your first enhancement.</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-cyan-300 mb-4">⚡ Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setCurrentView('modules')}
                          className="w-full p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-left hover:bg-cyan-500/20 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🧠</span>
                            <div>
                              <div className="font-medium text-cyan-200">Activate Modules</div>
                              <div className="text-xs text-cyan-300">Browse and activate cognitive enhancements</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setCurrentView('progress')}
                          className="w-full p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg text-left hover:bg-purple-500/20 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📊</span>
                            <div>
                              <div className="font-medium text-purple-200">View Progress</div>
                              <div className="text-xs text-purple-300">Check your enhancement statistics</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setCurrentView('research')}
                          className="w-full p-4 bg-pink-500/10 border border-pink-400/30 rounded-lg text-left hover:bg-pink-500/20 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🔬</span>
                            <div>
                              <div className="font-medium text-pink-200">Research Lab</div>
                              <div className="text-xs text-pink-300">Discover new enhancement technologies</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === 'modules' && scanCompleted && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-purple-300 mb-2">Cognitive Enhancement Modules</h2>
                  <p className="text-white/70">
                    Activate up to 3 modules simultaneously. Each module provides unique cognitive benefits.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enhancementModules.map(module => (
                    <CognitiveModule
                      key={module.id}
                      module={module}
                      isUnlocked={unlockedModules.includes(module.id)}
                      onActivate={activateModule}
                      isActive={activeModules.includes(module.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentView === 'progress' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-cyan-300 mb-2">Enhancement Progress</h2>
                  <p className="text-white/70">Track your cognitive development and achievements</p>
                </div>

                <SkillTree 
                  modules={enhancementModules}
                  unlockedModules={unlockedModules}
                  onModuleSelect={(module) => console.log('Selected:', module)}
                />

                {/* Achievement Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-6 border border-yellow-500/30 text-center">
                    <div className="text-4xl mb-4">🏆</div>
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">Neural Pioneer</h3>
                    <p className="text-white/70 text-sm">Completed first neural scan and unlocked basic enhancements</p>
                    <div className="mt-4 text-xs text-yellow-400">Unlocked • 50 XP</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30 text-center opacity-60">
                    <div className="text-4xl mb-4">🧠</div>
                    <h3 className="text-xl font-bold text-purple-300 mb-2">Mind Master</h3>
                    <p className="text-white/70 text-sm">Activate all 6 enhancement modules simultaneously</p>
                    <div className="mt-4 text-xs text-white/50">Locked • 200 XP</div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-6 border border-cyan-500/30 text-center opacity-60">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-2">Enhancement Savant</h3>
                    <p className="text-white/70 text-sm">Reach maximum level in any enhancement module</p>
                    <div className="mt-4 text-xs text-white/50">Locked • 500 XP</div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'research' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-pink-300 mb-2">Research Laboratory</h2>
                  <p className="text-white/70">Experimental enhancements and cutting-edge cognitive technologies</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Experimental Modules */}
                  <div className="bg-black/40 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-pink-300 mb-6">🧪 Experimental Modules</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Quantum Consciousness', progress: 15, description: 'Access parallel universe insights' },
                        { name: 'Time Perception Modifier', progress: 42, description: 'Alter subjective time experience' },
                        { name: 'Synesthetic Enhancement', progress: 8, description: 'Cross-sensory cognitive abilities' }
                      ].map((research, index) => (
                        <div key={index} className="p-4 bg-pink-500/10 border border-pink-400/30 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-pink-200">{research.name}</h4>
                            <span className="text-xs text-pink-300">{research.progress}%</span>
                          </div>
                          <p className="text-white/70 text-sm mb-3">{research.description}</p>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className="h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300"
                              style={{ width: `${research.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Neural Network Simulator */}
                  <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-6">🌐 Neural Simulation</h3>
                    <div className="aspect-square bg-black/60 rounded-xl border border-cyan-400/30 p-4 mb-4">
                      <div className="w-full h-full relative">
                        {/* Simulated neural network visualization */}
                        <svg width="100%" height="100%" viewBox="0 0 300 300">
                          {/* Nodes */}
                          {Array.from({length: 20}).map((_, i) => (
                            <circle
                              key={i}
                              cx={50 + (i % 5) * 50}
                              cy={50 + Math.floor(i / 5) * 50}
                              r="8"
                              fill="#00ffff"
                              opacity="0.8"
                              className="animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                          {/* Connections */}
                          {Array.from({length: 15}).map((_, i) => (
                            <line
                              key={i}
                              x1={50 + ((i * 3) % 5) * 50}
                              y1={50 + Math.floor((i * 3) / 5) * 50}
                              x2={50 + ((i * 7) % 5) * 50}
                              y2={50 + Math.floor((i * 7) / 5) * 50}
                              stroke="#00ffff"
                              strokeWidth="2"
                              opacity="0.4"
                            />
                          ))}
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-cyan-200">
                      <div className="flex justify-between">
                        <span>Neural Plasticity:</span>
                        <span className="text-cyan-400">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Synapse Density:</span>
                        <span className="text-cyan-400">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Speed:</span>
                        <span className="text-cyan-400">2.4x Baseline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>
        {`
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Enhancement;
