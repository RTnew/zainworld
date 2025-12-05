-- Add unique constraint to support upsert operations
ALTER TABLE player_answers
ADD CONSTRAINT player_answers_room_player_round_category_unique 
UNIQUE (room_id, player_id, round_number, category);