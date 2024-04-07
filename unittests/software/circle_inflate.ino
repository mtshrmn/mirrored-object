#include <U8g2lib.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "time.h"
#include <NTPClient.h>


#define API_KEY "AIzaSyABl_UJRO3JkxAhHKfxys7xxDQHMSz4exg"
#define DB_URL "https://mirrored-object-default-rtdb.europe-west1.firebasedatabase.app"
#define SSID "meirl"
#define PSK "metoothanks"
#define NTP_SERVER "pool.ntp.org"



U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;
int radius = 0;
int remoteRadius = 0;
int buttonState = 0;
bool isPressed = false;
char buff[20];


char *getTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "err";
  }
  strftime(buff, 19, "%H:%M:%S", &timeinfo);
  return buff;
}


void init_wifi() {
  Serial.begin(9600);
  WiFi.begin(SSID, PSK);
  delay(1000);
  Serial.print("Connected with IP: ");
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.println(WiFi.localIP());
  Serial.println();
}

void init_firebase() {
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

void init_screen() {
  u8g2.begin();
  u8g2.setDrawColor(1);
  u8g2.setFont(u8g2_font_ncenB14_tr);

}

void setup() {
  pinMode(23, INPUT_PULLUP);

  init_screen();
  init_wifi();
  configTime(7200, 7200, NTP_SERVER);
  init_firebase();
}

void loop() {
    // firebase synchronization
    if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0)){
      sendDataPrevMillis = millis();
      if (Firebase.RTDB.getInt(&fbdo, "board_a")) {
        remoteRadius = fbdo.to<int>();
      } else {
        Serial.println("error reading remote radius");
      }

      if (Firebase.RTDB.setInt(&fbdo, "board_a/total_presses", radius)) {
        // do nothing
      } else {
        Serial.println("error setting local radius");
      }
      if (Firebase.RTDB.setString(&fbdo, "board_a/last_connected", getTime())) {
        // do nothing
      } else {
        Serial.println("error setting local radius");
      }
    }

    // update radius due to button press
    buttonState = digitalRead(23);
    if (buttonState == LOW && isPressed == false) {
      isPressed = true;
      radius++;
    }

    if (buttonState == HIGH) {
      isPressed = false;
    }

    // render monitor
    u8g2.clearBuffer();
    if (WiFi.status() != WL_CONNECTED) {
      u8g2.drawStr(0, 20, "wifi error");
    } else {
      if (!Firebase.ready()) {
        u8g2.drawStr(0, 40, "fb error");
      } else {
        u8g2.drawCircle(64, 32, remoteRadius % 30);
      }
    }
    
    u8g2.sendBuffer();
}

