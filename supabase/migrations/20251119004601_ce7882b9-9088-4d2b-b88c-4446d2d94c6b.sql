-- Add round_started_at to track when each round begins
ALTER TABLE game_rooms ADD COLUMN round_started_at timestamp with time zone;

-- Create index for better query performance
CREATE INDEX idx_game_rooms_round_started_at ON game_rooms(round_started_at);