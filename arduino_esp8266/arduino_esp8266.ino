#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <Hash.h>
#include <math.h>

// Configurações de WiFi e WebSocket
ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

// Serial para debug
#define USE_SERIAL Serial1

// Pinos e variáveis do sensor MQ-135
const int sensorPin = A0;       // Pino do sensor MQ-135
const int ledVerdePin = 5;      // Pino do LED verde
const int ledAmareloPin = 4;    // Pino do LED amarelo
const int ledVermelhoPin = 12;  // Pino do LED vermelho
float R0 = 10.0;                // Valor inicial aproximado de R0

// Variáveis de controle de tempo
unsigned long previousMillis = 0;
const long interval = 1000; // Intervalo de 1 segundo para leituras e envio de dados

// ---------------------------------------------
// Funções
// ---------------------------------------------

// Função para calibrar o sensor em ar limpo
float calibrarSensor() {
  float valorMedio = 0.0;

  for (int i = 0; i < 100; i++) {
    valorMedio += analogRead(sensorPin);
    delay(50); // Tempo entre as leituras
  }

  valorMedio /= 100; // Média das leituras

  // Calcular RS em ar limpo
  float RS_air = ((1023.0 - valorMedio) / valorMedio) * R0;

  // Calcular R0 em ar limpo
  R0 = RS_air / 3.6;

  return R0;
}

// Função para calcular o PPM com base no valor de R0 calibrado
float calcularPPM() {
  int valorSensor = analogRead(sensorPin);

  // Calcular RS a partir da leitura analógica
  float RS = ((1023.0 - valorSensor) / valorSensor) * R0;

  // Calcular a razão RS/R0 e converter para PPM
  float ratio = RS / R0;
  float ppm = pow(10, ((log10(ratio) - 0.6) / -0.38)); // Fórmula ajustada para fumaça

  return ppm;
}

// Função para controlar os LEDs de acordo com o valor de PPM
void controlarLeds(float ppm) {
  // Desliga todos os LEDs antes de definir o novo estado
  digitalWrite(ledVerdePin, LOW);
  digitalWrite(ledAmareloPin, LOW);
  digitalWrite(ledVermelhoPin, LOW);

  if (ppm < 6) {
    digitalWrite(ledVerdePin, HIGH);    // Acende LED verde
  } else if (ppm >= 6 && ppm <= 10) {
    digitalWrite(ledAmareloPin, HIGH);  // Acende LED amarelo
  } else if (ppm > 10) {
    digitalWrite(ledVermelhoPin, HIGH); // Acende LED vermelho
  }
}

// Evento de WebSocket
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      USE_SERIAL.println("[WSc] Disconnected!");
      break;

    case WStype_CONNECTED:
    USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);
    webSocket.sendTXT("Connected");
    
    // Enviar identificação do dispositivo
    String deviceInfo = "{\"device\":\"ESP8266\",\"type\":\"sensor\",\"id\":\"001\"}";
    webSocket.sendTXT(deviceInfo);
    USE_SERIAL.println("Identificação enviada ao servidor.");
    break;

    case WStype_TEXT:
      USE_SERIAL.printf("[WSc] Received text: %s\n", payload);
      break;

    case WStype_BIN:
      USE_SERIAL.printf("[WSc] Received binary length: %u\n", length);
      hexdump(payload, length);
      break;
  }
}

// ---------------------------------------------
// Configuração Inicial (Setup)
// ---------------------------------------------
void setup() {
  // Inicializar serial para debug
  USE_SERIAL.begin(115200);
  USE_SERIAL.setDebugOutput(true);

  // Configuração dos pinos dos LEDs
  pinMode(ledVerdePin, OUTPUT);
  pinMode(ledAmareloPin, OUTPUT);
  pinMode(ledVermelhoPin, OUTPUT);

  // Mensagem de inicialização
  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  // Conexão WiFi
  WiFiMulti.addAP("NOME_DO_WIFI", "SENHA_DO_WIFI");
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  // Configuração do WebSocket
  webSocket.beginSSL("192.192.19.19", 3000);
  webSocket.onEvent(webSocketEvent);
}

// ---------------------------------------------
// Loop Principal
// ---------------------------------------------
void loop() {
  // Manter a conexão do WebSocket
  webSocket.loop();

  // Obtém o tempo atual
  unsigned long currentMillis = millis();

  // Executar tarefas a cada intervalo definido
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Calcular o PPM
    float ppm = calcularPPM();

    // Exibir o valor de PPM no console
    USE_SERIAL.printf("Concentração de fumaça (PPM): %.2f\n", ppm);

    // Controlar os LEDs com base no valor do PPM
    controlarLeds(ppm);

    // Criar e enviar os dados em formato JSON via WebSocket
    String jsonData = "{\"ppm\":" + String(ppm, 2) + "}"; // 2 casas decimais
    USE_SERIAL.println("Enviando dados via WebSocket...");
    webSocket.sendTXT(jsonData);
  }
}
