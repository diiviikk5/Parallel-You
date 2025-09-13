// src/pages/Narrative.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
    purple: { primary: '#8000ff', secondary: '#a040ff', tertiary: '#c080ff' },
    green: { primary: '#00ff80', secondary: '#40ff99', tertiary: '#80ffcc' },
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

// ==================== QUANTUM BUTTON COMPONENT ====================
const QuantumButton = ({ children, onClick, variant = "pink", className = "", disabled = false, loading = false }) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const variants = {
    pink: "bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-400 text-pink-200 hover:from-pink-600/40 hover:to-purple-600/40 shadow-[0_0_20px_#ff00ff40]",
    cyan: "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-400 text-cyan-200 hover:from-cyan-600/40 hover:to-blue-600/40 shadow-[0_0_20px_#00ffff40]",
    purple: "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-400 text-purple-200 hover:from-purple-600/40 hover:to-indigo-600/40 shadow-[0_0_20px_#8000ff40]",
    green: "bg-gradient-to-r from-green-600/20 to-teal-600/20 border-green-400 text-green-200 hover:from-green-600/40 hover:to-teal-600/40 shadow-[0_0_20px_#00ff8040]",
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    
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
      disabled={disabled || loading}
      className={`
        relative overflow-hidden px-6 py-3 rounded-xl font-bold border transition-all duration-300 transform hover:scale-105
        ${variants[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
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
      
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </span>
    </button>
  );
};

// ==================== CHARACTER CARD COMPONENT ====================
const CharacterCard = ({ character, onChat, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCharacterColor = () => {
    const colors = ['#ff00ff', '#00ffff', '#ff8000', '#8000ff', '#00ff80', '#ff0080'];
    return colors[Math.abs(character.name?.charCodeAt(0) || 0) % colors.length];
  };

  const characterColor = getCharacterColor();

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          relative backdrop-blur-md bg-black/30 border-2 rounded-2xl p-5 transition-all duration-300 transform hover:scale-105
          ${isHovered ? 'border-white shadow-[0_0_25px_rgba(255,255,255,0.4)]' : 'border-white/20'}
        `}
        style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}
      >
        {/* Character Avatar */}
        <div className="text-center mb-4">
          <div 
            className="w-16 h-16 rounded-full border-3 flex items-center justify-center text-2xl font-bold mx-auto relative overflow-hidden"
            style={{ 
              borderColor: characterColor,
              backgroundColor: `${characterColor}20`,
              boxShadow: `0 0 15px ${characterColor}60`
            }}
          >
            {character.avatar || character.name?.charAt(0) || '👤'}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan" />
            )}
          </div>
        </div>

        {/* Character Info */}
        <div className="text-center space-y-2">
          <h4 
            className="text-lg font-bold text-white"
            style={{ textShadow: `0 0 8px ${characterColor}80` }}
          >
            {character.name}
          </h4>
          <div className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
            {character.role || 'Character'}
          </div>
          <p className="text-sm text-white/70 line-clamp-2 h-10">
            {character.personality || "A mysterious individual with untold stories..."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onChat(character)}
            className="flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400 text-cyan-200 hover:from-cyan-600/40 hover:to-purple-600/40"
          >
            💬
          </button>
          <button
            onClick={() => onEdit(character)}
            className="px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400 text-yellow-200 hover:from-yellow-600/40 hover:to-orange-600/40"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(character)}
            className="px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 bg-red-600/20 border border-red-400 text-red-200 hover:bg-red-600/40"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== CREATE CHARACTER MODAL ====================
const CreateCharacterModal = ({ isOpen, onClose, onSave, character = null, universeId }) => {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '👤',
    role: '',
    personality: '',
    backstory: '',
    goals: '',
    relationships: '',
    quirks: '',
    appearance: '',
    voice_style: 'Friendly',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (character) {
      setFormData({ ...character });
    } else {
      setFormData({
        name: '',
        avatar: '👤',
        role: '',
        personality: '',
        backstory: '',
        goals: '',
        relationships: '',
        quirks: '',
        appearance: '',
        voice_style: 'Friendly',
      });
    }
  }, [character, isOpen]);

  const avatars = ['👤', '👨', '👩', '🧙‍♂️', '🧙‍♀️', '👑', '🤴', '👸', '🧛‍♂️', '🧛‍♀️', '🧚‍♂️', '🧚‍♀️', '👨‍🚀', '👩‍🚀', '🦸‍♂️', '🦸‍♀️', '🥷', '👮‍♂️', '👮‍♀️', '🕵️‍♂️', '🕵️‍♀️', '🧑‍💻', '👨‍🔬', '👩‍🔬', '🤖', '👹', '👺', '🐺', '🦊', '🦁'];
  const voiceStyles = ['Friendly', 'Formal', 'Casual', 'Mysterious', 'Energetic', 'Calm', 'Sarcastic', 'Wise', 'Playful', 'Serious'];

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Character name is required!');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ ...formData, universe_id: universeId });
      onClose();
    } catch (error) {
      console.error('Error saving character:', error);
      alert('Failed to save character. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a0030] to-black border border-purple-500/50 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(255,0,255,0.3)]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {character ? 'Edit Character' : 'Create New Character'}
            </h2>
            <p className="text-white/70 text-sm mt-1">Bring your character to life</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Name & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/90 font-medium text-sm mb-2 block">Character Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Aria Nightblade, Dr. Marcus..."
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-white/90 font-medium text-sm mb-2 block">Role/Occupation</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Warrior, Scholar, Merchant..."
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300"
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="text-white/90 font-medium text-sm mb-3 block">Avatar</label>
              <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto p-2 bg-black/20 rounded-lg">
                {avatars.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                    className={`
                      w-8 h-8 rounded-lg text-lg transition-all duration-200 hover:scale-110
                      ${formData.avatar === avatar 
                        ? 'bg-cyan-500/30 border-2 border-cyan-400' 
                        : 'bg-white/10 hover:bg-white/20'
                      }
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Style */}
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Voice Style</label>
              <select
                value={formData.voice_style}
                onChange={(e) => setFormData(prev => ({ ...prev, voice_style: e.target.value }))}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300"
              >
                {voiceStyles.map(style => (
                  <option key={style} value={style} className="bg-black">{style}</option>
                ))}
              </select>
            </div>

            {/* Personality */}
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Personality Traits</label>
              <textarea
                value={formData.personality}
                onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                placeholder="Describe their personality, traits, mannerisms..."
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300 h-24 resize-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Appearance */}
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Appearance</label>
              <textarea
                value={formData.appearance}
                onChange={(e) => setFormData(prev => ({ ...prev, appearance: e.target.value }))}
                placeholder="Physical description, clothing, distinctive features..."
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300 h-24 resize-none"
              />
            </div>

            {/* Backstory */}
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Backstory</label>
              <textarea
                value={formData.backstory}
                onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
                placeholder="Their history, origin, important past events..."
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300 h-24 resize-none"
              />
            </div>

            {/* Goals */}
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Goals & Motivations</label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                placeholder="What drives them? What do they want to achieve?"
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300 h-20 resize-none"
              />
            </div>

            {/* Relationships */}
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Relationships</label>
              <textarea
                value={formData.relationships}
                onChange={(e) => setFormData(prev => ({ ...prev, relationships: e.target.value }))}
                placeholder="Friends, enemies, family, allies..."
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300 h-20 resize-none"
              />
            </div>

            {/* Quirks */}
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Quirks & Habits</label>
              <textarea
                value={formData.quirks}
                onChange={(e) => setFormData(prev => ({ ...prev, quirks: e.target.value }))}
                placeholder="Unique behaviors, catchphrases, habits..."
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300 h-20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
          >
            Cancel
          </button>
          <QuantumButton
            onClick={handleSave}
            loading={isSaving}
            variant="cyan"
            className="flex-1"
          >
            {isSaving ? 'Saving...' : (character ? 'Update Character' : 'Create Character')}
          </QuantumButton>
        </div>
      </div>
    </div>
  );
};

// ==================== CHAT INTERFACE COMPONENT ====================
const ChatInterface = ({ isOpen, onClose, characters, universeId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [currentScene, setCurrentScene] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (characters.length === 1) {
      setSelectedCharacters(characters);
    }
  }, [characters]);

  const handleSendMessage = async () => {
    if (!input.trim() || selectedCharacters.length === 0) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI responses from selected characters
    setTimeout(() => {
      selectedCharacters.forEach((character, index) => {
        setTimeout(() => {
          const aiMessage = {
            id: Date.now() + index + Math.random(),
            type: 'character',
            character: character,
            content: getCharacterResponse(character, userMessage.content),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setMessages(prev => [...prev, aiMessage]);
          
          if (index === selectedCharacters.length - 1) {
            setIsTyping(false);
          }
        }, (index + 1) * 1000);
      });
    }, 500);
  };

  const getCharacterResponse = (character, userInput) => {
    const responses = {
      friendly: [
        "That's really interesting! Tell me more about that.",
        "I can understand why you'd feel that way. What do you think we should do?",
        "Your perspective always helps me see things differently!",
        "I appreciate you sharing that with me. How are you feeling about it?",
      ],
      mysterious: [
        "Hmm... there are forces at work here that you may not fully comprehend...",
        "The shadows whisper of such things... but are you prepared for the truth?",
        "Curious... very curious indeed. This reminds me of an ancient prophecy...",
        "*eyes gleam with hidden knowledge* Not everything is as it seems...",
      ],
      wise: [
        "In my many years, I have learned that such matters require careful consideration.",
        "Wisdom comes not from having answers, but from asking the right questions.",
        "There is much truth in what you speak, young one.",
        "The path you seek has been walked by many before. Learn from their journeys.",
      ],
      energetic: [
        "Oh wow! That sounds absolutely amazing! Let's do it!",
        "This is so exciting! I can barely contain my enthusiasm!",
        "You've got such great ideas! I'm ready for whatever comes next!",
        "YES! I love your energy! This is going to be incredible!",
      ],
      calm: [
        "I see. Let's take a moment to consider all aspects of this.",
        "Your words carry weight. I think we should approach this thoughtfully.",
        "There's beauty in taking things one step at a time.",
        "Peace comes from understanding, not rushing.",
      ],
      sarcastic: [
        "Oh, wonderful. Another brilliant plan. What could possibly go wrong?",
        "Sure, because that's exactly what I was hoping to hear today.",
        "Well, isn't that just perfect. Life keeps getting better and better.",
        "Right, because your last idea worked out so magnificently.",
      ]
    };

    const style = character.voice_style?.toLowerCase() || 'friendly';
    const responseArray = responses[style] || responses.friendly;
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const toggleCharacterSelection = (character) => {
    setSelectedCharacters(prev => {
      const isSelected = prev.some(c => c.id === character.id);
      if (isSelected) {
        return prev.filter(c => c.id !== character.id);
      } else {
        return [...prev, character];
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a0030] to-black border-b border-purple-500/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {characters.length === 1 ? `Chat with ${characters[0].name}` : 'Multi-Character Chat'}
            </h2>
            <p className="text-white/70 text-sm">
              {selectedCharacters.length > 0 
                ? `Chatting with: ${selectedCharacters.map(c => c.name).join(', ')}`
                : 'Select characters to start chatting'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Character Selection - Only show if multiple characters available */}
        {characters.length > 1 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {characters.map(character => (
              <button
                key={character.id}
                onClick={() => toggleCharacterSelection(character)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300
                  ${selectedCharacters.some(c => c.id === character.id)
                    ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200'
                    : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20'
                  }
                `}
              >
                <span>{character.avatar || '👤'}</span>
                <span>{character.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Scene Setting */}
        <div className="mt-3">
          <input
            type="text"
            value={currentScene}
            onChange={(e) => setCurrentScene(e.target.value)}
            placeholder="Set the scene... (e.g., 'In the tavern at midnight', 'On the battlefield')"
            className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 transition-all duration-300 text-sm"
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentScene && (
          <div className="text-center">
            <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-3 text-purple-200 text-sm italic">
              📖 Scene: {currentScene}
            </div>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`
                max-w-sm px-4 py-3 rounded-2xl break-words
                ${message.type === 'user' 
                  ? 'bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-white ml-auto' 
                  : 'bg-gradient-to-r from-cyan-600/60 to-blue-600/60 text-white mr-auto'
                }
              `}
              style={{
                boxShadow: message.type === 'user' 
                  ? '0 0 20px #ff00ff80' 
                  : '0 0 20px #00ffff60'
              }}
            >
              {message.type === 'character' && (
                <div className="flex items-center gap-2 mb-1 opacity-80">
                  <span>{message.character.avatar || '👤'}</span>
                  <span className="text-xs font-medium">{message.character.name}</span>
                </div>
              )}
              <div className="leading-relaxed">{message.content}</div>
              <div className="text-xs opacity-60 mt-1">{message.timestamp}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-cyan-600/60 to-blue-600/60 px-4 py-3 rounded-2xl mr-auto">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-current animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="text-sm opacity-70">
                  {selectedCharacters.length === 1 
                    ? `${selectedCharacters[0].name} is thinking...` 
                    : 'Characters are thinking...'
                  }
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gradient-to-r from-[#1a0030] to-black border-t border-purple-500/50 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={selectedCharacters.length > 0 
              ? "Type your message..." 
              : "Select characters first..."
            }
            disabled={selectedCharacters.length === 0}
            className="flex-1 px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-cyan-400 focus:shadow-[0_0_20px_#00ffff40] transition-all duration-300 disabled:opacity-50"
          />
          <QuantumButton
            onClick={handleSendMessage}
            disabled={!input.trim() || selectedCharacters.length === 0 || isTyping}
            variant="cyan"
          >
            Send
          </QuantumButton>
        </div>
        
        <div className="text-xs text-white/50 mt-2 text-center">
          💡 Tip: {characters.length > 1 ? 'Select multiple characters for group conversations, or chat with them individually' : 'Share your thoughts and see how they respond!'}
        </div>
      </div>
    </div>
  );
};

// ==================== UNIVERSE CARD COMPONENT ====================
const UniverseCard = ({ universe, onClick, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getUniverseColor = () => {
    const colors = ['#ff00ff', '#00ffff', '#8000ff', '#00ff80', '#ff8000'];
    return colors[Math.abs(universe.name?.charCodeAt(0) || 0) % colors.length];
  };

  const universeColor = getUniverseColor();

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div 
        className={`
          relative backdrop-blur-md bg-black/40 border-2 rounded-3xl p-6 transition-all duration-500 transform hover:scale-105
          ${isHovered ? 'border-white shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'border-white/20'}
        `}
        style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}
      >
        {/* Cosmic Background Effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${universeColor}40, transparent 70%)`,
            }}
          />
          {isHovered && (
            <div 
              className="absolute inset-0"
              style={{
                background: `conic-gradient(from 0deg, ${universeColor}20, transparent, ${universeColor}20)`,
                animation: 'spin 4s linear infinite'
              }}
            />
          )}
        </div>

        <div className="relative z-10">
          {/* Universe Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 
                className="text-2xl font-bold text-white mb-2"
                style={{ textShadow: `0 0 10px ${universeColor}80` }}
              >
                {universe.name || "Untitled Universe"}
              </h3>
              <div className="text-xs text-white/60 bg-white/10 px-3 py-1 rounded-full inline-block">
                {universe.genre || "Custom"} • {universe.character_count || 0} Characters
              </div>
            </div>
            
            {/* Universe Icon */}
            <div 
              className="w-16 h-16 rounded-full border-3 flex items-center justify-center text-2xl relative overflow-hidden"
              style={{ 
                borderColor: universeColor,
                backgroundColor: `${universeColor}20`,
                boxShadow: `0 0 20px ${universeColor}60`
              }}
            >
              🌌
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan" />
              )}
            </div>
          </div>

          {/* Universe Description */}
          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {universe.description || "A realm of infinite possibilities awaiting your creative vision..."}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(universe);
              }}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400 text-cyan-200 hover:from-cyan-600/40 hover:to-purple-600/40"
            >
              🚀 Explore
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(universe);
              }}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400 text-yellow-200 hover:from-yellow-600/40 hover:to-orange-600/40"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(universe);
              }}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-red-600/20 border border-red-400 text-red-200 hover:bg-red-600/40"
            >
              🗑️
            </button>
          </div>

          {/* Created Date */}
          <div className="text-xs text-white/40 text-center mt-3">
            Created: {new Date(universe.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== CREATE UNIVERSE MODAL ====================
const CreateUniverseModal = ({ isOpen, onClose, onSave, universe = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: 'Fantasy',
    settings: '',
    rules: '',
    tone: 'Balanced',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (universe) {
      setFormData({
        name: universe.name || '',
        description: universe.description || '',
        genre: universe.genre || 'Fantasy',
        settings: universe.settings || '',
        rules: universe.rules || '',
        tone: universe.tone || 'Balanced',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        genre: 'Fantasy',
        settings: '',
        rules: '',
        tone: 'Balanced',
      });
    }
  }, [universe, isOpen]);

  const genres = [
    'Fantasy', 'Sci-Fi', 'Modern', 'Historical', 'Mystery', 'Romance', 
    'Horror', 'Comedy', 'Adventure', 'Drama', 'Slice of Life', 'Custom'
  ];

  const tones = [
    'Light & Funny', 'Balanced', 'Serious', 'Dark & Gritty', 
    'Romantic', 'Mysterious', 'Epic & Heroic', 'Casual & Friendly'
  ];

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Universe name is required!');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving universe:', error);
      alert('Failed to save universe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a0030] to-black border border-purple-500/50 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(255,0,255,0.3)]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {universe ? 'Edit Universe' : 'Create New Universe'}
            </h2>
            <p className="text-white/70 text-sm mt-1">Design your narrative reality</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Universe Name */}
          <div>
            <label className="text-white/90 font-medium text-sm mb-2 block">Universe Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Mystic Realms, Star Academy, Modern Magic..."
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-purple-400 focus:shadow-[0_0_20px_#8000ff40] transition-all duration-300"
            />
          </div>

          {/* Genre & Tone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Genre</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:shadow-[0_0_20px_#8000ff40] transition-all duration-300"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre} className="bg-black">{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-white/90 font-medium text-sm mb-2 block">Tone</label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:shadow-[0_0_20px_#8000ff40] transition-all duration-300"
              >
                {tones.map(tone => (
                  <option key={tone} value={tone} className="bg-black">{tone}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-white/90 font-medium text-sm mb-2 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your universe's core concept, main themes, and overall atmosphere..."
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-purple-400 focus:shadow-[0_0_20px_#8000ff40] transition-all duration-300 h-24 resize-none"
            />
          </div>

          {/* Settings */}
          <div>
            <label className="text-white/90 font-medium text-sm mb-2 block">World Settings</label>
            <textarea
              value={formData.settings}
              onChange={(e) => setFormData(prev => ({ ...prev, settings: e.target.value }))}
              placeholder="Describe locations, time period, technology level, magic systems, etc..."
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-purple-400 focus:shadow-[0_0_20px_#8000ff40] transition-all duration-300 h-24 resize-none"
            />
          </div>

          {/* Rules */}
          <div>
            <label className="text-white/90 font-medium text-sm mb-2 block">World Rules & Laws</label>
            <textarea
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              placeholder="Define physical laws, social norms, limitations, consequences, etc..."
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-purple-400 focus:shadow-[0_0_20px_#8000ff40] transition-all duration-300 h-24 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
          >
            Cancel
          </button>
          <QuantumButton
            onClick={handleSave}
            loading={isSaving}
            variant="purple"
            className="flex-1"
          >
            {isSaving ? 'Saving...' : (universe ? 'Update Universe' : 'Create Universe')}
          </QuantumButton>
        </div>
      </div>
    </div>
  );
};

// ==================== UNIVERSE EXPLORER COMPONENT ====================
const UniverseExplorer = ({ universe, onBack }) => {
  const [activeTab, setActiveTab] = useState('characters');
  const [characters, setCharacters] = useState([]);
  const [showCreateCharacter, setShowCreateCharacter] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedChatCharacter, setSelectedChatCharacter] = useState(null);

  useEffect(() => {
    // Load characters from localStorage
    const savedCharacters = JSON.parse(localStorage.getItem(`characters_${universe.id}`) || '[]');
    setCharacters(savedCharacters);
  }, [universe.id]);

  const handleCreateCharacter = () => {
    setEditingCharacter(null);
    setShowCreateCharacter(true);
  };

  const handleEditCharacter = (character) => {
    setEditingCharacter(character);
    setShowCreateCharacter(true);
  };

  const handleSaveCharacter = async (characterData) => {
    const timestamp = new Date().toISOString();
    
    if (editingCharacter) {
      // Update existing character
      const updatedCharacter = {
        ...editingCharacter,
        ...characterData,
        updated_at: timestamp,
      };
      
      const updatedCharacters = characters.map(c => 
        c.id === editingCharacter.id ? updatedCharacter : c
      );
      
      setCharacters(updatedCharacters);
      localStorage.setItem(`characters_${universe.id}`, JSON.stringify(updatedCharacters));
    } else {
      // Create new character
      const newCharacter = {
        id: Date.now().toString(),
        ...characterData,
        created_at: timestamp,
      };
      
      const updatedCharacters = [newCharacter, ...characters];
      setCharacters(updatedCharacters);
      localStorage.setItem(`characters_${universe.id}`, JSON.stringify(updatedCharacters));
    }
    
    setShowCreateCharacter(false);
  };

  const handleDeleteCharacter = async (character) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${character.name}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    const updatedCharacters = characters.filter(c => c.id !== character.id);
    setCharacters(updatedCharacters);
    localStorage.setItem(`characters_${universe.id}`, JSON.stringify(updatedCharacters));
  };

  const handleChatWithCharacter = (character) => {
    setSelectedChatCharacter(character);
    setShowChat(true);
  };

  const handleMultiChat = () => {
    setSelectedChatCharacter(null);
    setShowChat(true);
  };

  const tabs = [
    { id: 'characters', title: 'Characters', icon: '👥', count: characters.length },
    { id: 'scenes', title: 'Scenes', icon: '🎬', count: 0 },
    { id: 'stories', title: 'Stories', icon: '📚', count: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Universe Header */}
      <div className="bg-black/20 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,255,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-300 hover:text-cyan-200 hover:shadow-[0_0_15px_#00ffff40] transition-all"
            >
              ←
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{universe.name}</h1>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span>🎭 {universe.genre}</span>
                <span>🎨 {universe.tone}</span>
                <span>👥 {characters.length} Characters</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {characters.length > 1 && (
              <QuantumButton onClick={handleMultiChat} variant="purple">
                💬 Group Chat
              </QuantumButton>
            )}
            <QuantumButton onClick={handleCreateCharacter} variant="cyan">
              ✨ Add Character
            </QuantumButton>
          </div>
        </div>

        <p className="text-white/80 leading-relaxed">{universe.description}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white shadow-[0_0_20px_#8000ff40]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.title}</span>
              {tab.count > 0 && (
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'characters' && (
        <div>
          {characters.length === 0 ? (
            <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-3xl p-12 border border-cyan-500/30 text-center">
              <div className="text-8xl mb-6">👥</div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-4">No Characters Yet</h3>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Bring your universe to life by creating memorable characters with unique personalities, backstories, and motivations.
              </p>
              <QuantumButton
                onClick={handleCreateCharacter}
                variant="cyan"
                className="text-lg px-8 py-4"
              >
                🎭 Create First Character
              </QuantumButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onChat={() => handleChatWithCharacter(character)}
                  onEdit={() => handleEditCharacter(character)}
                  onDelete={() => handleDeleteCharacter(character)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'scenes' && (
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-3xl p-12 border border-yellow-500/30 text-center">
          <div className="text-8xl mb-6">🎬</div>
          <h3 className="text-2xl font-bold text-yellow-300 mb-4">Scene Builder Coming Soon</h3>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Create dynamic scenes and scenarios for your characters to interact in. Set the mood, location, and circumstances for epic storytelling.
          </p>
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 rounded-3xl p-12 border border-green-500/30 text-center">
          <div className="text-8xl mb-6">📚</div>
          <h3 className="text-2xl font-bold text-green-300 mb-4">Story Manager Coming Soon</h3>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Write, organize, and manage your ongoing narratives. Keep track of plot threads, character arcs, and story developments.
          </p>
        </div>
      )}

      {/* Modals */}
      <CreateCharacterModal
        isOpen={showCreateCharacter}
        onClose={() => setShowCreateCharacter(false)}
        onSave={handleSaveCharacter}
        character={editingCharacter}
        universeId={universe.id}
      />

      <ChatInterface
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        characters={selectedChatCharacter ? [selectedChatCharacter] : characters}
        universeId={universe.id}
      />
    </div>
  );
};

// ==================== MAIN NARRATIVE COMPONENT ====================
const Narrative = () => {
  const navigate = useNavigate();
  
  // State management
  const [universes, setUniverses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUniverse, setEditingUniverse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUniverse, setSelectedUniverse] = useState(null);
  const [showUniverseExplorer, setShowUniverseExplorer] = useState(false);

  // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  // Fetch user universes
  useEffect(() => {
    const fetchUniverses = async () => {
      if (!currentUser) return;
      
      try {
        // Use localStorage for now
        const savedUniverses = JSON.parse(localStorage.getItem(`universes_${currentUser.id}`) || '[]');
        setUniverses(savedUniverses);
      } catch (error) {
        console.error('Error fetching universes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUniverses();
    }
  }, [currentUser]);

  const handleCreateUniverse = () => {
    setEditingUniverse(null);
    setShowCreateModal(true);
  };

  const handleEditUniverse = (universe) => {
    setEditingUniverse(universe);
    setShowCreateModal(true);
  };

  const handleSaveUniverse = async (universeData) => {
    if (!currentUser) return;

    try {
      const timestamp = new Date().toISOString();
      
      if (editingUniverse) {
        // Update existing universe
        const updatedUniverse = {
          ...editingUniverse,
          ...universeData,
          updated_at: timestamp,
        };
        
        const updatedUniverses = universes.map(u => 
          u.id === editingUniverse.id ? updatedUniverse : u
        );
        
        setUniverses(updatedUniverses);
        localStorage.setItem(`universes_${currentUser.id}`, JSON.stringify(updatedUniverses));
      } else {
        // Create new universe
        const newUniverse = {
          id: Date.now().toString(),
          ...universeData,
          user_id: currentUser.id,
          character_count: 0,
          scene_count: 0,
          story_count: 0,
          created_at: timestamp,
        };
        
        const updatedUniverses = [newUniverse, ...universes];
        setUniverses(updatedUniverses);
        localStorage.setItem(`universes_${currentUser.id}`, JSON.stringify(updatedUniverses));
      }
    } catch (error) {
      console.error('Error saving universe:', error);
      throw error;
    }
  };

  const handleDeleteUniverse = async (universe) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${universe.name}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const updatedUniverses = universes.filter(u => u.id !== universe.id);
      setUniverses(updatedUniverses);
      localStorage.setItem(`universes_${currentUser.id}`, JSON.stringify(updatedUniverses));
    } catch (error) {
      console.error('Error deleting universe:', error);
      alert('Failed to delete universe. Please try again.');
    }
  };

  const handleExploreUniverse = (universe) => {
    setSelectedUniverse(universe);
    setShowUniverseExplorer(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0030] to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-gradient-to-l from-cyan-800 via-purple-600 to-indigo-800" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,0,255,0.02)_2px,rgba(255,0,255,0.02)_4px)]" />
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
            <GlitchText className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              NARRATIVE UNIVERSE
            </GlitchText>
            <p className="text-white/60 text-sm mt-1">Create • Explore • Experience Your Stories</p>
          </div>

          <QuantumButton
            onClick={handleCreateUniverse}
            variant="purple"
            className="font-bold"
          >
            ✨ Create Universe
          </QuantumButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Show Universe Explorer or Welcome Section */}
          {showUniverseExplorer && selectedUniverse ? (
            <UniverseExplorer 
              universe={selectedUniverse} 
              onBack={() => setShowUniverseExplorer(false)} 
            />
          ) : (
            <>
              {/* Welcome Section */}
              <div className="bg-black/20 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8 mb-8 shadow-[0_0_50px_rgba(255,0,255,0.2)]">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-purple-300">Welcome to Your Narrative Multiverse</h2>
                  <p className="text-white/80 text-lg max-w-4xl mx-auto">
                    Create infinite worlds, design unforgettable characters, and craft stories that transcend reality. 
                    Your imagination is the only limit in this boundless creative space.
                  </p>
                  
                  <div className="flex justify-center gap-8 mt-6 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{universes.length}</div>
                      <div className="text-white/60">Universes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400">
                        {universes.reduce((sum, u) => sum + (u.character_count || 0), 0)}
                      </div>
                      <div className="text-white/60">Characters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {universes.reduce((sum, u) => sum + (u.story_count || 0), 0)}
                      </div>
                      <div className="text-white/60">Stories</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Universes Grid */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-white/70">Loading your universes...</div>
                  </div>
                </div>
              ) : universes.length === 0 ? (
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-3xl p-12 border border-purple-500/30 text-center">
                  <div className="text-8xl mb-6">🌌</div>
                  <h3 className="text-2xl font-bold text-purple-300 mb-4">Your First Universe Awaits</h3>
                  <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                    Begin your creative journey by crafting your first narrative universe. 
                    Design worlds, create characters, and tell stories that come alive through AI.
                  </p>
                  <QuantumButton
                    onClick={handleCreateUniverse}
                    variant="purple"
                    className="text-lg px-8 py-4"
                  >
                    🚀 Create Your First Universe
                  </QuantumButton>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {universes.map((universe, index) => (
                    <UniverseCard
                      key={universe.id}
                      universe={universe}
                      onClick={() => handleExploreUniverse(universe)}
                      onEdit={() => handleEditUniverse(universe)}
                      onDelete={() => handleDeleteUniverse(universe)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Create/Edit Universe Modal */}
      <CreateUniverseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveUniverse}
        universe={editingUniverse}
      />

      {/* Global Styles */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes ripple { 
            to { transform: scale(20); opacity: 0; } 
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

export default Narrative;
