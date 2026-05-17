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
- [x] **DirectChatPage redesign completo**:
  - Header verde "Jataí Região Trabalho" + nav (Acolhida, Ofertantes, Demanda(+), Assinatura, Mensagens)
  - **Esquerda**: Sidebar "Mensagens" com busca, tabs (Todas/Não lidas/Arquivadas), cards de conversa com avatar+rating+badge+preview
  - **Centro**: Banner "Solicitação privada" com preview do post (botão Exibir/Ocultar) + área de mensagens em bolhas verdes/cinzas + ações (Recusar/Agendar/Pagamento/Avaliar) + input com anexar/câmera/enviar
  - **Direita**: Painel de perfil com avatar grande, rating 5/5, role, botões vídeo/telefone, "Ver perfil", links (Compartilhar/Fixar/Arquivar) e ações vermelhas (Reportar/Bloquear)
- [x] Toda lógica original do chat preservada: `sendMessage`, `fetchMessages`, `fetchOtherUser`, `checkCanChat`, `fetchUserPosts`, polling 3s

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
