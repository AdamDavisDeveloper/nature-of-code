let wally;
let wilbur;

const wallyConfig = {
  offsetX: 50,
  offsetY: 150,
  colorRGB: {
    r: 255,
    g: 192,
    b: 203,
  }
}

const wilburConfig = {
  offsetX: 0,
  offsetY: -100,
  colorRGB: {
    r: 255,
    g: 255,
    b: 255,
  }
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function randCoord() { // number[]
  let x = getRandomInt(0, 2);
  let y = getRandomInt(0, 2);
  if(x === 0) x--;
  if(y === 0) y--;
  return [x, y];
}

class FoodDropper {
  constructor() {

  }
}

class Walker {
  constructor(config) {
    this.x = (width / 2) - config.offsetX;
    this.y = (height / 2) - config.offsetY;
    this.offsetX = config.offsetX;
    this.offsetY = config.offsetY;
    this.colorRGB = config.colorRGB;
  }

  draw() {
    noStroke();
    fill(this.colorRGB.r, this.colorRGB.g, this.colorRGB.b);
    circle(this.x, this.y, 1);
  }

  step() {
    const newCoords = randCoord();
    const newX = newCoords[0];
    const newY = newCoords[1];

    this.x += newX;
    this.y += newY;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);

  // Wally Walker Setup
  wally = new Walker(wallyConfig);
  wallyLabel = createDiv('');
  wallyLabel.style('color', 'rgb(255, 192, 203)');
  wallyLabel.style('font-family', 'monospace');
  wallyLabel.position(10, 25);

  // Wilbur Walker Setup
  wilbur = new Walker(wilburConfig);
  wilburLabel = createDiv('');
  wilburLabel.style('color', 'white');
  wilburLabel.style('font-family', 'monospace');
  wilburLabel.position(10, 10); 
};

function draw() {
  wally.draw();
  wilbur.draw();


  wally.step();
  wilbur.step();

  // Display Position Labels
  wilburLabel.html(`WILBUR: (${wilbur.x}, ${wilbur.y})`);
  wallyLabel.html(`WALLY : (${wally.x}, ${wally.y})`);
};
