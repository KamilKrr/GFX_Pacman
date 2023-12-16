class WavefrontObjImporter {
  static importShape(file, color, gl) {
    let parsed = this.#parseFile(file);
    let computed = this.#computeVertices(parsed);
    let vertices = computed.vertices;
    let normals = computed.normals;
    let colors = [];

    let r = 0.0;
    /*
    vertices.forEach(() => {
      r += 0.00002;
      r %= 1.0;
      colors.push([r + color[0], r + color[1], r + color[2], 1.0]);
    });
    */
    vertices.forEach(() => {
      colors.push([color[0], color[1], color[2], 1.0]);
    });
    
    let shape = new Shape(gl);

    shape.initData(vertices, colors, normals);
    return shape;
  }

  static #computeVertices(parsedData) {
    let vertices = [];
    let normals = [];

    parsedData.faces.forEach(face => {
      for(let i = 0; i < 3; i++) {
        let vertexIndex = face.vertices[i];
        let normalIndex = face.normals[i];


        vertices.push(parsedData.vertices[vertexIndex - 1]);

        //calculate normal
        //search neighboring faces and average their normals
        let neighboringNormals = [];
        parsedData.faces.forEach(_face => {
          if(_face.vertices.includes(vertexIndex)){
            let _normalIndex = _face.normals[0];
            neighboringNormals.push(parsedData.normals[_normalIndex - 1]);
          }
        });

        let sumNormals = [0, 0, 0];
        neighboringNormals.forEach(normal => {
          sumNormals[0] += normal[0];
          sumNormals[1] += normal[1];
          sumNormals[2] += normal[2];
        });

        let length = Math.sqrt(sumNormals[0] * sumNormals[0] + sumNormals[1] * sumNormals[1] + sumNormals[2] * sumNormals[2]);
        sumNormals[0] = sumNormals[0] / length;
        sumNormals[1] = sumNormals[1] / length;
        sumNormals[2] = sumNormals[2] / length;

        normals.push(sumNormals);
        //normals.push(parsedData.normals[normalIndex - 1]);
      }
    })


    return {
      vertices: vertices,
      normals: normals
    }
  }

  static #parseFile(file) {
    let lines = file.split('\n');
    
    let vertices = [];
    let normals = [];

    let faceVertices = [];
    let faceNormals = [];
    
    let faces = [];

    lines.forEach(line => {
      let tokens = line.split(' ');
      
      switch(tokens[0]){
        case 'v': // Vertex
          vertices.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), 1]);
          break;
        case 'vn':
          normals.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])]);
          break;
        case 'f': // Face
          faces.push(
            {
              vertices: [this.#parseIndex(tokens[1], 0), this.#parseIndex(tokens[2], 0), this.#parseIndex(tokens[3], 0)],
              normals: [this.#parseIndex(tokens[1], 1), this.#parseIndex(tokens[2], 1), this.#parseIndex(tokens[3], 1)]
            });
          break;
      }
    });

    return {
      vertices: vertices,
      normals: normals,
      faces: faces,
    }
  }

  static #parseIndex(token, index) {
    if(token.includes('//')){
      return parseInt(token.split('//')[index]);
    }
    return parseInt(token);
  }
}