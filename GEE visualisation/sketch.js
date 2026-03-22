
let Canberra = [];
let Dubai = [];
let London = [];
let New_Delhi = [];
let Phoenix = [];
let Shanghai = [];
let CanberraRf = [];
let DubaiRf = [];
let LondonRf = [];
let New_DelhiRf = [];
let PhoenixRf = [];
let ShanghaiRf = [];
let dateLabel = ["Current","2020","2021","2022","2023","2024","2025"]
let w;
let h;
let slider;
let button;
let Rf = false;

async function setup() {
    w = windowWidth;
    h = windowHeight;

    for(i=0; i<7; i++){
        Canberra[i] = await loadImage(`assets/Canberra/${i}.png`);
        Dubai[i] = await loadImage(`assets/Dubai/${i}.png`);
        London[i] = await loadImage(`assets/London/${i}.png`);
        New_Delhi[i] = await loadImage(`assets/New_Delhi/${i}.png`);
        Phoenix[i] = await loadImage(`assets/Phoenix/${i}.png`);
        Shanghai[i] = await loadImage(`assets/Shanghai/${i}.png`);
    }

    for(i=0; i<7; i++){
        CanberraRf[i] = await loadImage(`assets/CanberraRf/${i}.png`);
        DubaiRf[i] = await loadImage(`assets/DubaiRf/${i}.png`);
        LondonRf[i] = await loadImage(`assets/LondonRf/${i}.png`);
        New_DelhiRf[i] = await loadImage(`assets/New_DelhiRf/${i}.png`);
        PhoenixRf[i] = await loadImage(`assets/PhoenixRf/${i}.png`);
        ShanghaiRf[i] = await loadImage(`assets/ShanghaiRf/${i}.png`);
    }

    createCanvas(w, h);

    slider = createSlider(0,6,0);
    slider.position(w/6*5,h/3);
    slider.size(200);

    button = createButton("click for land usage");
    button.position(w/7*6-10,h/3+50);
    button.mousePressed(imageState);
}

function imageState() {
    if(!Rf){
        Rf = true
    }else{
        Rf = false
    }
    console.log(Rf);
}

function draw() {
    background(14, 23, 48);
    imageMode(CENTER);
    fill(210);
    textAlign(CENTER);
    textFont("monospace");
    textSize(20);
    
    i = slider.value();

    if(!Rf){
        image(Canberra[i],(w/4)-50,h/4,200,200);
        image(Dubai[i],(w/2)-50,h/4,200,200);
        image(London[i],(w/4*3)-50,h/4,200,200);
        image(New_Delhi[i],(w/4)-50,(h/4*3)-40,200,200);
        image(Phoenix[i],(w/2)-50,(h/4*3)-40,200,200);
        image(Shanghai[i],(w/4*3)-50,(h/4*3)-40,200,200);
    }else{
        image(CanberraRf[i],(w/4)-50,h/4,200,200);
        image(DubaiRf[i],(w/2)-50,h/4,200,200);
        image(LondonRf[i],(w/4*3)-50,h/4,200,200);
        image(New_DelhiRf[i],(w/4)-50,(h/4*3)-40,200,200);
        image(PhoenixRf[i],(w/2)-50,(h/4*3)-40,200,200);
        image(ShanghaiRf[i],(w/4*3)-50,(h/4*3)-40,200,200);
    }

    text("Canberra",(w/4)-50,h/4+130);
    text("Dubai",(w/2)-50,h/4+130);
    text("London",(w/4*3)-50,h/4+130);
    text("New Delhi",(w/4)-50,(h/4*3)+90);
    text("Phoenix",(w/2)-50,(h/4*3)+90);
    text("Shanghai",(w/4*3)-50,(h/4*3)+90);

    textAlign(LEFT);
    text("Year",w/7*6,h/4-15);
    push();
        textSize(30)
        text(dateLabel[i],w/7*6,h/4+15);
    pop();

    text("Key",w/7*6,h/10*6);
    fill('#6f6f6f');
    text("tarmac",w/7*6,h/10*6+40);
    fill('#24bbff');
    text("water",w/7*6,h/10*6+65);
    fill('#70b003');
    text("vegetation",w/7*6,h/10*6+90);
    fill('#94691f');
    text("earth",w/7*6,h/10*6+115);
    fill('#F0A3C1');
    text("buildings",w/7*6,h/10*6+140);

}
