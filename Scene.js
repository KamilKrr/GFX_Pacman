class Scene {
  constructor() {
    this.camera = null;
    this.light = null;
    this.then = 0;
    this.gl = null;
  }
  
  setCamera(camera) {
    this.camera = camera;
  }

  setGame(game) {
    this.game = game;
  }

  setLight(light) {
    this.light = light;
  }
  
  setGlContext(gl) {
    this.gl = gl;
  }
  
  addShape(shape) {
    this.shapes.push(shape);
  }

  addSupportShape(shape) {
    this.supportShapes.push(shape);
  }

  startGame() {
    this.game.initGame();
  }

  update(now) {
    this.game.update(now, camera);
  }
  
  render(now) {
    /* --------- calculate time per frame in seconds --------- */
    let delta = now - this.then;
    delta *= 0.001;
    this.then = now;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.camera.draw();
    this.light.draw(camera, this.gl);

    this.game.render(this.camera, this.light, this.gl);
  }
  
}