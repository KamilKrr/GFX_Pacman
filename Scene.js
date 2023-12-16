class Scene {
  constructor() {
    this.camera = null;
    this.light = null;
    this.shapes = [];
    this.supportShapes = []; // Shapes used for visual support, cannot be selected
    this.then = 0;
    this.gl = null;
  }
  
  setCamera(camera) {
    this.camera = camera;
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
  
  render(now) {
    /* --------- calculate time per frame in seconds --------- */
    let delta = now - this.then;
    delta *= 0.001;
    this.then = now;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.uniform4fv(currentShaderProgram.uniforms.lightPosition, this.light.getTranslation(this.camera));

    this.shapes.forEach(shape => {
      shape.draw(this.camera);
    });

    this.supportShapes.forEach(shape => {
      shape.draw(this.camera);
    });
  }
  
}