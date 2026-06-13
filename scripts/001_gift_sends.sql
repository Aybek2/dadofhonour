-- Abuse log for the /api/gift "gift nudge" endpoint.
-- Used to rate-limit: per-IP (burst) and per-recipient (harassment) over rolling windows.
-- NOTE: /api/gift also runs this DDL idempotently on first call (ensureGiftTable),
-- so applying this file manually is optional — it's kept as the canonical schema record.
CREATE TABLE IF NOT EXISTS gift_sends (
  id              BIGSERIAL PRIMARY KEY,
  ip              TEXT,
  recipient_email TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gift_sends_ip_created_idx        ON gift_sends (ip, created_at);
CREATE INDEX IF NOT EXISTS gift_sends_recipient_created_idx ON gift_sends (recipient_email, created_at);
