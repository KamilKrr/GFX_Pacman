class SceneObject {
  constructor() {
    /* --------- initialize model matrix --------- */
    this.modelMatrix = mat4.create();
    this.scaleMatrixGlobal = mat4.create();
    this.scaleMatrixLocal = mat4.create();
  }

  rotate(angle, axis, global = false) {
    if (!global) {
      mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
    } else {
      const rotationMatrix = mat4.create();
      mat4.rotate(rotationMatrix, rotationMatrix, angle, axis);
      mat4.mul(this.modelMatrix, rotationMatrix, this.modelMatrix);
    }
  }

  scale(vector, global = false) {
    if (!global) {
      mat4.scale(this.scaleMatrixLocal, this.scaleMatrixLocal, vector);
    } else {
      mat4.scale(this.scaleMatrixGlobal, this.scaleMatrixGlobal, vector);
      /*
      const scaleMatrixHelper = mat4.create();
      mat4.scale(scaleMatrixHelper, scaleMatrixHelper, vector);
      mat4.mul(this.scaleMatrix, scaleMatrixHelper, this.scaleMatrix);
      */
    }
  }

  translate(vector, global = false) {
    if (!global) {
      mat4.translate(this.modelMatrix, this.modelMatrix, vector);
    } else {
      const transformMatrix = mat4.create();
      mat4.translate(transformMatrix, transformMatrix, vector);
      mat4.mul(this.modelMatrix, transformMatrix, this.modelMatrix);
    }
  }
}