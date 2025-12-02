-- Create user_wallets table for coins
CREATE TABLE public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL UNIQUE,
  coins INTEGER NOT NULL DEFAULT 500,
  total_wins INTEGER NOT NULL DEFAULT 0,
  total_losses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- Policies for wallets
CREATE POLICY "Anyone can view wallets" ON public.user_wallets FOR SELECT USING (true);
CREATE POLICY "Anyone can create wallet" ON public.user_wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update wallet" ON public.user_wallets FOR UPDATE USING (true);

-- Create matchmaking_queue table
CREATE TABLE public.matchmaking_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  stake_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  matched_with UUID REFERENCES public.matchmaking_queue(id),
  match_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;

-- Policies for queue
CREATE POLICY "Anyone can view queue" ON public.matchmaking_queue FOR SELECT USING (true);
CREATE POLICY "Anyone can join queue" ON public.matchmaking_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update queue" ON public.matchmaking_queue FOR UPDATE USING (true);
CREATE POLICY "Anyone can leave queue" ON public.matchmaking_queue FOR DELETE USING (true);

-- Create online_matches table
CREATE TABLE public.online_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  stake_amount INTEGER NOT NULL,
  current_letter TEXT,
  current_round INTEGER NOT NULL DEFAULT 1,
  total_rounds INTEGER NOT NULL DEFAULT 5,
  timer_duration INTEGER NOT NULL DEFAULT 60,
  round_started_at TIMESTAMP WITH TIME ZONE,
  categories JSONB NOT NULL DEFAULT '["Name", "Place", "Animal", "Thing"]'::jsonb,
  status TEXT NOT NULL DEFAULT 'playing',
  winner_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.online_matches ENABLE ROW LEVEL SECURITY;

-- Policies for matches
CREATE POLICY "Anyone can view matches" ON public.online_matches FOR SELECT USING (true);
CREATE POLICY "Anyone can create matches" ON public.online_matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update matches" ON public.online_matches FOR UPDATE USING (true);

-- Create online_match_answers table
CREATE TABLE public.online_match_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.online_matches(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  category TEXT NOT NULL,
  answer TEXT,
  is_valid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(match_id, player_name, round_number, category)
);

-- Enable RLS
ALTER TABLE public.online_match_answers ENABLE ROW LEVEL SECURITY;

-- Policies for answers
CREATE POLICY "Anyone can view answers" ON public.online_match_answers FOR SELECT USING (true);
CREATE POLICY "Anyone can submit answers" ON public.online_match_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update answers" ON public.online_match_answers FOR UPDATE USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_user_wallets_updated_at BEFORE UPDATE ON public.user_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_online_matches_updated_at BEFORE UPDATE ON public.online_matches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.matchmaking_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.online_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.online_match_answers;