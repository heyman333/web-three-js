import "./style.css";
import * as Three from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {} from "three/examples/jsm/loaders/GLTFLoader";

const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;

const floorGeomertry = new Three.PlaneGeometry(20, 20);
const floorMaterial = new Three.MeshStandardMaterial({
  color: 0xbbbbbb,
});
const floor = new Three.Mesh(floorGeomertry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

const cylinderGeometry = new Three.CylinderGeometry(0.3, 0.3, 5);
const cylinderMaterial = new Three.MeshStandardMaterial({ color: 0x00ff00 });
const firstCylinderMesh = new Three.Mesh(cylinderGeometry, cylinderMaterial);
firstCylinderMesh.position.set(-2, 2, 0);
firstCylinderMesh.castShadow = true;
firstCylinderMesh.receiveShadow = true;
scene.add(firstCylinderMesh);

const secondCylinderMesh = new Three.Mesh(cylinderGeometry, cylinderMaterial);
secondCylinderMesh.position.set(2, 2, 0);
secondCylinderMesh.castShadow = true;
secondCylinderMesh.receiveShadow = true;
scene.add(secondCylinderMesh);

const starShape = new Three.Shape();
starShape.moveTo(0, 1);
starShape.lineTo(0.2, 0.2);
starShape.lineTo(1, 0.2);
starShape.lineTo(0.4, -0.1);
starShape.lineTo(0.6, -1);
starShape.lineTo(0, -0.5);
starShape.lineTo(-0.6, -1);
starShape.lineTo(-0.4, -0.1);
starShape.lineTo(-1, 0.2);
starShape.lineTo(-0.2, 0.2);

const shapeGeometry = new Three.ShapeGeometry(starShape);
const shapeMaterial = new Three.MeshStandardMaterial({ color: 0xff00ff });
const shapeMesh = new Three.Mesh(shapeGeometry, shapeMaterial);
shapeMesh.position.set(0, 2, -2);
scene.add(shapeMesh);

const boxGeometry = new Three.BoxGeometry(5, 1.5, 5);
const boxMaterial = new Three.MeshStandardMaterial({ color: 0x000000 });
const boxMesh = new Three.Mesh(boxGeometry, boxMaterial);
boxMesh.castShadow = true;
boxMesh.receiveShadow = true;
boxMesh.position.y = 0.5;
scene.add(boxMesh);

const gltfLoader = new GLTFLoader();
const gltf = await gltfLoader.loadAsync("/dancer.glb");
const mainCharacter = gltf.scene;

const subCharacter = mainCharacter.clone(true);

const animationClip = gltf.animations;

mainCharacter.position.set(-1, 1.5, 0);
mainCharacter.scale.set(0.01, 0.01, 0.01);
mainCharacter.castShadow = true;
mainCharacter.receiveShadow = true;
mainCharacter.traverse((obj) => {
  if (obj.isMesh) {
    obj.castShadow = true;
    obj.receiveShadow = true;
  }
});

// TODO: 캐릭터를 복사해서 새로운 캐릭터로 불러오려 했으나 실패..
// subCharacter.position.set(1, 2, 0);
// subCharacter.scale.set(0.005, 0.005, 0.005);
// subCharacter.castShadow = true;
// subCharacter.receiveShadow = true;
// subCharacter.traverse((obj) => {
//   if (obj.isMesh) {
//     obj.castShadow = true;
//     obj.receiveShadow = true;
//   }
// });

const mixer = new Three.AnimationMixer(mainCharacter);
const action = mixer.clipAction(animationClip[0]);
action.play();
action.setLoop(Three.LoopPingPong);

const subMixer = new Three.AnimationMixer(subCharacter);
const subAction = subMixer.clipAction(animationClip[5]);
subAction.play();
subAction.setLoop(Three.LoopPingPong);

scene.add(mainCharacter);
scene.add(subCharacter);

setTimeout(() => {
  action.stop();
  mainCharacter.position.set(0, 1.5, 0);
  const newAction = mixer.clipAction(animationClip[3]);
  newAction.reset().play();
  newAction.setLoop(Three.LoopPingPong);
}, animationClip[0].duration * 2 * 1000);

const spotLight = new Three.SpotLight(0xffffff, 20, 100, Math.PI / 4, 0.5, 1);
spotLight.castShadow = true;
spotLight.position.set(0, 5, 0);
spotLight.target = boxMesh;
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight);

let hue = 0;
function animate() {
  requestAnimationFrame(animate);

  hue += 0.005;
  if (hue > 1) hue = 0;

  const color = new Three.Color();
  color.setHSL(hue, 1, 0.5);
  spotLight.color.set(color);

  renderer.render(scene, camera);
}

animate();

const spotLightHelper = new Three.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.03;

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

const clock = new Three.Clock();
const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  orbitControls.update();
  if (mixer) {
    mixer.update(clock.getDelta());
    // subMixer.update(clock.getDelta());
  }
};

render();
