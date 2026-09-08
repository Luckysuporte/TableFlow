-- =========================================================
-- TableFlow - Migração: Adicionar Saldo da Conta e Moeda
-- Execute este script no SQL Editor do seu painel Supabase
-- =========================================================

-- 1. Adicionar coluna de saldo da conta / banca (initial_balance)
ALTER TABLE accounts 
  ADD COLUMN IF NOT EXISTS initial_balance DECIMAL(12, 2) DEFAULT 0;

-- 2. Adicionar coluna de moeda (BRL ou USD)
ALTER TABLE accounts 
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL';

-- Notificação de conclusão
COMMENT ON COLUMN accounts.initial_balance IS 'Saldo base/inicial da corretora ou banca da mesa';
COMMENT ON COLUMN accounts.currency IS 'Moeda da conta: BRL (R$) ou USD ($)';
