import * as THREE from "three";
import threejs from "./threejs.webp";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// instantiate a loader
const loader = new THREE.TextureLoader();

// load a resource
loader.load(
  // resource URL
  threejs,

  // onLoad callback
  function (texture) {
    // in this example we create the material when the texture is loaded
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  },

  // onProgress callback currently not supported
  undefined,

  // onError callback
  function (err) {
    console.error("An error happened.");
  }
);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
