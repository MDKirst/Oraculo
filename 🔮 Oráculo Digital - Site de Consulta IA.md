# 🔮 Oráculo Digital - Site de Consulta IA

Um site elegante e responsivo que integra com Google Colab para processamento de perguntas e respostas baseadas em documentos especializados.

## 📋 Características

### ✨ Design e Interface
- **Layout responsivo** que se adapta a desktop, tablet e mobile
- **Tema cyberpunk/místico** com cores neon (ciano, magenta, verde)
- **Animações suaves** para interações e transições
- **Espaços publicitários** estrategicamente posicionados
- **Efeitos visuais** como gradientes animados e sombras neon

### 🚀 Funcionalidades
- **Campo de entrada** para perguntas com contador de caracteres
- **Botão "Consultar Oráculo"** com estados de loading
- **Área de resposta** com animação de digitação (typewriter)
- **Exibição de fontes** consultadas pela IA
- **Modo demonstração** quando API não está disponível
- **Notificações** para feedback do usuário
- **Validação de entrada** e tratamento de erros

### 🔧 Tecnologias
- **HTML5** semântico e acessível
- **CSS3** com variáveis, grid, flexbox e animações
- **JavaScript ES6+** com async/await e fetch API
- **Integração Flask** no Google Colab
- **Comunicação REST** com JSON

## 📁 Estrutura do Projeto

```
oracle_website/
├── index.html                    # Estrutura principal do site
├── style.css                     # Estilos e animações
├── script.js                     # Lógica JavaScript e integração API
├── background.jpg                # Imagem de fundo temática
├── README.md                     # Este arquivo
├── DOCUMENTACAO_INTEGRACAO.md    # Guia detalhado de integração
└── todo.md                       # Lista de tarefas do projeto
```

## 🚀 Como Usar

### 1. Configuração Local

```bash
# Clone ou baixe os arquivos do projeto
cd oracle_website

# Inicie um servidor HTTP local
python3 -m http.server 8080

# Acesse no navegador
http://localhost:8080
```

### 2. Configuração da API (Google Colab)

1. **Abra um novo notebook no Google Colab**
2. **Copie o código da documentação** (`DOCUMENTACAO_INTEGRACAO.md`)
3. **Configure seus documentos** na pasta do Google Drive
4. **Execute as células** para iniciar a API
5. **Copie a URL do ngrok** gerada
6. **Atualize a URL** no arquivo `script.js`

### 3. Teste da Integração

1. Abra o site local
2. Digite uma pergunta no campo de texto
3. Clique em "Consultar Oráculo"
4. Aguarde a resposta aparecer com animação
5. Verifique as fontes consultadas

## 🎨 Personalização

### Cores e Tema

Edite as variáveis CSS em `style.css`:

```css
:root {
    --primary-neon: #00ffff;      /* Ciano principal */
    --secondary-neon: #ff00ff;    /* Magenta secundário */
    --accent-neon: #00ff00;       /* Verde de destaque */
    --warning-neon: #ffff00;      /* Amarelo de aviso */
}
```

### Imagem de Fundo

Substitua `background.jpg` por sua imagem preferida:
- Resolução recomendada: 1920x1080 ou superior
- Formato: JPG ou PNG
- Tema: Místico, tecnológico ou cyberpunk

### Textos e Conteúdo

Edite os textos diretamente no `index.html`:
- Título principal
- Subtítulo
- Placeholders
- Mensagens de feedback

## 📱 Responsividade

O site se adapta automaticamente a diferentes tamanhos de tela:

- **Desktop (1024px+)**: Layout completo com espaços publicitários
- **Tablet (768px-1024px)**: Layout simplificado, ads top/bottom
- **Mobile (até 768px)**: Layout vertical, foco no conteúdo
- **Mobile pequeno (até 480px)**: Otimizado para telas pequenas

## 🔧 Configuração da API

### Estrutura da Requisição

```javascript
{
    "pergunta": "Sua pergunta aqui",
    "timestamp": "2025-07-15T02:04:00.000Z",
    "configuracoes": {
        "max_tokens": 500,
        "temperatura": 0.7,
        "incluir_fontes": true
    }
}
```

### Estrutura da Resposta

```javascript
{
    "resposta": "Resposta da IA baseada nos documentos",
    "fontes": ["documento1.pdf", "arquivo2.docx"],
    "timestamp": "2025-07-15T02:04:05.123Z",
    "status": "sucesso"
}
```

### Endpoints Disponíveis

- `GET /health` - Verificação de status
- `POST /api/consulta` - Processamento de perguntas
- `GET /api/estatisticas` - Estatísticas do sistema

## 🛠️ Desenvolvimento

### Adicionando Novas Funcionalidades

1. **Histórico de conversas**
```javascript
// Adicionar ao appState
conversationHistory: []

// Salvar cada pergunta/resposta
appState.conversationHistory.push({
    pergunta: question,
    resposta: response,
    timestamp: new Date()
});
```

2. **Exportar respostas**
```javascript
function exportarResposta(formato) {
    if (formato === 'pdf') {
        // Implementar geração de PDF
    } else if (formato === 'txt') {
        // Implementar download de texto
    }
}
```

3. **Modo escuro/claro**
```css
[data-theme="light"] {
    --bg-dark: #ffffff;
    --text-primary: #000000;
    /* ... outras variáveis */
}
```

### Debug e Logs

Use as funções de debug disponíveis:

```javascript
// No console do navegador
debugOracle(); // Mostra estado atual da aplicação

// Logs automáticos
console.log('🔮 Oráculo Digital iniciado');
console.log('✅ Conexão com API estabelecida');
```

## 🔒 Segurança

### Validações Implementadas

- **Limite de caracteres**: Máximo 1000 caracteres por pergunta
- **Sanitização**: Prevenção de XSS básica
- **Rate limiting**: Prevenção de spam (configurável)
- **CORS**: Controle de origem das requisições

### Recomendações Adicionais

1. **HTTPS**: Use sempre conexões seguras em produção
2. **Autenticação**: Implemente login se necessário
3. **Logs**: Monitore acessos e erros
4. **Backup**: Mantenha cópias dos documentos

## 📊 Performance

### Otimizações Implementadas

- **Lazy loading**: Carregamento sob demanda
- **Debounce**: Prevenção de requisições excessivas
- **Cache**: Armazenamento temporário de respostas
- **Compressão**: Minificação de recursos

### Métricas Recomendadas

- Tempo de resposta da API
- Taxa de sucesso das requisições
- Tempo de carregamento da página
- Satisfação do usuário

## 🐛 Troubleshooting

### Problemas Comuns

1. **Site não carrega**
   - Verifique se o servidor HTTP está rodando
   - Confirme a porta (8080)
   - Teste em navegador diferente

2. **API não responde**
   - Verifique se o Colab está ativo
   - Confirme a URL do ngrok
   - Teste o endpoint `/health`

3. **Resposta não aparece**
   - Abra o console do navegador (F12)
   - Verifique erros JavaScript
   - Teste com pergunta simples

4. **Layout quebrado**
   - Limpe cache do navegador
   - Verifique arquivo CSS
   - Teste em modo incógnito

### Logs Úteis

```javascript
// Verificar estado da aplicação
console.log(appState);

// Testar conectividade
fetch(API_CONFIG.BASE_URL + '/health')
    .then(r => r.json())
    .then(console.log);

// Verificar elementos DOM
console.log(elements);
```

## 🚀 Deploy em Produção

### Opções de Hospedagem

1. **GitHub Pages** (gratuito)
   - Ideal para sites estáticos
   - Integração com repositório Git
   - HTTPS automático

2. **Netlify** (gratuito/pago)
   - Deploy automático
   - Formulários e funções
   - CDN global

3. **Vercel** (gratuito/pago)
   - Otimizado para frontend
   - Preview de branches
   - Analytics integrado

### Configuração para Produção

1. **Minificar arquivos**
```bash
# CSS
cssnano style.css style.min.css

# JavaScript
terser script.js -o script.min.js
```

2. **Otimizar imagens**
```bash
# Comprimir background
imagemin background.jpg --out-dir=dist/
```

3. **Configurar HTTPS**
```javascript
// Forçar HTTPS em produção
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace('https:' + window.location.href.substring(window.location.protocol.length));
}
```

## 📞 Suporte

### Documentação Adicional

- `DOCUMENTACAO_INTEGRACAO.md` - Guia completo de integração
- Comentários no código - Explicações detalhadas
- Console do navegador - Logs e debug

### Contato

Para dúvidas ou sugestões:
- Abra uma issue no repositório
- Consulte a documentação técnica
- Verifique os logs de erro

---

## 📄 Licença

Este projeto é fornecido como exemplo educacional. Sinta-se livre para modificar e usar conforme necessário.

## 🙏 Agradecimentos

- Fontes: Google Fonts (Orbitron, Roboto)
- Ícones: Font Awesome
- Imagens: Recursos de domínio público
- Inspiração: Design cyberpunk e interfaces futuristas

---

**Desenvolvido com ❤️ para demonstrar integração entre frontend moderno e IA no Google Colab**

