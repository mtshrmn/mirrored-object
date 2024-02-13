#include <U8g2lib.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define API_KEY "AIzaSyABl_UJRO3JkxAhHKfxys7xxDQHMSz4exg"
#define DB_URL "https://mirrored-object-default-rtdb.europe-west1.firebasedatabase.app"
#define SSID "meirl"
#define PSK "metoothanks"

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;
String s = "";

void setup() {
  pinMode(22, INPUT_PULLUP);

  Serial.begin(9600);
  WiFi.begin(SSID, PSK);
  delay(1000);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  config.api_key = API_KEY;
  config.database_url = DB_URL;

  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

int buttonState = 0;
bool isPressed = false;

void loop() {
  buttonState = digitalRead(22);
  if (buttonState == LOW && isPressed == false) {
    isPressed = true;
    count++;
    Serial.println(count);
  }

  if (buttonState == HIGH) {
    isPressed = false;
  }

  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();
    if (Firebase.RTDB.setInt(&fbdo, "test", count)){
      Serial.println("ok");
    }
  }

}

