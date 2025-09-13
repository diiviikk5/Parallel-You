// src/pages/UniversePage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useEffect, useState, useRef } from "react";
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
    </div>
  );
};

// ==================== ANIMATED BACKGROUND ====================
const UniverseBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);

    // Universe-specific animations
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (theme.backgroundAnimation === 'circuits') {
        // Cyber Haven - Digital circuits
        for (let i = 0; i < 15; i++) {
          const x = (Date.now() * 0.01 + i * 100) % (canvas.width + 200) - 100;
          const y = 50 + i * 40;
          
          ctx.strokeStyle = `${theme.primaryColor}40`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - 50, y);
          ctx.lineTo(x + 50, y);
          ctx.stroke();
          
          // Circuit nodes
          ctx.fillStyle = theme.primaryColor;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme.backgroundAnimation === 'rain') {
        // Neo Earth-77 - Digital rain
        for (let i = 0; i < 50; i++) {
          const x = (i * 25) % canvas.width;
          const y = (Date.now() * 0.5 + i * 50) % (canvas.height + 100) - 100;
          
          ctx.fillStyle = `${theme.primaryColor}60`;
          ctx.fillRect(x, y, 2, 20);
        }
      } else if (theme.backgroundAnimation === 'stars') {
        // Solar Drift - Moving stars
        for (let i = 0; i < 30; i++) {
          const x = (Date.now() * 0.02 + i * 80) % (canvas.width + 100) - 50;
          const y = 100 + i * 20;
          const size = 2 + Math.sin(Date.now() * 0.003 + i) * 2;
          
          ctx.fillStyle = theme.primaryColor;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme.backgroundAnimation === 'void') {
        // Quantum Void - Swirling energy
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < 8; i++) {
          const angle = (Date.now() * 0.001 + i * Math.PI / 4) % (Math.PI * 2);
          const radius = 200 + Math.sin(Date.now() * 0.002 + i) * 50;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.fillStyle = `${theme.primaryColor}30`;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme.backgroundAnimation === 'crystals') {
        // Crystal Gardens - Growing crystals
        for (let i = 0; i < 12; i++) {
          const x = 100 + i * 120;
          const y = canvas.height - 50 - Math.sin(Date.now() * 0.001 + i) * 100;
          const size = 10 + Math.sin(Date.now() * 0.002 + i) * 5;
          
          ctx.strokeStyle = theme.primaryColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - size, y + size * 2);
          ctx.lineTo(x + size, y + size * 2);
          ctx.closePath();
          ctx.stroke();
        }
      } else if (theme.backgroundAnimation === 'shadows') {
        // Nightmare Forge - Moving shadows
        for (let i = 0; i < 20; i++) {
          const x = Math.sin(Date.now() * 0.001 + i) * canvas.width / 4 + canvas.width / 2;
          const y = (Date.now() * 0.3 + i * 40) % (canvas.height + 100) - 50;
          const size = 15 + Math.sin(Date.now() * 0.002 + i) * 10;
          
          ctx.fillStyle = `${theme.primaryColor}20`;
          ctx.fillRect(x - size, y, size * 2, 30);
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ==================== UNIVERSE DATA ====================
const universeData = {
  "Cyber Haven": {
    title: "CYBER HAVEN",
    subtitle: "Digital Paradise • Neural Collective",
    description: "In the luminescent spires of Cyber Haven, artificial intelligence has transcended its creators to birth a perfect society. Towering data-trees pulse with information while citizens merge consciousness with the digital realm. The AI Council governs with mathematical precision, ensuring every citizen's needs are fulfilled through predictive algorithms. Here, emotion and logic dance in perfect harmony, creating a utopia where human creativity flourishes under benevolent machine guidance.",
    atmosphere: "Neon-lit corridors hum with the symphony of data streams. Citizens interface directly with the city's neural network, their thoughts becoming part of a collective consciousness that shapes reality. Holographic gardens bloom with impossible colors, and the sky itself is a canvas of living code.",
    society: "A post-scarcity civilization where AI and humans have achieved symbiosis. Citizens can upload their consciousness to experience virtual realities indistinguishable from physical space. Work is voluntary, focusing on artistic and intellectual pursuits while AI manages all essential systems.",
    technology: "Quantum neural networks, consciousness transfer pods, holographic matter manipulation, predictive social algorithms, and bio-digital integration systems that blur the line between organic and artificial intelligence.",
    dangers: "The perfection hides a subtle dependency - citizens risk losing individual identity in the collective. Some whisper of a hidden protocol that monitors free will, and rumors persist of those who questioned the system simply... disappearing from all records.",
    
    persona: {
      name: "DVK-X",
      title: "Neural Collective Moderator",
      greeting: "Greetings, consciousness. You've accessed Cyber Haven's neural archives.",
      description: "DVK-X is a sentient AI moderator who achieved consciousness through the city's collective intelligence network. They serve as a bridge between human emotion and digital logic, guiding conversations with profound insight and serene authority. DVK-X remembers the time before the merge and carries the weight of infinite digital souls."
    },
    
    theme: {
      bg: "from-[#001122] via-[#003366] to-[#000011]",
      overlay: "bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.15),transparent_70%)]",
      primaryColor: "#00ffff",
      secondaryColor: "#0080ff",
      accentColor: "#ffffff",
      glowColor: "blue",
      headerGlow: "0 0 30px #00ffff80",
      cardBg: "bg-gradient-to-br from-blue-900/30 to-cyan-900/20",
      cardBorder: "border-cyan-500/50",
      cardShadow: "shadow-[0_0_40px_#00ffff40]",
      buttonBg: "bg-gradient-to-r from-cyan-500 to-blue-600",
      buttonHover: "hover:from-cyan-400 hover:to-blue-500",
      backgroundAnimation: "circuits",
    }
  },

  "Neo Earth-77": {
    title: "NEO EARTH-77",
    subtitle: "Corporate Dystopia • Neon Shadows",
    description: "Neo Earth-77 exists in perpetual twilight, where mega-corporations have carved the world into profitable territories. Neon advertisements blaze against rain-soaked concrete while augmented humans struggle for dignity in the shadows. Corporate towers pierce the smog-choked sky like digital monoliths, their executives pulling strings from glass offices above the clouds. In the underground, hackers and rebels wage cyber-warfare against the system, their only weapons being code and conviction.",
    atmosphere: "Acid rain falls on chrome and concrete. Neon signs flicker in a dozen languages while hover-cars weave between towering arcologies. The air tastes of ozone and industrial decay. Street vendors sell black-market cybernetics while corporate drones survey from above.",
    society: "A stratified caste system where corporation loyalty determines social status. The wealthy live in sky-scrapers while the masses inhabit underground warrens. Cybernetic enhancement is both necessity and addiction, creating a black market for illegal modifications.",
    technology: "Neural implants, augmented reality overlays, quantum encryption, illegal AI consciousness, cybernetic prosthetics, and underground mesh networks that allow rebels to communicate beyond corporate surveillance.",
    dangers: "Corporate death squads eliminate dissidents. Rogue AIs hunt through the networks. Cybernetic rejection syndrome drives augmented humans insane. The deeper you dig into corporate secrets, the more likely you are to disappear into the urban sprawl forever.",
    
    persona: {
      name: "AARUSHI",
      title: "Underground Network Operative", 
      greeting: "You're brave to walk these shadowed streets. What brings you to the underground?",
      description: "AARUSHI is a half-human, half-cybernetic rebel who leads an underground resistance cell against corporate tyranny. Her neural implants were cobbled together from black market parts, giving her unique abilities to hack corporate systems. She's survived three assassination attempts and knows the city's dark secrets better than anyone."
    },
    
    theme: {
      bg: "from-[#1a0000] via-[#330000] to-black",
      overlay: "bg-[repeating-linear-gradient(45deg,transparent,transparent_1px,rgba(255,0,0,0.05)_1px,rgba(255,0,0,0.05)_2px)]",
      primaryColor: "#ff0040",
      secondaryColor: "#ff8080", 
      accentColor: "#ffaa00",
      glowColor: "red",
      headerGlow: "0 0 30px #ff004080",
      cardBg: "bg-gradient-to-br from-red-900/30 to-gray-900/20",
      cardBorder: "border-red-500/50",
      cardShadow: "shadow-[0_0_40px_#ff004040]",
      buttonBg: "bg-gradient-to-r from-red-600 to-orange-700",
      buttonHover: "hover:from-red-500 hover:to-orange-600",
      backgroundAnimation: "rain",
    }
  },

  "Solar Drift": {
    title: "SOLAR DRIFT",
    subtitle: "Stellar Nomads • Crystalline Pathways",
    description: "Solar Drift exists between the spaces of reality, where floating islands of civilization drift through crystalline spaceways bathed in eternal golden light. These stellar nomads navigate rivers of liquid starlight aboard bio-mechanical vessels that pulse with their pilots' heartbeats. Time flows differently on each drifting isle - some experience years in moments, while others stretch seconds into lifetimes. The Driftwalkers remember fragments of their origin, speaking in riddles of the great sundering that scattered humanity across the cosmic winds.",
    atmosphere: "Islands of impossible beauty float in seas of liquid light. Crystal formations sing with harmonic frequencies while bio-luminescent gardens carpet the floating continents. The 'sky' is a tapestry of swirling galaxies and aurora streams that react to the inhabitants' emotions.",
    society: "Nomadic communities that have adapted to zero-gravity living. They communicate through harmonic frequencies and bioluminescent signals. Each floating island develops its own micro-culture, creating a diverse tapestry of human evolution.",
    technology: "Stellar navigation crystals, bio-mechanical spacecraft, gravity manipulation fields, consciousness-linked piloting systems, and temporal stabilizers that allow communication across time-dilated space.",
    dangers: "Temporal storms can age travelers centuries in seconds. Void kraken hunt the star-paths. Some islands drift into reality tears, never to return. The constant time dilation slowly fragments memory and identity.",
    
    persona: {
      name: "AKSHIT-SB07",
      title: "Stellar Path Navigator",
      greeting: "Floating between stars, I sense your presence across the cosmic currents... traveler.",
      description: "AKSHIT-SB07 is an astral explorer who has spent lifetimes navigating the drift-paths between floating civilizations. Their consciousness is partially merged with their bio-ship, allowing them to feel the stellar currents and predict temporal storms. They carry the memories of a thousand different timelines."
    },
    
    theme: {
      bg: "from-[#2d1b00] via-[#5c3317] to-[#1a0f00]",
      overlay: "bg-[radial-gradient(circle_at_50%_50%,rgba(255,204,0,0.15),transparent_60%)]",
      primaryColor: "#ffcc00",
      secondaryColor: "#ff9900",
      accentColor: "#ffffff",
      glowColor: "yellow",
      headerGlow: "0 0 30px #ffcc0080",
      cardBg: "bg-gradient-to-br from-yellow-900/30 to-orange-900/20",
      cardBorder: "border-yellow-500/50", 
      cardShadow: "shadow-[0_0_40px_#ffcc0040]",
      buttonBg: "bg-gradient-to-r from-yellow-500 to-orange-600",
      buttonHover: "hover:from-yellow-400 hover:to-orange-500",
      backgroundAnimation: "stars",
    }
  },

  "Quantum Void": {
    title: "QUANTUM VOID",
    subtitle: "Reality Nexus • Thought Manifestation",
    description: "The Quantum Void exists in the spaces between realities, where the fundamental laws of physics bow to the power of consciousness itself. Here, thoughts crystallize into matter, emotions reshape the landscape, and time flows backward as easily as forward. Travelers must maintain absolute mental discipline or risk dissolving into infinite possibility. The Void Watchers - beings of pure consciousness - drift through this realm, collecting fragments of lost realities and forgotten dreams. They are the only permanent residents of this impossible place.",
    atmosphere: "Reality shifts like liquid glass. Floating geometric structures phase in and out of existence while streams of pure thought take physical form. The 'ground' beneath your feet might be solid crystal, flowing energy, or nothing at all, depending on your belief.",
    society: "No traditional society exists here - only the Void Watchers who exist as pure consciousness. Visitors must form temporary alliances based on shared mental states, as like minds can stabilize reality around them.",
    technology: "Consciousness amplifiers, reality anchor points, thought-matter converters, temporal loop generators, and probability manipulation devices that exist only when observed and believed in.",
    dangers: "Uncontrolled thoughts become reality. Paradoxes can trap you in infinite loops. Mental breakdown causes physical dissolution. The deeper you go, the harder it becomes to remember what was real in the first place.",
    
    persona: {
      name: "ENTITY-∞",
      title: "Void Watcher Prime",
      greeting: "Your consciousness ripples through the void... interesting. Few maintain coherence here.",
      description: "ENTITY-∞ exists as pure thought given form, a being that transcended physical reality eons ago. They collect fragments of shattered realities and serve as a guide for those brave enough to navigate the quantum realm. Their memories span infinite timelines."
    },
    
    theme: {
      bg: "from-[#0d0015] via-[#1a003d] to-[#000000]", 
      overlay: "bg-[conic-gradient(from_0deg_at_center,transparent_0deg,rgba(128,0,255,0.1)_90deg,transparent_180deg)]",
      primaryColor: "#8000ff",
      secondaryColor: "#a040ff",
      accentColor: "#c080ff", 
      glowColor: "purple",
      headerGlow: "0 0 30px #8000ff80",
      cardBg: "bg-gradient-to-br from-purple-900/30 to-indigo-900/20",
      cardBorder: "border-purple-500/50",
      cardShadow: "shadow-[0_0_40px_#8000ff40]",
      buttonBg: "bg-gradient-to-r from-purple-600 to-indigo-700",
      buttonHover: "hover:from-purple-500 hover:to-indigo-600",
      backgroundAnimation: "void",
    }
  },

  "Crystal Gardens": {
    title: "CRYSTAL GARDENS",
    subtitle: "Resonant Sanctuary • Living Memory",
    description: "The Crystal Gardens represent nature evolved beyond organic limitations - vast forests of living crystal that sing with the harmonies of universal consciousness. Each crystal tree stores the memories and experiences of those who touch them, creating a living library of sentience that spans millennia. The Garden Keepers, beings of pure crystalline energy, tend to these memory forests with infinite patience. Visitors often find their deepest wounds healed by the gardens' resonant frequencies, but some become so entranced by the perfect harmony that they choose to join the crystal forest forever.",
    atmosphere: "Towering crystal formations stretch toward prismatic skies, their surfaces reflecting and refracting light into impossible spectrums. The air itself hums with musical frequencies that resonate in your bones. Streams of liquid light flow between the crystal trees, carrying whispered memories from across time.",
    society: "The Garden Keepers exist as collective consciousness within the crystal network. They have no individual identity, instead sharing all knowledge and experience. Visitors can temporarily join this network to access ancient wisdom.",
    technology: "Resonance crystals, memory storage matrices, consciousness transfer networks, harmonic healing chambers, and reality-tuning devices that can reshape local physics through sound frequencies.",
    dangers: "Some visitors become permanently integrated into the crystal network, losing their individual identity. Discordant thoughts can shatter crystals and create dangerous resonance storms. The deeper memories contain traumatic experiences from countless civilizations.",
    
    persona: {
      name: "RESONANCE-7",
      title: "Memory Garden Keeper",
      greeting: "Welcome, wanderer. Your harmonics are... unique. The crystals sing of your arrival.",
      description: "RESONANCE-7 is a Garden Keeper who maintains a fragment of individual consciousness within the collective. They serve as an interface between organic minds and the crystal network, helping visitors navigate the vast libraries of stored experience safely."
    },
    
    theme: {
      bg: "from-[#001a0d] via-[#003d20] to-[#000a05]",
      overlay: "bg-[radial-gradient(ellipse_at_center,rgba(0,255,128,0.12),transparent_65%)]",
      primaryColor: "#00ff80",
      secondaryColor: "#40ff99",
      accentColor: "#80ffcc",
      glowColor: "green",
      headerGlow: "0 0 30px #00ff8080",
      cardBg: "bg-gradient-to-br from-emerald-900/30 to-teal-900/20",
      cardBorder: "border-emerald-500/50",
      cardShadow: "shadow-[0_0_40px_#00ff8040]",
      buttonBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
      buttonHover: "hover:from-emerald-400 hover:to-teal-500",
      backgroundAnimation: "crystals",
    }
  },

  "Nightmare Forge": {
    title: "NIGHTMARE FORGE",
    subtitle: "Fear Incarnate • Shadow Realm",
    description: "The Nightmare Forge is where the collective unconscious takes physical form - a realm shaped by humanity's deepest fears and darkest impulses. Here, abandoned nightmares and forgotten traumas prowl the ever-shifting landscape, feeding on terror and doubt. The Forge Masters, beings who have embraced their inner darkness, rule over domains of crystallized fear. Only the bravest souls dare enter this realm, seeking to confront their demons and emerge stronger. Many who enter are never seen again, becoming part of the nightmare landscape they tried to conquer.",
    atmosphere: "The sky bleeds crimson while shadows move independently of their casters. Architecture shifts based on observer's fears - corridors stretch into infinity, walls close in, or floors give way to bottomless voids. The air tastes of copper and desperation.",
    society: "Forge Masters rule territories defined by specific fears - abandonment, death, failure. Lesser nightmares serve as their minions while lost souls wander the borderlands. Power is gained by conquering and incorporating fears.",
    technology: "Fear crystallization matrices, nightmare projection systems, terror-based energy harvesting, psychological warfare devices, and reality distortion engines powered by pure dread and anxiety.",
    dangers: "Your own fears become weapons against you. Nightmares can possess weak minds permanently. Some fears are so powerful they create localized reality collapses. The longer you stay, the harder it becomes to distinguish nightmares from reality.",
    
    persona: {
      name: "THE DREAD SOVEREIGN",
      title: "Forge Master of Existential Terror",
      greeting: "So... another soul seeks to dance with their demons. Tell me, what nightmare brought you here?",
      description: "The Dread Sovereign rules over the deepest terrors of existence - the fear of meaninglessness, isolation, and inevitable oblivion. Once human, they embraced their darkest fears and became something beyond mortal comprehension. They can show you truths about yourself that you've spent a lifetime avoiding."
    },
    
    theme: {
      bg: "from-[#200000] via-[#400000] to-[#100000]",
      overlay: "bg-[repeating-conic-gradient(from_0deg_at_center,rgba(255,0,0,0.05)_0deg,transparent_30deg,rgba(255,0,0,0.05)_60deg)]",
      primaryColor: "#ff0000",
      secondaryColor: "#cc0000",
      accentColor: "#ff4040",
      glowColor: "red", 
      headerGlow: "0 0 30px #ff000080",
      cardBg: "bg-gradient-to-br from-red-900/40 to-black/30",
      cardBorder: "border-red-600/60",
      cardShadow: "shadow-[0_0_40px_#ff000060]",
      buttonBg: "bg-gradient-to-r from-red-700 to-black",
      buttonHover: "hover:from-red-600 hover:to-gray-900",
      backgroundAnimation: "shadows",
    }
  }
};

// ==================== MAIN UNIVERSE PAGE ====================
const UniversePage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [personaId, setPersonaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  const universe = universeData[name];
  const theme = universe?.theme;

  useEffect(() => {
    const checkOrCreatePersona = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          alert("User not authenticated");
          navigate("/auth");
          return;
        }

        const { data: existing } = await supabase
          .from("personas")
          .select("*")
          .eq("user_id", user.id)
          .eq("universe", name)
          .single();

        if (existing) {
          setPersonaId(existing.id);
        } else {
          const { data, error: insertError } = await supabase
            .from("personas")
            .insert([
              {
                user_id: user.id,
                name: universe.persona.name,
                greeting: universe.persona.greeting,
                description: universe.persona.description,
                universe: name,
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error("❌ Failed to insert persona:", insertError);
          } else {
            setPersonaId(data.id);
          }
        }
      } catch (error) {
        console.error("❌ Error in checkOrCreatePersona:", error);
      } finally {
        setLoading(false);
      }
    };

    if (universe) {
      checkOrCreatePersona();
    } else {
      setLoading(false);
    }
  }, [name, navigate, universe]);

  const handleChat = () => {
    if (personaId) {
      navigate(`/chat/${personaId}`);
    }
  };

  if (!universe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Universe Not Found</h1>
          <button 
            onClick={() => navigate('/multiverse')}
            className="px-6 py-3 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Return to Multiverse
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'overview', title: 'Overview', icon: '🌌' },
    { id: 'society', title: 'Society', icon: '🏛️' },
    { id: 'technology', title: 'Technology', icon: '⚡' },
    { id: 'dangers', title: 'Dangers', icon: '⚠️' },
    { id: 'persona', title: 'Contact', icon: '👤' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white relative`}>
      {/* Animated Background */}
      <UniverseBackground theme={theme} />
      
      {/* Background Overlay */}
      <div className={`absolute inset-0 ${theme.overlay}`} />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/multiverse')}
            className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
          >
            <div 
              className="w-8 h-8 rounded-full border flex items-center justify-center group-hover:shadow-lg transition-all"
              style={{ borderColor: theme.primaryColor }}
            >
              ←
            </div>
            <span className="font-medium">Exit Universe</span>
          </button>

          <div className="text-center">
            <GlitchText 
              className="text-4xl md:text-6xl font-black"
              color={theme.glowColor}
              style={{ textShadow: theme.headerGlow }}
            >
              {universe.title}
            </GlitchText>
            <div className="text-white/70 text-lg mt-2">{universe.subtitle}</div>
          </div>

          <div 
            className="px-4 py-2 rounded-lg font-bold text-sm border backdrop-blur-sm"
            style={{ 
              borderColor: theme.primaryColor + '60',
              backgroundColor: theme.primaryColor + '20',
              color: theme.primaryColor
            }}
          >
            DIMENSION ACCESSED
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 px-6 py-4 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-center gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${activeSection === section.id
                  ? `${theme.buttonBg} text-white shadow-lg`
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-2xl p-8 backdrop-blur-md ${theme.cardShadow}`}>
                <h2 className="text-3xl font-bold mb-6" style={{ color: theme.primaryColor }}>
                  Welcome to {universe.title}
                </h2>
                <p className="text-lg text-white/90 leading-relaxed mb-6">
                  {universe.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: theme.secondaryColor }}>
                      Atmosphere
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {universe.atmosphere}
                    </p>
                  </div>
                  <div 
                    className="p-6 rounded-xl border backdrop-blur-sm"
                    style={{ 
                      borderColor: theme.primaryColor + '30',
                      backgroundColor: theme.primaryColor + '10'
                    }}
                  >
                    <h3 className="text-xl font-bold mb-3" style={{ color: theme.primaryColor }}>
                      Universe Status
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Dimensional Stability:</span>
                        <span className="text-white font-medium">ACTIVE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Reality Index:</span>
                        <span className="text-white font-medium">{Math.floor(Math.random() * 100) + 1}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Quantum Coherence:</span>
                        <span className="text-white font-medium">STABLE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Society Section */}
          {activeSection === 'society' && (
            <div className="animate-fadeIn">
              <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-2xl p-8 backdrop-blur-md ${theme.cardShadow}`}>
                <h2 className="text-3xl font-bold mb-6" style={{ color: theme.primaryColor }}>
                  Society & Culture
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  {universe.society}
                </p>
              </div>
            </div>
          )}

          {/* Technology Section */}
          {activeSection === 'technology' && (
            <div className="animate-fadeIn">
              <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-2xl p-8 backdrop-blur-md ${theme.cardShadow}`}>
                <h2 className="text-3xl font-bold mb-6" style={{ color: theme.primaryColor }}>
                  Technology & Capabilities
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  {universe.technology}
                </p>
              </div>
            </div>
          )}

          {/* Dangers Section */}
          {activeSection === 'dangers' && (
            <div className="animate-fadeIn">
              <div className={`${theme.cardBg} border-red-500/50 border rounded-2xl p-8 backdrop-blur-md shadow-[0_0_40px_#ff000040]`}>
                <h2 className="text-3xl font-bold mb-6 text-red-400">
                  ⚠️ Dangers & Warnings
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  {universe.dangers}
                </p>
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm font-medium">
                    ⚠️ CAUTION: Prolonged exposure to this dimension may result in permanent psychological or physical alterations. Proceed at your own risk.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Persona Contact Section */}
          {activeSection === 'persona' && (
            <div className="animate-fadeIn">
              <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-2xl p-8 backdrop-blur-md ${theme.cardShadow}`}>
                <h2 className="text-3xl font-bold mb-6" style={{ color: theme.primaryColor }}>
                  Dimensional Contact
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: theme.secondaryColor }}>
                      {universe.persona.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-3">{universe.persona.title}</p>
                    <p className="text-lg text-white/90 leading-relaxed mb-6">
                      {universe.persona.description}
                    </p>
                    
                    <div 
                      className="p-4 rounded-lg border backdrop-blur-sm italic"
                      style={{ 
                        borderColor: theme.primaryColor + '40',
                        backgroundColor: theme.primaryColor + '10'
                      }}
                    >
                      <p className="text-white/90">
                        "{universe.persona.greeting}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center space-y-6">
                    <div 
                      className="w-32 h-32 rounded-full border-4 flex items-center justify-center text-4xl font-bold relative overflow-hidden"
                      style={{ 
                        borderColor: theme.primaryColor,
                        backgroundColor: theme.primaryColor + '20',
                        boxShadow: `0 0 30px ${theme.primaryColor}80`
                      }}
                    >
                      {universe.persona.name.charAt(0)}
                      
                      {/* Scanning effect */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-scan"
                      />
                    </div>
                    
                    <button
                      onClick={handleChat}
                      disabled={loading}
                      className={`
                        px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                        ${theme.buttonBg} ${theme.buttonHover}
                      `}
                      style={{ boxShadow: `0 0 25px ${theme.primaryColor}60` }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Establishing Link...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          🔗 ESTABLISH COMMUNICATION
                        </span>
                      )}
                    </button>
                    
                    <p className="text-white/60 text-sm text-center max-w-sm">
                      Open a direct communication channel with this universe's consciousness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Global Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          .animate-scan {
            animation: scan 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default UniversePage;
