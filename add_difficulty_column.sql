-- Add difficulty column to mockinterview table
ALTER TABLE mockinterview 
ADD COLUMN difficulty VARCHAR(50);

-- Set default value for existing records
UPDATE mockinterview 
SET difficulty = 'Intermediate' 
WHERE difficulty IS NULL;
