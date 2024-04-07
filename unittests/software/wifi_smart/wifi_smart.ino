
#include <WiFi.h>
#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "time.h"
#include <NTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
#include "AnimationFrames.h"
#include <Fonts/FreeSans12pt7b.h>

Adafruit_MPU6050 mpu;
#include "OrientationManager.h"
OrientationManager orientationManager;

#define API_KEY "AIzaSyABl_UJRO3JkxAhHKfxys7xxDQHMSz4exg"
#define DB_URL "https://mirrored-object-default-rtdb.europe-west1.firebasedatabase.app"  // database url
#define SSID "Marina's phone" //wifi username
#define PSK "marina30"        //wifi password
#define NTP_SERVER "pool.ntp.org"

#define PIN_RED 27
#define PIN_GREEN 26
#define PIN_BLUE 25
/*=======================================================================================================

                       PAY ATTANTION: THIS CODE BELONGS TO BOARD B!
// NOTE: maybe neeed to rotate the screen when doing init.
=========================================================================================================*/
extern Adafruit_SSD1306 display;
//display is declared in "animation frames"

FirebaseData fbdo;
FirebaseData streamConnection;
FirebaseData streamState;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson timeAndState;


unsigned long sendDataPrevMillis = 0; // used
int state = 0; // used
int remoteState = 0; // used

int lastConnectedTimeB = 0; // used
bool signupOK = false;

WiFiManager wifiManager;
bool res;//use for wifi




//----------------------------Functions for stream-----------------------------------
void streamCallbackConnection(FirebaseStream data)
{
  lastConnectedTimeB=data.intData();
  Serial.println(lastConnectedTimeB);
}

void streamCallbackState(FirebaseStream data)
{
  remoteState=data.intData();
  Serial.println(remoteState);
}

void streamTimeoutCallback(bool timeout) {
  if(timeout) {
    Serial.println("stream timed out, resuming...");
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


//----------------------- Init the acceleration sensor ---------------------------
void init_mpu(){
  if (!mpu.begin()) {
    Serial.println("Sensor init failed");
    while (1)
      yield();
  }
  Serial.println("Found a MPU-6050 sensor");
}




//----------------------- Set connection to Wifi -------------------------------
void init_wifi() {  //connect to Wifi
  write_to_display("init Wifi",1);

  wifiManager.resetSettings();
  res = wifiManager.autoConnect("ConfigCubeA","password");
  if(!res) {
          Serial.println("Failed to connect");
          // ESP.restart();
      } 
      else {
          //if you get here you have connected to the WiFi    
      }
}



//------------------------ Set Connection To FireBase-----------------------------
void init_firebase() {  // connect to firebase
  write_to_display("Init FB",1);

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

  if (!Firebase.RTDB.beginStream(&streamConnection, "/cube_b/last_connected"))
    Serial.printf("stream begin error, %s\n\n", streamConnection.errorReason().c_str());
  else {
  }
  Firebase.RTDB.setStreamCallback(&streamConnection, streamCallbackConnection, streamTimeoutCallback);

  if (!Firebase.RTDB.beginStream(&streamState, "/cube_b/state"))
    Serial.printf("stream begin error, %s\n\n", streamState.errorReason().c_str());
  else {
  }
  Firebase.RTDB.setStreamCallback(&streamState, streamCallbackState, streamTimeoutCallback);

}



//-------------------------- Set the screen for usage --------------------------------
void init_screen() {  
  display.begin(SSD1306_SWITCHCAPVCC, SCREEN_I2C_ADDR);
    display.setTextSize(1); // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE);
}



//-------------------------- Set the state to the value in the DB ------------------
void init_state(){
  if (Firebase.ready()){
      if (Firebase.RTDB.getInt(&fbdo, "cube_a/state")) {
        state = fbdo.to<int>();
      } else {
        Serial.println("error reading state");
      }
  }
}



//-------------------------- Check if the second board is connected ----------------------
bool isBoardBConnected() {
  int currentTime = getTime();
  if (lastConnectedTimeB == 0 || currentTime == 0) {
    return false;
  } else 
  return currentTime - lastConnectedTimeB < 15;
}



//------------------------- use for writing on the screen----------------------------------

void write_to_display(String text, int orientation){
  display.clearDisplay();
  display.setFont(&FreeSans12pt7b);
  display.setTextSize(1);
  switch(state){
      case 1: 
        display.setRotation(0);    
        break;
      case 3:
         display.setRotation(2);       
        break;
      case 5:
         display.setRotation(3);         
        break;
      case 6:
         display.setRotation(1);       
        break;
    } 

    display.setCursor(0,20); 
    display.print(text);
    display.display();   
}



//------------------------------control RGB LED--------------------------------------------
void display_led(int mode){
  if(mode ==1){ //a critical error accured- display red light
    setColor(255,0,0);
  } 
  else if (mode == 2){ //connection error- display yellow light
    setColor(255,130,0);
  }
  else if(mode == 3){ // display color by remote state
    switch(remoteState){
      case 1: //avalible - green
        setColor(0,255,0);
        break;
      case 3: // Emergencies only - pink
        setColor(255,102,255);
        break;
      case 5: // on a break - purple
        setColor(127,0,255);
        break;
      case 6: // meeting - blue
        setColor(0,0,255);
        break;
    }
  }
}

void setColor(int R, int G, int B){
  analogWrite(PIN_RED,R);
  analogWrite(PIN_GREEN,G);
  analogWrite(PIN_BLUE,B);
}



//=========================== SET UP WHEN CONNECTED TO POWER =================================
void setup() {
  pinMode(23, INPUT_PULLUP);
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE, OUTPUT);
  Serial.begin(9600);
  init_mpu();
  init_screen();
  init_wifi();
  configTime(7200, 7200, NTP_SERVER);
  init_firebase();
  init_state();
}


//=========================== THE CODE THAT WILL BE EXXECUTED IN LOOPS  =============================
void loop() {
    // firebase synchronization
    if (Firebase.ready() && signupOK && millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0){
      sendDataPrevMillis = millis();
      if (Firebase.RTDB.setInt(&fbdo, "cube_a/last_connected", getTime())) {
      } else {
        Serial.println("error setting local last_connected");
      }
    }

    sensors_event_t a,g,temp;
    mpu.getEvent(&a,&g,&temp);
    // Update the orientation manager with the latest data
    orientationManager.update(a);

    // Check if the orientation has been stable for 3 seconds and update display
    if(orientationManager.checkStabilityAndUpdate()){

      if(orientationManager.get_stable_state()!=2&&orientationManager.get_stable_state()!=4){

        state = orientationManager.get_stable_state();
        if (Firebase.RTDB.setInt(&fbdo, "cube_a/state", state)) {
        // do nothing
        } else {
          Serial.println("error setting local state");
        }
        
        timeAndState.set("state", state);
        timeAndState.set("timeStamp", getTime());

        if (Firebase.RTDB.pushJSON(&fbdo, "/cube_a/state_and_time", &timeAndState)) {
            // do nothing
          } else {
            Serial.println("error pushing time with state");
          }
          timeAndState.clear();
        }
    }


    if (WiFi.status() != WL_CONNECTED) {
        write_to_display("Wifi Error", state);
        display_led(1);
      res = wifiManager.autoConnect("ConfigCubeA","password"); // This will open the configuration portal if not able to reconnect.
    } else {
      if (!Firebase.ready()) {
          write_to_display("Fb error",state);
          display_led(1);
      }else if(!isBoardBConnected()){
          write_to_display("  B is offline",state);
          display_led(2);
      }
       else {
        display_animation(remoteState,state);
        display_led(3);
      }    
    }
  }