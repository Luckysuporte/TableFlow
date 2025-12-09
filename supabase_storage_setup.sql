-- Configuração do Supabase Storage para Fotos de Perfil
-- Execute este SQL no Supabase SQL Editor

-- 1. Criar o bucket 'profile-photos' (se não existir)
-- IMPORTANTE: Você também pode criar o bucket pela interface do Supabase:
-- Storage → New Bucket → Nome: profile-photos → Public: SIM

-- 2. Configurar políticas de acesso ao bucket

-- Política: Qualquer usuário autenticado pode fazer upload de sua própria foto
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = 'avatars' AND
    auth.uid()::text = (storage.filename(name))::text
);

-- Política: Qualquer pessoa pode visualizar fotos de perfil (bucket público)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Política: Usuários podem atualizar suas próprias fotos
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = 'avatars'
)
WITH CHECK (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = 'avatars'
);

-- Política: Usuários podem deletar suas próprias fotos
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = 'avatars'
);
