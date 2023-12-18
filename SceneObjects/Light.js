class Light extends SceneObject {
  constructor(scene) {
    super();
  }

  draw(camera, gl) {
    const lightViewMatrix = mat4.create();
    mat4.mul(lightViewMatrix, this.modelMatrix, camera.projectionMatrix);

    const lightPosition = vec4.create();
    vec4.set(lightPosition, lightViewMatrix[12], lightViewMatrix[13], lightViewMatrix[14], 1.0);

    gl.uniform4fv(currentShaderProgram.uniforms.lightPosition, lightPosition);
  }
}