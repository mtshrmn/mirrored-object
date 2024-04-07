#include "AnimationFrames.h"

int frame = 0;
Adafruit_SSD1306 display(128, 64, &Wire, OLED_RST_PIN);


void display_animation()
{
    display.clearDisplay();
    display.setTextSize(1); // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE);

    avalible_animation();
    // Update the display with the drawn bitmap and text
    display.display();

    // Move to the next frame for the next loop iteration
    frame = (frame + 1) % FRAME_COUNT;
    delay(FRAME_DELAY);
}

void meeting_animation()
{
    display.drawBitmap(40, 8, people[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    // Set the position where the text will start (x, y)
    // Adjust the x value as needed to center the text, and y to position at the bottom
    display.setCursor(25, 56); // You may need to adjust these values
    display.print("In a meeting");
}


void break_animation()
{
      display.drawBitmap(40, 8, coffee[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
   // Set the position where the text will start (x, y)
    // Adjust the x value as needed to center the text, and y to position at the bottom
    display.setCursor(30, 56); // You may need to adjust these values
    display.print("On a break");
}


void avalible_animation()
{
    display.drawBitmap(40, 8, smiley[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    // Set the position where the text will start (x, y)
    // Adjust the x value as needed to center the text, and y to position at the bottom
    display.setCursor(35, 56); // You may need to adjust these values
    display.print("Avalible:)");
}

void emergency_animation()
{
    display.drawBitmap(40, 8, warning[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    // Set the position where the text will start (x, y)
    // Adjust the x value as needed to center the text, and y to position at the bottom
    display.setCursor(20, 56); // You may need to adjust these values
    display.print("Emergencies only");
}

