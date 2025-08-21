let foodPositions = new Map();
let wally, wilbur, willow;
let wallyLabel, wilburLabel, willowLabel;
let trailLayer;
let energyExpenseRate = 1;
const foodSize = 5;

const wallyConfig = {
  offsetX: 50,
  offsetY: 150,
  baseHunger: 50,
  colorRGB: {
    r: 255,
    g: 192,
    b: 203,
  }
}

const wilburConfig = {
  offsetX: 0,
  offsetY: -100,
  baseHunger: 50,
  colorRGB: {
    r: 255,
    g: 255,
    b: 255,
  }
}

function isFoodLocation(x, y) {
  return foodPositions.has(`${x},${y}`);
};

function removeFood(x, y) {
  return foodPositions.delete(`${x},${y}`);
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function mouseClicked() {
  foodLayer.noStroke();
  foodLayer.fill('khaki');
  foodLayer.circle(mouseX, mouseY, foodSize);
  foodPositions.set(`${mouseX},${mouseY}`, true);
}

function touchStarted() {
  foodLayer.noStroke();
  foodLayer.fill('khaki');
  foodLayer.circle(mouseX, mouseY, foodSize);
  foodPositions.set(`${mouseX},${mouseY}`, true);
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
    this.x = (width / 2);
    this.y = (height / 2);
    this.foodSize = foodSize;
  }

  dropsFood(rate = 1500) {
    return !!(getRandomInt(1, rate) === getRandomInt(1, rate));
  }

  draw() {
    fill('aquamarine');
    circle(this.x, (this.y + 2), 5);
    circle(this.x, this.y, 5);
  }

  step() {
    const [dx, dy] = randCoord();

    if(this.dropsFood()) {
      if (!window.foodLayer) {
        window.foodLayer = createGraphics(width, height);
        window.foodLayer.clear();
      }
      foodLayer.noStroke();
      foodLayer.fill('khaki');
      foodLayer.circle(this.x, this.y, foodSize);
      foodPositions.set(`${this.x},${this.y}`, true);

      console.log("New Food Positions:", foodPositions);
    };

    this.x += dx;
    this.y += dy;
  }
}


class Walker {
  constructor(config) {
    this.isAlive = true;
    this.x = (width / 2) - config.offsetX;
    this.y = (height / 2) - config.offsetY;
    this.hunger = config.baseHunger ?? 50;
    this.energy = 500; // amount of steps before expending energyExpenseRate of hunger
    this.colorRGB = config.colorRGB;

    // Independent Layer (can be cleared upon death)
    this.layer = createGraphics(width, height);
    this.layer.clear(); 
  };

  drawTrail() {
    this.layer.noStroke();
    this.layer.fill(this.colorRGB.r, this.colorRGB.g, this.colorRGB.b);
    this.layer.circle(this.x, this.y, 1);
  }

  draw(target = this._main()) {
    target.noStroke();
    target.fill(this.colorRGB.r, this.colorRGB.g, this.colorRGB.b);
    target.circle(this.x, this.y, 1);
  }

  die() {
    this.isAlive = false;
    this.clearTrail();
  }

  eat() {
    removeFood(this.x, this.y);
    this.hunger += foodSize + 10;
  }

  clearTrail() {
    this.layer.clear(); 
  }

  handleEnergyAndHunger() {
    if(this.energy > 0) {
      this.energy--;
    } else if (this.energy === 0) {
      this.hunger -= energyExpenseRate; 
      this.energy = 500;
    }
    if(this.hunger <= 0) {
      this.die();
      return;
    }
  }

  step() {
    if (!this.isAlive) return;

    if(isFoodLocation(this.x, this.y)) {
      this.eat();
    }
    const [dx, dy] = randCoord();
    this.handleEnergyAndHunger();
    this.x += dx;
    this.y += dy;

    this.drawTrail();
  }

  _main() { return this.__dummy || (this.__dummy = {  // fallback to main canvas if needed
    noStroke: () => noStroke(),
    fill: (...args) => fill(...args),
    circle: (...args) => circle(...args)
  });}
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);

  window.foodLayer = createGraphics(width, height);
  foodLayer.clear();

  // Persistent layer for Walker trails
  trailLayer = createGraphics(width, height);
  trailLayer.background(20);

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

  // Willow Setup
  willow = new FoodDropper();
  willowLabel = createDiv('');
  willowLabel.style('color', 'aquamarine');
  willowLabel.style('font-family', 'monospace');
  willowLabel.position(10, 40); 
};

function draw() {
  background(20);

  wally.step();
  wilbur.step();

  image(wally.layer, 0, 0);
  image(wilbur.layer, 0, 0);
  if (window.foodLayer) image(foodLayer, 0, 0);

  // Update + draw non-trail objects onto main canvas
  // 1. Willow the FoodDropper
  willow.step();
  willow.draw();

  // HUD
  if (wally) wallyLabel.html(`WALLY : (${wally.x}, ${wally.y}) - Hunger: ${wally.hunger}`);
  if (wilbur) wilburLabel.html(`WILBUR: (${wilbur.x}, ${wilbur.y}) - Hunger: ${wilbur.hunger}`);
  willowLabel.html(`WILLOW: (${willow.x}, ${willow.y})`);
};


// Keep layers in sync on resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Rebuild each walker layer at new size and preserve old content
  const rebuildLayer = (walker) => {
    if (!walker) return;
    const old = walker.layer;
    walker.layer = createGraphics(width, height);
    walker.layer.clear();
    walker.layer.image(old, 0, 0);
  };
  rebuildLayer(wally);
  rebuildLayer(wilbur);

  // Rebuild food layer 
  if (window.foodLayer) {
    const oldFood = foodLayer;
    window.foodLayer = createGraphics(width, height);
    foodLayer.clear();
    foodLayer.image(oldFood, 0, 0);
  }
};
