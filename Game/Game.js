class Game {
  constructor(map, pacman, food) {
    this.map = map;
    this.pacman = pacman;
    this.food = food;
    this.then = 0;

    this.ghosts = [];
    this.score = 0;
    this.powerMode = false;
    this.lives = 3;
    this.gameLost = false;
  }

  addScore = (score) => {
    this.score += score;
    document.querySelector('.score').innerHTML = this.score;
  }

  addGhost(ghost) {
    this.ghosts.push(ghost);
  }

  #registerEventListeners() {
    this.keyDownHandler = (event) => {
      const callback = {
        "ArrowLeft": () => this.pacman.setDirection('left'),
        "ArrowRight": () => this.pacman.setDirection('right'),
        "ArrowUp": () => this.pacman.setDirection('up'),
        "ArrowDown": () => this.pacman.setDirection('down'),
        " ": () => this.pacman.jump(),
      }[event.key];
      callback?.();
    };

    window.addEventListener("keydown", this.keyDownHandler);
  }

  #deregisterEventListeners() {
    window.removeEventListener("keydown", this.keyDownHandler);
  }

  initGame() {
    this.map.createMap(this.food);
    let spawnPosition = this.map.getPacmanSpawnPosition();
    this.pacman.setPosition(spawnPosition[0], spawnPosition[1]);

    this.ghosts.forEach(g => {
      let spawnPosition = this.map.getPacmanSpawnPosition();
      g.setPosition(spawnPosition[0], spawnPosition[1]);
    });
    this.#registerEventListeners();
    this.#updateGhostsOverlay();
    this.#updateLivesOverlay();
  }

  endGame() {
    this.#deregisterEventListeners();
  }

  update(now, camera) {
    if(this.gameLost) return;
    let delta = now - this.then;
    delta *= 0.0005;
    this.then = now;

    this.pacman.update(delta, this.map, camera, this.addScore);

    this.ghosts.forEach(g => {
      g.update(delta, this.map, camera, this.pacman);
    });

    this.#testCollision();
  }

  #testCollision() {
    let distance = 0.18;
    this.ghosts.forEach(g => {
      if(
        g.isAlive &&
        Math.abs(g.xPos - this.pacman.xPos) < distance && Math.abs(g.yPos - this.pacman.yPos) < distance &&
        this.pacman.verticalPosition < 0.2
      ) {
        if(this.powerMode) {
          this.#eatGhost(g);
        }else {
          this.#looseLive(g);
        }
      }
    });
  }

  #updateGhostsOverlay() {
    document.querySelector('.ghosts').innerHTML = this.ghosts.filter((g) => g.isAlive).length;
  }

  #updateLivesOverlay() {
    document.querySelector('.hearts').innerHTML = this.lives;
  }

  #eatGhost(ghost) {
    ghost.eat();
    this.addScore(500);
    this.#updateGhostsOverlay();
  }

  #looseLive(ghost) {
    this.lives--;
    this.#updateLivesOverlay();
    ghost.eat();
    this.addScore(-1000);
    if(this.lives <= 0) {
      this.#looseGame();
    }
  }

  #looseGame() {
    this.gameLost = true;
  }

  render(camera) {
    this.map.draw(camera);

    this.pacman.head.draw(camera);
    this.pacman.body.draw(camera);

    this.ghosts.forEach(g => {
      g.body.draw(camera);
      g.eyes.draw(camera);
    })
  }

}