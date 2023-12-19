const { mat4, vec4, mat3, vec3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shaders = {
    vertexPhong: "v-phong",
    fragmentPhongSpecular: "f-phong-specular",
    vertexShadow: "v-shadow",
    fragmentShadow: "f-shadow",
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
    shadow: null,
}

let currentShaderProgram = null;

let camera = null;
let light = null;
let scene = null;
let shear = true;

window.onload = async () => {

    /* --------- basic setup --------- */
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    //resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ext = gl.getExtension('WEBGL_depth_texture');
    if (!ext) {
        return alert('need WEBGL_depth_texture');
    }
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    camera = new Camera(canvas, gl);
    light = new Light(light);
    light.translate([2.0, 3.0, 2.0], true);
    scene = new Scene();
    scene.setCamera(camera);
    scene.setLight(light);
    scene.setGlContext(gl);

    window.addEventListener("keydown", (e) => {
        if(e.key === "v"){
            shear = !shear;
            if(shear)
                camera.shear();
            else {
                camera.unshear()
            }
        }
    });

    shaderPrograms.phongSpecular = new ShaderProgram(gl, shaders.vertexPhong, shaders.fragmentPhongSpecular, shaderInfo, camera);
    shaderPrograms.shadow = new ShaderProgram(gl, shaders.vertexShadow, shaders.fragmentShadow, shaderInfo, camera);
    shaderPrograms.phongSpecular.enable();
    camera.init();

    /* --------- Load some data from external files - only works with an http server --------- */
    await loadObjFiles();

    /* --------- start render loop --------- */
    requestAnimationFrame(render);
}

async function loadObjFiles() {
    const wallFileBlue = await fetch('3D Objects/Wall.obj').then(result => result.text());
    let wallBlue = WavefrontObjImporter.importShape(wallFileBlue, [0.2, 0.2, 1.0], scene.gl);
    wallBlue.scale([.1, .1, .1]);

    const wallFileGreen = await fetch('3D Objects/Wall.obj').then(result => result.text());
    let wallGreen = WavefrontObjImporter.importShape(wallFileGreen, [0, 0.2, 0.25], scene.gl);
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

    const foodFile = await fetch('3D Objects/Food.obj').then(result => result.text());
    let food = WavefrontObjImporter.importShape(foodFile, [0.85, 0.95, 0.3], scene.gl);
    food.scale([.07, .07, .07]);
    food.translate([0, 0.12, 0]);

    let powerFood = WavefrontObjImporter.importShape(foodFile, [0.95, 0.2, 0.2], scene.gl);
    powerFood.scale([.15, .15, .15]);
    powerFood.translate([0, 0.12, 0]);

    let pacman = new Pacman(pacmanHead, pacmanBody);
    let game = new Game(map, pacman, food, powerFood);

    //Ghosts
    for(let i = 0; i < 9; i++) {
        const ghostFile = await fetch('3D Objects/Ghost.obj').then(result => result.text());
        let ghost = WavefrontObjImporter.importShape(ghostFile, [Math.random(), Math.random(), Math.random()], scene.gl);
        ghost.scale([.09, .09, .09]);
        ghost.translate([0, 0.1, 0]);

        const eyesFile = await fetch('3D Objects/Eyes.obj').then(result => result.text());
        let eyes = WavefrontObjImporter.importShape(eyesFile, [1.0, 1.0, 1.0], scene.gl);
        eyes.scale([.09, .09, .09]);
        eyes.translate([0, 0.1, 0]);

        let gh = new Ghost(ghost, eyes);
        game.addGhost(gh);
    }

    scene.setGame(game);
    scene.startGame();
}


function render(now) {
    scene.update(now);
    scene.render(now);
    requestAnimationFrame(render)
}

