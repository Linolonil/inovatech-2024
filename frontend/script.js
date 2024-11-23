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
    const valorMaximo = 50000;

    // Calcular o progresso como uma porcentagem do valor máximo
    const progresso = Math.min((valorGas * 100) / valorMaximo, 100);

    // Comprimento total do círculo (circunferência)
    const raio = 120; // Raio do círculo
    const comprimentoTotal = 2 * Math.PI * raio;

    // Converter a porcentagem para o valor do stroke-dashoffset
    const strokeDashOffset = comprimentoTotal - (comprimentoTotal * progresso / 100);

    // Atualizar o progresso do círculo
    const circle = document.querySelector('#circle-two');
    if (circle) {
        circle.style.strokeDasharray = comprimentoTotal;
        circle.style.strokeDashoffset = strokeDashOffset;
        if (valorGas <= 2000) {
            circle.style.stroke = '#28a745';
        } else if (valorGas > 2000 && valorGas <= 5000) {
            circle.style.stroke = '#ffc107'; 
        } else if (valorGas > 5000 && valorGas <= 40000) {
            circle.style.stroke = '#dc3545'; 
        } else if (valorGas > 40000) {
            circle.style.stroke = '#000'; 
        }
    } else {
        console.error("Círculo não encontrado. Verifique o seletor ou o DOM.");
    }
}

// Função para atualizar dados com verificação
function atualizarDados(sensorData) {
    const gasElement = document.getElementById('gas-level') || 0;
    const ppm = sensorData.ppm ?? 0; 
    const valorAtt = ppm * 1000;
    gasElement.textContent = `${valorAtt.toFixed(2)}`;

    if (!isNaN(ppm)) {
        calcularMedia(ppm * 1000);
        calcularPico(ppm *1000);
        atualizarProgressoCircular(ppm* 1000);
    } else {
        console.error('Valor inválido para o nível de gás:', ppm);
    }

    atualizarCorFundo(ppm * 1000);
    adicionarAoHistorico(ppm * 1000);
}

// Função para calcular o pico
function calcularPico(valorGas) {
    if (valorGas > picoGas) {
        picoGas = valorGas;
    }

    // Exibe o pico na tela (pode ser em um elemento específico)
    const picoElement = document.getElementById('gas-pico');
    if (picoElement) {
        picoElement.textContent = `${picoGas.toFixed(2)} `;
    }
}

// Função para adicionar uma nova entrada no histórico
function adicionarAoHistorico(sensorData) {
    const historyTable = document.getElementById('history-table').querySelector('tbody');

    // Obtém a data e horário atual
    const agora = new Date();
    const data = agora.toLocaleDateString();
    const horario = agora.toLocaleTimeString();
    const ppm = sensorData ?? 0; 

    // Cria uma nova linha na tabela
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${data}</td>
        <td>${horario}</td>
        <td>${ppm.toFixed(2)} ppm</td>
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
    const textBox = document.getElementById('text-box');
    const circle = document.querySelector('.iconLoaderProgressFirst circle');
    // Limpa classes de status anteriores
    statusBox.classList.remove('safe', 'warning', 'danger', 'kill');

    if (nivelGas <= 2000) {
        statusBox.classList.add('safe');
        // circle.style.stroke = '#28a745';
        textBox.textContent = '🌞 Qualidade do ar está ótima';
    } else if (nivelGas > 2000 && nivelGas <= 5000) {
        statusBox.classList.add('warning');
        // circle.style.stroke = '#ffc107'; 
        textBox.textContent = '⚠️ Atenção: qualidade do ar moderada';
    } else if (nivelGas > 5000 && nivelGas <= 40000 ) {
        statusBox.classList.add('danger');
        // circle.style.stroke = '#dc3545'; 
        textBox.textContent = '⚠️ Perigo: qualidade do ar ruim.';
    } else if (nivelGas > 40000) {
        statusBox.classList.add('kill');
        // circle.style.stroke = '#dc3545'; 
        textBox.textContent = '☠️ Perigo: RISCO DE VIDA!.';
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
