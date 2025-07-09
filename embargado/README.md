# 🔔 ESP32 - Detector de Movimento com Buzzer e Display OLED

Projeto embarcado desenvolvido com **ESP32**, que combina conectividade Wi-Fi, detecção de movimento via sensor PIR, exibição em **display OLED 0.96"** e alarme sonoro com buzzer. A ideia surgiu como um **trabalho acadêmico**, mas evoluiu para um projeto pessoal pela utilidade e potencial de expansão.

## 🚀 Funcionalidades

- 📡 Conexão com Wi-Fi e comunicação com API REST.
- 🌐 Integração com uma API externa para obter configurações remotas.
- 🕵️‍♂️ Detecção de movimento com sensor PIR.
- 📢 Alerta sonoro via buzzer ativo.
- 🖥️ Feedback visual em display OLED (com interface amigável).

## 🎯 Objetivo

Criar um sistema simples de alarme doméstico ou de monitoramento de ambientes que:

- Exiba o status no display OLED.
- Toque o buzzer por um tempo configurável via API, caso detecte movimento.
- Permita ativar/desativar remotamente o sistema com facilidade, sem a necessidade de reprogramação.

---

## 🔌 Componentes Utilizados

| Componente             | Modelo / Observação                                                |
|------------------------|--------------------------------------------------------------------|
| ESP32                  | Placa principal                                                    |
| Sensor de Movimento    | PIR HC-SR501                                                       |
| Display OLED           | 0.96" I2C (SSD1306, 128x64)                                        |
| Buzzer                 | Ativo                                                              |
| Resistores e Jumpers   | Padrão para conexão(adapte o resistor de acordo seu buzzer)     |
| Fonte USB              | Alimentação via computador ou power bank                           |

---

## 🧠 Lógica de Funcionamento

1. O ESP32 conecta-se à rede Wi-Fi configurada.
2. Ele consulta periodicamente uma API externa que retorna dois valores:
   - `sistema_ativo`: se o sistema deve estar em funcionamento ou não.
   - `tempo_buzzer`: tempo, em milissegundos, que o buzzer deve tocar em caso de movimento.
3. Se o `sistema_ativo` for `true`, o sensor PIR é ativado.
4. Caso detecte movimento:
   - O display mostra uma mensagem de alerta.
   - O buzzer é acionado pelo tempo definido.
5. Caso contrário, o display permanece em modo "monitoramento ativo".

---

## 📚 Bibliotecas Utilizadas

O projeto utiliza as seguintes bibliotecas (instale via **Arduino Library Manager**):

```cpp
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
