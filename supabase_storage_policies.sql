-- POLÍTICAS PARA O BUCKET profile-photos
-- Execute este SQL no Supabase SQL Editor se o upload não funcionar

-- 1. Permitir que usuários autenticados façam upload
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

-- 2. Permitir que qualquer um veja as fotos (bucket público)
CREATE POLICY "Public access to avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- 3. Permitir que usuários atualizem suas fotos
CREATE POLICY "Users can update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos')
WITH CHECK (bucket_id = 'profile-photos');

-- 4. Permitir que usuários deletem suas fotos
CREATE POLICY "Users can delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos');
