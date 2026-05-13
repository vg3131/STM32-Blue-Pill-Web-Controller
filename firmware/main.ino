void setup() {
  Serial.begin(115200);
  pinMode(PC13, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "LED_ON") digitalWrite(PC13, LOW);
  }
}