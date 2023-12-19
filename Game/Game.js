class Game {
  constructor(map, pacman, food, powerFood) {
    this.map = map;
    this.pacman = pacman;
    this.food = food;
    this.powerFood = powerFood;
    this.then = 0;

    this.ghosts = [];
    this.score = 0;
    this.powerModeRemainingSeconds = 0;
    this.lives = 3;
    this.gameFrozen = false;
    this.size = 2;

    this.#registerEventListeners();
  }

  addScore = (score) => {
    this.score += score;
    [... document.querySelectorAll('.score')].map(i => i.innerHTML = this.score);
  }

  enablePowerMode = () => {
    this.powerModeRemainingSeconds += 10;
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

    const handlePowerModeCountdown = () => {
      if (this.powerModeRemainingSeconds > 0) {
        this.powerModeRemainingSeconds--;
      }
    };

    this.powerModeIntervalId = setInterval(handlePowerModeCountdown, 1000);

    document.querySelector(".button").addEventListener("click", () => {
      this.initGame();
      document.querySelector(".popover").hidePopover();
    })

    document.querySelector(".slider").addEventListener("input", e => {
      let text = "small";
      let val = parseInt(e.target.value);

      if(val === 1) {
        text = "medium";
      }else if(val === 2){
        text = "large";
      }

      document.querySelector(".size").innerHTML = text;

      this.size = 2 + val;
    });
  }

  #deregisterEventListeners() {
    window.removeEventListener("keydown", this.keyDownHandler);
  }

  initGame() {
    this.then = 0;
    this.score = 0;
    this.powerModeRemainingSeconds = 0;
    this.lives = 3;

    this.map.createMap(this.size, this.food, this.powerFood);
    let spawnPosition = this.map.getPacmanSpawnPosition();
    this.pacman.setPosition(spawnPosition[0], spawnPosition[1]);
    this.ghosts.forEach(g => {
      let spawnPosition = this.map.getPacmanSpawnPosition();
      g.setPosition(spawnPosition[0], spawnPosition[1]);
    });
    let i = 0;
    this.ghosts.forEach(g => {
      if(i < 3 + (this.size - 2) * 3) {
        g.show();
        g.isAlive = true;
      }else {
        g.hide();
        g.isAlive = false;
      }
      i++;
    });
    this.#updateGhostsOverlay();
    this.#updateLivesOverlay();
    this.gameFrozen = false;
  }

  #showPopup(message) {
    document.querySelector(".message").innerHTML = message;
    document.querySelector(".popover").showPopover();
  }

  update(now, camera) {
    if(this.gameFrozen) return;
    if(this.then === 0) this.then = now;
    let delta = now - this.then;
    delta *= 0.0005;
    this.then = now;

    this.pacman.update(delta, this.map, camera, this.addScore, this.enablePowerMode, this.winGame);

    this.ghosts.forEach(g => {
      g.update(delta, this.map, camera, this.pacman);
    });

    this.#testCollision();
    this.#updatePowerModeOverlay();
    this.#updateGhostsOverlay();
  }

  #testCollision() {
    let distance = 0.18;
    this.ghosts.forEach(g => {
      if(
        g.isAlive &&
        Math.abs(g.xPos - this.pacman.xPos) < distance && Math.abs(g.yPos - this.pacman.yPos) < distance &&
        this.pacman.verticalPosition < 0.2
      ) {
        if(this.powerModeRemainingSeconds > 0) {
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

  #updatePowerModeOverlay() {
    if(this.powerModeRemainingSeconds > 0) {
      document.querySelector(".powermode").innerHTML = this.powerModeRemainingSeconds + "s";
      document.querySelector(".powerstat").classList.remove("hidden");
    }else {
      document.querySelector(".powermode").innerHTML = "";
      document.querySelector(".powerstat").classList.add("hidden");
    }
  }

  #eatGhost(ghost) {
    ghost.eat();
    let spawnPosition = this.map.getPacmanSpawnPosition();
    ghost.setPosition(spawnPosition[0], spawnPosition[1]);

    this.addScore(500);
    this.#updateGhostsOverlay();
  }

  #looseLive(ghost) {
    this.lives--;
    this.#updateLivesOverlay();
    ghost.eat();
    this.#updateGhostsOverlay();
    this.addScore(-1000);
    if(this.lives <= 0) {
      this.#looseGame();
    }
  }

  #looseGame() {
    this.gameFrozen = true;
    this.#showPopup("Game over");
  }

  winGame = () => {
    this.gameFrozen = true;
    this.#showPopup("You Win");
  }

  render(camera, light, gl) {
    this.map.draw(camera);

    this.pacman.head.draw(camera);
    this.pacman.body.draw(camera);


    //shaderPrograms.shadow.enable();
    this.ghosts.forEach(g => {
      g.body.draw(camera);
      g.eyes.draw(camera);
    })

    //gl.clear(gl.DEPTH_BUFFER_BIT);
    shaderPrograms.shadow.enable();
    camera.draw();
    light.draw(camera, gl);
    this.pacman.head.draw(camera);
    this.pacman.body.draw(camera);

    shaderPrograms.phongSpecular.enable();
  }

}