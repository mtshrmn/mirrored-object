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

                       PAY ATTANTION: THIS CODE BELONGS TO BOARD B!

=========================================================================================================*/



U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson timeAndPresses;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;
int radius = 0;
int remoteRadius = 0;
int buttonState = 0;
bool isPressed = false;
bool isAConnected=false;
char buff[40];



//----------------------- Get the current time--------------------------------
unsigned int getTime() { //get the current time
  struct tm timeinfo;
  time_t now;
  if (!getLocalTime(&timeinfo)) {
    return 0;
  }
  // strftime(buff, 39, "%d-%B-%Y,%H:%M:%S", &timeinfo);
  time(&now);
  return now;
  
}




//----------------------- Set connection to Wifi -------------------------------
void init_wifi() {  //connect to Wifi
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



//------------------------ Set Connection To FireBase-----------------------------
void init_firebase() {  // connect to firebase
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



//-------------------------- Set the screen for usage --------------------------------
void init_screen() {  
  u8g2.begin();
  u8g2.setDrawColor(1);
  u8g2.setFont(u8g2_font_ncenB14_tr);
}



//-------------------------- Set the radius to the value in the DB ------------------
void init_radius(){
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0)){
      sendDataPrevMillis = millis();
      if (Firebase.RTDB.getInt(&fbdo, "board_b/total_presses")) {
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
      if (Firebase.RTDB.setInt(&fbdo, "board_b/total_presses", radius)) {
        // do nothing
      } else {
        Serial.println("error setting local radius");
      }
      
      timeAndPresses.set("pressesCount", radius);
      timeAndPresses.set("timeStamp", getTime());

    if (Firebase.RTDB.pushJSON(&fbdo, "/board_b/presses", &timeAndPresses)) {
        // do nothing
      } else {
        Serial.println("error pushing time with presses");
      }
      timeAndPresses.clear();

}



//-------------------------- Check if the second board is connected ----------------------
bool isBoardAConnected(){
   /* if (Firebase.RTDB.getString(&fbdo, "board_a/last_connected")) {
        String time = fbdo.to<String>();
        String curTime = getTime();
        if (time.equals("err")||curTime.equals("err"))
        {
          return false;
        }
        int firstSeperatorIndex = time.indexOf(':');
        int secondSeperatorIndex = time.indexOf(':', firstSeperatorIndex + 1);

        String dateWithHour = time.substring(0, firstSeperatorIndex);
        int minutes = (time.substring(firstSeperatorIndex + 1, secondSeperatorIndex)).toInt();
        int seconds = (time.substring(secondSeperatorIndex + 1)).toInt();

        int curFirstSeperatorIndex = curTime.indexOf(':');
        int curSecondSeperatorIndex = curTime.indexOf(':', curFirstSeperatorIndex + 1);

        String curDateWithHour = curTime.substring(0, curFirstSeperatorIndex);
        int curMinutes = (curTime.substring(curFirstSeperatorIndex + 1, curSecondSeperatorIndex)).toInt();
        int curSeconds = (curTime.substring(curSecondSeperatorIndex + 1)).toInt();*/

      if (Firebase.RTDB.getInt(&fbdo, "board_a/last_connected")) {
        int time = fbdo.to<int>();
        int curTime = getTime();
        if (time == 0 || curTime == 0) {
          return false;
        }

        return curTime - time < 15;

      }

      
       /* if(curDateWithHour.equals(dateWithHour)&&((curMinutes*60+curSeconds)-(minutes*60+seconds)<30))
        {
          return true;
        }
        return false;;*/
    else {
        Serial.println("error getting last connection of other board");
        return false;
      }    
}




//=========================== SET UP WHEN CONNECTED TO POWER =================================
void setup() {
  pinMode(23, INPUT_PULLUP);

  init_screen();
  init_wifi();
  configTime(7200, 7200, NTP_SERVER);
  init_firebase();
  init_radius();
}



//=========================== THE CODE THAT WILL BE EXXECUTED IN LOOPS  =============================
void loop() {
    // firebase synchronization
    if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0)){
      sendDataPrevMillis = millis();

      isAConnected=isBoardAConnected();

      if (Firebase.RTDB.setInt(&fbdo, "board_b/last_connected", getTime())) {
        // do nothing
      } else {
        Serial.println("error setting local radius");
      }
      if (Firebase.RTDB.getInt(&fbdo, "board_a/total_presses")) {
        remoteRadius = fbdo.to<int>();
      } else {
        Serial.println("error getting remote radius");
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
      } else if(!isAConnected){
        u8g2.drawStr(0, 30, "A is offline");
      } else {
        u8g2.drawCircle(64, 32, remoteRadius % 30);
          }    
    }
    
    u8g2.sendBuffer();
  }


