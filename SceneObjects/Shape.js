class Shape extends SceneObject {
    constructor(gl) {
        super();
        
        this.gl = gl;
        this.vertices = [];
        this.colors = [];
        this.normals = [];

        this.buffers = {
            /* --------- initialize buffers --------- */
            vertexBuffer: this.gl.createBuffer(),
            colorBuffer: this.gl.createBuffer(),
            normalBuffer: this.gl.createBuffer(),
        }

        this.isHidden = false;


        this.normalMatrix = mat3.create();


        this.Ka = 0.1;
        this.Kd = 1.0;
        this.Ks = 1.0;
        this.shininessVal = 12;
        this.ambientColor = vec3.fromValues(0.4, 0.4, 0.4);
        this.specularColor = vec3.fromValues(1.0, 1.0, 1.0);
    }

    initData(vertices, colors, normals) {
        /* --------- flatten & convert data to 32 bit float arrays --------- */
        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());
        this.normals = new Float32Array(normals.flat());

        /* --------- send data to buffers --------- */
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normals, this.gl.STATIC_DRAW);
    }

    draw(camera) {
        if(this.isHidden) return;
        /* --------- set up attribute arrays --------- */
        Shape.setupAttribute(this.gl, this.buffers.vertexBuffer, currentShaderProgram.attributes.vertexLocation);
        Shape.setupAttribute(this.gl, this.buffers.colorBuffer, currentShaderProgram.attributes.colorLocation);
        Shape.setupAttribute(this.gl, this.buffers.normalBuffer, currentShaderProgram.attributes.normalLocation, true);


        let kaLocation = this.gl.getUniformLocation(currentShaderProgram.program, shaderInfo.uniforms.Ka);
        let kdLocation = this.gl.getUniformLocation(currentShaderProgram.program, shaderInfo.uniforms.Kd);
        let ksLocation = this.gl.getUniformLocation(currentShaderProgram.program, shaderInfo.uniforms.Ks);
        let shininessLocation = this.gl.getUniformLocation(currentShaderProgram.program, shaderInfo.uniforms.shininessVal);
        this.gl.uniform1f(shininessLocation, this.shininessVal);
        this.gl.uniform1f(kaLocation, this.Ka);
        this.gl.uniform1f(kdLocation, this.Kd);
        this.gl.uniform1f(ksLocation, this.Ks);

        let ambientColorLocation = this.gl.getUniformLocation(currentShaderProgram.program, shaderInfo.uniforms.ambientColor);
        let specularColorLocation = this.gl.getUniformLocation(currentShaderProgram.program, shaderInfo.uniforms.specularColor);

        this.gl.uniform3f(ambientColorLocation, this.ambientColor[0], this.ambientColor[1], this.ambientColor[2]);
        this.gl.uniform3f(specularColorLocation, this.specularColor[0], this.specularColor[1], this.specularColor[2]);


        /* --------- combine view and model matrix into modelView matrix --------- */
        const modelViewMatrix = mat4.create();
        mat4.mul(modelViewMatrix, this.modelMatrix, this.scaleMatrixLocal);
        mat4.mul(modelViewMatrix, this.scaleMatrixGlobal, modelViewMatrix);
        mat4.mul(modelViewMatrix, camera.modelMatrix, modelViewMatrix);

        mat3.normalFromMat4(this.normalMatrix, modelViewMatrix);
        this.gl.uniformMatrix3fv(currentShaderProgram.uniforms.normalMatrix, this.gl.FALSE, this.normalMatrix);

        /* --------- send modelView matrix to GPU --------- */
        this.gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, this.gl.FALSE, modelViewMatrix);

        /* --------- draw the shape --------- */
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 4);
    }

    hide() {
        this.isHidden = true;
    }

    show() {
        this.isHidden = false;
    }

    static setupAttribute(gl, buffer, location, isNormal = false) {
        if (location === -1) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            isNormal ? 3 : 4, // number of elements for each attribute/vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // is data normalised?
            (isNormal ? 3 : 4) * Float32Array.BYTES_PER_ELEMENT, // size for one vertex
            0 // offset from begin of vertex to the attribute
        );

        // enable the attribute
        gl.enableVertexAttribArray(location);
    }
}
