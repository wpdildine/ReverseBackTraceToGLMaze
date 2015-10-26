"use strict";


var BLOCK_SIZE = 1;

var periscopeView = false;
var freeCamera, canvas, engine, maze_scene;
var camPositionInLabyrinth, camRotationInLabyrinth;
var NORTH = 1, SOUTH = 2, EAST = 4, WEST = 8;


function createMaze() {
    //number of modules count or cube in width/height
    var mCount = 100;

    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -0.8, 0);
    scene.collisionsEnabled = true;

    freeCamera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(0, 5, 0), scene);
    freeCamera.minZ = 1;
    freeCamera.checkCollisions = true;
    freeCamera.applyGravity = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    // Ground
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.emissiveTexture = new BABYLON.Texture("assets/200.jpg", scene);
    groundMaterial.emissiveTexture.uScale = mCount;
    groundMaterial.emissiveTexture.vScale = mCount;
    groundMaterial.bumpTexture = new BABYLON.Texture("assets/200_norm.jpg", scene);
    groundMaterial.bumpTexture.uScale = mCount;
    groundMaterial.bumpTexture.vScale = mCount;
    groundMaterial.specularTexture = new BABYLON.Texture("assets/200.jpg", scene);
    groundMaterial.specularTexture.uScale = mCount;
    groundMaterial.specularTexture.vScale = mCount;

    var ground = BABYLON.Mesh.CreateGround("ground", (mCount + 2) * BLOCK_SIZE,
        (mCount + 2) * BLOCK_SIZE,
        1, scene, false);
    ground.material = groundMaterial;
    ground.checkCollisions = true;

    //Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    //At Last, add some lights to our scene
    var light0 = new BABYLON.PointLight("pointlight0", new BABYLON.Vector3(28, 78, 385), scene);
    light0.diffuse = new BABYLON.Color3(0.5137254901960784, 0.2117647058823529, 0.0941176470588235);
    light0.intensity = 0.2;

    var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(382, 96, 4), scene);
    light1.diffuse = new BABYLON.Color3(1, 0.7333333333333333, 0.3568627450980392);
    light1.intensity = 0.2;

    var cubeWallMaterial = new BABYLON.StandardMaterial("cubeWalls", scene);
    cubeWallMaterial.emissiveTexture = new BABYLON.Texture("assets/176.jpg", scene);
    cubeWallMaterial.bumpTexture = new BABYLON.Texture("assets/176_norm.jpg", scene);
    cubeWallMaterial.specularTexture = new BABYLON.Texture("assets/176.jpg", scene);

    var mainCubeX = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
    mainCubeX.material = cubeWallMaterial;
    mainCubeX.checkCollisions = true;
    mainCubeX.scaling = new BABYLON.Vector3(6, 1, 1);
    mainCubeX.setEnabled(0);

    var mainCubeY = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
    mainCubeY.material = cubeWallMaterial;
    mainCubeY.checkCollisions = true;
    mainCubeY.scaling = new BABYLON.Vector3(1, 1, 5);
    mainCubeY.setEnabled(0);

    createCubes(mainCubeX, mainCubeY, 10);

    return scene;
}

function createCubes(cubeX, cubeY, maze_size) {
    var position = {'x': -1 * (6 * maze_size / 2), 'z': -1 * (6 * maze_size / 2)};
    for (var e = 0, buffer = maze_size; e < buffer; e++) {
        position.z = position.z + 6;
        for (var i = 0, buffer = maze_size; i < buffer; i++) {
            var xInstances = cubeX.createInstance('xCube x:' + i + ' y:' + e);
            var yInstances = cubeY.createInstance('yCube x:' + i + ' y:' + e);

            xInstances.checkCollisions = true;
            yInstances.checkCollisions = true;
            xInstances.position = new BABYLON.Vector3(position.x + (i * 6) - 3, 1.5, position.z);
            yInstances.position = new BABYLON.Vector3(position.x + (i * 6), 1.5, position.z - 3);
        }
    }
}

for (var i = 0; i < maze_scene.meshes.length; i++) {
    if (maze_scene.meshes[i].id == 'yCube x:2 y:3') {
        maze.meshes[i].dispose();
    }
}
function removeCubes() {

    var startPosition = maze.mazePath.shift();
    if (startPosition != undefined) {
        if (startPosition.direction == 'N') {
            for (var i = 0; i < maze_scene.meshes.length; i++) {
                if (maze_scene.meshes[i].id == 'yCube x:' + startPosition.x + ' y:' + startPosition.y + 1) {
                    console.log('true');
                    maze_scene.meshes[i].enabled = false;

                }
            }
        }
        if (startPosition.direction == 'S') {
            for (var i = 0; i < maze_scene.meshes.length; i++) {
                if (maze_scene.meshes[i].id == 'yCube x:' + startPosition.x + ' y:' + startPosition.y - 1) {
                    maze_scene.meshes[i].dispose();
                }
            }
        }
        if (startPosition.direction == 'W') {
            for (var i = 0; i < maze_scene.meshes.length; i++) {
                if (maze_scene.meshes[i].id == 'xCube x:' + startPosition.x + ' y:' + startPosition.y - 1) {
                    maze_scene.meshes[i].dispose();
                }
            }
        }
        if (startPosition.direction == 'E') {
            for (var i = 0; i < maze_scene.meshes.length; i++) {
                if (maze_scene.meshes[i].id == 'xCube x:' + startPosition.x + ' y:' + startPosition.y + 1) {
                    maze_scene.meshes[i].dispose();
                }
            }
        }
        removeCubes();
    }

}

window.onload = function () {
    canvas = document.getElementById("canvas");

    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    }
    else {
        engine = new BABYLON.Engine(canvas, true);

        window.addEventListener("resize", function () {
            engine.resize();
        });
        maze.initializeMaze();
        maze.mazeGenerator();
        maze_scene = createMaze();
        //removeCubes();
        // Enable keyboard/mouse controls on the scene (FPS like mode)
        maze_scene.activeCamera.attachControl(canvas);

        engine.runRenderLoop(function () {
            maze_scene.render();
        });
    }
};

