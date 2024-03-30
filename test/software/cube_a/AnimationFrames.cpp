#include "AnimationFrames.h"

int frame = 0;
Adafruit_SSD1306 display(128, 64, &Wire, OLED_RST_PIN);


void display_animation(int status,int orientation)
{
    display.clearDisplay();
    display.setFont(NULL);
    switch(orientation){
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
        default:
        display.setRotation(0);
        display.setCursor(10, 56);
        display.print("Illegal orientation!");
        display.display();
        return;
    }
    if(status==1){
      avalible_animation(orientation);
    }
    else if(status==3){
      emergency_animation(orientation);
    }
    else if(status==5){
      break_animation(orientation);
    }
    else if(status==6){
      meeting_animation(orientation);
    }
    
    // Update the display with the drawn bitmap and text
    display.display();

    // Move to the next frame for the next loop iteration
    frame = (frame + 1) % FRAME_COUNT;
    delay(FRAME_DELAY);
}

void meeting_animation(int orientation)
{
  if(orientation==5||orientation==6){
    display.drawBitmap(8, 20, people[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    display.setCursor(20, 76);
    display.print("In a");
    display.setCursor(12, 86);
    display.print("meeting");
  }
  else{
    display.drawBitmap(40, 8, people[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    display.setCursor(25, 56);
    display.print("In a  meeting");
  }
}


void break_animation(int orientation)
{
  if(orientation==5||orientation==6){
    display.drawBitmap(8, 20, coffee[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    display.setCursor(0, 76); 
    display.print("on a break");
  }
  else{
    display.drawBitmap(40, 8, coffee[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    display.setCursor(35, 56); 
    display.print("on a break");
  }
    
}


void avalible_animation(int orientation)
{
  if(orientation==5||orientation==6){
    display.drawBitmap(8, 20, smiley[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    display.setCursor(6, 76);
    display.print("Avalible");
  }
  else {
    display.drawBitmap(40, 8, smiley[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    display.setCursor(35, 56);
    display.print("  Avalible");
  }
    
}

void emergency_animation(int orientation)
{
  if(orientation==5||orientation==6){
    display.drawBitmap(8, 20, warning[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    display.setCursor(0, 76);
    display.print("Emergency");
    display.setCursor(15, 86);
    display.print("only");
  }
  else{
    display.drawBitmap(40, 8, warning[frame], FRAME_WIDTH, FRAME_HEIGHT, 1);
    display.setCursor(20, 56);
    display.print("Emergency only");
  }

}

