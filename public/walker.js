let positionX;
let positionY;

let wallyX;
let wallyY;

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

class Walker {
  constructor({offsetX, offsetY}) {
    this.x = (width / 2) - offsetX;
    this.y = (height / 2) - offsetY;
  }

  drawWalker() {
    noStroke();
    fill(255);
    circle(positionX, positionY, 1);
  }
}

function setup() {
  createCanvas(900, 800);
  background(20);

  positionX = width / 2;
  positionY = height / 2;

  wallyX = (width / 2) - 250;
  wallyY = (height / 2) - 150;

  // Tracking Coords
  wilburLabel = createDiv('');
  wilburLabel.style('color', 'white');
  wilburLabel.style('font-family', 'monospace');
  wilburLabel.position(10, 10);

  wallyLabel = createDiv('');
  wallyLabel.style('color', 'rgb(255, 192, 203)');
  wallyLabel.style('font-family', 'monospace');
  wallyLabel.position(10, 25);
};

function draw() {
  // getting a direction to move the dot
  const newCoords = randCoord();
  const newX = newCoords[0];
  const newY = newCoords[1];

  const wallyNewCoords = randCoord();
  const newWallyX = wallyNewCoords[0];
  const newWallyY = wallyNewCoords[1];

  noStroke();
  fill(255);
  circle(positionX, positionY, 1);

  fill(255, 192, 203);
  circle(wallyX, wallyY, 1);


  // A (-1,-1) -- 
  // B (+1,-1) --
  // C (+1,-1) --
  // D (+1,+1) --

  // Setting new dot direction for one frame
  positionX += newX;
  positionY += newY;
  wallyX += newWallyX;
  wallyY += newWallyY;

  wilburLabel.html(`WILBUR: (${positionX}, ${positionY})`);
  wallyLabel.html(`WALLY: (${wallyX}, ${wallyY})`);
};
