#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define PIR_PIN 13
#define BUZZER_PIN 12

const char* ssid = ""; //NOME DO SEU WIFI
const char* password = ""; //SENHA DO WIFI
const char* apiUrl = "https://api.npoint.io/a6f1ec240976dbe61aff"; //Api de Mateus Ferrari, substitua por sua API para customização

unsigned long ultimaDeteccao = 0;
const unsigned long intervalo = 2000;

unsigned long ultimaConsultaAPI = 0;
const unsigned long intervaloAPI = 10000;

bool sistemaAtivo;
int tempoBuzzer;

void conectarWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi");
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Conectando WiFi...");
  display.display();

  int tentativas = 0;
  const int maxTentativas = 20;

  while (WiFi.status() != WL_CONNECTED && tentativas < maxTentativas) {
    delay(500);
    Serial.print(".");
    tentativas++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nFalha ao conectar WiFi!");
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Erro: WiFi");
    display.setCursor(0, 10);
    display.println("Sem Conexao");
    display.display();
    delay(2000);
    conectarWiFi();
  } else {
    Serial.println("\nWiFi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());

    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("WiFi Conectado!");
    display.setCursor(0, 10);
    display.println(WiFi.localIP());
    display.display();
    delay(2000);
  }
}

void obterConfiguracoesDaAPI() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi não conectado. Tentando reconectar...");
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Erro: WiFi");
    display.setCursor(0, 10);
    display.println("Reconectando...");
    display.display();
    conectarWiFi();
  }

  if (String(apiUrl) == "") {
    Serial.println("URL da API vazia!");
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Erro: API");
    display.setCursor(0, 10);
    display.println("URL Invalida");
    display.display();
    for (;;);
  }

  HTTPClient http;
  http.begin(apiUrl);
  int httpCode = http.GET();

  if (httpCode == 200) {
    String payload = http.getString();
    StaticJsonDocument<256> doc;
    DeserializationError erro = deserializeJson(doc, payload);

    if (!erro) {
      tempoBuzzer = doc["tempo_buzzer"];
      sistemaAtivo = doc["sistema_ativo"];

      Serial.print("Configuração recebida: tempoBuzzer = ");
      Serial.print(tempoBuzzer);
      Serial.print(", sistemaAtivo = ");
      Serial.println(sistemaAtivo ? "true" : "false");

      display.clearDisplay();
      display.setCursor(0, 0);
      display.println("API OK!");
      display.setCursor(0, 10);
      display.print("Buzzer: ");
      display.print(tempoBuzzer);
      display.setCursor(0, 20);
      display.print("Ativo: ");
      display.print(sistemaAtivo ? "Sim" : "Nao");
      display.display();
      delay(2000);
    } else {
      Serial.println("Erro ao interpretar JSON: " + String(erro.c_str()));
      display.clearDisplay();
      display.setCursor(0, 0);
      display.println("Erro: JSON");
      display.setCursor(0, 10);
      display.println("Formato Invalido");
      display.display();
      delay(2000);
      obterConfiguracoesDaAPI();
    }
  } else {
    Serial.print("Erro na requisição HTTP: ");
    Serial.println(httpCode);
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Erro: HTTP");
    display.setCursor(0, 10);
    display.print("Codigo: ");
    display.print(httpCode);
    display.display();
    delay(2000);
    obterConfiguracoesDaAPI();
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("Falha ao inicializar o display OLED"));
    for (;;);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Iniciando...");
  display.display();

  conectarWiFi();
  obterConfiguracoesDaAPI();

  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Sistema Iniciado");
  display.display();
  delay(2000);
}

void loop() {
  unsigned long agora = millis();

  if (agora - ultimaConsultaAPI >= intervaloAPI) {
    ultimaConsultaAPI = agora;
    obterConfiguracoesDaAPI();
  }

  if (!sistemaAtivo) {
    Serial.println("Sistema inativo via API");
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Sistema Inativo");
    display.display();
    delay(1000);
    return;
  }

  int movimento = digitalRead(PIR_PIN);

  if (movimento == HIGH && (agora - ultimaDeteccao > intervalo)) {
    ultimaDeteccao = agora;

    Serial.println("Movimento Detectado");
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Movimento:");
    display.setCursor(0, 10);
    display.println("Detectado!");
    display.display();

    digitalWrite(BUZZER_PIN, HIGH);
    delay(tempoBuzzer);
    digitalWrite(BUZZER_PIN, LOW);
  } else if (movimento == LOW) {
    Serial.println("Sem Movimento");
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Sem Movimento");
    display.display();

    digitalWrite(BUZZER_PIN, LOW);
  }

  delay(500);
}
