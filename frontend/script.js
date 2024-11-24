// ==================== Configuração do WebSocket ====================
const linkWs = import.meta.env.VITE_WS_URL;
const socket = new WebSocket(linkWs);

// ==================== Variáveis Globais ====================
let ultimaNotificacao = 0; // Controle de frequência de notificações
let somaGas = 0, contador = 0, picoGas = 0; // Controle de média e pico

// ==================== Funções de Atualização ====================
// Atualiza os dados recebidos do servidor
function atualizarDados(sensorData) {
    const ppm = sensorData.ppm ?? 0; 
    const valorAtt = ppm * 1000;

    // Atualiza o nível de gás exibido
    const gasElement = document.getElementById('gas-level');
    if (gasElement) gasElement.textContent = `${valorAtt.toFixed(2)}`;

    if (!isNaN(ppm)) {
        calcularMedia(valorAtt);
        calcularPico(valorAtt);
        atualizarProgressoCircular(valorAtt);
    } else {
        console.error('Valor inválido para o nível de gás:', ppm);
    }

    atualizarCorFundo(valorAtt);
    adicionarAoHistorico(valorAtt);
}

// Atualiza o progresso do círculo
function atualizarProgressoCircular(valorGas) {
    const valorMaximo = 50000; // Valor máximo para 100%
    const progresso = Math.min((valorGas * 100) / valorMaximo, 100);
    const raio = 120;
    const comprimentoTotal = 2 * Math.PI * raio;
    const strokeDashOffset = comprimentoTotal - (comprimentoTotal * progresso / 100);

    const circle = document.querySelector('#circle-two');
    if (circle) {
        circle.style.strokeDasharray = comprimentoTotal;
        circle.style.strokeDashoffset = strokeDashOffset;

        if (valorGas <= 2000) circle.style.stroke = '#28a745';
        else if (valorGas <= 5000) circle.style.stroke = '#ffc107';
        else if (valorGas <= 40000) circle.style.stroke = '#dc3545';
        else circle.style.stroke = '#000';
    } else {
        console.error("Círculo não encontrado. Verifique o seletor ou o DOM.");
    }
}

// Atualiza a cor do fundo com base no nível de gás
function atualizarCorFundo(nivelGas) {
    const statusBox = document.getElementById('status-box');
    const textBox = document.getElementById('text-box');

    statusBox.classList.remove('safe', 'warning', 'danger', 'kill');

    if (nivelGas <= 2000) {
        statusBox.classList.add('safe');
        textBox.textContent = '🌞 Qualidade do ar está ótima';
    } else if (nivelGas <= 5000) {
        statusBox.classList.add('warning');
        textBox.textContent = '⚠️ Atenção: qualidade do ar moderada';
    } else if (nivelGas <= 40000) {
        statusBox.classList.add('danger');
        textBox.textContent = '⚠️ Perigo: qualidade do ar ruim.';
    } else {
        statusBox.classList.add('kill');
        textBox.textContent = '☠️ Perigo: RISCO DE VIDA!';
    }
}

// ==================== Funções de Cálculo ====================
// Calcula e exibe a média
function calcularMedia(valorGas) {
    if (typeof valorGas !== 'number' || isNaN(valorGas)) {
        console.error('Valor de gás inválido:', valorGas);
        return;
    }

    somaGas += valorGas;
    contador++;
    const media = somaGas / contador;

    const mediaElement = document.getElementById('gas-media');
    if (mediaElement) mediaElement.textContent = `${media.toFixed(2)}`;
}

// Calcula e exibe o pico
function calcularPico(valorGas) {
    if (valorGas > picoGas) picoGas = valorGas;

    const picoElement = document.getElementById('gas-pico');
    if (picoElement) picoElement.textContent = `${picoGas.toFixed(2)}`;
}

// ==================== Funções de Histórico ====================
// Adiciona dados ao histórico
function adicionarAoHistorico(valorGas) {
    const historyTable = document.getElementById('history-table').querySelector('tbody');

    const agora = new Date();
    const data = agora.toLocaleDateString();
    const horario = agora.toLocaleTimeString();

    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${data}</td>
        <td>${horario}</td>
        <td>${valorGas.toFixed(2)} ppm</td>
    `;

    historyTable.insertBefore(novaLinha, historyTable.firstChild);

    if (historyTable.children.length > 5) {
        historyTable.removeChild(historyTable.lastChild);
    }
}

// ==================== Funções de Notificação ====================
// Mostra uma notificação no navegador
function mostrarNotificacao(mensagem) {
    const agora = Date.now();

    if (Notification.permission === 'granted' && agora - ultimaNotificacao > 30000) {
        new Notification('Alerta de Gás', {
            body: mensagem,
            icon: 'alert-icon.png',
        });
        ultimaNotificacao = agora;
    }
}

// Solicita permissão para notificações
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

// ==================== Eventos do WebSocket ====================
socket.onopen = () => {
    console.log('Conectado ao servidor WebSocket no front');
    socket.onmessage = (event) => {
        const dados = JSON.parse(event.data);
        atualizarDados(dados);
    };
};

socket.onerror = (error) => {
    console.error('Erro na conexão WebSocket:', error);
};

socket.onclose = () => {
    console.log('Conexão WebSocket fechada');
};
