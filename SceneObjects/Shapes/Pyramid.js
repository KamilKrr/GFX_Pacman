class Pyramid extends Shape {
  constructor(gl) {
    super(gl);
    
    const vertices = [
      // X, Y, Z, W
      0.1, 0, 0.1, 1,
      -0.1, 0, 0.1, 1,
      0, 0.3, 0, 1,
      
      0.1, 0, 0.1, 1,
      0.1, 0, -0.1, 1,
      0, 0.3, 0, 1,
      
      0.1, 0, -0.1, 1,
      -0.1, 0, -0.1, 1,
      0, 0.3, 0, 1,
      
      -0.1, 0, 0.1, 1,
      -0.1, 0, -0.1, 1,
      0, 0.3, 0, 1,
      
      -0.1, 0, 0.1, 1,
      0.1, 0, 0.1, 1,
      0.1, 0, -0.1, 1,
      
      -0.1, 0, -0.1, 1,
      0.1, 0, -0.1, 1,
      -0.1, 0, 0.1, 1,
      
    ];

    const colorData = [
      [0.,0.608,0.282, 1.0],      // Green
      [1.0, 1.0, 1.0, 1.0],       // White
      [0.718,0.071,0.204, 1.0],   // Red
      [0.,0.275,0.678, 1.0],      // Blue
      [1.,0.835,0., 1.0],         // Yellow
      [1.,0.345,0., 1.0],         // Orange
    ];

    const colors = [];

    /* --------- add one color per face, so 6 times for each color --------- */
    colorData.forEach(color => {
      for (let i = 0; i < 3; ++i) {
        colors.push(color);
      }
    });
    this.initData(vertices, colors);
  }
}