# 🚀 Deploy no Render - Guia Definitivo (Docker)

## O problema anterior
O Render estava tentando deploy como serviço Node/Python separados e quebrando com `Exited with status 1`. A solução é usar **Docker** — bundle único, sem dependência de runtime do Render.

## Como aplicar

### 1. Suba o código atualizado no GitHub
Use o botão **"Save to GitHub"** aqui no chat. Isso envia:
- `Dockerfile` — bundle React + FastAPI em 1 container
- `.dockerignore` — exclui arquivos desnecessários
- `render.yaml` — Blueprint com 1 serviço Docker
- `requirements.txt` (raiz) — backup

### 2. Crie o MongoDB Atlas (gratuito)
1. https://www.mongodb.com/cloud/atlas → conta gratuita
2. Crie cluster **M0 Free**
3. **Database Access**: crie usuário com senha (anote!)
4. **Network Access**: libere `0.0.0.0/0`
5. **Connect → Drivers**: copie a string (exemplo):
   ```
   mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/watizat_db?retryWrites=true&w=majority
   ```

### 3. No Render
1. **Apague o serviço antigo** que está dando erro
2. Clique **"New +" → "Blueprint"** → conecte o repo `obrigadod7-sketch/aplicativo-servivcos-importante-`
3. O Render detecta o `render.yaml` e cria o serviço `jatai-app`
4. Em **Environment** preencha 2 secrets:
   - `MONGO_URL` → string do passo 2
   - `PIX_KEY` → sua chave PIX real (email, CPF, CNPJ ou aleatória)
5. Clique **Apply** / **Deploy**

### 4. Aguarde 3-5 min do primeiro deploy
O Docker leva mais tempo na primeira vez (compila o React + instala Python). Os próximos deploys são mais rápidos por causa do cache.

### 5. Quando aparecer "Live"
- App ficará em `https://jatai-app.onrender.com`
- Frontend e backend rodam no MESMO endereço (frontend em `/`, API em `/api`)

## Vantagens dessa abordagem
- ✅ Sem confusão de runtime Node vs Python
- ✅ Um único endereço (sem CORS issues)
- ✅ Funciona idêntico em qualquer plataforma (Render, Railway, Fly.io)
- ✅ Build reprodutível (mesmo container = mesmo comportamento)

## Plano free
> Free instance spin down after 15min inactivity (50s delay on first request)

Para evitar: configure **UptimeRobot** (grátis em uptimerobot.com) com URL `https://jatai-app.onrender.com/api` a cada 14 min.

## Troubleshooting

| Erro | Solução |
|---|---|
| Build trava em "yarn install" | Aumente RAM no Render (plano Starter $7/mês) |
| MongoDB connection failed | Verifique MONGO_URL e Network Access do Atlas |
| Frontend mostra "Erro de conexão" | Verifique que `/api` retorna JSON visitando direto a URL |
| Exited with status 1 | Logs do Render mostram a stacktrace — copie pra mim |
