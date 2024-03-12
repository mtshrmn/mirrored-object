#include <U8g2lib.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "time.h"
#include <NTPClient.h>


#define API_KEY "AIzaSyABl_UJRO3JkxAhHKfxys7xxDQHMSz4exg"
#define DB_URL "https://mirrored-object-default-rtdb.europe-west1.firebasedatabase.app"  // database url
#define SSID "Marina's phone" //wifi username
#define PSK "marina30"        //wifi password
#define NTP_SERVER "pool.ntp.org"


/*=======================================================================================================

                       PAY ATTANTION: THIS CODE BELONGS TO BOARD A!

=========================================================================================================*/



U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

FirebaseData fbdo;
FirebaseData stream;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson timeAndPresses;
String otherBoardPath = "/board_b";
String otherLastConnectedPath = "/last_connected";
String otherTotalPressesPath = "/total_presses";

unsigned long sendDataPrevMillis = 0; // used
int radius = 0; // used
int remoteRadius = 0; // used
int buttonState = 0; // used
bool isPressed = false; // used
int lastConnectedTimeB = 0; // used
bool signupOK = false;




//----------------------------Functions for stream-----------------------------------
void streamCallback(MultiPathStream stream) {
  if (stream.get(otherLastConnectedPath)) {
    lastConnectedTimeB = atoi(stream.value.c_str());
  }

  if (stream.get(otherTotalPressesPath)) {
    remoteRadius = atoi(stream.value.c_str());
  }
}

void streamTimeoutCallback(bool timeout) {
  if(timeout) {
    Serial.println("stream timed out, resuming...");
    return;
  }

  if (!stream.httpConnected()) {
    Serial.printf("error code: %d, reason: %s\n", stream.httpCode(), stream.errorReason().c_str());
    return;
  }
}




//----------------------- Get the current time--------------------------------
unsigned int getTime() { 
  struct tm timeinfo;
  time_t now;
  if (!getLocalTime(&timeinfo)) {
    return 0;
  }
  time(&now);
  return now;
}




//----------------------- Set connection to Wifi -------------------------------
void init_wifi() {  //connect to Wifi
  u8g2.clearBuffer();
  u8g2.drawStr(0, 20, "init wifi...");
  u8g2.sendBuffer();

  WiFi.begin(SSID, PSK);
  delay(1000);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.print("Connected with IP: ");
  Serial.println();
  Serial.println(WiFi.localIP());
  Serial.println();
}



//------------------------ Set Connection To FireBase-----------------------------
void init_firebase() {  // connect to firebase
  config.api_key = API_KEY;
  config.database_url = DB_URL;

  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  } else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  if (!Firebase.RTDB.beginMultiPathStream(&stream, otherBoardPath)) {
    Serial.printf("stream begin error, %s\n", stream.errorReason().c_str());
  } else {
    Firebase.RTDB.setMultiPathStreamCallback(&stream, streamCallback, streamTimeoutCallback);
  }
}



//-------------------------- Set the screen for usage --------------------------------
void init_screen() {  
  u8g2.begin();
  u8g2.setDrawColor(1);
  u8g2.setFont(u8g2_font_ncenB14_tr);
}



//-------------------------- Set the radius to the value in the DB ------------------
void init_radius(){
  if (Firebase.ready()){
      if (Firebase.RTDB.getInt(&fbdo, "board_a/total_presses")) {
        radius = fbdo.to<int>();
      } else {
        Serial.println("error reading radius");
      }
  }
}



//--------------------------- Hande an event of pressed button ----------------------------
void buttonWasPressed()
{
      radius++;
      if (Firebase.RTDB.setInt(&fbdo, "board_a/total_presses", radius)) {
        // do nothing
      } else {
        Serial.println("error setting local radius");
      }
      
      timeAndPresses.set("pressesCount", radius);
      timeAndPresses.set("timeStamp", getTime());

    if (Firebase.RTDB.pushJSON(&fbdo, "/board_a/presses", &timeAndPresses)) {
        // do nothing
      } else {
        Serial.println("error pushing time with presses");
      }
      timeAndPresses.clear();

}



//-------------------------- Check if the second board is connected ----------------------
bool isBoardBConnected() {
  int currentTime = getTime();
  if (lastConnectedTimeB == 0 || currentTime == 0) {
    return false;
  } else 
  return currentTime - lastConnectedTimeB < 15;
}




//=========================== SET UP WHEN CONNECTED TO POWER =================================
void setup() {
  pinMode(23, INPUT_PULLUP);
  Serial.begin(9600);
  init_screen();
  init_wifi();
  configTime(7200, 7200, NTP_SERVER);
  init_firebase();
  init_radius();
}



//=========================== THE CODE THAT WILL BE EXXECUTED IN LOOPS  =============================
void loop() {
    // firebase synchronization
    if (Firebase.ready() && signupOK && millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0){
      Serial.println("attempting to send data");
      sendDataPrevMillis = millis();
      if (Firebase.RTDB.setInt(&fbdo, "board_a/last_connected", getTime())) {
        Serial.println("sent data successfully");
      } else {
        Serial.println("error setting local last_connected");
      }
    }

    // update radius due to button press
    buttonState = digitalRead(23);
    if (buttonState == LOW && isPressed == false) {
      isPressed = true;
      buttonWasPressed();
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
      } else if(!isBoardBConnected()){
        u8g2.drawStr(0, 30, "B is offline");
      } else {
        u8g2.drawCircle(64, 32, remoteRadius % 30);
      }    
    }
    
    u8g2.sendBuffer();
  }


