class ShapeInteractionHandler {
  constructor(scene) {
    this.shapes = scene.shapes;
    this.activeShapes = [];
    this.useGlobalOrigin = false;
    this.coordinateSystem = new CoordinateSystem(scene.gl);
    this.coordinateSystem.hide();
    this.canUseArrowKeys = false;
    scene.addSupportShape(this.coordinateSystem);
  }
  
  registerInputListeners() {
    window.addEventListener("keydown", (event) => {
      if(event.code === 'Digit0'){
        this.useGlobalOrigin = true;
        this.activeShapes = this.shapes;
        this.coordinateSystem.hide();
      }else if(event.key >= 1 && event.key <= this.shapes.length) {
        this.useGlobalOrigin = false;
        this.activeShapes = [this.shapes[event.key - 1]];

        this.coordinateSystem.modelMatrix = this.shapes[event.key - 1].modelMatrix;
        this.coordinateSystem.scaleMatrixGlobal = this.shapes[event.key - 1].scaleMatrixGlobal;

        this.coordinateSystem.show();
      }

      const callback = {
        // Scaling
        "a"  : () => this.#scale([.9, 1, 1]),
        "A"  : () => this.#scale([1.1, 1, 1]),
        "b"  : () => this.#scale([1, .9, 1]),
        "B"  : () => this.#scale([1, 1.1, 1]),
        "c"  : () => this.#scale([1, 1, .9]),
        "C"  : () => this.#scale([1, 1, 1.1]),

        // Rotation
        "i"  : () => this.canUseArrowKeys && this.#rotate(-5, [1, 0, 0]),
        "k"  : () => this.canUseArrowKeys && this.#rotate(5, [1, 0, 0]),
        "o"  : () => this.canUseArrowKeys && this.#rotate(-5, [0, 1, 0]),
        "u"  : () => this.canUseArrowKeys && this.#rotate(5, [0, 1, 0]),
        "l"  : () => this.canUseArrowKeys && this.#rotate(-5, [0, 0, 1]),
        "j"  : () => this.canUseArrowKeys && this.#rotate(5, [0, 0, 1]),

        //Translation
        "ArrowLeft"  : () => this.canUseArrowKeys && this.#translate([-0.05, 0, 0]),
        "ArrowRight"  : () => this.canUseArrowKeys && this.#translate([0.05, 0, 0]),
        "ArrowUp"  : () => this.canUseArrowKeys && this.#translate([0, 0.05, 0]),
        "ArrowDown"  : () => this.canUseArrowKeys && this.#translate([0, -0.05, 0]),
        ","  : () => this.#translate([0, 0, 0.05]),
        "."  : () => this.#translate([0, 0, -0.05]),
      }[event.key]
      callback?.()
    });
  }

  #scale(vector) {
    this.activeShapes.forEach(shape => {
      shape.scale(vector, this.useGlobalOrigin);
    })
  }

  #rotate(angle, axis) {
    this.activeShapes.forEach(shape => {
      shape.rotate(toRad(angle), axis, this.useGlobalOrigin);
    })
  }

  #translate(vector) {
    this.activeShapes.forEach(shape => {
      shape.translate(vector, this.useGlobalOrigin);
    })
  }
}