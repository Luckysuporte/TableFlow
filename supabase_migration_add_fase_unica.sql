-- ============================================
-- TableFlow - Migração: Adicionar "Fase Única"
-- ============================================

-- Esta migração adiciona suporte para "Fase Única" no campo phase da tabela accounts

-- 1. Remover a constraint antiga
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_phase_check;

-- 2. Adicionar nova constraint que inclui 'unica'
ALTER TABLE accounts ADD CONSTRAINT accounts_phase_check 
  CHECK (phase IN ('1', '2', 'unica'));

-- ============================================
-- FIM - Migração concluída!
-- ============================================
