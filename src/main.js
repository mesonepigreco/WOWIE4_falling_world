import * as THREE from "three";
import { pingpong } from "three/src/math/MathUtils.js";
import * as PF from "./sprite.js";
import * as PL from "./player.js";
import { PlayerCamera } from "./camera.js";
import { Level } from "./level.js";
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new PlayerCamera(75, window.innerWidth / window.innerHeight,
    0.5, 1000);

// Add the autoresize
window.addEventListener("resize", (event) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});


document.body.appendChild(renderer.domElement);

const level = new Level(renderer, 10, 4);
level.mainLoop(0);

/*
// Create an example scene
const light = new THREE.AmbientLight(0xffffff);
const p1 = new PF.Sprite(0, 0, 0, 10, 0.2, 10);
p1.dynamic = false;

const player =  new PL.Player(0, 5, 0);
camera.bind_player = player;
const collisionGroup = new PF.Group([p1]);
const updateGroup = new PF.Group([p1, player]);

// Add object to the scene
scene.add(light);
p1.add_scene(scene);
player.add_scene(scene);




let dt = 0;
let old_t = 0;
function animate(timeStamp) {
    dt = timeStamp - old_t;
    if (dt > 0.05) dt = 0.05;
    old_t = timeStamp;

    updateGroup.update(dt, collisionGroup);
    camera.update(dt);

    //console.log("Time:", timeStamp, "dt:", dt);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate(0);
*/



