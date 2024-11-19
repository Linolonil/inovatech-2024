// Estabelecendo a conexão WebSocket com o servidor
const linkWs = import.meta.env.VITE_WS_URL
console.log(linkWs)
const socket = new WebSocket(linkWs);

// Variável para controlar frequência de notificações
let ultimaNotificacao = 0;

function atualizarDados(sensorData) {
    const gasElement = document.getElementById('gas-level');
    const tempElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');

    gasElement.textContent = `${sensorData.valorGas || 0} ppm`;
    tempElement.textContent = `${sensorData.temperatura || 0} °C`;
    humidityElement.textContent = `${sensorData.umidade || 0} %`;

    atualizarCorFundo(sensorData.valorGas);
    adicionarAoHistorico(sensorData);
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
        <td>${sensorData.valorGas || 0} ppm</td>
        <td>${sensorData.temperatura || 0} °C</td>
        <td>${sensorData.umidade || 0} %</td>
    `;

    // Adiciona a nova linha ao corpo da tabela
    historyTable.appendChild(novaLinha);
}

// Função para atualizar o fundo com base no nível de gás
function atualizarCorFundo(nivelGas) {
    const statusBox = document.getElementById('status-box');

    if (nivelGas <= 400) {
        statusBox.className = 'status-box safe';
        statusBox.textContent = 'Nível seguro de gás detectado.';
    } else if (nivelGas > 400 && nivelGas <= 700) {
        statusBox.className = 'status-box warning';
        statusBox.textContent = '⚠️ Atenção: Nível de gás moderado.';
    } else{
        statusBox.className = 'status-box warning';
        statusBox.textContent = '⚠️ Atenção: Nível de gás moderadamente alto.';
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
        console.log('Dados recebidos do servidor:', dados);
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
