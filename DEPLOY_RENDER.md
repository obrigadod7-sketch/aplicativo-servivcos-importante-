# Deploy no Render — Como corrigir o erro "Build failed"

## Problema
O Render estava procurando `requirements.txt` na raiz do repositório, mas o arquivo está dentro de `backend/`. Por isso o build falhava com:
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
==> Build failed
```
Como o backend não subia, o frontend mostrava "Erro de conexão" ao tentar cadastrar.

## Solução
Foram criados/atualizados estes arquivos na raiz do projeto:
- `render.yaml` — configura **2 serviços** (backend Python + frontend estático) com `rootDir`
- `requirements.txt` — cópia das dependências do backend (fallback caso o Render ignore o `rootDir`)
- `runtime.txt` — fixa Python 3.11.10

## Passos para você no Render

### 1. Suba o código atualizado no GitHub
Use o botão **"Save to GitHub"** no chat para enviar essas correções ao seu repositório `obrigadod7-sketch/aplicativo-servivcos-importante-`.

### 2. Crie o banco MongoDB (gratuito)
1. Vá em https://www.mongodb.com/cloud/atlas
2. Crie um cluster **M0 Free**
3. Em "Database Access" crie um usuário com senha
4. Em "Network Access" libere `0.0.0.0/0` (qualquer IP)
5. Copie a connection string (formato: `mongodb+srv://usuario:senha@cluster.mongodb.net/watizat_db`)

### 3. No painel do Render
1. Apague os serviços antigos que falharam
2. Clique em **"New +"** → **"Blueprint"** → conecte seu repo
3. O `render.yaml` criará automaticamente **jatai-backend** e **jatai-frontend**
4. No backend, vá em **Environment** e preencha as variáveis marcadas `sync: false`:
   - `MONGO_URL` = sua connection string do MongoDB Atlas (passo 2)
   - `PIX_KEY` = sua chave PIX (email, CPF, CNPJ ou aleatória)
5. Salve. O deploy começa automaticamente.

### 4. Após o deploy
- Backend ficará em `https://jatai-backend.onrender.com`
- Frontend ficará em `https://jatai-frontend.onrender.com`
- O frontend já está configurado para chamar o backend automaticamente (via `fromService`)

## Variáveis opcionais
- `PIX_MERCHANT_NAME` — nome do recebedor que aparece no PIX (default: "JATAI REGIAO TRABALHO")
- `PIX_MERCHANT_CITY` — cidade (default: "SAO PAULO")
- `SUB_AMOUNT` — valor da assinatura (default: 35.90)
- `SUB_TRIAL_DAYS` — dias de trial (default: 3)

## Atenção sobre o plano free do Render
> "Your free instance will spin down with inactivity, which can delay requests by 50 seconds or more."

O backend dorme após ~15min sem requisições. A primeira chamada pode demorar 30-60s. Para evitar isso:
- Use o plano Starter ($7/mês) **OU**
- Configure um ping a cada 14 min (UptimeRobot.com — gratuito)
