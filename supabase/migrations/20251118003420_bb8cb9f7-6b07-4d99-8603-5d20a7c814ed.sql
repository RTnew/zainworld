-- Add timer_duration column to game_rooms table
ALTER TABLE public.game_rooms
ADD COLUMN timer_duration integer NOT NULL DEFAULT 60;

COMMENT ON COLUMN public.game_rooms.timer_duration IS 'Time limit per round in seconds';