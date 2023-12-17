class Camera extends SceneObject {
  constructor(canvas) {
    super();

    this.projectionMatrix = mat4.create();

    this.#initializeCamera(canvas);
  }

  #initializeCamera(canvas) {
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;

    mat4.ortho(this.projectionMatrix,-canvas.clientWidth * 0.001, canvas.clientWidth * 0.001, -canvas.clientHeight * 0.001, canvas.clientHeight * 0.001, 0.1, 100);

    mat4.lookAt(this.modelMatrix, [0, 1, 2], [0, 0, 0], [0, 1, 0]);

    const shearMatrix = mat4.create();
    //mat4.translate(shearMatrix, shearMatrix, [1.1, 2.2, 0]);
    //console.log(shearMatrix);
    shearMatrix[8] = -0.3;
    shearMatrix[9] = -0.3;

    mat4.mul(this.modelMatrix, this.modelMatrix, shearMatrix);

  }
}
