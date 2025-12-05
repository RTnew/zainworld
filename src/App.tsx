import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Menu from "./pages/Menu";
import GameSetup from "./pages/GameSetup";
import Game from "./pages/Game";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import Scores from "./pages/Scores";
import MultiplayerSetup from "./pages/MultiplayerSetup";
import MultiplayerLobby from "./pages/MultiplayerLobby";
import MultiplayerGame from "./pages/MultiplayerGame";
import MultiplayerResults from "./pages/MultiplayerResults";
import MultiplayerFinalResults from "./pages/MultiplayerFinalResults";
import OnlineMatchSetup from "./pages/OnlineMatchSetup";
import OnlineMatchmaking from "./pages/OnlineMatchmaking";
import OnlineMatch from "./pages/OnlineMatch";
import OnlineMatchResults from "./pages/OnlineMatchResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/game-setup" element={<GameSetup />} />
          <Route path="/game" element={<Game />} />
          <Route path="/results" element={<Results />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/multiplayer-setup" element={<MultiplayerSetup />} />
          <Route path="/multiplayer-lobby/:roomId" element={<MultiplayerLobby />} />
          <Route path="/multiplayer-game/:roomId" element={<MultiplayerGame />} />
          <Route path="/multiplayer-results/:roomId" element={<MultiplayerResults />} />
          <Route path="/multiplayer-final-results/:roomId" element={<MultiplayerFinalResults />} />
          <Route path="/online-match-setup" element={<OnlineMatchSetup />} />
          <Route path="/online-matchmaking" element={<OnlineMatchmaking />} />
          <Route path="/online-match/:matchId" element={<OnlineMatch />} />
          <Route path="/online-match-results/:matchId" element={<OnlineMatchResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
