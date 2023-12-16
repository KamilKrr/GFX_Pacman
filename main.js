const { mat4, vec4, mat3, vec3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shaders = {
    vertexGouraudDiffuse: "v-gouraud-diffuse",
    vertexGouraudSpecular: "v-gouraud-specular",
    vertexPhong: "v-phong",
    fragmentGouraud: "f-gouraud",
    fragmentPhongSpecular: "f-phong-specular",
    fragmentPhongDiffuse: "f-phong-diffuse",
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
    gouraudDiffuse: null,
    gouraudSpecular: null,
    phongDiffuse: null,
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

    gl.enable(gl.DEPTH_TEST);
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    camera = new Camera(canvas);
    light = new Light(light);
    light.translate([0.0, 10.0, 0.0], true);
    scene = new Scene();
    scene.setCamera(camera);
    scene.setLight(light);
    scene.setGlContext(gl);

    shaderPrograms.gouraudSpecular = new ShaderProgram(gl, shaders.vertexGouraudSpecular, shaders.fragmentGouraud, shaderInfo, camera);
    shaderPrograms.gouraudDiffuse = new ShaderProgram(gl, shaders.vertexGouraudDiffuse, shaders.fragmentGouraud, shaderInfo, camera);
    shaderPrograms.phongSpecular = new ShaderProgram(gl, shaders.vertexPhong, shaders.fragmentPhongSpecular, shaderInfo, camera);
    shaderPrograms.phongDiffuse = new ShaderProgram(gl, shaders.vertexPhong, shaders.fragmentPhongDiffuse, shaderInfo, camera);
    shaderPrograms.phongSpecular.enable();


    for(let i = 0; i < 5; i++) {
        let cube = new Cube(gl);
        cube.translate([-0.8 + 0.4 * i, -0.4, 0]);
        scene.addShape(cube);
    }

    /*
    let pyramid = new Pyramid(gl);
    pyramid.rotate(toRad(90), [1, 0, 0]);
    pyramid.rotate(toRad(45), [0, 1, 0]);
    scene.addShape(pyramid);

    */
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
    const bunnyFile = await fetch('3D Objects/bunny.obj').then(result => result.text());
    let bunny = WavefrontObjImporter.importShape(bunnyFile, [0.9, 0.7, 0.5], scene.gl);
    bunny.scale([3, 3, 3]);
    bunny.translate([-0.4, 0.4, 0]);
    scene.addShape(bunny);

    let bunny2 = WavefrontObjImporter.importShape(bunnyFile, [0.5, 0.7, 0.9], scene.gl);
    bunny2.scale([2, 2, 2]);
    bunny2.translate([0.2, 0.0, 0]);
    scene.addShape(bunny2);


    const teapotFile = await fetch('3D Objects/teapot.obj').then(result => result.text());
    let teapot = WavefrontObjImporter.importShape(teapotFile, [1.0, 0.0, 1.0], scene.gl);
    teapot.scale([.4, .4, .4]);
    teapot.translate([0.4, 0.3, 0]);
    scene.addShape(teapot);

    let teapot2 = WavefrontObjImporter.importShape(teapotFile, [0.0, 1.0, 1.0], scene.gl);
    teapot2.scale([.2, .2, .2]);
    teapot2.translate([-0.2, -0.09, 0]);
    scene.addShape(teapot2);

    /*
    const sphereFile = await fetch('3D Objects/sphere.obj').then(result => result.text());
    let sphere = WavefrontObjImporter.importShape(sphereFile, [0.8, 0, 0], scene.gl);
    sphere.scale([.1, .1, .1]);
    sphere.translate([0, 0, 0]);
    scene.addShape(sphere);

    /*
    const textFile = await fetch('3D Objects/text.obj').then(result => result.text());
    let text = WavefrontObjImporter.importShape(textFile, [0.1, 0.1, 0.1], scene.gl);
    text.translate([0, .6, 0]);
    text.scale([.3, .3, .3]);
    scene.addShape(text);
    */
}


function render(now) {
    scene.render(now);
    requestAnimationFrame(render)
}

