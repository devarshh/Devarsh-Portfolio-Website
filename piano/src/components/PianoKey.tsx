
import React from 'react';
import { cn } from '@/lib/utils';

interface PianoKeyProps {
  keyId: string;
  note: string;
  octave: number;
  isBlack: boolean;
  isActive: boolean;
  onPress: () => void;
  style?: React.CSSProperties;
}

export const PianoKey: React.FC<PianoKeyProps> = ({
  keyId,
  note,
  octave,
  isBlack,
  isActive,
  onPress,
  style
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onPress();
  };

  const baseClasses = "transition-all duration-150 cursor-pointer select-none shadow-lg transform-gpu";
  
  if (isBlack) {
    return (
      <div
        className={cn(
          baseClasses,
          "absolute w-6 sm:w-7 h-28 sm:h-32 bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 rounded-b-lg z-10",
          "hover:from-slate-800 hover:via-slate-900 hover:to-slate-950 hover:shadow-xl hover:shadow-indigo-500/20",
          "active:from-slate-700 active:via-slate-800 active:to-slate-900 active:transform active:translate-y-0.5 active:shadow-inner",
          isActive && "from-indigo-600 via-indigo-700 to-indigo-900 shadow-indigo-500/50 shadow-xl border-indigo-500"
        )}
        style={style}
        onMouseDown={handleMouseDown}
        title={`${note}${octave}`}
      >
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 text-white text-[10px] sm:text-xs font-mono opacity-70">
          {note}
        </div>
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/30 to-purple-400/30 rounded-b-lg animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        "w-8 sm:w-10 h-40 sm:h-48 bg-gradient-to-b from-slate-50 via-white to-slate-100 border-r border-slate-300 first:rounded-l-lg last:rounded-r-lg",
        "hover:from-slate-100 hover:via-slate-50 hover:to-slate-200 hover:shadow-xl hover:shadow-indigo-500/10",
        "active:from-slate-200 active:via-slate-300 active:to-slate-400 active:transform active:translate-y-1 active:shadow-inner",
        isActive && "from-indigo-100 via-indigo-200 to-indigo-300 shadow-indigo-400/50 shadow-xl border-indigo-300"
      )}
      onMouseDown={handleMouseDown}
      title={`${note}${octave}`}
    >
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 text-slate-600 text-[10px] sm:text-xs font-mono text-center">
        <div className="font-semibold">{note}</div>
        <div className="text-[8px] sm:text-[10px] opacity-60">{octave}</div>
      </div>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-200/40 to-purple-200/40 first:rounded-l-lg last:rounded-r-lg animate-pulse" />
      )}
    </div>
  );
};
