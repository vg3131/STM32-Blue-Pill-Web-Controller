void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == "N") {
        digitalWrite(LED_BUILTIN, HIGH);
    }
    else if (cmd == "F") {
        digitalWrite(LED_BUILTIN, LOW);
    }
  }
}