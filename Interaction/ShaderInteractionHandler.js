class ShaderInteractionHandler {

  constructor(scene) {
    this.camera = scene.camera;
    this.isMouseDown = false;
    this.dragStartPosition = {x: 0, y: 0};
    this.canUseArrowKeys = true;
  }

  registerInputListeners() {

    // KEYBOARD MEVEMENT
    window.addEventListener("keydown", (event) => {
      const callback = {
        "w"  : () => shaderPrograms.gouraudDiffuse.enable(),
        "e"  : () => shaderPrograms.gouraudSpecular.enable(),
        "r"  : () => shaderPrograms.phongDiffuse.enable(),
        "t"  : () => shaderPrograms.phongSpecular.enable(),
      }[event.key]
      callback?.()
    })
  }
}