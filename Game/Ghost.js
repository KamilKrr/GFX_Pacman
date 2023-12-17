class Ghost {
  constructor(body, eyes) {
    this.body = body;
    this.eyes = eyes;

    this.currentDirection = 'right';
    this.nextDirection = 'right';
    this.currentRotation = 90;
    this.directions = ['up', 'right', 'left', 'down'];
  }

  update(delta, gameMap, camera) {
    this.#move(delta, gameMap.map, camera);
    this.#orient(delta);
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
    delta *= 0.8; //ghosts are slower
    let current = this.#getNextField(this.currentDirection);
    let next = this.#getNextField(this.nextDirection);

    if(this.#isAtCenter() || this.#isOppositeDirection(current, next)){

      if(!this.hasCollidedWithWall(this.xPos + next.x * delta, this.yPos + next.y * delta, map, this.nextDirection)){
        this.currentDirection = this.nextDirection;
        this.#translate(next.x * delta, next.y * delta, camera);
        return;
      }
    }
    if(this.hasCollidedWithWall(this.xPos + current.x * delta, this.yPos + current.y * delta, map, this.currentDirection)){
      this.#setNewDirection();
      return;
    };
    this.#translate(current.x * delta, current.y * delta, camera);
  }

  #setNewDirection() {
    this.nextDirection = this.directions[Math.floor(Math.random() * this.directions.length)];
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
    this.body.modelMatrix = mat4.create();
    this.eyes.modelMatrix = mat4.create();

    this.xPos = x * 0.2;
    this.yPos = y * 0.2;

    this.body.translate([this.xPos, 0.1, this.yPos]);
    this.eyes.translate([this.xPos, 0.1, this.yPos]);
  }

  #translate(x, y, camera) {
    this.xPos += x;
    this.yPos += y;
    this.body.translate([x, 0, y], true);
    this.eyes.translate([x, 0, y], true);
  }

  #rotate(angle) {
    this.currentRotation += angle;
    this.currentRotation = ((this.currentRotation % 360) + 360) % 360;

    this.body.translate([-this.xPos, 0, -this.yPos], true);
    this.eyes.translate([-this.xPos, 0, -this.yPos], true);
    this.body.rotate(angle * (Math.PI/180), [0, 1, 0], true);
    this.eyes.rotate(angle * (Math.PI/180), [0, 1, 0], true);
    this.body.translate([this.xPos, 0, this.yPos], true);
    this.eyes.translate([this.xPos, 0, this.yPos], true);
  }

  hide() {
    this.body.hide();
    this.eyes.hide(); 
  }

}