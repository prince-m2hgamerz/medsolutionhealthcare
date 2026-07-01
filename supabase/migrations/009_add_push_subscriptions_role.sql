ALTER TABLE IF EXISTS push_subscriptions
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_role ON push_subscriptions(role);
