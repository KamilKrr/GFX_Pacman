class Camera extends SceneObject {
  constructor(canvas) {
    super();

    this.projectionMatrix = mat4.create();

    this.#initializeCamera(canvas);
  }

  #initializeCamera(canvas) {
    mat4.perspective(this.projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    mat4.lookAt(this.modelMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);
  }
}