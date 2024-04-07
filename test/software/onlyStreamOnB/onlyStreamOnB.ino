#include <U8g2lib.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"


#define WIFI_SSID "Marina's phone"
#define WIFI_PASSWORD "marina30"
#define API_KEY "AIzaSyABl_UJRO3JkxAhHKfxys7xxDQHMSz4exg"
#define DATABASE_URL "https://mirrored-object-default-rtdb.europe-west1.firebasedatabase.app" //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app



U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

// Define Firebase Data object
FirebaseData stream;
FirebaseData stream2;
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
unsigned long blocking_call_millis = 0;
int lastConnected=0;
int presses=0;

// int count = 0;
bool signupOK;

volatile bool dataChanged = false;


void streamCallback(FirebaseStream data)
{
  lastConnected=data.intData();
  Serial.println(lastConnected);
  dataChanged = true;
}

void streamCallback2(FirebaseStream data)
{
  presses=data.intData();
  Serial.println(presses);
  dataChanged = true;
}

void streamTimeoutCallback(bool timeout)
{
  if (timeout)
    Serial.println("stream timed out, resuming...\n");

  if (!stream.httpConnected())
    Serial.printf("error code: %d, reason: %s\n\n", stream.httpCode(), stream.errorReason().c_str());
}


void init_screen() {  
  u8g2.begin();
  u8g2.setDrawColor(1);
  u8g2.setFont(u8g2_font_ncenB14_tr);
}


void init_wifi() {  //connect to Wifi
  u8g2.clearBuffer();
  u8g2.drawStr(0, 20, "init wifi...");
  u8g2.sendBuffer();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
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


void init_firebase() {  // connect to firebase
 u8g2.clearBuffer();
  u8g2.drawStr(0, 20, "init fb...");
  u8g2.sendBuffer();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  } else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

 if (!Firebase.RTDB.beginStream(&stream, "/board_a/last_connected"))
    Serial.printf("stream begin error, %s\n\n", stream.errorReason().c_str());
  else {
  }
  Firebase.RTDB.setStreamCallback(&stream, streamCallback, streamTimeoutCallback);

  if (!Firebase.RTDB.beginStream(&stream2, "/board_a/total_presses"))
    Serial.printf("stream begin error, %s\n\n", stream.errorReason().c_str());
  else {
  }
  Firebase.RTDB.setStreamCallback(&stream2, streamCallback2, streamTimeoutCallback);

  u8g2.clearBuffer();
  u8g2.drawStr(0, 20, "done");
  u8g2.sendBuffer();
}

void setup()
{

  Serial.begin(9600);
  init_screen();
  init_wifi();
  init_firebase();
}


void update_status_async(int status) 
//this is a blocking call that takes on average 0.2 seconds to complete. 
// the action is done 'in the background' so the advantage is that other code can be executed while the update is performed
{
  blocking_call_millis = millis();
  Serial.printf("Set status to %d... \n", status, Firebase.RTDB.setIntAsync(&fbdo, F("/status"), status) );
  Firebase.RTDB.setIntAsync(&fbdo, F("/status"), status); //TODO for some reason the last call is not performed, so need to call twice
  Firebase.RTDB.setIntAsync(&fbdo, F("/status"), status);
  Serial.print ("duration of async call - ms: "); 
  Serial.println (millis()-blocking_call_millis);
}


void loop()
{

  Firebase.ready(); // should be called repeatedly to handle authentication tasks.

  if (dataChanged) //this funcion runs when a new command is received from the server
  {
    dataChanged = false; 
     u8g2.clearBuffer();
  u8g2.drawStr(0, 20, "changed");
  u8g2.sendBuffer();
    sendDataPrevMillis = millis();
  }
  else{
  u8g2.clearBuffer();
  u8g2.drawStr(0, 20, "no changes");
  u8g2.sendBuffer();
  }

  delay(100);

  /*  if ((millis() - sendDataPrevMillis > taskDuration) && currentStatus==RUNNING) // if 6 seconds have passed since action started, update status back to idle
  {
    currentStatus=IDLE; // set status to 1 when action is complete to symbolize return to idle state
    digitalWrite(LED_PIN, HIGH);
    update_status_blocking(currentStatus);
  }*/

}