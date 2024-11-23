// emulador
import { WebSocket } from 'ws';
import dotenv from "dotenv";

dotenv.config();

const serverUrl = process.env.SERVER_WEBSOCKET_URL; 
const LIMITE_GAS = 100; 
const INTERVALO = 1500;
const DURACAO_CICLO = 5000;

let tempoAtual = 0; // Controla o tempo dentro do ciclo

function gerarDadosSensor(tempo) {
    const proporcao = tempo / DURACAO_CICLO; // Proporção do tempo no ciclo
    const ppm = proporcao <= 0.5
        ? LIMITE_GAS * (proporcao * 2) // Aumenta gradualmente na primeira metade do ciclo
        : LIMITE_GAS * (1 - (proporcao - 0.5) * 2); // Diminui gradualmente na segunda metade

    return {
        ppm: Math.round(ppm), // Gás em ppm (arredondado)
    };
}

// Conectar ao servidor WebSocket
const socket = new WebSocket(serverUrl);

socket.on('open', () => {
    console.log('Conectado ao servidor WebSocket');

    // Enviar dados a cada intervalo definido
    const intervaloEnvio = setInterval(() => {
        // Atualiza o tempo atual dentro do ciclo
        tempoAtual = (tempoAtual + 300) % DURACAO_CICLO;

        const dados = gerarDadosSensor(tempoAtual);
        console.log('Enviando dados:', dados);

        // Enviar os dados gerados para o servidor WebSocket
        socket.send(JSON.stringify(dados));
    }, INTERVALO);

    // Limpar o intervalo ao fechar a conexão
    socket.on('close', () => {
        clearInterval(intervaloEnvio);
        console.log('Conexão com o servidor WebSocket fechada');
    });
});

socket.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
});
