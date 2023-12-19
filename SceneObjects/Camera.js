class Camera extends SceneObject {
  constructor(canvas, gl) {
    super();
    this.gl = gl;
    this.canvas = canvas;
    this.projectionMatrix = mat4.create();
  }

  init() {
    this.#initializeCamera();
  }

  #initializeCamera() {
    this.projectionMatrix = mat4.create();
    mat4.ortho(this.projectionMatrix,-this.canvas.clientWidth * 0.001, this.canvas.clientWidth * 0.001, -this.canvas.clientHeight * 0.001, this.canvas.clientHeight * 0.001, 0.1, 100);

    mat4.lookAt(this.modelMatrix, [0, 1, 2], [0, 0, 0], [0, 1, 0]);

    this.shear();
  }

  draw() {
    let projectionMatrixLocation = this.gl.getUniformLocation(currentShaderProgram.program, shaderInfo.uniforms.projectionMatrix);
    this.gl.uniformMatrix4fv(projectionMatrixLocation, this.gl.FALSE, this.projectionMatrix);
  }

  shear() {
    this.projectionMatrix[8] = -0.2;
    this.projectionMatrix[9] = -0.2;
    this.projectionMatrix[12] = -0.44;
    this.projectionMatrix[13] = -0.44;
    this.projectionMatrix[14] = -0.9;
  }

  unshear() {
    this.projectionMatrix[8] = 0;
    this.projectionMatrix[9] = 0;
    this.projectionMatrix[12] = 0;
    this.projectionMatrix[13] = 0;
    this.projectionMatrix[14] = 0;
  }
}
