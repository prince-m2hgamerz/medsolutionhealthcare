CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_expires_at ON push_subscriptions(expires_at);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Only allow the service role to manage subscriptions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'Service role can manage push subscriptions') THEN
    CREATE POLICY "Service role can manage push subscriptions" ON push_subscriptions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Allow anon users to insert their own subscription
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'Anyone can upsert subscriptions') THEN
    CREATE POLICY "Anyone can upsert subscriptions" ON push_subscriptions
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Allow anon users to delete by endpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'Anyone can delete by endpoint') THEN
    CREATE POLICY "Anyone can delete by endpoint" ON push_subscriptions
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
