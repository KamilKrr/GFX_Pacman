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
    light.translate([0.0, 10.0, 10.0], true);
    scene = new Scene();
    scene.setCamera(camera);
    scene.setLight(light);
    scene.setGlContext(gl);

    shaderPrograms.phongSpecular = new ShaderProgram(gl, shaders.vertexPhong, shaders.fragmentPhongSpecular, shaderInfo, camera);
    shaderPrograms.phongSpecular.enable();

    let cameraInteractionHandler = new CameraInteractionHandler(scene);
    cameraInteractionHandler.registerInputListeners();

    let shapeInteractionHandler = new ShapeInteractionHandler(scene);
    shapeInteractionHandler.registerInputListeners();

    let shaderInteractionHandler = new ShaderInteractionHandler(scene);
    shaderInteractionHandler.registerInputListeners();

    let lightInteractionHandler = new LightInteractionHandler(scene);
    lightInteractionHandler.registerInputListeners();


    window.addEventListener("keydown", (event) => {
        if(event.key == ' '){
            cameraInteractionHandler.canUseArrowKeys = true;
            shapeInteractionHandler.canUseArrowKeys = false;
            lightInteractionHandler.canUseArrowKeys = false;
        } else if(event.key >= 0 && event.key <= 9) {
            cameraInteractionHandler.canUseArrowKeys = false;
            shapeInteractionHandler.canUseArrowKeys = true;
            lightInteractionHandler.canUseArrowKeys = false;
        } else if(event.key == 'L') {
            lightInteractionHandler.canUseArrowKeys = !lightInteractionHandler.canUseArrowKeys;
            shapeInteractionHandler.canUseArrowKeys = !lightInteractionHandler.canUseArrowKeys;
            cameraInteractionHandler.canUseArrowKeys = false;
        }
    });

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
    scene.setMap(map);
}


function render(now) {
    scene.render(now);
    requestAnimationFrame(render)
}

