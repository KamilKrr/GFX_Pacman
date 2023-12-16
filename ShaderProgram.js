class ShaderProgram {
  
  gl = null;
  program = null;
  constructor(gl, vertexId, fragmentId, shaderInfo, camera) {
    this.gl = gl;
    
    this.program = createShaderProgram(this.gl, vertexId, fragmentId);
    
    this.gl.useProgram(this.program);

    this.attributes = {};
    this.uniforms = {};
    
    Object.entries(shaderInfo.attributes).forEach(([key, value]) => {
      this.attributes[key] = this.gl.getAttribLocation(this.program, value);
    });
    
    Object.entries(shaderInfo.uniforms).forEach(([key, value]) => {
      this.uniforms[key] = this.gl.getUniformLocation(this.program, value);
    });
    
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, this.gl.FALSE, camera.projectionMatrix);
  }
  
  enable() {
    this.gl.useProgram(this.program);
    currentShaderProgram = this;
  }
}