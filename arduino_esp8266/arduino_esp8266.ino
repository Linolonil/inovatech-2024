/*
 * WebSocketClientSSL.ino
 *
 *  Created on: 10.12.2015
 *
 *  note SSL is only possible with the ESP8266
 *
 */

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <WebSocketsClient.h>

#include <Hash.h>
#include <math.h>


ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

#define USE_SERIAL Serial1

// Pinos e variáveis do sensor MQ-135
const int sensorPin = A0;       // Pino do sensor MQ-135
const int ledVerdePin = 5;      // Pino do LED verde
const int ledAmareloPin = 4;    // Pino do LED amarelo
const int ledVermelhoPin = 12;  // Pino do LED vermelho
float R0 = 10.0;                // Valor inicial aproximado de R0

// Função para calibrar o sensor em ar limpo
float calibrarSensor() {
  float valorMedio = 0.0;
  for (int i = 0; i < 100; i++) {
    valorMedio += analogRead(sensorPin);
    delay(50);  // Tempo entre as leituras
  }
  valorMedio /= 100;  // Média das leituras

  // Calcular RS em ar limpo
  float RS_air = ((1023.0 - valorMedio) / valorMedio) * R0;

  // Calcular R0 em ar limpo
  R0 = RS_air / 3.6;

  return R0;
}

// Função para calcular o PPM (fumaça) com base no valor de R0 calibrado
float calcularPPM() {
  int valorSensor = analogRead(sensorPin);

  // Calcular RS a partir da leitura analógica
  float RS = ((1023.0 - valorSensor) / valorSensor) * R0;

  // Calcular a razão RS/R0 e converter para PPM usando a fórmula ajustada para fumaça
  float ratio = RS / R0;
  float ppm = pow(10, ((log10(ratio) - 0.6) / -0.38));  // Fórmula ajustada para fumaça

  return ppm;
}

// Função para controlar os LEDs de acordo com o valor de PPM
void controlarLeds(float ppm) {
  // Desliga todos os LEDs inicialmente
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


void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {


  switch (type) {
    case WStype_DISCONNECTED:
      USE_SERIAL.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED:
      {
        USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);

        // send message to server when Connected
        webSocket.sendTXT("Connected");
      }
      break;
    case WStype_TEXT:
      USE_SERIAL.printf("[WSc] get text: %s\n", payload);

      break;
    case WStype_BIN:
      USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);

      // send data to server
      // webSocket.sendBIN(payload, length);
      break;
  }
}

void setup() {
  // USE_SERIAL.begin(921600);
  USE_SERIAL.begin(115200);

  //Serial.setDebugOutput(true);
  USE_SERIAL.setDebugOutput(true);

  pinMode(ledVerdePin, OUTPUT);
  pinMode(ledAmareloPin, OUTPUT);
  pinMode(ledVermelhoPin, OUTPUT);

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  WiFiMulti.addAP("SILVA", "ljbs0202");

  //WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  webSocket.beginSSL("inovatech-2024.onrender.com", 443);
  webSocket.onEvent(webSocketEvent);
}

unsigned long previousMillis = 0; 
const long interval = 1000;        

void loop() {
  webSocket.loop();

  // Obtém o tempo atual
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

     float ppm = calcularPPM();

    // Exibe o valor do PPM no console
    USE_SERIAL.print("Concentração de fumaça (PPM): ");
    USE_SERIAL.println(ppm);

    // Controle de LEDs de acordo com o valor do PPM
    controlarLeds(ppm);

    // Cria a string JSON com o valor do PPM
    String jsonData = "{\"ppm\":" + String(ppm, 2) + "}";  // 2 casas decimais

    // Envia os dados via WebSocket
    USE_SERIAL.println("Enviando dados via WebSocket...");
    webSocket.sendTXT(jsonData);
  }
}

