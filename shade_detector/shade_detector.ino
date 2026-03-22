#include <SD.h>
 
File myFile;

int ldr = 0;
int button;
int oldbutton = 0;
int state = 0;
int fileNumber = 1;
int fileName;
 
void setup()
{
  Serial.begin(9600);
  Serial.print("Initializing SD card...");

  pinMode(10, OUTPUT); //pin writing to SD
  pinMode(3, OUTPUT); //pin for LED
  pinMode(2, INPUT); //pin getting button data
 
  if (!SD.begin(10)) {
    Serial.println("initialization failed!");
    return;
  }
  
  Serial.println("initialization done.");
}
 
void loop()
{
  ldr = analogRead(A0);
//  Serial.println(ldr);
  
  button = digitalRead(2);
  if(button && !oldbutton) {// same as if(button == high && oldbutton == low)
    if(state == 0){
      // open the file
      //fileName = String("shadows")+String(fileNumber)+String(".txt");
      Serial.println(fileName);
      myFile = SD.open(String("shadows")+String(fileNumber)+String(".txt"), FILE_WRITE);

      // turn on LED
      digitalWrite(3, HIGH);
      // change button state
      state = 1;
      fileNumber++;
    }
    else
    {
      // close file
      myFile.close();
      // turn off LED
      digitalWrite(3, LOW);
      // change button state
      state = 0; 
    }
    oldbutton = 1;
  }
  else if(!button && oldbutton)
  {
    //button was released
    oldbutton = 0;
  }

  if(myFile) {
    if(state == 1){
      Serial.println(ldr);
      myFile.print(ldr);
      myFile.println(",");
    }
  }
}
