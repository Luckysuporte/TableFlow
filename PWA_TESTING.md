# Como Testar o PWA TableFlow

## ✅ Mudanças Implementadas

1. **Manifest.json atualizado** com todas as propriedades necessárias
2. **Service Worker melhorado** com estratégia de cache robusta
3. **Popup de instalação customizado** que aparece automaticamente
4. **Meta tags PWA** adicionadas ao HTML para suporte iOS e Android
5. **Ícones configurados** corretamente para todas as plataformas

## 🧪 Como Testar

### No Computador (Desktop)

1. **Rode o projeto em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acesse via HTTPS ou localhost:**
   - O PWA só funciona em HTTPS ou localhost
   - Abra: `http://localhost:5173` (ou a porta que o Vite mostrar)

3. **Abra o DevTools do Chrome:**
   - Pressione `F12`
   - Vá em **Application** > **Manifest**
   - Verifique se o manifest está carregado corretamente
   - Vá em **Service Workers** e veja se está registrado

4. **Teste a instalação:**
   - O popup deve aparecer automaticamente
   - OU clique no ícone de instalação na barra de endereço (ícone de +)
   - Clique em "Instalar"

### No Celular (Android/iOS)

#### Android (Chrome):

1. **Deploy o projeto** (Vercel, Netlify, etc.) ou use `ngrok` para expor localhost
2. **Acesse o site via HTTPS** no Chrome mobile
3. **Aguarde o popup aparecer** ou:
   - Toque nos 3 pontos (⋮) no canto superior direito
   - Selecione "Adicionar à tela inicial" ou "Instalar app"
4. **Aceite a instalação**
5. **O ícone aparecerá na tela inicial** do seu celular

#### iOS (Safari):

1. **Acesse o site via HTTPS** no Safari
2. **Toque no botão de compartilhar** (quadrado com seta para cima)
3. **Role para baixo** e toque em "Adicionar à Tela de Início"
4. **Confirme** e o ícone aparecerá na tela inicial

## 🚀 Deploy para Produção

Para testar em produção, faça o deploy:

```bash
# Build
npm run build

# Deploy (se estiver usando Vercel)
vercel --prod
```

## 🔍 Verificar se está funcionando

### Checklist:

- [ ] Service Worker registrado (veja no console: "Service Worker registered")
- [ ] Manifest carregado (DevTools > Application > Manifest)
- [ ] Ícones aparecem corretamente no manifest
- [ ] Popup de instalação aparece
- [ ] App pode ser instalado
- [ ] App abre em modo standalone (sem barra de navegação do browser)
- [ ] App funciona offline (após primeira visita)

## 🐛 Troubleshooting

### Popup não aparece:
- Limpe o cache do navegador
- Limpe o localStorage: `localStorage.removeItem('pwa-prompt-dismissed')`
- Recarregue a página
- Certifique-se de estar em HTTPS (ou localhost)

### Service Worker não registra:
- Verifique o console para erros
- Certifique-se que o arquivo `service-worker.js` está em `/public/`
- Limpe o cache e recarregue

### Ícones não aparecem:
- Verifique se os arquivos existem em `/public/icons/`
- Verifique o caminho no manifest (deve começar com `/`)
- Limpe o cache do navegador

### No celular não aparece opção de instalar:
- Certifique-se de estar usando HTTPS
- Aguarde alguns segundos após carregar a página
- Tente acessar pelo menos 2 vezes (alguns navegadores exigem isso)
- Verifique se já não está instalado

## 📱 Testando Localmente no Celular

Use `ngrok` para expor seu localhost:

```bash
# Instale ngrok
npm install -g ngrok

# Rode seu projeto
npm run dev

# Em outro terminal, exponha a porta
ngrok http 5173
```

Acesse a URL HTTPS que o ngrok fornecer no seu celular.

## ✨ Recursos PWA Implementados

- ✅ Instalável em desktop e mobile
- ✅ Funciona offline (após primeira visita)
- ✅ Ícone personalizado
- ✅ Splash screen automática
- ✅ Modo standalone (sem barra do navegador)
- ✅ Popup de instalação customizado
- ✅ Cache inteligente de recursos
- ✅ Suporte iOS e Android
