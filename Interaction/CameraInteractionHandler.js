class CameraInteractionHandler {
  
  constructor(scene) {
    this.camera = scene.camera;
    this.isMouseDown = false;
    this.dragStartPosition = {x: 0, y: 0};
    this.canUseArrowKeys = true;
  }
  
  registerInputListeners() {
    
    window.addEventListener("mouseup", () => { this.isMouseDown = false; });
    window.addEventListener("mousedown", (event) => {
      this.isMouseDown = true;
      this.dragStartPosition = {x: event.clientX, y: event.clientY};
    });
    
    // MOUSE DRAGGING
    window.addEventListener("mousemove", (event) => {
      if (!this.isMouseDown) return;
      
      let currentPosition = {x: event.clientX, y: event.clientY};
      
      let calibrationFactor = 0.002;
      let deltaX = this.dragStartPosition.x - currentPosition.x;
      let deltaY = this.dragStartPosition.y - currentPosition.y;
      
      deltaX = -calibrationFactor * deltaX;
      deltaY = calibrationFactor * deltaY;
      
      this.dragStartPosition = currentPosition;
      
      this.#translateCamera([deltaX, deltaY, 0]);
    });
  }
  
  #translateCamera(vector) {
      this.camera.translate(vector);
  }
}