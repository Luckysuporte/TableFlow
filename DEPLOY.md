# TableFlow - Instruções de Deploy no Vercel

## ⚠️ IMPORTANTE: Configuração de Variáveis de Ambiente

Para que o site funcione corretamente no Vercel, você **DEVE** configurar as variáveis de ambiente do Supabase:

### Passo a Passo:

1. **Acesse o Dashboard do Vercel**
   - Vá para o seu projeto no Vercel
   - Clique em "Settings" (Configurações)

2. **Configure as Variáveis de Ambiente**
   - No menu lateral, clique em "Environment Variables"
   - Adicione as seguintes variáveis:

   ```
   VITE_SUPABASE_URL = [sua URL do Supabase]
   VITE_SUPABASE_ANON_KEY = [sua chave anônima do Supabase]
   ```

3. **Importante:**
   - Marque as três opções: Production, Preview e Development
   - Clique em "Save"

4. **Faça um novo Deploy**
   - Após salvar as variáveis, faça um novo deploy
   - Você pode fazer isso fazendo um novo commit ou clicando em "Redeploy" no Vercel

### Como encontrar suas credenciais do Supabase:

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em "Settings" → "API"
4. Copie:
   - **Project URL** → Use como `VITE_SUPABASE_URL`
   - **anon public** key → Use como `VITE_SUPABASE_ANON_KEY`

## 🚀 Deploy Automático

O Vercel está configurado para:
- ✅ Build automático com `npm run build`
- ✅ Servir arquivos da pasta `dist`
- ✅ Roteamento SPA (Single Page Application)

## 🔧 Comandos Locais

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Build local funcionando (`npm run build`)
- [ ] Arquivo `.env` local com as credenciais (não fazer commit!)
- [ ] Push para o repositório Git
- [ ] Deploy automático no Vercel

## 🐛 Solução de Problemas

### Site abre em branco no Vercel:
1. ✅ Verifique se as variáveis de ambiente estão configuradas
2. ✅ Verifique os logs de build no Vercel
3. ✅ Abra o Console do navegador (F12) e veja se há erros
4. ✅ Faça um redeploy após configurar as variáveis

### Erros de autenticação:
- Verifique se as credenciais do Supabase estão corretas
- Confirme que o domínio do Vercel está autorizado no Supabase

---

**Desenvolvido com ❤️ usando React + Vite + Supabase**
