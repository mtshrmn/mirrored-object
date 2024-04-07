#ifndef OrientationManager_h
#define OrientationManager_h
#include<Arduino.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
extern Adafruit_SSD1306 display;

class OrientationManager {
private:
  int currentOrientation;
  int stableOrientation;
  unsigned long lastUpdateTime;
  bool orientationChanged;
  
public:
OrientationManager();
void update(const sensors_event_t &a);
void checkStabilityAndUpdateDisplay();
int getOrientation(sensors_event_t a);
};
#endif