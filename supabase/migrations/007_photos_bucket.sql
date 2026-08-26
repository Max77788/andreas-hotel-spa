-- Storage bucket required by the admin Gallery uploader.
-- Idempotent so it is safe to apply to the migrated Andreas project.
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;
