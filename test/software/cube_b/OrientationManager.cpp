#include "OrientationManager.h"

  OrientationManager::OrientationManager():currentOrientation(0), stableOrientation(0), lastUpdateTime(0), orientationChanged(false) 
  {}

  int OrientationManager::getOrientation(sensors_event_t a){
  // Determine which axis has the highest absolute acceleration, indicating alignment with gravity
    float absX = abs(a.acceleration.x);
    float absY = abs(a.acceleration.y);
    float absZ = abs(a.acceleration.z);

    if (absZ > absX && absZ > absY) {
      // The cube is lying flat
      return (a.acceleration.z > 0) ? 1 : 3; // Assuming 1 is Z up, 3 is Z down
    } else if (absY > absX) {
      // The cube is on its side
      return (a.acceleration.y > 0) ? 4 : 2; // Assuming 4 is Y up, 2 is Y down
    } else {
      // The cube is standing up
      return (a.acceleration.x > 0) ? 5 : 6; // Assuming 5 is X up, 6 is X down
    }
  }


  void OrientationManager::update(const sensors_event_t &a) {
    int newOrientation = getOrientation(a);
    if (newOrientation != currentOrientation) {
      currentOrientation = newOrientation;
      lastUpdateTime = millis();
      orientationChanged = true;
    }
  }

  // Checks if the orientation has been stable for more than 3 seconds and updates 
  bool OrientationManager::checkStabilityAndUpdate() {
    if (orientationChanged && millis() - lastUpdateTime > 3000) {
      if(stableOrientation != currentOrientation){
        stableOrientation = currentOrientation;
        
        orientationChanged = false; // Reset flag until the next orientation change
        return true;
      }
      orientationChanged = false; // Reset flag until the next orientation change
    }
    return false;
  }

  int OrientationManager::get_stable_state(){
    return stableOrientation;
  }
