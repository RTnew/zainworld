-- Create game rooms table
CREATE TABLE public.game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT UNIQUE NOT NULL,
  host_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, playing, finished
  current_letter TEXT,
  current_round INTEGER DEFAULT 1,
  total_rounds INTEGER DEFAULT 5,
  categories JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create players table
CREATE TABLE public.game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.game_rooms(id) ON DELETE CASCADE NOT NULL,
  player_name TEXT NOT NULL,
  is_host BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create player answers table
CREATE TABLE public.player_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.game_rooms(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES public.game_players(id) ON DELETE CASCADE NOT NULL,
  round_number INTEGER NOT NULL,
  category TEXT NOT NULL,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow anyone to read and write (public game)
CREATE POLICY "Anyone can view game rooms"
  ON public.game_rooms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create game rooms"
  ON public.game_rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update game rooms"
  ON public.game_rooms FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can view players"
  ON public.game_players FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join games"
  ON public.game_players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view answers"
  ON public.player_answers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit answers"
  ON public.player_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update answers"
  ON public.player_answers FOR UPDATE
  USING (true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_game_rooms_updated_at
  BEFORE UPDATE ON public.game_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_answers;