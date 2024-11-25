#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
#include <WebSocketsClient.h>
#include <Hash.h>
#include <math.h>

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

#define USE_SERIAL Serial1

// Definir o servidor HTTP
ESP8266WebServer server(80);

// Pinos e variáveis do sensor MQ-135
const int sensorPin = A0;       // Pino do sensor MQ-135
const int ledVerdePin = 5;      // Pino do LED verde
const int ledAmareloPin = 4;    // Pino do LED amarelo
const int ledVermelhoPin = 12;  // Pino do LED vermelho
float R0 = 10.0;                // Valor inicial aproximado de R0

const char* sensorId = "001";   // Identificador do sensor
const char* deviceName = "ESP8266"; // Nome do dispositivo

// Variáveis para armazenar as credenciais Wi-Fi
String ssid = "";
String password = "";
String wifiStatusMessage = "Não conectado ao Wi-Fi."; // Mensagem de status do Wi-Fi
String ipAddress = "Aguardando conexão...";  // IP dinâmico do ESP

// Função para calibrar o sensor em ar limpo
float calibrarSensor() {
  float valorMedio = 0.0;
  for (int i = 0; i < 100; i++) {
    valorMedio += analogRead(sensorPin);
    delay(50);  // Tempo entre as leituras
  }
  valorMedio /= 100;  // Média das leituras
  float RS_air = ((1023.0 - valorMedio) / valorMedio) * R0; // Calcular RS
  R0 = RS_air / 3.6;  // Calcular R0 em ar limpo
  return R0;
}

// Função para calcular o PPM (fumaça) com base no valor de R0 calibrado
float calcularPPM() {
  int valorSensor = analogRead(sensorPin);
  float RS = ((1023.0 - valorSensor) / valorSensor) * R0;  // Calcular RS
  float ratio = RS / R0;
  float ppm = pow(10, ((log10(ratio) - 0.6) / -0.38));  // Fórmula ajustada para fumaça
  return ppm;
}

// Função para controlar os LEDs de acordo com o valor de PPM
void controlarLeds(float ppm) {
  digitalWrite(ledVerdePin, LOW);
  digitalWrite(ledAmareloPin, LOW);
  digitalWrite(ledVermelhoPin, LOW);

  if (ppm < 12) {
    digitalWrite(ledVerdePin, HIGH);    // Acende LED verde
  } else if (ppm >= 12 && ppm <= 20) {
    digitalWrite(ledAmareloPin, HIGH);  // Acende LED amarelo
  } else if (ppm > 20) {
    digitalWrite(ledVermelhoPin, HIGH); // Acende LED vermelho
  }
}

// Função para salvar as credenciais Wi-Fi
void handleWiFiConfig() {
  if (server.method() == HTTP_POST) {
    ssid = server.arg("ssid");
    password = server.arg("password");
    server.send(200, "text/html", "<h1>Credenciais Salvas!</h1><p>O ESP8266 tentará se conectar à rede Wi-Fi...</p>");

    // Tentar conectar à rede Wi-Fi com as credenciais fornecidas
    WiFi.begin(ssid.c_str(), password.c_str());

    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 15000) {
      delay(100);
    }

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("Conectado ao Wi-Fi!");
      wifiStatusMessage = "Conectado ao Wi-Fi com sucesso!";
      ipAddress = WiFi.localIP().toString();  // Atualizar IP dinâmico
    } else {
      Serial.println("Falha ao conectar ao Wi-Fi.");
      wifiStatusMessage = "Falha ao conectar ao Wi-Fi. Tente novamente.";
    }
  }

  // Exibir formulário para inserir as credenciais Wi-Fi ou status de conexão
  String html = "<h1>Configuração do Wi-Fi</h1>";
  html += "<p>" + wifiStatusMessage + "</p><br>";
  html += "<p>IP Atual: " + ipAddress + "</p><br>";  // Exibir o IP
  html += "<form method='POST'>";
  html += "<label for='ssid'>SSID:</label><br>";
  html += "<input type='text' id='ssid' name='ssid' required><br><br>";
  html += "<label for='password'>Senha:</label><br>";
  html += "<input type='password' id='password' name='password' required><br><br>";
  html += "<input type='submit' value='Salvar'>";
  html += "</form>";
  server.send(200, "text/html", html);
}

// Função para configurar o ponto de acesso
void setupAccessPoint() {
  // Configura o ESP8266 como ponto de acesso
  WiFi.softAP("BioTrack_Config", "123456789", 1, 0, 8);  // Limita o número de conexões simultâneas para 8
  Serial.println("Ponto de acesso iniciado.");

  // Configurar a página de configuração
  server.on("/", HTTP_GET, handleWiFiConfig);
  server.on("/", HTTP_POST, handleWiFiConfig);

  // Iniciar o servidor
  server.begin();
  Serial.println("Servidor HTTP iniciado.");
}

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      USE_SERIAL.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED: {
      USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);
      break;
    }
    case WStype_TEXT:
      USE_SERIAL.printf("[WSc] get text: %s\n", payload);
      break;
    case WStype_BIN:
      USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);
      break;
  }
}

void setup() {
  USE_SERIAL.begin(115200);
  USE_SERIAL.setDebugOutput(true);

  pinMode(ledVerdePin, OUTPUT);
  pinMode(ledAmareloPin, OUTPUT);
  pinMode(ledVermelhoPin, OUTPUT);

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

// Tentar conectar ao Wi-Fi sem IP fixo
  WiFi.begin("NOME_DO_WIFI", "SENHA_DO_WIFI");

  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
    delay(100);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Conectado ao Wi-Fi!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    wifiStatusMessage = "Conectado ao Wi-Fi com sucesso!";
    ipAddress = WiFi.localIP().toString();  // Atualiza o IP dinâmico
  } else {
    Serial.println("Não foi possível conectar ao Wi-Fi.");
    wifiStatusMessage = "Não foi possível conectar ao Wi-Fi. Mantenha-se no ponto de acesso.";
    // Não desliga o ponto de acesso, ele continua ativo.
    setupAccessPoint();  // Inicia o ponto de acesso se não conseguir conectar
  }

  // Se a conexão for bem-sucedida, desativar o ponto de acesso (opcional)
  if (WiFi.status() == WL_CONNECTED) {
    WiFi.softAPdisconnect(true);  // Desliga o ponto de acesso após conectar ao Wi-Fi
  }

  webSocket.beginSSL("inovatech-2024-1.onrender.com", 443);
  webSocket.onEvent(webSocketEvent);
}

unsigned long previousMillis = 0;
const long interval = 1000;

void loop() {
  // Manter o servidor HTTP funcionando
  server.handleClient();
  // Manter o WebSocket funcionando
  webSocket.loop();
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    float ppm = calcularPPM();

    USE_SERIAL.print("Concentração de fumaça (PPM): ");
    USE_SERIAL.println(ppm);

    controlarLeds(ppm);

    // Obtém o timestamp atual
    unsigned long timestamp = millis();

    // Cria a string JSON com os dados
    String jsonData = "{";
    jsonData += "\"dados\":{";
    jsonData += "\"ppm\":" + String(ppm, 2) + ",";
    jsonData += "\"timestamp\":" + String(timestamp);
    jsonData += "},";
    jsonData += "\"type\":\"sensor\",";
    jsonData += "\"deviceName\":\"" + String(deviceName) + "\",";
    jsonData += "\"sensorId\":\"" + String(sensorId) + "\"";
    jsonData += "}";

    USE_SERIAL.println("Enviando dados via WebSocket...");
    webSocket.sendTXT(jsonData);
  }
}