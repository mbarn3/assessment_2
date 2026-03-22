let ml;
let currentLabel = "Waiting...";
let currentData;
let currentConfidence;
let lastData;
let currentPhoto;
let time1 = 0;
let time2 = 0;
let time3 = 0;
let timer1 = 0;
let timer2 = 0;
let timer3 = 0;
let loadTime = 2500;
let stopStartScreen = false;
let stopWelcomeMember = true;
let stopNotMember = true;
let stopAdverts = false;
let button1;
let button2;
let button3;
let button4;
let canvas;
let profileData;
let digitalIdData;
let routeData;
let digitalIdNumber = 0;
let imgs =[];
let profilePhoto;
let imageFound = false;
let mapLoaded = false;

//  images
let goWayLogo;
let governmentApproved;
let digitalId;
let mapImg;


//load map
//Access token
const access_key = 'pk.eyJ1IjoibWJhcm4zIiwiYSI6ImNtbGV6MWI5dTFmdW0zZHNhNjh5Mjk1NHQifQ.Qy1QfgZGp0VD943_A4lNgA';

//Mapbox style
const style = "mapbox://styles/mbarn3/cmlgjx9iw003001sc3nk10j6a";

// Options for map
const options = {  
  lat: 51.472368,
  lng: -0.086186,
  zoom: 13,
  style: style,
};

// Create an instance of MapboxGL
const mappa = new Mappa('MapboxGL', access_key);  
let myMap;
let myData;

async function setup() {
  //load font
  font = await loadFont('assets/raleway.light.ttf');

  //  load images
  goWayLogo = await loadImage('/assets/go_way_logo.png');
  governmentApproved = await loadImage('/assets/government_approved.png');
  digitalId = await loadImage('assets/digital_id.png');
  mapImg = await loadImage('assets/map_test.png')
  
  //  load all images from ML bridge dataset
  profileData = await loadJSON('/assets/faces_final.json');
  for(let i =0;i<profileData.unifiedDataset.length;i++){
  imgs[i] = await loadImage(profileData.unifiedDataset[i].thumbnail);
  }

  // load profile data for digital IDs
  digitalIdData = await loadJSON('assets/profile_data.json');

  // Auto-connects to localhost:3100
  ml = new MLBridge();
  
  // Listen for predictions
  ml.onPrediction((data) => {
    if (data.label) {
      currentData = data.label
      currentLabel = data.label + " (" + int(data.confidence * 100) + "%)";
      currentConfidence = data.confidence*100
    }
  });

  //create canvas
  canvas = createCanvas(windowWidth, windowHeight);

  //set page loading timers
  time1 = millis()
  time2 = millis()

  //create buttons
  button1 = createButton('End Session');
  button1.position(windowWidth/20*17, windowWidth/20);
  button1.mousePressed(endSession);


  button2 = createButton("Plan Route");
  button2.position(windowWidth/4*3,windowHeight/2);
  button2.mousePressed(loadMap);

  button3 = createButton("Upgrade");
  button3.position(windowWidth/8*3,windowHeight/8*5);
  button3.mousePressed(notMember)

  button4 = createButton("x");
  button4.position(windowWidth/20*17, windowWidth/20);
  button4.mousePressed(showAdverts)
}

function draw() {
  console.log(stopAdverts)

  textFont(font);
  noStroke()
  imageMode(CENTER);
  image(governmentApproved,windowWidth/8*7,windowHeight/8*7,windowWidth/6,windowHeight/3.5)
  
  startScreen();

  // draw goWay logo in top left
  if(stopStartScreen){
    image(goWayLogo,windowWidth/8,windowHeight/8,windowWidth/10,windowWidth/10)
  }

  if(!stopWelcomeMember){
    sx = (windowWidth/4*3) - (windowWidth/4/2);
    sy = (windowHeight/2) - (windowHeight/2/2);
    bx = (windowWidth/4*3) + (windowWidth/4/2);
    by = (windowHeight/2) + (windowHeight/2/2);

    if(mouseX >= sx && mouseX <= bx && mouseY >= sy && mouseY <= by && mouseIsPressed){
      loadMap();
    }
  }
}

function loadTimer1() {
  //starts timer for not member
  timer1 = millis() - time1;
}
function loadTimer2() {
  //starts time for welcome member
  timer2 = millis() - time2;
}

function startScreen() {
  // waits for face and then checks identity
  if(!stopStartScreen){
    button1.hide();
    button2.hide();
    button3.hide();
    button4.hide()

    background(20)
    fill(200);
    textSize(30);
    textAlign(CENTER);

    image(goWayLogo,windowWidth/2,windowHeight/3,windowWidth/2.5,windowWidth/2.5)
    
    if(currentData == "class_5"){
      text("scanning for face...",windowWidth/2,windowHeight/4*3);
      time1 = millis()
      time2 = millis()
    }
    else if((currentData == "class_1" || "class_2" || "class_3" || "class_4") && (currentConfidence >= 90)){
      text("face found, loading profile...",windowWidth/2,windowHeight/4*3);
      loadTimer2();
      time1 = millis(); //reset not member timer
      if(timer2 > loadTime){
        stopWelcomeMember = false;
        welcomeMember();
      }
    }
    else if(currentConfidence < 90){
      text("face found, loading profile...",windowWidth/2,windowHeight/4*3);
      loadTimer1();
      time2 = millis(); //reset welcome member timer
      if(timer1 > loadTime){;
        stopNotMember = false;
        notMember();
      }
    }
  }
}

// if member - show membership tier and money as stored in json file
function welcomeMember() {
  //console.log("welcome member");
  stopStartScreen = true;
  stopNotMember = true;

  button1.show();
  //button2.show();
  button3.show();

  background(20);
  fill(200);
  imageMode(CENTER);
  rectMode(CENTER);
  push();
    fill(50);
    rect(windowWidth/3,windowHeight/2,windowWidth/2,windowHeight/2,20);
  pop();
  image(digitalId,windowWidth/6,windowHeight/3,150,100);

  //clickable minimap to plan route
  mapHolder = createGraphics(windowWidth/4,windowHeight/2)
  mapHolder.rect(0,0,windowWidth/4,windowHeight/2,20);
  mapImg.mask(mapHolder);
  croppedMapImg = image(mapImg,windowWidth/4*3,windowHeight/2,windowWidth/4,windowHeight/2);
  push();
  text("Press to",windowWidth/4*3,(windowHeight/2)-10)
  text("plan route",windowWidth/4*3,(windowHeight/2)+30)
  pop();

  //mapHolder.mouseOver(croppedMapImg.filter(BLUR,3));
  //croppedMapImg.mousePressed(loadMap)

  // show first profile image of current class
  if(!imageFound){
    for(i=0;i<profileData.unifiedDataset.length;i++){   
      if(profileData.unifiedDataset[i].label == currentData){
        currentPhoto = i - profileData.classification[currentData].shape[0] + 1;
        imageFound = true;
      }
    }
  }
  if(imageFound){
    console.log("profile image loaded");
    image(imgs[currentPhoto],windowWidth/5,windowHeight/20*11,windowWidth/7,windowHeight/4);
  }

  //show membership type
  //convert currentData into 1,2,3..
  if(currentData == "class_1"){
    digitalIdNumber = 0
  }else if(currentData == "class_2"){
    digitalIdNumber = 1
  }else if(currentData == "class_3"){
    digitalIdNumber = 2
  }else if(currentData == "class_4"){
    digitalIdNumber = 3
  }

  push()
    strokeWeight(2);
    if(digitalIdData.profiles[digitalIdNumber].membership == "Bronze"){
      fill(158, 120, 79);
      stroke(115, 87, 57);
    }else if(digitalIdData.profiles[digitalIdNumber].membership == "Silver"){
      fill(180);
      stroke(140);
    }else if(digitalIdData.profiles[digitalIdNumber].membership == "Gold"){
      fill(255, 225, 107);
      stroke(240, 203, 70);
    }
    rect(windowWidth/40*17,windowHeight/2,windowWidth/4,windowHeight/10,10);
    fill(20)
    noStroke()
    textSize(18)
    text(`${digitalIdData.profiles[digitalIdNumber].membership} Member`,windowWidth/40*17,windowHeight/40*20.7);
    textSize(25)
    fill(200)
    text(digitalIdData.profiles[digitalIdNumber].name,windowWidth/40*17,windowHeight/8*3);
    lastData = currentData
  pop()

}

// if not member - ask to buy membership, and if not exit vehicle countdown
function notMember() {
  stopStartScreen = true;
  stopWelcomeMember = true;
  
  button1.show()
  button2.hide()
  button3.hide()
  background(20);

  //draw membership tiers
  push()
  textSize(50)
  text("Membership Packages",windowWidth/2,windowHeight/7);
  strokeWeight(4)
  rectMode(CENTER);
  let x = windowWidth/5
  let y = windowHeight/2
  let r = 20
      fill(158, 120, 79);
      stroke(115, 87, 57);
  rect(windowWidth/4,windowHeight/2,x,y,r);
      fill(180);
      stroke(140);
  rect(windowWidth/2,windowHeight/2,x,y,r);
      fill(255, 225, 107);
      stroke(240, 203, 70);
  rect(windowWidth/4*3,windowHeight/2,x,y,r);
  pop()

  fill(50);
  textSize(20)

  text("Bronze",windowWidth/4,windowHeight/3)
  text("Silver",windowWidth/2,windowHeight/3)
  text("Gold",windowWidth/4*3,windowHeight/3)

  textSize(13)

  text("£100 per month",windowWidth/4,windowHeight/2 - 30)
  text("Basic road usage",windowWidth/4,windowHeight/2)

  text("£500 per month",windowWidth/2,windowHeight/2 - 30)
  text("All public roads",windowWidth/2,windowHeight/2)
  text("Fewer adverts",windowWidth/2,windowHeight/2+30)

  text("£1000 per month",windowWidth/4*3,windowHeight/2 - 30)
  text("Use of all roads",windowWidth/4*3,windowHeight/2)
  text("Ad free experience",windowWidth/4*3,windowHeight/2+30)
}

function loadMap() {
  stopWelcomeMember=true

  clear()
  button2.hide()
  button3.hide()

  if(!mapLoaded){
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
  }else{
    //myMap.jumpTo(resetOptions);
    //set map to original position
  }

  mapLoaded=true
}

function showAdverts(){
  stopAdverts = true
}

function adverts() {
  if(!stopAdverts){
    background(240,30,30);
    text("This is an advert",windowWidth/2,windowHeight/2);
    button4.show();
    button1.hide();
    button2.hide();
    button3.hide();
  }else{
    clear()
  }
}

function startDrive() {

}

function endSession() {
  stopStartScreen = false;
  stopWelcomeMember = true;
  stopNotMember = true;
  imageFound = false;
  time1 = millis();
  time2 = millis();
  time3 = millis();

}



