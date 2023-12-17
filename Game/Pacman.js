class Pacman {
  constructor(head, body) {
    this.head = head;
    this.body = body;
    this.currentDirection = 'right';
    this.nextDirection = 'right';
    this.currentRotation = 90;
    this.mouthRotation = 45;
    this.isOpeningMouth = true;
  }

  setDirection(direction) {
    this.nextDirection = direction;
  }

  update(delta, map) {
    this.#move(delta, map);
    this.#orient(delta);
    this.#animate(delta);
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
  #move(delta, map) {
    let current = this.#getNextField(this.currentDirection);
    let next = this.#getNextField(this.nextDirection);

    if(this.#isAtCenter() || this.#isOppositeDirection(current, next)){
      if(!this.hasCollidedWithWall(this.xPos + next.x * delta, this.yPos + next.y * delta, map, this.nextDirection)){
        this.currentDirection = this.nextDirection;
        this.#translate(next.x * delta, next.y * delta, this.nextDirection);
        return;
      }
    }
    if(this.hasCollidedWithWall(this.xPos + current.x * delta, this.yPos + current.y * delta, map, this.currentDirection)) return;
    this.#translate(current.x * delta, current.y * delta);
  }

  #isOppositeDirection(current, next) {
    return current.x === -next.x || current.y === -next.y;
  }

  #isAtCenter() {
    return (this.xPos + 0.005) % 0.2 <= 0.01 && (this.yPos + 0.005) % 0.2 <= 0.01;
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

  #setNewTarget() {

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
    this.head.modelMatrix = mat4.create();
    this.body.modelMatrix = mat4.create();

    this.xPos = x * 0.2;
    this.yPos = y * 0.2;

    this.head.translate([this.xPos, 0.1, this.yPos]);
    this.body.translate([this.xPos, 0.1, this.yPos]);
  }

  #translate(x, y) {
    this.xPos += x;
    this.yPos += y;
    this.head.translate([x, 0, y], true);
    this.body.translate([x, 0, y], true);
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

}