// script.js

// URL do servidor WebSocket (substitua pelo endereço correto do servidor)
const socket = new WebSocket('ws://localhost:3000'); // ou o IP do seu ESP8266/ESP32

// Referência ao elemento onde os dados serão exibidos
const sensorDataElement = document.getElementById('sensor-data');

// Função para atualizar a interface com os dados recebidos
socket.onmessage = function(event) {
    const data = JSON.parse(event.data); // Supondo que o servidor envie os dados como JSON
    sensorDataElement.textContent = `Concentração de Gás: ${data.valorGas} ppm`;
};

// Função para enviar uma mensagem ao servidor (se necessário)
document.getElementById('update-button').addEventListener('click', () => {
    socket.send(JSON.stringify({ action: 'requestData' }));
});
