// Estabelecendo a conexão WebSocket com o servidor
const linkWs = import.meta.env.VITE_WS_URL;
const socket = new WebSocket(linkWs);

// Variáveis para controlar frequência de notificações
let ultimaNotificacao = 0;

// Variáveis para calcular média e pico
let somaGas = 0;
let contador = 0;
let picoGas = 0;

// Função para calcular a média
function calcularMedia(valorGas) {
    // Verifica se valorGas é um número válido
    if (typeof valorGas !== 'number' || isNaN(valorGas)) {
        console.error('Valor de gás inválido:', valorGas);
        return;
    }

    somaGas += valorGas;
    contador++;
    const media = somaGas / contador;

    // Exibe a média na tela (pode ser em um elemento específico)
    const mediaElement = document.getElementById('gas-media');
    if (mediaElement) {
        mediaElement.textContent = ` ${media.toFixed(2)} `;
    }
}
// muda o progresso do círculo
function atualizarProgressoCircular(valorGas) {
    // Definir o valor máximo do ppm para 100%
    const valorMaximo = 50;

    // Calcular o progresso como uma porcentagem do valor máximo
    const progresso = (valorGas * 100) / valorMaximo;

    // Comprimento total do círculo (circunferência)
    const comprimentoTotal = 628; // Atualizar para o valor correto baseado no raio do círculo

    // Converter a porcentagem para o valor do stroke-dashoffset
    const strokeDashOffset = comprimentoTotal - (comprimentoTotal * progresso / 100);

    // Atualizar o progresso do círculo
    const circle = document.querySelector('#circle-two');
    if (circle) {
        circle.style.strokeDashoffset = strokeDashOffset;
    } else {
        console.error("Círculo não encontrado. Verifique o seletor ou o DOM.");
    }
}


// Função para atualizar dados com verificação
function atualizarDados(sensorData) {
    const gasElement = document.getElementById('gas-level') || 0;
    gasElement.textContent = `${sensorData.ppm}`;

    // Verifica se o valor do gás é válido antes de calcular a média e pico
    if (sensorData.ppm && !isNaN(sensorData.ppm)) {
        // Atualiza média e pico
        calcularMedia(sensorData.ppm);
        calcularPico(sensorData.ppm);
        atualizarProgressoCircular(sensorData.ppm); 
    } else {
        console.error('Valor inválido para o nível de gás:', sensorData.ppm);
    }

    // Atualiza a cor de fundo conforme o nível de gás

    atualizarCorFundo(sensorData.ppm);

    // Adiciona a entrada ao histórico
    adicionarAoHistorico(sensorData);
}

// Função para calcular o pico
function calcularPico(valorGas) {
    if (valorGas > picoGas) {
        picoGas = valorGas;
    }

    // Exibe o pico na tela (pode ser em um elemento específico)
    const picoElement = document.getElementById('gas-pico');
    if (picoElement) {
        picoElement.textContent = `${picoGas} `;
    }
}

// Função para adicionar uma nova entrada no histórico
function adicionarAoHistorico(sensorData) {
    const historyTable = document.getElementById('history-table').querySelector('tbody');

    // Obtém a data e horário atual
    const agora = new Date();
    const data = agora.toLocaleDateString();
    const horario = agora.toLocaleTimeString();

    // Cria uma nova linha na tabela
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${data}</td>
        <td>${horario}</td>
        <td>${sensorData.ppm} ppm</td>
    `;

    // Adiciona a nova linha no início da tabela
    historyTable.insertBefore(novaLinha, historyTable.firstChild);

    if (historyTable.children.length > 5) {
        historyTable.removeChild(historyTable.lastChild);
    }
}

// Função para atualizar o fundo com base no nível de gás
function atualizarCorFundo(nivelGas) {
    const statusBox = document.getElementById('status-box');
    const circle = document.querySelector('.iconLoaderProgressFirst circle');
    // Limpa classes de status anteriores
    statusBox.classList.remove('safe', 'warning', 'danger');
    circle.classList.remove('safe', 'warning', 'danger');

    if (nivelGas <= 2) {
        statusBox.classList.add('safe');
        circle.style.stroke = '#28a745';
        statusBox.textContent = '🌞 Qualidade do ar está ótima';
    } else if (nivelGas > 6 && nivelGas <= 10) {
        statusBox.classList.add('warning');
        circle.style.stroke = '#ffc107'; 
        statusBox.textContent = '⚠️ Atenção: qualidade do ar moderada';
    } else if (nivelGas > 10) {
        statusBox.classList.add('danger');
        circle.style.stroke = '#dc3545'; 
        statusBox.textContent = '☠️ Perigo: qualidade do ar ruim.';
    }
}

// Função para mostrar uma notificação
function mostrarNotificacao(mensagem) {
    const agora = Date.now();
    if (Notification.permission === 'granted' && agora - ultimaNotificacao > 30000) { // 30 segundos de intervalo
        new Notification('Alerta de Gás', {
            body: mensagem,
            icon: 'alert-icon.png',
        });
        ultimaNotificacao = agora;
    }
}

// Evento de conexão do WebSocket
socket.onopen = () => {
    console.log('Conectado ao servidor WebSocket no front');

    // Recebendo dados do servidor (emulador ou ESP8266)
    socket.onmessage = (event) => {
        const dados = JSON.parse(event.data);
        atualizarDados(dados); 
    };
};

// Evento de erro do WebSocket
socket.onerror = (error) => {
    console.error('Erro na conexão WebSocket:', error);
};

// Evento de fechamento da conexão WebSocket
socket.onclose = () => {
    console.log('Conexão WebSocket fechada');
};

// Solicita permissão para notificações no navegador
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}
