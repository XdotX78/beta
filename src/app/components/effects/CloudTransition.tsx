import React, { useEffect, useState } from 'react';

interface CloudTransitionProps {
  isActive: boolean;
  onTransitionComplete: () => void;
  duration?: number; // in milliseconds
}

const CloudTransition: React.FC<CloudTransitionProps> = ({
  isActive,
  onTransitionComplete,
  duration = 4000, // default 4 seconds
}) => {
  const [stage, setStage] = useState<'inactive' | 'starting' | 'peak' | 'ending'>('inactive');

  useEffect(() => {
    if (isActive) {
      // Start transition
      setStage('starting');
      
      // Set peak at 50% through duration
      const peakTimeout = setTimeout(() => {
        setStage('peak');
      }, duration * 0.5);
      
      // Start ending after peak
      const endingTimeout = setTimeout(() => {
        setStage('ending');
      }, duration * 0.7);
      
      // Complete transition at full duration
      const completeTimeout = setTimeout(() => {
        setStage('inactive');
        onTransitionComplete();
      }, duration);
      
      return () => {
        clearTimeout(peakTimeout);
        clearTimeout(endingTimeout);
        clearTimeout(completeTimeout);
      };
    } else {
      setStage('inactive');
    }
  }, [isActive, duration, onTransitionComplete]);
  
  if (stage === 'inactive') return null;
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Multiple cloud layers for depth effect */}
      <div 
        className={`absolute inset-0 bg-center bg-no-repeat bg-cover cloud-layer-1 ${stage}`}
        style={{
          backgroundImage: "url('/images/clouds/cloud-layer-1.svg')",
          animation: "drift 15s infinite linear",
        }}
      />
      <div 
        className={`absolute inset-0 bg-center bg-no-repeat bg-cover cloud-layer-2 ${stage}`}
        style={{
          backgroundImage: "url('/images/clouds/cloud-layer-2.svg')",
          animation: "drift-reverse 25s infinite linear",
        }}
      />
      <div 
        className={`absolute inset-0 bg-center bg-no-repeat bg-cover cloud-layer-3 ${stage}`}
        style={{
          backgroundImage: "url('/images/clouds/cloud-layer-3.svg')",
          animation: "drift 20s infinite linear",
        }}
      />
      
      {/* White flash when "breaking through" to the detailed map */}
      <div 
        className={`absolute inset-0 bg-white ${stage === 'peak' ? 'opacity-80' : 'opacity-0'} transition-opacity duration-500`}
      />
      
      {/* Turbulence effect during transition */}
      <div 
        className={`absolute inset-0 ${stage === 'peak' ? 'turbulence' : ''}`}
      >
        {/* Overlay for the entire effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-white/30 via-white/50 to-white/30 transition-opacity duration-1000
            ${stage === 'starting' ? 'opacity-0 animate-in' : 
              stage === 'peak' ? 'opacity-90' : 
                stage === 'ending' ? 'opacity-0 animate-out' : 'opacity-0'}`}
        />
      </div>
    </div>
  );
};

export default CloudTransition; 