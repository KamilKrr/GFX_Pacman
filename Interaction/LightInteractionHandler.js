class LightInteractionHandler {

  constructor(scene) {
    this.light = scene.light;
    this.canUseArrowKeys = false;
  }

  registerInputListeners() {

    // KEYBOARD MEVEMENT
    window.addEventListener("keydown", (event) => {
      let velocity = 0.05;

      const callback = {
        // Rotation
        "i"  : () => this.canUseArrowKeys && this.#rotateLight(-5, [1, 0, 0]),
        "k"  : () => this.canUseArrowKeys && this.#rotateLight(5, [1, 0, 0]),
        "o"  : () => this.canUseArrowKeys && this.#rotateLight(-5, [0, 1, 0]),
        "u"  : () => this.canUseArrowKeys && this.#rotateLight(5, [0, 1, 0]),
        "l"  : () => this.canUseArrowKeys && this.#rotateLight(-5, [0, 0, 1]),
        "j"  : () => this.canUseArrowKeys && this.#rotateLight(5, [0, 0, 1]),

        //Translation
        "ArrowLeft"  : () => this.canUseArrowKeys && this.#translateLight([-0.5, 0, 0]),
        "ArrowRight"  : () => this.canUseArrowKeys && this.#translateLight([0.5, 0, 0]),
        "ArrowUp"  : () => this.canUseArrowKeys && this.#translateLight([0, 0.5, 0]),
        "ArrowDown"  : () => this.canUseArrowKeys && this.#translateLight([0, -0.5, 0]),
        ","  : () => this.canUseArrowKeys && this.#translateLight([0, 0, 0.5]),
        "."  : () => this.canUseArrowKeys && this.#translateLight([0, 0, -0.5]),
      }[event.key]
      callback?.()
    })
  }

  #translateLight(vector) {
    this.light.translate(vector, true);
  }
  

  #rotateLight(angle, axis) {
    this.light.rotate(toRad(angle), axis, true);
  }
}