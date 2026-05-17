# Watizat - PRD

## Original Problem Statement
Plataforma para conectar migrantes e voluntários em Paris (chat AI + chat direto, mapa, vagas, moradia solidária Airbnb-style, painel admin, multi-idioma PT/FR/EN/ES). Usuário pediu para clonar visualmente o app "Jataí Região" (zip enviado) mantendo todo o backend e integrações do Watizat. Preparação para deploy na Render.

## User Personas
- **Migrante**: pede ajuda (alimentação, jurídico, moradia, etc.)
- **Voluntário/Ajudante**: oferece serviços
- **Admin**: gerencia plataforma

## Core Features
1. Auth JWT (login/registro)
2. Feed estilo Jataí (FeedPage) com posts "Demanda pública", upload de fotos, criação no sidebar
3. Mensagens estilo Jataí (MessagesPage) com lista de conversas + chat ativo
4. AI Chat (em /ai-chat) com OpenAI via Emergent LLM Key
5. Moradia Solidária Airbnb-style (/housing) com calendário e fotos
6. Vagas de emprego (/jobs)
7. Voluntários (/volunteers)
8. Admin Dashboard (/admin) com aba Hospedagem
9. i18n PT/FR/EN/ES
10. Mapa de recursos

## Architecture
- Frontend: React 18 + react-i18next + shadcn/ui + lucide-react
- Backend: FastAPI (`/app/backend/server.py` ~2155 linhas)
- DB: MongoDB (Motor)
- 3rd party: OpenAI via Emergent LLM Key, JSearch API

## Implemented (Feb 2026)
### Sessão atual (2026-02-17)
- ✅ Upload de fotos em Posts e Housing (max 3/5 fotos, 5MB)
- ✅ Bug P0 scroll do modal SOS corrigido
- ✅ Theme Jataí: green primary (HSL 142/71/45%), orange secondary (HSL 25/95/53%), SF Pro fonts
- ✅ **LandingPage** reescrita 100% estilo Jataí (logo gradient W, hero com stats, CTA verde, trust badges)
- ✅ **FeedPage** (NEW /home): clone Jataí completo — top nav centralizado, banner salmão premium, layout 2-col (posts "Demanda pública" + card de publicação direita "Olá" + monetização)
- ✅ **MessagesPage** (NEW /chat): clone Jataí Messages — 2-col (lista conversas com search/filtros/avatares + chat ativo com bolhas verdes/brancas + painel perfil xl)
- ✅ Legacy HomePage movido para /home-old; legacy AIChat movido para /ai-chat
- ✅ test_credentials.md atualizado: admin@watizat.com / admin123 (working)
- ✅ Backend tests: 12/12 PASS (8 photo_uploads + 4 messages_chat)
- ✅ Frontend: 100% desktop, 95%+ mobile (1 visual fix aplicado para mobile conv header)

## Test Credentials
- Admin: `admin@watizat.com / admin123`
- Migrant: `test_migrant_photo@watizat.com / Pass1234`

## Backlog (Próximas)
- (P1) Integrar API Pôle Emploi (requer chave do usuário)
- (P2) Refatorar `server.py` (>2100 linhas) em routers separados
- (P2) Adicionar `images: List[str]` ao response_model do POST /api/posts
- (P2) Adicionar DialogDescription nas 2 DialogContent de /jobs (a11y warning Radix)
- (P2) Substituir `<input type="date">` por shadcn Calendar em HousingPage
- (P3) Remover endpoints mortos `/api/mural` em server.py
- (P3) Sistema dedicado de Ads promocionais

## Known Issues
- Nenhum bloqueador para deploy na Render.
