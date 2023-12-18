class Camera extends SceneObject {
  constructor(canvas) {
    super();

    this.projectionMatrix = mat4.create();

    this.#initializeCamera(canvas);
  }

  #initializeCamera(canvas) {
    this.projectionMatrix = mat4.create();
    mat4.ortho(this.projectionMatrix,-canvas.clientWidth * 0.001, canvas.clientWidth * 0.001, -canvas.clientHeight * 0.001, canvas.clientHeight * 0.001, 0.1, 100);

    mat4.lookAt(this.modelMatrix, [0, 1, 2], [0, 0, 0], [0, 1, 0]);

    this.shear();
  }

  shear() {
    const shearMatrix = mat4.create();

    shearMatrix[8] = -0.3;
    shearMatrix[9] = -0.3;

    mat4.mul(this.modelMatrix, this.modelMatrix, shearMatrix);
  }

  unshear() {
    const shearMatrix = mat4.create();

    shearMatrix[8] = 0.3;
    shearMatrix[9] = 0.3;

    mat4.mul(this.modelMatrix, this.modelMatrix, shearMatrix);
  }
}
