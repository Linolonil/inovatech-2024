#define DEBUG_WEBSOCKETS 4

#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <WebSocketsClient.h>
#include <time.h>

// Variaveis 
const int botoes[6] = {5, 4, 14, 12, 13, 0};
String cor[6] = {"PRETO", "BRANCO1", "VERMELHO", "AZUL", "VERDE", "BRANCO2"};
bool ultimoEstado[6] = {HIGH, HIGH, HIGH, HIGH, HIGH, HIGH};

unsigned long ultimoClique[6] = {0,0,0,0,0,0};
const unsigned long debounce = 120;     // bloqueia bounce
const unsigned long minInterval = 180;  // evita repetição do mesmo botão

const String ToyID = "01";   
const String deviceName = "CRIANCA";

// Buffer offline
String buffer[50];
int bufferSize = 0;

// WebSocket
WebSocketsClient ws;
bool socketConectado = false;

// Timestamp
String getTimestamp() {
  time_t now = time(nullptr);
  struct tm* t = localtime(&now);

  char buf[25];
  sprintf(buf, "%04d-%02d-%02dT%02d:%02d:%02d",
          t->tm_year + 1900,
          t->tm_mon + 1,
          t->tm_mday,
          t->tm_hour,
          t->tm_min,
          t->tm_sec);
  return String(buf);
}

void enviarMensagem(String json) {
  if (socketConectado) {
    ws.sendTXT(json);
  } else {
    if (bufferSize < 50) buffer[bufferSize++] = json;
  }
}

void enviarBuffer() {
  if (!socketConectado || bufferSize == 0) return;

  String json = "{";
  json += "\"deviceId\":\"" + deviceName + "-" + ToyID + "\",";
  json += "\"event\":\"buffer\",";
  json += "\"items\":[";

  for (int i = 0; i < bufferSize; i++) {
    json += buffer[i];
    if (i < bufferSize - 1) json += ",";
  }

  json += "]}";

  ws.sendTXT(json);
  bufferSize = 0;
}

void eventoWebSocket(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("WS CONECTADO!");
      socketConectado = true;
      enviarBuffer();
      break;

    case WStype_DISCONNECTED:
      Serial.println("WS DESCONECTADO!");
      socketConectado = false;
      break;

    case WStype_ERROR:
      Serial.println("WS ERRO!");
      break;

    case WStype_TEXT:
      Serial.printf("WS MSG: %s\n", payload);
      break;
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  for (int i = 0; i < 6; i++) {
    pinMode(botoes[i], INPUT_PULLUP);
  }

  WiFiManager wm;
  wm.autoConnect("EmoteTutor-Config", "EmoteTutor123");

  configTime(-3 * 3600, 0, "pool.ntp.org");

  ws.beginSSL("inovatech-2024.onrender.com", 443, "/");
  ws.onEvent(eventoWebSocket);
  ws.setReconnectInterval(5000);
}

void loop() {
  ws.loop();

  unsigned long agora = millis();

  for (int i = 0; i < 6; i++) {

    int estado = digitalRead(botoes[i]);

    // clique detectado
    if (estado == LOW && ultimoEstado[i] == HIGH) {
      
      // debounce
      if (agora - ultimoClique[i] < debounce) {
        ultimoEstado[i] = estado;
        continue;
      }

      // intervalo mínimo para evitar repetição
      if (agora - ultimoClique[i] < minInterval) {
        ultimoEstado[i] = estado;
        continue;
      }

      ultimoClique[i] = agora;

      // monta JSON
      String json = "{";
      json += "\"deviceId\":\"" + deviceName + "-" + ToyID + "\",";
      json += "\"event\":\"buttonPress\",";
      json += "\"data\":{";
      json += "\"buttonId\":" + String(botoes[i]) + ",";
      json += "\"color\":\"" + cor[i] + "\"";
      json += "},";
      json += "\"timestamp\":\"" + getTimestamp() + "Z\"";
      json += "}";

      enviarMensagem(json);
      Serial.println(json);
    }

    ultimoEstado[i] = estado;
  }
}
