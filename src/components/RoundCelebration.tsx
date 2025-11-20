import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

interface RoundCelebrationProps {
  players: string[];
  onComplete: () => void;
  duration?: number;
}

const RoundCelebration = ({ players, onComplete, duration = 3000 }: RoundCelebrationProps) => {
  useEffect(() => {
    // Fireworks-style celebration effect
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const colors = ['#9b87f5', '#7E69AB', '#6E59A5', '#D946EF', '#F97316'];

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const firework = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0.2, 0.5) },
        colors: colors,
        startVelocity: 45,
        gravity: 1.2,
        scalar: 1.2,
        ticks: 200,
        shapes: ['star', 'circle'],
      });
    };

    // Initial burst
    firework();
    setTimeout(firework, 400);
    setTimeout(firework, 800);
    
    // Continuous smaller bursts
    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: colors,
        startVelocity: 30,
        gravity: 1,
        ticks: 150,
        shapes: ['star'],
      });
    }, 500);

    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="p-8 max-w-md w-full mx-4 shadow-glow bg-gradient-card border-0 animate-scale-in">
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-2">
            <Trophy className="w-12 h-12 text-primary animate-bounce" />
            <Star className="w-12 h-12 text-secondary animate-bounce" style={{ animationDelay: "0.1s" }} />
            <Trophy className="w-12 h-12 text-accent animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Round Complete!
          </h2>
          
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">Great job!</p>
            {players.length > 0 && (
              <div className="space-y-1">
                {players.map((player, idx) => (
                  <p 
                    key={idx} 
                    className="text-xl font-semibold text-primary animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {player}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoundCelebration;
