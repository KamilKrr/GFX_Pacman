class Pacman {
  constructor(head, body) {
    this.head = head;
    this.body = body;
    this.currentDirection = 'right';
    this.nextDirection = 'right';
    this.currentRotation = 90;
    this.mouthRotation = 45;
    this.isOpeningMouth = true;

    this.verticalPosition = 0;
    this.gravity = 30;
    this.jumpForce = 4;
    this.isJumping = false;
    this.isDoubleJump = false;
    this.currentJumpForce = 0;
    this.wasInAir = false;

    this.collectedFood = 0;
    this.xPos = 0;
    this.yPos = 0;
  }

  setDirection(direction) {
    this.nextDirection = direction;
  }

  update(delta, gameMap, camera, addScore, enablePowerMode, winGame) {
    if(this.verticalPosition <= 0.05) {
      if(this.wasInAir) {
        this.isJumping = false;
        this.isDoubleJump = false;
        this.wasInAir = false;
        this.currentJumpForce = 0;
      }
    }else{
      this.wasInAir = true;
      this.currentJumpForce -= this.gravity * delta;
    }

    this.#move(delta, gameMap.map, camera);
    this.#orient(delta);
    this.#animateJump(delta);
    this.#animate(delta);
    this.#eatFood(gameMap.foodMap, gameMap.powerFoodMap, addScore, enablePowerMode, winGame);
  }

  #eatFood(foodMap, powerFoodMap, addScore, enablePowerMode, winGame) {
    if(this.#isAtCenter(0.05)) {
      let x = Math.floor((this.xPos + 0.05) / 0.2);
      let y = Math.floor((this.yPos + 0.05) / 0.2);
      if(this.verticalPosition < 0.2 && !foodMap[y][x].isHidden){
        if(powerFoodMap[y][x] === 1){
          enablePowerMode();
        }
        this.collectedFood++;
        foodMap[y][x].hide();
        addScore(10);
      }
    }
    this.#updateScore(foodMap, winGame);
  }

  jump() {
    if(this.isJumping){
      if(this.isDoubleJump) return;
      this.isDoubleJump = true;
    }

    this.isJumping = true;
    this.currentJumpForce = this.jumpForce;
  }

  #animateJump(delta) {
    if(this.isJumping) {
      this.verticalPosition += this.currentJumpForce * delta;

      this.head.translate([0, this.currentJumpForce * delta, 0], true);
      this.body.translate([0, this.currentJumpForce * delta, 0], true);
    }
  }


  #animate(delta) {
    if(this.mouthRotation > 70) {
      this.isOpeningMouth = false;
    }else if(this.mouthRotation <= 5) {
      this.isOpeningMouth = true;
    }

    let rotation = -600 * delta;
    if(this.isOpeningMouth) {
      rotation *= -1;
    }

    this.mouthRotation += rotation;
    this.head.rotate(rotation * (Math.PI/180), [0, 0, 1]);
  }

  #orient(delta) {
    let targetRotation = this.#getTargetRotationAngle();

    if(Math.abs(this.currentRotation - targetRotation) < 3) return;

    let clockwiseRotation = (targetRotation - this.currentRotation + 360) % 360;
    let counterclockwiseRotation = (this.currentRotation - targetRotation + 360) % 360;

    if (clockwiseRotation < counterclockwiseRotation) {
      this.#rotate(1000 * delta);
    }else {
      this.#rotate(-1000 * delta);
    }
  }

  #getTargetRotationAngle() {
    switch (this.currentDirection) {
      case 'up':
        return 180;
      case 'down':
        return 0;
      case 'left':
        return 270;
      case 'right':
        return 90;
      default:
        return 0;
    }
  }
  #move(delta, map, camera) {
    let current = this.#getNextField(this.currentDirection);
    let next = this.#getNextField(this.nextDirection);

    if(this.#isAtCenter() || this.#isOppositeDirection(current, next)){
      if(!this.hasCollidedWithWall(this.xPos + next.x * delta, this.yPos + next.y * delta, map, this.nextDirection)){
        this.currentDirection = this.nextDirection;
        this.#translate(next.x * delta, next.y * delta, camera);
        return;
      }
    }
    if(this.hasCollidedWithWall(this.xPos + current.x * delta, this.yPos + current.y * delta, map, this.currentDirection)) return;
    this.#translate(current.x * delta, current.y * delta, camera);
  }

  #isOppositeDirection(current, next) {
    return current.x === -next.x || current.y === -next.y;
  }

  #isAtCenter(delta = 0.005) {
    return (this.xPos + delta) % 0.2 <= delta*2 && (this.yPos + delta) % 0.2 <= delta*2;
  }

  #getNextField(direction) {
    let x = 0;
    let y = 0;

    switch (direction) {
      case 'up':
        y = -1;
        break;
      case 'down':
        y = 1;
        break;
      case 'left':
        x = -1;
        break;
      case 'right':
        x = 1;
        break;
      default:
        break;
    }

    return {
      x: x,
      y: y
    }
  }

  hasCollidedWithWall(x, y, map, direction) {

    let xC = 0;
    let yC = 0;
    if(direction === 'right'){
      xC = Math.ceil(x / 0.2);
      yC = Math.floor((y + 0.1) / 0.2);
    }else if(direction === 'down'){
      yC = Math.ceil(y / 0.2);
      xC = Math.floor((x + 0.1) / 0.2);
    } else if(direction === 'up'){
      yC = Math.floor(y / 0.2);
      xC = Math.floor((x + 0.1) / 0.2);
    } else if(direction === 'left'){
      yC = Math.floor((y + 0.1) / 0.2);
      xC = Math.floor(x / 0.2);
    }
    return map[yC][xC];
  }

  setPosition(x, y) {
    this.currentRotation = 90;
    this.collectedFood = 0;
    camera.translate([this.xPos, 0, this.yPos], false);
    this.head.modelMatrix = mat4.create();
    this.body.modelMatrix = mat4.create();

    this.xPos = x * 0.2;
    this.yPos = y * 0.2;

    this.head.translate([this.xPos, 0.1, this.yPos]);
    this.body.translate([this.xPos, 0.1, this.yPos]);
    camera.translate([-this.xPos, 0, -this.yPos], false);
  }

  #translate(x, y, camera) {
    this.xPos += x;
    this.yPos += y;
    this.head.translate([x, 0, y], true);
    this.body.translate([x, 0, y], true);
    camera.translate([-x, 0, -y], false);
  }

  #rotate(angle) {
    this.currentRotation += angle;
    this.currentRotation = ((this.currentRotation % 360) + 360) % 360;

    this.head.translate([-this.xPos, 0, -this.yPos], true);
    this.body.translate([-this.xPos, 0, -this.yPos], true);
    this.head.rotate(angle * (Math.PI/180), [0, 1, 0], true);
    this.body.rotate(angle * (Math.PI/180), [0, 1, 0], true);
    this.head.translate([this.xPos, 0, this.yPos], true);
    this.body.translate([this.xPos, 0, this.yPos], true);
  }

  #updateScore(foodMap, winGame) {
    let maxPoints = 0;
    foodMap.forEach(r => {
      r.forEach(v => {
        if(v) maxPoints++;
      })
    })
    document.querySelector(".points").innerHTML = this.collectedFood + "/" + maxPoints;
    if(maxPoints === this.collectedFood) {
      winGame();
    }
  }

}