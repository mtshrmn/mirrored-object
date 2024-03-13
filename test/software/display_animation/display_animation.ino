#include "AnimationFrames.h"

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, SCREEN_I2C_ADDR);
}


void loop() {
 display_animation();
}