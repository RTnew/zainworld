import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Volume2, VolumeX } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GameTimerProps {
  timeLeft: number;
  totalTime: number;
  onTimeUp: () => void;
}

const GameTimer = ({ timeLeft, totalTime, onTimeUp }: GameTimerProps) => {
  const [buzzerEnabled, setBuzzerEnabled] = useState(() => {
    const saved = localStorage.getItem("npat-buzzer-enabled");
    return saved === null ? true : saved === "true";
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedBuzzer = useRef(false);

  useEffect(() => {
    // Create buzzer sound (simple beep)
    if (!audioRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "square";
      
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !hasPlayedBuzzer.current) {
      if (buzzerEnabled) {
        playBuzzer();
      }
      hasPlayedBuzzer.current = true;
      onTimeUp();
    } else if (timeLeft > 0) {
      hasPlayedBuzzer.current = false;
    }
  }, [timeLeft, buzzerEnabled, onTimeUp]);

  const playBuzzer = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "square";
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch (error) {
      console.error("Failed to play buzzer:", error);
    }
  };

  const toggleBuzzer = () => {
    const newValue = !buzzerEnabled;
    setBuzzerEnabled(newValue);
    localStorage.setItem("npat-buzzer-enabled", String(newValue));
  };

  const percentage = (timeLeft / totalTime) * 100;
  const isLowTime = timeLeft <= 10;

  return (
    <Card className={`p-6 shadow-card bg-gradient-card border-0 ${isLowTime ? 'animate-pulse' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-6 h-6 ${isLowTime ? 'text-destructive' : 'text-primary'}`} />
            <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBuzzer}
            title={buzzerEnabled ? "Buzzer On" : "Buzzer Off"}
          >
            {buzzerEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </div>
        
        <div className="text-center">
          <div className={`text-6xl font-bold ${isLowTime ? 'text-destructive' : 'text-foreground'}`}>
            {timeLeft}s
          </div>
        </div>
        
        <Progress 
          value={percentage} 
          className={`h-3 ${isLowTime ? '[&>div]:bg-destructive' : ''}`}
        />
      </div>
    </Card>
  );
};

export default GameTimer;
