# inovatech-2024

# Projeto de Monitoramento de Gás

Este projeto consiste em um sistema completo para monitoramento de gás, com frontend, backend e emulador para simular o envio de dados de um sensor ESP8266.

## Estrutura do Projeto

- **`server/`**: Contém o backend do servidor WebSocket, responsável por gerenciar a comunicação com o frontend e o ESP8266.
- **`emulador/`**: Simula o comportamento do ESP8266, enviando dados para o servidor WebSocket.
- **`frontend/`**: O frontend que exibe as informações do sensor em tempo real.

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [Visual Studio Code](https://code.visualstudio.com/) (ou outro editor de texto)
- [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (se usar o VS Code)

---

## Como Rodar o Projeto

### 1. Backend - Servidor WebSocket

1. Navegue até a pasta `server`:
   ```bash
   cd server

npm install

npm run dev

vai aparecer um "Servidor rodando na porta 3000"

```
e pra rodar a emulação do ESP8266 rode:

npm run esp

### 2. Frontend

1. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Abra o arquivo `index.html` no seu editor de texto favorito ou com o live server.
