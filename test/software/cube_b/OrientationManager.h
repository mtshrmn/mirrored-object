#ifndef OrientationManager_h
#define OrientationManager_h
#include<Arduino.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

class OrientationManager {
private:
  int currentOrientation;
  int stableOrientation;
  unsigned long lastUpdateTime;
  bool orientationChanged;
  
public:
OrientationManager();
void update(const sensors_event_t &a);
bool checkStabilityAndUpdate();
int getOrientation(sensors_event_t a);
int get_stable_state();
};
#endif