#include <Arduino.h>

void setup() {
  Serial.begin(115200);

  delay(1000);

  Serial.println("PERFUMIA ESP32 started");
}

void loop() {
  Serial.println("ESP32 is alive");

  delay(2000);
}