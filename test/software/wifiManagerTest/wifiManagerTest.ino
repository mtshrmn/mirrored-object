#include<WiFi.h>
#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager
#include <U8g2lib.h>

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);
 WiFiManager wifiManager;
 bool res;


 void init_screen() {  
  u8g2.begin();
  u8g2.setDrawColor(1);
  u8g2.setFont(u8g2_font_ncenB14_tr);
  
  u8g2.clearBuffer();
  u8g2.drawStr(0, 40, "connecting...");
  u8g2.sendBuffer();
}

void setup() {
  init_screen();
    // WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
    // it is a good practice to make sure your code sets wifi mode how you want it.

    // put your setup code here, to run once:
    Serial.begin(9600);
    
    //WiFiManager, Local intialization. Once its business is done, there is no need to keep it around
   //here was declared wifiManager

    // reset settings - wipe stored credentials for testing
    // these are stored by the esp library
     wifiManager.resetSettings();

    // Automatically connect using saved credentials,
    // if connection fails, it starts an access point with the specified name ( "AutoConnectAP"),
    // if empty will auto generate SSID, if password is blank it will be anonymous AP (wm.autoConnect())
    // then goes into a blocking loop awaiting configuration and will return success result

//here was declared bool res;
    
    // res = wm.autoConnect(); // auto generated AP name from chipid
    // res = wm.autoConnect("AutoConnectAP"); // anonymous ap
    res = wifiManager.autoConnect("AutoConnectAP","password"); // password protected ap

    if(!res) {
        Serial.println("Failed to connect");
        // ESP.restart();
    } 
    else {
        //if you get here you have connected to the WiFi    
        u8g2.clearBuffer();
        u8g2.drawStr(0, 40, "connected:)");
        u8g2.sendBuffer();
    }

}

void loop() {
   if(WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, attempting to reconnect...");
    u8g2.clearBuffer();
    u8g2.drawStr(0, 40, "wifi error");
    u8g2.sendBuffer();
    res = wifiManager.autoConnect("AutoConnectAP","password"); // This will open the configuration portal if not able to reconnect.
    if(res){
      u8g2.clearBuffer();
      u8g2.drawStr(0, 40, "connected");
      u8g2.sendBuffer();
    }
  }
  // Your regular loop code goes here

  delay(100);
}