const { mat4, vec4, mat3, vec3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shaders = {
    vertexPhong: "v-phong",
    fragmentPhongSpecular: "f-phong-specular",
}

const shaderInfo = {
    attributes: {
        vertexLocation: "vertexPosition",
        colorLocation:  "vertexColor",
        normalLocation:  "vertexNormal",
    },
    uniforms: {
        modelViewMatrix: "modelViewMatrix",
        projectionMatrix: "projectionMatrix",
        viewMatrix: "viewMatrix",
        normalMatrix: "normalMatrix",
        lightPosition: "lightViewPosition",
        Ka: "Ka",
        Kd: "Kd",
        Ks: "Ks",
        shininessVal: "shininessVal",
        ambientColor: "ambientColor",
        specularColor: "specularColor"
    }
}

const shaderPrograms = {
    phongSpecular: null,
}

let currentShaderProgram = null;

let camera = null;
let light = null;
let scene = null;

window.onload = async () => {

    /* --------- basic setup --------- */
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    //resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    camera = new Camera(canvas);
    light = new Light(light);
    light.translate([5.0, 10.0, 5.0], true);
    scene = new Scene();
    scene.setCamera(camera);
    scene.setLight(light);
    scene.setGlContext(gl);

    shaderPrograms.phongSpecular = new ShaderProgram(gl, shaders.vertexPhong, shaders.fragmentPhongSpecular, shaderInfo, camera);
    shaderPrograms.phongSpecular.enable();

    let cameraInteractionHandler = new CameraInteractionHandler(scene);
    cameraInteractionHandler.registerInputListeners();

    /* --------- Load some data from external files - only works with an http server --------- */
    await loadObjFiles();

    /* --------- start render loop --------- */
    requestAnimationFrame(render);
}

async function loadObjFiles() {
    const wallFileBlue = await fetch('3D Objects/Wall.obj').then(result => result.text());
    let wallBlue = WavefrontObjImporter.importShape(wallFileBlue, [0.2, 0.2, 0.9], scene.gl);
    wallBlue.scale([.1, .1, .1]);

    const wallFileGreen = await fetch('3D Objects/Wall.obj').then(result => result.text());
    let wallGreen = WavefrontObjImporter.importShape(wallFileGreen, [0.1, 0.3, 0.1], scene.gl);
    wallGreen.scale([.1, .1, .1]);

    const floorFile = await fetch('3D Objects/Floor.obj').then(result => result.text());
    let floor = WavefrontObjImporter.importShape(floorFile, [0.4, 0.4, 0.4], scene.gl);
    floor.scale([.1, .1, .1]);

    let map = new GameMap([wallBlue, wallGreen], [floor]);

    const pacmanHeadFile = await fetch('3D Objects/PacmanHead.obj').then(result => result.text());
    let pacmanHead = WavefrontObjImporter.importShape(pacmanHeadFile, [0.85, 0.95, 0.3], scene.gl);
    pacmanHead.scale([.1, .1, .1]);
    pacmanHead.translate([0, 0.1, 0]);

    const pacmanBodyFile = await fetch('3D Objects/PacmanBody.obj').then(result => result.text());
    let pacmanBody = WavefrontObjImporter.importShape(pacmanBodyFile, [0.85, 0.95, 0.3], scene.gl);
    pacmanBody.scale([.1, .1, .1]);
    pacmanBody.translate([0, 0.1, 0]);

    let pacman = new Pacman(pacmanHead, pacmanBody);

    let game = new Game(map, pacman);
    scene.setGame(game);
    scene.startGame();
}


function render(now) {
    scene.update(now);
    scene.render(now);
    requestAnimationFrame(render)
}

