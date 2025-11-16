import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Logo and title */}
      <div className="relative z-10 text-center animate-scale-in">
        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-white/20 rounded-3xl shadow-glow backdrop-blur-sm">
            <Gamepad2 className="w-24 h-24 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          NPAT Game
        </h1>
        <p className="text-xl text-white/90 font-medium">
          Name • Place • Animal • Thing
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

export default Splash;
