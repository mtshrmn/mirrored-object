# Mirrored Object - Twin cubes that each display the other's state.

## **Project by**: Marina Yanovskiy, Dvir Elkabetz & Moshe Sherman.

In this project, we have built two smart cubes. Each of them can be
placed in four different orientation to indicate state and display
the other's state.

---

# Folder Structure of the Repository
```

├── docs - documentation and instructions.
├── PARAMETERS.md - hard coded parameters of the project.
├── README.md - this file.
├── src
│   ├── app - source code for react native application.
│   │   ├── assets - all the images for the application.
│   │   ├── components - custom react native components.
│   └── hardware
│       ├── final
│       │   ├── cube_a - code for cube a (final submission).
│       │   └── cube_b - code for cube b (final submission).
│       └── poc - code for PoC (old code).
└── unittests
    ├── hardware - hardware unit tests.
    └── software - software unit tests.

```

# Libraries used for ESP32 and their versions 
- [Firebase ESP Client](https://github.com/mobizt/Firebase-ESP-Client) - 4.4.14
- [FirebaseJson](https://github.com/mobizt/FirebaseJson) - 3.0.7
- [WifiManger](https://github.com/tzapu/WiFiManager) - 2.0.17
- [NTPClient](https://github.com/arduino-libraries/NTPClient) - 3.2.1
- [Adafruit MPU6050](https://github.com/adafruit/Adafruit_MPU6050) - 2.2.6
- [Adafruit SSD1306](https://github.com/adafruit/Adafruit_SSD1306) - 2.5.9
- [Adafruit Sensor](https://github.com/adafruit/Adafruit_Sensor) - 1.1.14
- [Adafruit GFX](https://github.com/adafruit/Adafruit-GFX-Library) - 1.11.9

# Hardware used
- 2 $\times$ ESP32
- 2 $\times$ MPU6050
- 2 $\times$ SD1306
- 2 $\times$ KY016

# Connection Diagmram
![Connection Diagram](https://github.com/mtshrmn/mirrored-object/assets/18540571/a04810b1-9e94-4f00-9c12-ebd87cbcae58)

# Poster
![Mirrored object GROUP 9 - IOT poster](https://github.com/mtshrmn/mirrored-object/assets/18540571/e0ef05ea-efc2-46cd-87eb-2f4b576775ea)

