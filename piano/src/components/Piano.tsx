import React, { useCallback, useEffect, useState } from 'react';
import { PianoKey } from './PianoKey';
import { Music, Volume2, Sparkles } from 'lucide-react';

// Piano key configuration
const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];

// Generate a smaller range of piano keys for better mobile experience
const generatePianoKeys = () => {
  const keys = [];
  
  // Generate C2 to C6 (4 octaves) for better screen fit
  for (let octave = 2; octave <= 5; octave++) {
    whiteKeys.forEach((note, index) => {
      const frequency = 261.63 * Math.pow(2, octave - 4) * Math.pow(2, (index * 2 + (index >= 3 ? 1 : 0)) / 12);
      keys.push({ note, octave, isBlack: false, frequency });
      
      if (blackKeys[index]) {
        const blackNote = blackKeys[index];
        const blackFreq = frequency * Math.pow(2, 1/12);
        keys.push({ note: blackNote, octave, isBlack: true, frequency: blackFreq });
      }
    });
  }
  
  // Add final C6
  keys.push({ note: 'C', octave: 6, isBlack: false, frequency: 1046.5 });
  
  return keys;
};

const Piano: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      }
    };
    
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
    
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, [audioContext]);

  const playSound = useCallback((frequency: number) => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  }, [audioContext]);

  const handleKeyPress = useCallback((keyId: string, frequency: number) => {
    setActiveKeys(prev => new Set(prev).add(keyId));
    playSound(frequency);
    
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyId);
        return newSet;
      });
    }, 150);
  }, [playSound]);

  const pianoKeys = generatePianoKeys();
  
  // Keyboard mapping
  const keyMap: { [key: string]: number } = {
    'a': 0, 'w': 1, 's': 2, 'e': 3, 'd': 4, 'f': 5, 't': 6, 'g': 7, 'y': 8, 'h': 9, 'u': 10, 'j': 11,
    'k': 12, 'o': 13, 'l': 14, 'p': 15, ';': 16, "'": 17
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyIndex = keyMap[event.key.toLowerCase()];
      if (keyIndex !== undefined && keyIndex < pianoKeys.length) {
        const key = pianoKeys[keyIndex + 36]; // Start from middle C area
        if (key) {
          const keyId = `${key.note}${key.octave}`;
          if (!activeKeys.has(keyId)) {
            handleKeyPress(keyId, key.frequency);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, activeKeys, pianoKeys]);

  const whiteKeysOnly = pianoKeys.filter(key => !key.isBlack);
  const blackKeysPositions = pianoKeys.filter(key => key.isBlack);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
      {/* Header */}
      <div className="w-full px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Music className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Virtual Piano Studio
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">Professional digital piano experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Volume2 className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-xs sm:text-sm">Audio Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Piano Area */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-7xl">
          {/* Instructions */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm mb-4">
              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-indigo-400" />
              <span className="text-slate-300 text-xs sm:text-sm">Click keys or use keyboard to play</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Keyboard mapping: <span className="text-indigo-400 font-mono">A-L</span> and <span className="text-indigo-400 font-mono">W-P</span> rows
            </p>
          </div>
          
          {/* Piano Container */}
          <div className="relative bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700/50 p-4 sm:p-8 overflow-x-auto">
            <div className="relative flex justify-center min-w-fit">
              {/* White keys */}
              <div className="flex">
                {whiteKeysOnly.map((key, index) => {
                  const keyId = `${key.note}${key.octave}`;
                  return (
                    <PianoKey
                      key={keyId}
                      keyId={keyId}
                      note={key.note}
                      octave={key.octave}
                      isBlack={false}
                      isActive={activeKeys.has(keyId)}
                      onPress={() => handleKeyPress(keyId, key.frequency)}
                    />
                  );
                })}
              </div>
              
              {/* Black keys */}
              <div className="absolute top-0 left-0 flex justify-center w-full">
                <div className="flex">
                  {blackKeysPositions.map((key, index) => {
                    const keyId = `${key.note}${key.octave}`;
                    const whiteKeyIndex = whiteKeysOnly.findIndex(wk => 
                      wk.octave === key.octave && 
                      whiteKeys.indexOf(wk.note) === whiteKeys.indexOf(key.note.charAt(0))
                    );
                    
                    return (
                      <PianoKey
                        key={keyId}
                        keyId={keyId}
                        note={key.note}
                        octave={key.octave}
                        isBlack={true}
                        isActive={activeKeys.has(keyId)}
                        onPress={() => handleKeyPress(keyId, key.frequency)}
                        style={{ 
                          left: `${whiteKeyIndex * 40 + 28}px`
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Piano Brand */}
            <div className="absolute bottom-2 sm:bottom-4 left-4 sm:left-8">
              <div className="text-slate-500 text-xs font-mono">
                VIRTUAL STUDIO
              </div>
            </div>
          </div>

          {/* Scroll hint for mobile */}
          <div className="text-center mt-4 sm:hidden">
            <p className="text-slate-500 text-xs">
              Scroll horizontally to see all keys
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-xs sm:text-sm">
            Experience the joy of music with our premium virtual piano
          </p>
        </div>
      </div>
    </div>
  );
};

export default Piano;
