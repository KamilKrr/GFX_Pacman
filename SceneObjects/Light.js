class Light extends SceneObject {
  constructor(scene) {
    super();
  }
  
  getTranslation(camera) {

    const lightViewMatrix = mat4.create();
    mat4.mul(lightViewMatrix, this.modelMatrix, lightViewMatrix);
    
    const lightPosition = vec4.create();
    mat4.getTranslation(lightPosition, lightViewMatrix);
    lightPosition[3] = 1.0;
    
    return lightPosition;
    
  }
}