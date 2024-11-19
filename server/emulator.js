// emulador
import { WebSocket } from 'ws';

const serverUrl = 'wss://m6b4tqzd-3000.brs.devtunnels.ms/'; // URL do servidor WebSocket

const LIMITE_GAS = 800; // Defina o limite de gás

function gerarDadosSensor() {
    const valorGas = Math.floor(Math.random() * 1000); // Geração de valor aleatório de gás
    return {
        valorGas, // Gás em ppm
        temperatura: (Math.random() * 40 + 10).toFixed(2), // Temperatura entre 10 e 50 graus Celsius
        umidade: (Math.random() * 100).toFixed(2), // Umidade relativa entre 0 e 100%
    };
}

// Conectar ao servidor WebSocket
const socket = new WebSocket(serverUrl);

socket.on('open', () => {
    console.log('Conectado ao servidor WebSocket');

    // Enviar dados a cada 3 segundos para simular o ESP8266
    setInterval(() => {
        const dados = gerarDadosSensor();
        console.log('Enviando dados:', dados);

        // Verificar se o valor do gás ultrapassa o limite
        if (dados.valorGas > LIMITE_GAS) {
            console.log('Alerta: Nível de gás excedeu o limite!');
            // Enviar um alerta ou sinal de perigo
            socket.send(JSON.stringify(dados));
        } else {
            socket.send(JSON.stringify(dados)); // Enviar dados normais
        }
    }, 2500);
});

socket.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
});

socket.on('close', () => {
    console.log('Conexão com o servidor WebSocket fechada');
});
