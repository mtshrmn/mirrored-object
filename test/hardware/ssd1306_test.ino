#include <U8g2lib.h>

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

void setup() {
  u8g2.begin();
  u8g2.setDrawColor(1);
}


void loop() {
  u8g2.clearBuffer();
  u8g2.drawLine(0, 0, 127, 63);
  u8g2.sendBuffer();
}
