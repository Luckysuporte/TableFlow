# Instruções para Aplicar a Migração - Fase Única

## Problema Identificado
O banco de dados Supabase tem uma restrição que só permite os valores '1' ou '2' para o campo `phase` na tabela `accounts`. Por isso, quando você tenta cadastrar uma mesa com "Fase Única" (valor 'unica'), o banco rejeita a operação.

## Solução
Execute a migração SQL que foi criada para adicionar suporte ao valor 'unica'.

## Como Aplicar a Migração

### Opção 1: Via Dashboard do Supabase (Recomendado)
1. Acesse o dashboard do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto TableFlow
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `supabase_migration_add_fase_unica.sql`
6. Clique em **Run** para executar a migração

### Opção 2: Via Supabase CLI
Se você tem o Supabase CLI instalado:
```bash
supabase db execute --file supabase_migration_add_fase_unica.sql
```

## Conteúdo da Migração
```sql
-- Remover a constraint antiga
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_phase_check;

-- Adicionar nova constraint que inclui 'unica'
ALTER TABLE accounts ADD CONSTRAINT accounts_phase_check 
  CHECK (phase IN ('1', '2', 'unica'));
```

## Após Aplicar a Migração
Depois de executar a migração com sucesso:
1. ✅ Você poderá cadastrar mesas com "Fase Única"
2. ✅ As mesas existentes (Fase 1 e Fase 2) continuarão funcionando normalmente
3. ✅ O sistema mostrará "Fase Única" corretamente na lista de mesas

## Verificação
Para verificar se a migração foi aplicada corretamente, você pode executar no SQL Editor:
```sql
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'accounts_phase_check';
```

Isso deve mostrar que a constraint agora aceita os valores '1', '2' e 'unica'.
