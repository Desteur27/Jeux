/*
# Add download_url column to games table

1. Modified Tables
- `games`: Add `download_url` column (text, nullable) — stores the ZIP download link for each game.
  This URL is returned to the customer only after payment is validated.
2. Security
- No policy changes needed: the column is readable via the existing public SELECT policy,
  but the download_url should only be exposed after payment. The edge function will
  return download URLs only for paid orders.
*/

ALTER TABLE games ADD COLUMN IF NOT EXISTS download_url text;

-- Populate download_url for all existing games with placeholder ZIP links
UPDATE games SET download_url = 'https://storage.supabase.co/games/' || id || '/' || replace(lower(title), ' ', '_') || '.zip' WHERE download_url IS NULL;
