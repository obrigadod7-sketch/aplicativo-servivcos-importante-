# 🔑 Credenciais de Acesso - Jataí Região Trabalho

## 📧 Credenciais de Login

### 👤 Conta Admin (Dashboard)
**Email:** francesdefranceff@gmail.com  
**Senha:** admin123  
**Acesso:** Dashboard Admin ✅

### Conta de Teste Principal
**Email:** usuario@teste.com  
**Senha:** senha123  
**Acesso:** Todas as funcionalidades (exceto Dashboard)

### Conta Prestador de Serviços
**Email:** prestador@teste.com  
**Senha:** prestador123  
**Acesso:** Perfil profissional

---

## 🔒 Proteção de Rota - Dashboard

O Dashboard está protegido e **APENAS** acessível para:
- Email: `francesdefranceff@gmail.com`

### Proteções Implementadas:

1. ✅ **Dashboard.jsx** - Verifica email e redireciona se não for admin
2. ✅ **Feed.jsx** - Link do Dashboard só aparece para admin
3. ✅ **BottomNav.jsx** - Botão do Dashboard só aparece para admin

### Comportamento:

**Se usuário for admin (`francesdefranceff@gmail.com`):**
- ✅ Vê link "Dashboard" na navegação desktop
- ✅ Vê botão "Dashboard" no bottom nav mobile
- ✅ Pode acessar `/dashboard`

**Se usuário NÃO for admin:**
- ❌ Não vê link do Dashboard
- ❌ Não vê botão do Dashboard
- ❌ Se tentar acessar `/dashboard`, é redirecionado para `/feed`

---

## 🔗 URLs de Acesso

- **Página Inicial/Login:** /login
- **Feed:** /feed
- **Dashboard Admin:** /dashboard (apenas francesdefranceff@gmail.com)
- **Perfil:** /perfil
- **Editar Perfil:** /editar-perfil
- **Mensagens:** /mensagens
- **Ofertantes:** /ofertantes
- **Assinatura:** /assinatura
- **Publicar Demanda:** /publicar-demanda

---

## 📱 Responsividade Testada

✅ **Mobile (320px - 768px)**
- Navegação bottom bar
- Cards empilhados
- Formulários responsivos
- Zoom desabilitado ✅
- Scroll funcionando ✅

✅ **Tablet (768px - 1024px)**
- Layout adaptativo
- Sidebar colapsável

✅ **Desktop (1024px+)**
- Layout completo
- Sidebar fixa
- Multi-colunas

---

## 🎯 Funcionalidades Principais

1. **Autenticação**
   - Login com email/senha
   - Registro multi-step
   - Logout completo
   - Proteção de rotas

2. **Dashboard (Admin Only)**
   - Estatísticas em tempo real
   - Gráficos e métricas
   - Atividades recentes
   - Acesso restrito

3. **Feed**
   - Posts de demandas
   - Upload de fotos real ✅
   - Resposta automática
   - Redirecionamento para mensagens

4. **Mensagens**
   - Conversas em tempo real
   - Criação automática de chat
   - Envio de mensagens

5. **Perfil**
   - Visualização de perfil
   - Edição de dados
   - Upload de fotos
   - Logout

---

## 🌐 Detecção de Localização

A página de login possui detecção automática de localização:
- Clique no ícone 📍 no campo de endereço
- Permita acesso à localização
- Endereço será preenchido automaticamente
- Timeout: 30s (alta precisão) + 15s (baixa precisão)

---

**Última atualização:** 09/04/2026
