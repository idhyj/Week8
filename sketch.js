let backgroundImg, stick, buttonStart, buttonRestart, ghost1, ghost2, sound, successSound, pingSound;
let score = 0;
let gameStarted = false;
let ghosts = [];
let showSuccessMessage = false;
let restartButtonX, restartButtonY;

function preload() {
  backgroundImg = loadImage('background.svg');
  stick = loadImage('stick.svg');
  buttonStart = loadImage('buttonStart.svg');
  buttonRestart = loadImage('buttonRestart.svg');
  ghost1 = loadImage('ghost1.svg');
  ghost2 = loadImage('ghost2.svg');
  sound = loadSound('sound.mp3');
  successSound = loadSound('success.mp3');
  pingSound = loadSound('ping.mp3'); 
}

function setup() {
  createCanvas(1270, 720);
  sound.loop();
  textAlign(RIGHT);
  textFont('Helvetica Neue');
}

function draw() {
  background(backgroundImg);

  if (!gameStarted) {
    if (showSuccessMessage) {
      image(buttonRestart, width / 2 - buttonRestart.width / 2, height / 2 - buttonRestart.height / 2);
    } else {
      image(buttonStart, width / 2 - buttonStart.width / 2, height / 2 - buttonStart.height / 2);
    }
  }

  // Draw Ghosts
  if (gameStarted) {
    for (let ghost of ghosts) {
      ghost.move();
      ghost.show();
    }
  }

  // Draw Stick on top of everything
  image(stick, mouseX - 60, mouseY - 60);

  if (gameStarted) {
    textAlign(RIGHT, BOTTOM);
    fill('#FF961C');
    textSize(48);
    text(`Score: ${score}`, width - 50, height - 10); // Adjust position for score to prevent clipping

    fill('#ABABAB');
    textSize(24);
    textAlign(LEFT, BOTTOM);
    text('Freely move your mouse :)', 10, height - 10);

    if (score >= 10 && !showSuccessMessage) {
      successSound.play();
      showSuccessMessage = true;
      setTimeout(() => {
        gameStarted = false;
        restartButtonX = width / 2 - buttonRestart.width / 2;
        restartButtonY = height / 2 - buttonRestart.height / 2;
      }, 2000);
    }

    if (showSuccessMessage) {
      fill('#29EF18');
      textSize(160);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text('Success!', width / 2, height / 2);
    }
  }
}

function mousePressed() {
  if (!gameStarted && !showSuccessMessage && mouseX > width / 2 - buttonStart.width / 2 && mouseX < width / 2 + buttonStart.width / 2 && mouseY > height / 2 - buttonStart.height / 2 && mouseY < height / 2 + buttonStart.height / 2) {
    startGame();
    return;
  }

  if (showSuccessMessage && mouseX > restartButtonX && mouseX < restartButtonX + buttonRestart.width && mouseY > restartButtonY && mouseY < restartButtonY + buttonRestart.height) {
    resetGame();
    showSuccessMessage = false;
    return;
  }


  if (gameStarted) {  // 게임이 시작된 상태에서만 유령 클릭 로직을 실행
    for (let i = ghosts.length - 1; i >= 0; i--) {
      if (ghosts[i].clicked(mouseX, mouseY)) {
        pingSound.play();
        score++;
        ghosts.splice(i, 1);
        ghosts.push(new Ghost());
      }
    }
  }
}

function startGame() {
  gameStarted = true;
  score = 0;
  ghosts = [];
  for (let i = 0; i < 3; i++) {
    ghosts.push(new Ghost());
  }
}

function resetGame() {
  gameStarted = true;
  score = 0;
  showSuccessMessage = false;
  ghosts = [];
  for (let i = 0; i < 3; i++) {
    ghosts.push(new Ghost());
  }
  sound.stop();
  sound.loop();
}

class Ghost {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.sizeW = 19.7003 * 16;  
    this.sizeH = 21.6001 * 16;
    this.speedX = random(-2, 2);
    this.speedY = random(-2, 2);
    this.img = random([ghost1, ghost2]);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > width || this.x < 0) {
      this.speedX = -this.speedX;
    }

    if (this.y > height || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }

  show() {
    image(this.img, this.x, this.y, this.sizeW, this.sizeH);
  }

  clicked(px, py) {
    let d = dist(px, py, this.x + this.sizeW / 2, this.y + this.sizeH / 2);
    if (d < this.sizeW / 2) {
      return true;
    }
    return false;
  }
}
