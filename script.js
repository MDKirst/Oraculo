/**
 * ORÁCULO DIGITAL - SCRIPT PRINCIPAL
 * 
 * Este arquivo contém toda a lógica JavaScript para o funcionamento do site,
 * incluindo a integração com a API do Google Colab para processamento de perguntas.
 * 
 * Funcionalidades principais:
 * - Captura e validação de entrada do usuário
 * - Comunicação com API do Google Colab via fetch
 * - Exibição animada das respostas
 * - Tratamento de erros e estados de loading
 * - Responsividade e interações do usuário
 */

// ===== CONFIGURAÇÕES DA API =====
const API_CONFIG = {
    // URL base do Google Colab (deve ser substituída pela URL real do seu notebook)
    // Exemplo: https://abc123-def456.ngrok.io ou https://colab-endpoint.com
    BASE_URL: 'https://seu-colab-endpoint.ngrok.io',
    
    // Endpoint específico para consultas
    ENDPOINT: '/api/consulta',
    
    // Timeout para requisições (em milissegundos)
    TIMEOUT: 30000,
    
    // Headers padrão para as requisições
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Adicione aqui qualquer header de autenticação necessário
        // 'Authorization': 'Bearer seu-token-aqui'
    }
};

// ===== ELEMENTOS DO DOM =====
let elements = {};

// ===== ESTADO DA APLICAÇÃO =====
let appState = {
    isLoading: false,
    currentQuestion: '',
    lastResponse: '',
    requestController: null
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 Oráculo Digital iniciado');
    
    // Captura todos os elementos necessários do DOM
    initializeElements();
    
    // Configura todos os event listeners
    setupEventListeners();
    
    // Inicializa animações e efeitos visuais
    initializeAnimations();
    
    // Verifica conectividade com a API
    checkApiConnection();
});

/**
 * Inicializa as referências dos elementos DOM
 */
function initializeElements() {
    elements = {
        questionInput: document.getElementById('question-input'),
        consultBtn: document.getElementById('consult-btn'),
        responseContent: document.getElementById('response-content'),
        clearBtn: document.getElementById('clear-btn'),
        charCount: document.getElementById('char-count'),
        loadingOverlay: document.getElementById('loading-overlay'),
        btnText: document.querySelector('.btn-text'),
        btnLoading: document.querySelector('.btn-loading')
    };
    
    // Verifica se todos os elementos foram encontrados
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos não encontrados:', missingElements);
    } else {
        console.log('✅ Todos os elementos DOM foram carregados');
    }
}

/**
 * Configura todos os event listeners da aplicação
 */
function setupEventListeners() {
    // Event listener para o campo de texto
    elements.questionInput.addEventListener('input', handleInputChange);
    elements.questionInput.addEventListener('keydown', handleKeyDown);
    
    // Event listener para o botão de consulta
    elements.consultBtn.addEventListener('click', handleConsultClick);
    
    // Event listener para o botão de limpar
    elements.clearBtn.addEventListener('click', handleClearClick);
    
    // Event listeners para efeitos visuais
    elements.questionInput.addEventListener('focus', handleInputFocus);
    elements.questionInput.addEventListener('blur', handleInputBlur);
    
    console.log('✅ Event listeners configurados');
}

/**
 * Inicializa animações e efeitos visuais
 */
function initializeAnimations() {
    // Animação de entrada para os elementos principais
    const animatedElements = document.querySelectorAll('.question-section, .response-section');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    console.log('✅ Animações inicializadas');
}

/**
 * Verifica a conectividade com a API do Google Colab
 */
async function checkApiConnection() {
    try {
        showLoadingOverlay('Verificando conexão com o Oráculo...');
        
        // Tenta fazer uma requisição de teste para verificar se a API está disponível
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
            signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
            console.log('✅ Conexão com API estabelecida');
            showNotification('Oráculo conectado e pronto!', 'success');
        } else {
            throw new Error('API não disponível');
        }
    } catch (error) {
        console.warn('⚠️ API não disponível:', error.message);
        showNotification('Modo demonstração ativo - API não conectada', 'warning');
    } finally {
        hideLoadingOverlay();
    }
}

/**
 * Manipula mudanças no campo de entrada de texto
 */
function handleInputChange(event) {
    const text = event.target.value;
    const charCount = text.length;
    
    // Atualiza contador de caracteres
    elements.charCount.textContent = charCount;
    
    // Muda cor do contador baseado no limite
    if (charCount > 900) {
        elements.charCount.style.color = '#ff6b6b';
    } else if (charCount > 700) {
        elements.charCount.style.color = '#ffd93d';
    } else {
        elements.charCount.style.color = '#707070';
    }
    
    // Habilita/desabilita botão baseado no conteúdo
    const isValid = text.trim().length >= 10;
    elements.consultBtn.disabled = !isValid || appState.isLoading;
    
    if (isValid) {
        elements.consultBtn.style.opacity = '1';
        elements.consultBtn.style.cursor = 'pointer';
    } else {
        elements.consultBtn.style.opacity = '0.6';
        elements.consultBtn.style.cursor = 'not-allowed';
    }
}

/**
 * Manipula teclas pressionadas no campo de entrada
 */
function handleKeyDown(event) {
    // Permite envio com Ctrl+Enter
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        handleConsultClick();
    }
    
    // Previne quebra de linha com apenas Enter (opcional)
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
        event.preventDefault();
        handleConsultClick();
    }
}

/**
 * Manipula o clique no botão de consulta
 */
async function handleConsultClick() {
    const question = elements.questionInput.value.trim();
    
    // Validações
    if (!question) {
        showNotification('Por favor, digite uma pergunta', 'error');
        return;
    }
    
    if (question.length < 10) {
        showNotification('A pergunta deve ter pelo menos 10 caracteres', 'error');
        return;
    }
    
    if (appState.isLoading) {
        return;
    }
    
    // Inicia processo de consulta
    await consultOracle(question);
}

/**
 * Função principal para consultar o Oráculo (API do Google Colab)
 */
async function consultOracle(question) {
    try {
        // Atualiza estado da aplicação
        appState.isLoading = true;
        appState.currentQuestion = question;
        
        // Atualiza interface para estado de loading
        setLoadingState(true);
        
        // Limpa resposta anterior
        clearResponse();
        
        console.log('🔮 Consultando Oráculo:', question);
        
        // Cria controller para cancelar requisição se necessário
        appState.requestController = new AbortController();
        
        // Prepara dados para envio
        const requestData = {
            pergunta: question,
            timestamp: new Date().toISOString(),
            // Adicione aqui outros parâmetros necessários para sua API
            configuracoes: {
                max_tokens: 500,
                temperatura: 0.7,
                incluir_fontes: true
            }
        };
        
        // Faz a requisição para a API do Google Colab
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT}`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(requestData),
            signal: appState.requestController.signal
        });
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        // Processa a resposta
        const responseData = await response.json();
        
        console.log('✅ Resposta recebida:', responseData);
        
        // Exibe a resposta com animação
        await displayResponse(responseData);
        
        // Mostra botão de limpar
        elements.clearBtn.style.display = 'block';
        
        showNotification('Consulta realizada com sucesso!', 'success');
        
    } catch (error) {
        console.error('❌ Erro na consulta:', error);
        
        if (error.name === 'AbortError') {
            showNotification('Consulta cancelada', 'info');
        } else {
            // Em caso de erro, mostra resposta de demonstração
            await displayDemoResponse(question);
            showNotification('Modo demonstração - API não disponível', 'warning');
        }
    } finally {
        // Restaura estado da aplicação
        appState.isLoading = false;
        appState.requestController = null;
        setLoadingState(false);
    }
}

/**
 * Exibe a resposta da API com animação de digitação
 */
async function displayResponse(responseData) {
    // Extrai o texto da resposta (adapte conforme estrutura da sua API)
    let responseText = '';
    let sources = [];
    
    if (typeof responseData === 'string') {
        responseText = responseData;
    } else if (responseData.resposta) {
        responseText = responseData.resposta;
        sources = responseData.fontes || [];
    } else if (responseData.answer) {
        responseText = responseData.answer;
        sources = responseData.sources || [];
    } else {
        responseText = 'Resposta recebida, mas formato não reconhecido.';
    }
    
    // Limpa área de resposta
    elements.responseContent.innerHTML = '';
    
    // Cria container para a resposta
    const responseContainer = document.createElement('div');
    responseContainer.className = 'response-text';
    elements.responseContent.appendChild(responseContainer);
    
    // Animação de digitação
    await typeWriter(responseContainer, responseText, 30);
    
    // Adiciona fontes se disponíveis
    if (sources.length > 0) {
        const sourcesContainer = document.createElement('div');
        sourcesContainer.className = 'response-sources';
        sourcesContainer.innerHTML = `
            <hr style="margin: 20px 0; border-color: var(--secondary-neon);">
            <h4><i class="fas fa-book"></i> Fontes consultadas:</h4>
            <ul>
                ${sources.map(source => `<li>${source}</li>`).join('')}
            </ul>
        `;
        elements.responseContent.appendChild(sourcesContainer);
    }
    
    appState.lastResponse = responseText;
}

/**
 * Exibe uma resposta de demonstração quando a API não está disponível
 */
async function displayDemoResponse(question) {
    const demoResponses = [
        `Baseado nos documentos consultados, posso fornecer informações relevantes sobre "${question}". Esta é uma resposta de demonstração, pois a conexão com o Google Colab não está ativa no momento.`,
        
        `O Oráculo analisou sua pergunta sobre "${question}" e encontrou referências nos documentos especializados. Em modo de demonstração, esta resposta simula o comportamento esperado da integração com a IA.`,
        
        `Sua consulta sobre "${question}" foi processada. Os documentos contêm informações pertinentes que seriam analisadas pela IA em uma implementação completa. Esta é uma resposta simulada para fins de demonstração.`
    ];
    
    const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
    
    // Simula estrutura de resposta da API
    const mockResponseData = {
        resposta: randomResponse,
        fontes: [
            'Documento_Exemplo_1.pdf',
            'Arquivo_Referencia_2.docx',
            'Base_Conhecimento_3.txt'
        ]
    };
    
    await displayResponse(mockResponseData);
}

/**
 * Animação de digitação (typewriter effect)
 */
function typeWriter(element, text, speed = 50) {
    return new Promise((resolve) => {
        element.classList.add('typing');
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
                resolve();
            }
        }
        
        type();
    });
}

/**
 * Manipula o clique no botão de limpar
 */
function handleClearClick() {
    // Cancela requisição em andamento se houver
    if (appState.requestController) {
        appState.requestController.abort();
    }
    
    // Limpa campos
    elements.questionInput.value = '';
    elements.charCount.textContent = '0';
    clearResponse();
    
    // Esconde botão de limpar
    elements.clearBtn.style.display = 'none';
    
    // Restaura estado inicial
    appState.currentQuestion = '';
    appState.lastResponse = '';
    setLoadingState(false);
    
    // Foca no campo de entrada
    elements.questionInput.focus();
    
    showNotification('Pronto para nova consulta', 'info');
}

/**
 * Limpa a área de resposta
 */
function clearResponse() {
    elements.responseContent.innerHTML = `
        <div class="waiting-message">
            <i class="fas fa-crystal-ball"></i>
            <p>O Oráculo aguarda sua pergunta...</p>
        </div>
    `;
}

/**
 * Define o estado de loading da interface
 */
function setLoadingState(isLoading) {
    elements.consultBtn.classList.toggle('loading', isLoading);
    elements.consultBtn.disabled = isLoading;
    elements.questionInput.disabled = isLoading;
    
    if (isLoading) {
        elements.responseContent.innerHTML = `
            <div class="loading-response">
                <i class="fas fa-spinner fa-spin"></i>
                <p>O Oráculo está consultando os documentos...</p>
            </div>
        `;
    }
}

/**
 * Manipula foco no campo de entrada
 */
function handleInputFocus(event) {
    event.target.parentElement.style.transform = 'scale(1.02)';
    event.target.parentElement.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.3)';
}

/**
 * Manipula perda de foco no campo de entrada
 */
function handleInputBlur(event) {
    event.target.parentElement.style.transform = 'scale(1)';
    event.target.parentElement.style.boxShadow = '0 0 20px var(--primary-neon)';
}

/**
 * Mostra overlay de loading
 */
function showLoadingOverlay(message = 'Carregando...') {
    elements.loadingOverlay.style.display = 'flex';
    const loadingText = elements.loadingOverlay.querySelector('p');
    if (loadingText) {
        loadingText.textContent = message;
    }
}

/**
 * Esconde overlay de loading
 */
function hideLoadingOverlay() {
    elements.loadingOverlay.style.display = 'none';
}

/**
 * Mostra notificações para o usuário
 */
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Cores baseadas no tipo
    const colors = {
        success: '#00ff00',
        error: '#ff4757',
        warning: '#ffa502',
        info: '#00ffff'
    };
    
    notification.style.background = `linear-gradient(45deg, ${colors[type]}, ${colors[type]}aa)`;
    notification.style.border = `2px solid ${colors[type]}`;
    
    // Adiciona ao DOM
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove automaticamente após 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
    
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
}

/**
 * Retorna o ícone apropriado para cada tipo de notificação
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Utilitário para debug - pode ser removido em produção
 */
function debugInfo() {
    console.log('🔍 Estado da aplicação:', {
        isLoading: appState.isLoading,
        currentQuestion: appState.currentQuestion,
        lastResponse: appState.lastResponse ? appState.lastResponse.substring(0, 100) + '...' : 'Nenhuma',
        apiConfig: API_CONFIG
    });
}

// Expõe função de debug globalmente para testes
window.debugOracle = debugInfo;

/**
 * INSTRUÇÕES PARA INTEGRAÇÃO COM GOOGLE COLAB:
 * 
 * 1. No seu notebook do Google Colab, crie um endpoint Flask:
 * 
 * from flask import Flask, request, jsonify
 * from flask_cors import CORS
 * import threading
 * 
 * app = Flask(__name__)
 * CORS(app)  # Permite requisições do frontend
 * 
 * @app.route('/health', methods=['GET'])
 * def health_check():
 *     return jsonify({"status": "ok", "message": "API funcionando"})
 * 
 * @app.route('/api/consulta', methods=['POST'])
 * def processar_consulta():
 *     data = request.json
 *     pergunta = data.get('pergunta')
 *     
 *     # Aqui você processaria a pergunta com seus documentos
 *     # Exemplo usando seus documentos carregados:
 *     resposta = seu_modelo_ia.processar(pergunta)
 *     
 *     return jsonify({
 *         "resposta": resposta,
 *         "fontes": ["doc1.pdf", "doc2.txt"],
 *         "timestamp": datetime.now().isoformat()
 *     })
 * 
 * # Para executar o servidor
 * def run_server():
 *     app.run(host='0.0.0.0', port=5000)
 * 
 * # Inicia em thread separada
 * server_thread = threading.Thread(target=run_server)
 * server_thread.daemon = True
 * server_thread.start()
 * 
 * 2. Use ngrok para expor o servidor:
 * 
 * !pip install pyngrok
 * from pyngrok import ngrok
 * 
 * # Cria túnel público
 * public_url = ngrok.connect(5000)
 * print(f"URL pública: {public_url}")
 * 
 * 3. Atualize a variável API_CONFIG.BASE_URL neste arquivo com a URL do ngrok
 * 
 * 4. Teste a integração acessando o site
 */

