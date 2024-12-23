# Projeto inovatech - BIOTRACK

BioTrack é um projeto que utiliza a tecnologia IoT (Internet das Coisas) para monitorar e analisar dados de sensores. Especificamente, ele emprega um sensor QM-135, conectado a um ESP8266, para capturar e transmitir informações sobre a qualidade do ar ou a presença de gases específicos em um ambiente.

## Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [Visual Studio Code](https://code.visualstudio.com/) (ou outro editor de texto)
- [Aduino IDE](https://www.arduino.cc/en/software) (pra conseguir progamar o ESP8266)
## Dependências Utilizadas


- `cors`: Middleware para habilitar o CORS (Cross-Origin Resource Sharing) no servidor, permitindo requisições de diferentes origens. Necessário caso o frontend e o backend estejam hospedados em domínios distintos.
- `express`: Framework para criar e gerenciar o servidor HTTP. Facilita o roteamento, o gerenciamento de middlewares e a integração com APIs RESTful.
- `nodemailer`: Biblioteca para enviar e-mails diretamente do servidor. Pode ser usada para notificações, relatórios ou alertas baseados nos dados capturados.

- `ws`:Biblioteca para implementar WebSockets, permitindo comunicação bidirecional e em tempo real entre o servidor e os dispositivos (ESP8266, por exemplo).

## Configuração e Execução

1. **Instalação das Dependências**

   Navegue até a pasta `/server` do projeto e execute o comando abaixo para instalar as dependências necessárias:

   ```bash
   cd /server
   npm install
   ```

    Em seguida navegue até a pasta `/frontend` do projeto e execute o comando abaixo para instalar as dependências necessárias para o frontend:

   ```bash
   cd ..
   cd /frontend
   npm install
   ```

2. **Configuração das Variáveis de Ambiente**

    Em seguida crie o arquivo `.env` na pasta `/server`e na pasta `/frontend`

no env do `/frontend` insira 
   ```bash
VITE_WS_URL=ws://localhost:3000
  # o numero da porta pode variar com a sua env do server

   ```
e no env do `/server` insira 
   ```bash
  PORT=3000
  SERVER_WEBSOCKET_URL=ws://localhost:3000
   # o numero da porta pode variar com a sua env PORT, se trocar o valor de PORT troca o valor da porta SERVER_WEBSOCKET_URL
  EMAIL_USER=seu_email
  EMAIL_PASS=sua_senha


   ```

3. **Execução do Server**

    Após configurar instalar as dependências e as váriaveis de ambiente, acesse a pasta `/server` e rode o comando:

    ```bash
    npm run dev
    ```

    Se tudo estiver correto, você verá a seguinte mensagem no console:

    ```bash
    [2024-11-22T15:32:32.358Z] Servidor WebSocket inicializado e aguardando conexões...
    [2024-11-22T15:32:32.365Z] Servidor rodando na porta 3000
    ```
    (A porta pode ser diferente se você a tiver configurado no arquivo .env).

    e logo após poderá executar o emulador da aplicação com o comando dentro da pastar `/server`
    ```bash
      npm run esp 
    ```
    Se tudo estiver correto, você verá a seguinte mensagem no console:
  
        Conectado ao servidor WebSocket
        Enviando dados: { ppm: 2 }
        Enviando dados: { ppm: 4 }
        Enviando dados: { ppm: 5 }

Se você for utilizar os dados reais do sensor QM-135 e do ESP8266, siga os passos abaixo:


- Pare o script do emulador:
- Finalize o script que está em execução no diretório /server usando o comando correspondente ao seu terminal (como Ctrl+C).

- não esqueça de baixar os drivers do ESP8266 [Video de configuração do ESP8266](https://www.youtube.com/watch?v=SYKx85uoBrw)
- Navegue até a pasta /arduino_esp8266 e abra o código no **Arduino IDE**. Conecte o ESP8266 ao computador, selecione a porta correta na IDE, e faça o upload do código para o dispositivo.
- carregue o código no ESP8266:

- Configure o IP do servidor:
- informe as credenciais do seu WI-FI

 ```bash
  WiFiMulti.addAP("nome da rede", "senha do wifi");

 ```

- Certifique-se de informar no código do ESP8266 o IP do seu computador (onde o servidor está rodando) para que a conexão com os WebSockets seja estabelecida corretamente.

 ```bash
   webSocket.beginSSL("seu ip aqui EX:192.168.1.00", 3000);

 ```
**Lembrando que a porta vai variar com o env do seu server*

com o seu servidor ligado e o codigo no esp você já deve conseguir visualizar no console os dados do sensor

 ```bash
[2024-11-22T16:21:41.131Z] Novo cliente conectado.
[2024-11-22T16:21:42.659Z] Dados recebidos do ESP8266: { ppm: 2 }
[2024-11-22T16:21:44.151Z] Dados recebidos do ESP8266: { ppm: 4 }

 ```
4. **Execução do Frontend**

 Após configurar instalar as dependências, acesse a pasta `/frontend` e rode o comando:

```bash
 npm run dev
``` 
    
Se tudo estiver correto, você verá a seguinte mensagem no console:
 
  ```bash
  > frontend@0.0.0 dev
  > vite


  VITE v5.4.11  ready in 355 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
  ```
 

5. **Endpoint para consulta de dados do sensor**

    GET ***/sensor***
    
    **Resposta:**

        
        [
            {
                "status": "success",
                "timestamp": "2024-11-22T16:21:47.372Z",
                "dados": {
                    "ppm": 7
                }
            }
        ]

    ou

        [
           {
            "status": "error",
            "timestamp": "2024-11-22T16:19:30.306Z",
            "message": "Nenhum dado do sensor disponível no momento."
            }
        ]

   
    **Estrutura do Projeto:**
    - `/arduino_esp8266/`: Contém código relacionado ao ESP8266 e ao sensor QM-135.
    - `/frontend`: código do frontend para exibição de dados.
    - `/server`: Servidor backend para receber e processar dados do ESP8266
   - `.gitignore`: Arquivo que define os padrões de arquivos/pastas a serem ignorados pelo Git
   - `README.md`: Arquivo que define os padrões de arquivos/pastas a serem ignorados pelo Git

## Referência

 - [Configurações do ESP8266](https://www.robocore.net/tutoriais/programando-o-esp8266-pela-arduino-ide)
 - [DOC ESP8266](https://github.com/esp8266/esp8266-wiki)
 - [QM-135 integrações](https://randomnerdtutorials.com/)
 - [Erros no ESP8266](https://stackoverflow.com/questions/tagged/esp8266)

## Autores

- [@Linox](https://github.com/Linolonil)

