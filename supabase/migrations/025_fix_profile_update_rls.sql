-- Fix: the "Users can update own profile" policy (006) has no WITH CHECK and no
-- column restriction, so a user could self-update their own row's `role` and
-- `tenant_id` (e.g. via the browser Supabase client) and escalate to owner of any
-- tenant. RLS WITH CHECK can't compare against the pre-update row without risking
-- self-recursion on the profiles table, so we guard the sensitive columns with a
-- BEFORE UPDATE trigger that only the service role may bypass.

CREATE OR REPLACE FUNCTION prevent_profile_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- The service-role key (used by trusted server code) is allowed to change these.
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Changing profile role is not permitted';
  END IF;

  IF NEW.tenant_id IS DISTINCT FROM OLD.tenant_id THEN
    RAISE EXCEPTION 'Changing profile tenant is not permitted';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON profiles;
CREATE TRIGGER trg_prevent_profile_privilege_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_profile_privilege_escalation();
