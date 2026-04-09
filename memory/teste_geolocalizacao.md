# 🧪 Teste de Geolocalização - Jataí Região Trabalho

## 📍 **Objetivo**
Verificar se o sistema de detecção automática de localização está funcionando corretamente.

---

## 🔍 **Cenários de Teste**

### **Cenário 1: Permissão Concedida ✅**

**Passos:**
1. Acesse `/login`
2. Clique em "Criar uma conta"
3. Escolha tipo de conta (Particular/Auto-empresário/Empresa)
4. No campo "Endereço postal", clique no ícone 📍 (laranja)
5. Quando o navegador solicitar permissão, clique em **"Permitir"**

**Resultado Esperado:**
- ✅ Toast verde: "Localização detectada!"
- ✅ Campo preenchido automaticamente com: "Cidade, Estado, CEP"
- ✅ Exemplo: "São Paulo, SP, 01310-100"
- ✅ Console mostra: "✅ Localização obtida", "📍 Dados da API", "🏠 Endereço montado"

---

### **Cenário 2: Permissão Negada ❌**

**Passos:**
1. Acesse `/login`
2. Clique em "Criar uma conta"
3. Escolha tipo de conta
4. Clique no ícone 📍 de localização
5. Quando o navegador solicitar permissão, clique em **"Bloquear"** ou **"Negar"**

**Resultado Esperado:**
- ❌ Toast vermelho: "Erro ao detectar localização"
- ❌ Descrição: "Permissão de localização negada. Ative nas configurações do navegador."
- ❌ Campo de endereço permanece VAZIO
- ❌ Usuário deve digitar manualmente
- ✅ Console mostra: "❌ Erro ao obter localização"

---

### **Cenário 3: Timeout ⏱️**

**Passos:**
1. Acesse `/login`
2. Clique em "Criar uma conta"
3. Escolha tipo de conta
4. Clique no ícone 📍
5. Permitir, mas aguardar mais de 10 segundos sem resposta do GPS

**Resultado Esperado:**
- ❌ Toast vermelho: "Erro ao detectar localização"
- ❌ Descrição: "Tempo esgotado ao tentar obter localização."
- ❌ Campo permanece vazio

---

### **Cenário 4: API de Geocoding Falha 🌐**

**Passos:**
1. Desconectar internet temporariamente
2. Já com permissão concedida, clicar no ícone 📍
3. GPS obtém coordenadas, mas API não responde

**Resultado Esperado:**
- ❌ Toast vermelho: "Não foi possível obter endereço"
- ❌ Descrição: "Por favor, digite seu endereço manualmente"
- ❌ Campo permanece vazio (NÃO mostra coordenadas)
- ✅ Console mostra: "❌ Erro na API de geocoding"

---

### **Cenário 5: Navegador Sem Suporte 🚫**

**Passos:**
1. Usar navegador muito antigo ou simulador sem geolocalização
2. Clicar no ícone 📍

**Resultado Esperado:**
- ❌ Toast vermelho: "Geolocalização não suportada"
- ❌ Descrição: "Seu navegador não suporta detecção de localização"
- ❌ Campo permanece vazio

---

## 🛠️ **Como Testar no Chrome**

### **Permitir Localização:**
1. Clique no ícone 🔒 ao lado da URL
2. Clique em "Configurações do site"
3. Em "Localização", selecione "Permitir"
4. Recarregue a página

### **Bloquear Localização:**
1. Clique no ícone 🔒 ao lado da URL
2. Clique em "Configurações do site"
3. Em "Localização", selecione "Bloquear"
4. Recarregue a página

### **Simular Localização (DevTools):**
1. Abra DevTools (F12)
2. Menu ⋮ → More tools → Sensors
3. Em "Location", escolha uma cidade ou insira coordenadas personalizadas
4. Teste a funcionalidade

---

## 📊 **Checklist de Testes**

- [ ] **Teste 1:** Permissão concedida → Campo preenchido ✅
- [ ] **Teste 2:** Permissão negada → Campo vazio, erro exibido ❌
- [ ] **Teste 3:** Timeout → Campo vazio, erro de timeout ⏱️
- [ ] **Teste 4:** API falha → Campo vazio, erro de API 🌐
- [ ] **Teste 5:** Navegador sem suporte → Erro apropriado 🚫

---

## 🔍 **Logs do Console**

### **Sucesso:**
```
✅ Localização obtida: -23.5505, -46.6333
📍 Dados da API: {city: "São Paulo", principalSubdivision: "SP", ...}
🏠 Endereço montado: São Paulo, SP, 01310-100
```

### **Erro de Permissão:**
```
❌ Erro ao obter localização: GeolocationPositionError {code: 1, message: "User denied Geolocation"}
```

### **Erro de API:**
```
✅ Localização obtida: -23.5505, -46.6333
❌ Erro na API de geocoding: TypeError: Failed to fetch
```

---

## ✅ **Correções Aplicadas**

### **Problema Original:**
- ❌ Mesmo com erro de permissão, preenchia coordenadas no campo
- ❌ Mostrava "Lat: -23.5505, Long: -46.6333" mesmo sem permissão
- ❌ Confundia o usuário

### **Solução Implementada:**
- ✅ Removido fallback de coordenadas
- ✅ Campo permanece vazio em caso de erro
- ✅ Mensagens de erro específicas por tipo
- ✅ Logs detalhados no console para debug
- ✅ Toast com duração de 5s para erros
- ✅ Toast com duração de 3s para sucesso

---

## 🚀 **Próximos Passos**

1. **Teste Manual:** Execute todos os 5 cenários acima
2. **Verifique Console:** Confirme que logs estão aparecendo
3. **Teste em Diferentes Navegadores:**
   - Chrome ✅
   - Firefox ✅
   - Safari ✅
   - Edge ✅

---

**Data:** 09/04/2026  
**Versão:** 1.0  
**Status:** Pronto para teste
