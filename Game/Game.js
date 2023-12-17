class Game {
  constructor(map, pacman) {
    this.map = map;
    this.pacman = pacman;
    this.then = 0;
  }

  #registerEventListeners() {
    this.keyDownHandler = (event) => {
      const callback = {
        "ArrowLeft": () => this.pacman.setDirection('left'),
        "ArrowRight": () => this.pacman.setDirection('right'),
        "ArrowUp": () => this.pacman.setDirection('up'),
        "ArrowDown": () => this.pacman.setDirection('down'),
      }[event.key];
      callback?.();
    };

    window.addEventListener("keydown", this.keyDownHandler);
  }

  #deregisterEventListeners() {
    window.removeEventListener("keydown", this.keyDownHandler);
  }

  initGame() {
    this.map.createMap();
    let spawnPosition = this.map.getPacmanSpawnPosition();
    this.pacman.setPosition(spawnPosition[0], spawnPosition[1]);
    this.#registerEventListeners();
  }

  endGame() {
    this.#deregisterEventListeners();
  }

  update(now) {
    let delta = now - this.then;
    delta *= 0.0005;
    this.then = now;

    this.pacman.update(delta, this.map.map);
  }

  render(camera) {
    this.map.draw(camera);

    this.pacman.head.draw(camera);
    this.pacman.body.draw(camera);
  }

}