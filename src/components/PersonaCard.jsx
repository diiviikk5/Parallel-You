// src/components/PersonaCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PersonaCard = ({ persona, onEdit, onDelete, showActions = true }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getPersonaColor = () => {
    const colors = ['#ff00ff', '#00ffff', '#8000ff', '#00ff80', '#ff0080', '#ff8000'];
    return colors[Math.abs(persona.name?.charCodeAt(0) || 0) % colors.length];
  };

  const personaColor = getPersonaColor();

  const handleChat = () => {
    console.log('🚀 Opening chat with persona:', persona);
    
    if (!persona.id) {
      console.error('❌ Persona missing ID:', persona);
      alert('Character data is invalid - missing ID');
      return;
    }
    
    // Navigate to chat with proper ID
    navigate(`/chat/${persona.id}`);
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          relative backdrop-blur-md bg-black/40 border-2 rounded-2xl p-6 transition-all duration-500 transform hover:scale-105
          ${isHovered ? 'border-white shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'border-white/20'}
        `}
        style={{
          animation: 'fadeInUp 0.8s ease-out forwards',
        }}
      >
        {/* Hologram Effect */}
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
          {/* Persona Avatar */}
          <div className="text-center mb-4">
            <div 
              className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl font-bold mx-auto relative overflow-hidden"
              style={{ 
                borderColor: personaColor,
                backgroundColor: `${personaColor}20`,
                boxShadow: `0 0 20px ${personaColor}80`
              }}
            >
              {persona.avatar || persona.name?.charAt(0) || '🤖'}
              
              {/* Scanning effect */}
              {isHovered && (
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-scan"
                />
              )}
            </div>
          </div>

          {/* Persona Info */}
          <div className="text-center space-y-3">
            <h3 
              className="text-2xl font-bold text-white mb-2"
              style={{ textShadow: `0 0 10px ${personaColor}80` }}
            >
              {persona.name}
            </h3>
            
            {persona.universe && (
              <div className="text-xs text-white/60 bg-white/10 px-3 py-1 rounded-full inline-block">
                {persona.universe}
              </div>
            )}
            
            <p className="text-white/80 text-sm line-clamp-3 min-h-[60px]">
              {persona.description || persona.traits || persona.personality || "A mysterious entity from the digital realm..."}
            </p>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-2 mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChat();
                }}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400 text-cyan-200 hover:from-cyan-600/40 hover:to-purple-600/40 shadow-[0_0_15px_#00ffff40]"
              >
                💬 Chat
              </button>
              
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(persona);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400 text-yellow-200 hover:from-yellow-600/40 hover:to-orange-600/40"
                >
                  ✏️
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(persona);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 bg-red-600/20 border border-red-400 text-red-200 hover:bg-red-600/40"
                >
                  🗑️
                </button>
              )}
            </div>
          )}

          {/* Debug Info */}
          <div className="text-xs text-white/40 text-center mt-4">
            ID: {persona.id || 'No ID'} | Created: {persona.created_at ? new Date(persona.created_at).toLocaleDateString() : 'Unknown'}
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PersonaCard;
