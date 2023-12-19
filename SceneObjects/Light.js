class Light extends SceneObject {
  constructor(scene) {
    super();
  }

  draw(camera, gl) {
    const lightPosition = vec4.fromValues(3, 4, 3, 1);

    //vec4.transformMat4(lightPosition, lightPosition, this.modelMatrix);
    vec4.transformMat4(lightPosition, lightPosition, camera.modelMatrix);

    gl.uniform4fv(currentShaderProgram.uniforms.lightPosition, lightPosition);
  }

}