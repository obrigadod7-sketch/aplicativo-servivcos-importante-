# PRD - Aplicativo de Serviços (Watizat / Jataí Região Trabalho)

## Problema original
> "clone esse aplicativo e faca essas modificacoes para que quando alquem clicar embaixo do poste de servico a pagina de conversa fique igual a essa analisando todos os detalhes mais sempre guardando as configuracoes iniciais do chat so mudando a personalizacao... aplicativo de servico"

Usuário enviou print da página AlloVoisins como referência visual e o zip `aplicativo-mesclado-main` como base.

## Arquitetura
- Backend: FastAPI + MongoDB (motor)
- Frontend: React 19 + Tailwind + lucide-react + sonner
- Auth: JWT bearer tokens (existente)

## Personas
- **Migrante (migrant)**: Cria posts de "necessidade" e recebe ajuda
- **Voluntário (volunteer)**: Profissional que oferece ajuda em categorias específicas
- **Helper**: Ajudante geral em categorias
- **Admin**: Gerencia dashboard

## Requisitos núcleo
- Conversa direta 1-a-1 entre usuários (`/direct-chat/:userId`)
- Restrição de chat baseada em categorias (`/api/can-chat/:userId`)
- Envio de texto, mídia (foto/vídeo) e localização
- Listagem de conversas com última mensagem
- Layout visual espelhando AlloVoisins (3 colunas)

## O que foi implementado (17/05/2026)
- [x] Setup do codebase (backend + frontend instalados, .env criados, MongoDB rodando)
- [x] Seed de serviços + 3 usuários teste (Maria, Carlos, Ana)
- [x] **DirectChatPage redesign desktop (AlloVoisins-style 3 colunas)**:
  - Header verde "Jataí Região Trabalho" + nav (Acolhida, Ofertantes, Demanda(+), Assinatura, Mensagens)
  - **Esquerda**: Sidebar "Mensagens" com busca, tabs (Todas/Não lidas/Arquivadas), cards de conversa com avatar+rating+badge+preview
  - **Centro**: Banner "Solicitação privada" com preview do post (botão Exibir/Ocultar) + área de mensagens em bolhas verdes/cinzas + ações (Recusar/Agendar/Pagamento/Avaliar) + input com anexar/câmera/enviar
  - **Direita**: Painel de perfil com avatar grande, rating 5/5, role, botões vídeo/telefone, "Ver perfil", links (Compartilhar/Fixar/Arquivar) e ações vermelhas (Reportar/Bloquear)
- [x] **DirectChatPage mobile (responsive)**:
  - Cabeçalho compacto: ← back + avatar + nome + "Serviço solicitado" + ⋮ menu
  - Mensagens em tela cheia (bolhas verdes/cinzas)
  - Input: 📎 anexar + 📷 câmera + "Sua mensagem" + ➤ enviar
  - Bottom nav fixo: Início, Ofertantes, Demande(+ verde), Mensagens
  - Sidebar e painel de perfil ocultos em mobile (mostrados apenas em md+)
  - Botões Recusar/Agendar/Pagamento/Avaliar ocultos em mobile (apenas desktop)
- [x] Toda lógica original do chat preservada: `sendMessage`, `fetchMessages`, `fetchOtherUser`, `checkCanChat`, `fetchUserPosts`, polling 3s

## Adicionado em 17/05/2026 (sessão 2)
- [x] **Modal "Demanda pública"** (FeedPage.js): centralizado, acionado pelo botão `+` Publicar. Campos: Descrição (0/250), Adicione fotos (3 slots), Endereço, Orçamento (select), Categoria (select), botão verde "Postar minha demanda". Toggle "Demanda paga" | "Ajuda Voluntária" (redireciona para `/volunteers`).
- [x] **Página `/assinatura`** (SubscriptionPage.js): layout 3 colunas
  - Sidebar: Meu perímetro de intervenção, Minha visibilidade, Minha empresa PRO
  - Centro: "Gerenciar meu perímetro" com slider de raio, domínios (Serviços/Objetos), notificações, "Modificar meu perímetro"
  - Direita: Card laranja "Passe para a velocidade superior!" com bullets + botão "Eu me inscrevo"
- [x] **Pagamento PIX (QR Code estático)**:
  - Backend `pix_generator.py` gera BR Code EMV compliant (CRC16-CCITT, spec BCB)
  - Endpoints: `/api/subscription/{status, start, confirm-payment}` + admin `/api/admin/subscriptions{,/:id/activate}`
  - 3 dias grátis + R$ 35,90/mês
  - Modal PIX com QR PNG + copia-e-cola + botão "Já paguei" (status → `pending_verification`)
  - Chave PIX configurável via env `PIX_KEY` (placeholder: `jatairegiao@suporte.com`)
- [x] Backend 100% (10/10 pytest), Frontend 100% (todos fluxos verificados)

## Backlog / Futuro
- **P1**: Tornar funcionais os botões (Recusar/Agendar/Pagamento/Avaliar) com endpoints reais
- **P1**: Backend de ratings reais (atualmente "5/5" é placeholder)
- **P1**: Implementar filtros "Não lidas" e "Arquivadas" (precisa flags no schema de mensagens/conversas)
- **P2**: Chamadas de vídeo/telefone (WebRTC ou redirect para WhatsApp/Telegram)
- **P2**: Reportar/Bloquear usuário com persistência no backend
- **P2**: Componentizar DirectChatPage em `<ConversationsSidebar/>`, `<ChatPanel/>`, `<ProfilePanel/>`
- **P2**: Trocar polling por WebSocket

## Status testes
- Backend: 100% (10/10 pytest)
- Frontend: 100% (23/23 data-testids render, fluxo e2e completo OK)
