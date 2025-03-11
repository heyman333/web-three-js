import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 5;

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const dirrectionalLight = new THREE.DirectionalLight(0xffffff, 5);
// dirrectionalLight.castShadow = true;
// dirrectionalLight.position.set(3, 4, 5);
// dirrectionalLight.lookAt(0, 0, 0);
// scene.add(dirrectionalLight);

const textureLoader = new THREE.TextureLoader();
const texture = await textureLoader.loadAsync("/pattern1.jpg");

const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ map: texture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.castShadow = true;
floor.name = "FLOOR";
scene.add(floor);

/**
 * NOTE: Geometry 실습
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// mesh.castShadow = true;
// mesh.position.y = 0.5;
// scene.add(mesh);

// const capsuleGeometry = new THREE.CapsuleGeometry(1, 2, 20, 30);
// const capsuleMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
// const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
// capsuleMesh.position.set(3, 1.75, 0);
// capsuleMesh.castShadow = true;
// capsuleMesh.receiveShadow = true;
// scene.add(capsuleMesh);

// const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2);
// const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
// cylinderMesh.position.set(-3, 1, 0);
// cylinderMesh.castShadow = true;
// cylinderMesh.receiveShadow = true;
// scene.add(cylinderMesh);

// const torusGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
// const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
// const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
// torusMesh.rotation.x = -Math.PI / 2;
// torusMesh.position.set(1, 0.5, 1);
// torusMesh.castShadow = true;
// torusMesh.receiveShadow = true;
// scene.add(torusMesh);

// add random torus objects, random position, size, rotation and color
// position is between 1 and 5 and moving between -1 and 1
const randomTorusArray = [];
for (let i = 0; i < 10; i++) {
  const randomTorusGeometry = new THREE.TorusGeometry(
    Math.random() * 0.5 + 0.1,
    Math.random() * 0.2 + 0.1,
    16,
    100
  );
  const randomTorusMaterial = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
  });
  const torus = new THREE.Mesh(randomTorusGeometry, randomTorusMaterial);
  torus.rotation.x = Math.random() * Math.PI;
  torus.rotation.y = Math.random() * Math.PI;
  torus.rotation.z = Math.random() * Math.PI;
  torus.scale.set(
    Math.random() + 0.5,
    Math.random() + 0.5,
    Math.random() + 0.5
  );

  torus.position.set(
    Math.random() * 6 - 3,
    Math.random() * 4 + 1,
    Math.random() * 6 - 3
  );
  // torus.castShadow = true;
  torus.receiveShadow = true;
  randomTorusArray.push(torus);
  scene.add(torus);
}

const starShape = new THREE.Shape();
starShape.moveTo(0, 2);
starShape.lineTo(0.4, 0.4);
starShape.lineTo(2, 0.4);
starShape.lineTo(0.8, -0.2);
starShape.lineTo(1.2, -2);
starShape.lineTo(0, -1);
starShape.lineTo(-1.2, -2);
starShape.lineTo(-0.8, -0.2);
starShape.lineTo(-2, 0.4);
starShape.lineTo(-0.4, 0.4);

const shapeGeometry = new THREE.ShapeGeometry(starShape);
const shapeMaterial = new THREE.MeshStandardMaterial({
  color: 0xfcba03,
});
const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
shapeMesh.position.set(0, 0.8, -4.2);
shapeMesh.castShadow = true;
shapeMesh.receiveShadow = true;
scene.add(shapeMesh);

const x = 0,
  y = 0;

const heartShape = new THREE.Shape();
heartShape.moveTo(x + 1, y + 1);
heartShape.bezierCurveTo(x + 1, y + 1, x + 0.8, y, x, y);
heartShape.bezierCurveTo(x - 1.2, y, x - 1.2, y + 1.4, x - 1.2, y + 1.4);
heartShape.bezierCurveTo(x - 1.2, y + 2.2, x - 0.6, y + 3.08, x + 1, y + 3.8);
heartShape.bezierCurveTo(x + 2.4, y + 3.08, x + 3.2, y + 2.2, x + 3.2, y + 1.4);
heartShape.bezierCurveTo(x + 3.2, y + 1.4, x + 3.2, y, x + 2, y);
heartShape.bezierCurveTo(x + 1.4, y, x + 1, y + 1, x + 1, y + 1);

const geometry = new THREE.ShapeGeometry(heartShape);
const material = new THREE.MeshBasicMaterial({ color: 0xfcdb03 });
const heartMesh = new THREE.Mesh(geometry, material);
heartMesh.position.set(-1.5, 3, -4.4);
heartMesh.rotateZ(Math.PI);
heartMesh.rotateY(Math.PI / -10);
shapeMesh.castShadow = true;
shapeMesh.receiveShadow = true;
scene.add(heartMesh);

// const extrudeSettings = {
//   steps: 1,
//   depth: 0.1,
//   bevelEnabled: true,
//   bevelThickness: 0.1,
//   bevelSize: 0.3,
//   bevelSegments: 100,
// };

// const extrudeGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
// const extrudeMaterial = new THREE.MeshStandardMaterial({ color: 0x0ddaaf });
// const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
// extrudeMesh.position.set(2, 1.3, 2);
// extrudeMesh.castShadow = true;
// extrudeMesh.receiveShadow = true;
// scene.add(extrudeMesh);

// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x98daaf });
// const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphereMesh.position.set(0, 1, -3);
// sphereMesh.castShadow = true;
// sphereMesh.receiveShadow = true;
// // scene.add(sphereMesh);

// const numPoints = 1000;
// const positions = new Float32Array(numPoints * 3);

// for (let i = 0; i < numPoints; i++) {
//   const x = (Math.random() - 0.5) * 1;
//   const y = (Math.random() - 0.5) * 1;
//   const z = (Math.random() - 0.5) * 1;

//   positions[i * 3] = x;
//   positions[i * 3 + 1] = y;
//   positions[i * 3 + 2] = z;
// }

// const bufferGeometry = new THREE.BufferGeometry();
// bufferGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(positions, 3)
// );

// const pointsMaterial = new THREE.PointsMaterial({ color: 0xffff00, size: 0.5 });
// const point = new THREE.Points(bufferGeometry, pointsMaterial);
// point.position.set(0, 0, -5);
// scene.add(point);

/**
 * NOTE: Material 실습
 */
// const frontSideGeometry = new THREE.BoxGeometry(1, 1, 1);
// const frontSideMaterial = new THREE.MeshStandardMaterial({
//   color: 0x00ffff,
//   side: THREE.FrontSide,
// });
// const frontSideMesh = new THREE.Mesh(frontSideGeometry, frontSideMaterial);
// frontSideMesh.position.z = 4;
// frontSideMesh.position.y = 0.5;
// frontSideMesh.castShadow = true;
// frontSideMesh.receiveShadow = true;
// scene.add(frontSideMesh);

// const backSideGeometry = new THREE.BoxGeometry(1, 1, 1);
// const backSideMaterial = new THREE.MeshStandardMaterial({
//   color: 0x00ff00,
//   side: THREE.BackSide,
// });
// const backSideMesh = new THREE.Mesh(backSideGeometry, backSideMaterial);
// backSideMesh.position.set(2, 0.5, 4);
// backSideMesh.position.y = 0.51;
// // backSideMesh.castShadow = true;
// backSideMesh.receiveShadow = true;
// scene.add(backSideMesh);

// const doubleSideGeometry = new THREE.BoxGeometry(1, 1, 1);
// const doubleSideMaterial = new THREE.MeshStandardMaterial({
//   color: 0xff00ff,
//   side: THREE.DoubleSide,
// });
// const doubleSideMesh = new THREE.Mesh(doubleSideGeometry, doubleSideMaterial);
// doubleSideMesh.position.set(4, 0.5, 4);
// doubleSideMesh.position.y = 0.51;
// // doubleSideMesh.castShadow = true;
// doubleSideMesh.receiveShadow = true;
// scene.add(doubleSideMesh);

// const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 20);
// const torusKnotStandardMaterial = new THREE.MeshStandardMaterial({
//   color: 0xff0000,
// });
// torusKnotStandardMaterial.roughness = 0.5;
// torusKnotStandardMaterial.metalness = 1;
// const torusKnotStandardMesh = new THREE.Mesh(
//   torusKnotGeometry,
//   torusKnotStandardMaterial
// );
// torusKnotStandardMesh.position.set(-4, 1, 0);
// torusKnotStandardMesh.castShadow = true;
// torusKnotStandardMesh.receiveShadow = true;
// scene.add(torusKnotStandardMesh);

// const torusKnotLambertMaterial = new THREE.MeshLambertMaterial({
//   color: 0xff0000,
// });
// torusKnotLambertMaterial.emissive = new THREE.Color(0x00ff00);
// torusKnotLambertMaterial.emissiveIntensity = 0.2;
// const torusKnotLambertMesh = new THREE.Mesh(
//   torusKnotGeometry,
//   torusKnotLambertMaterial
// );
// torusKnotLambertMesh.position.set(-2, 1, 0);
// torusKnotLambertMesh.castShadow = true;
// torusKnotLambertMesh.receiveShadow = true;
// scene.add(torusKnotLambertMesh);

// const torusKnotPhongMaterial = new THREE.MeshPhongMaterial({
//   color: 0xff0000,
// });
// torusKnotPhongMaterial.emissive = new THREE.Color(0x00ff00);
// torusKnotPhongMaterial.emissiveIntensity = 0.2;
// torusKnotPhongMaterial.specular = new THREE.Color(0x0000ff);
// torusKnotPhongMaterial.shininess = 100;
// const torusKnotPhongMesh = new THREE.Mesh(
//   torusKnotGeometry,
//   torusKnotPhongMaterial
// );
// torusKnotPhongMesh.position.set(0, 1, 0);
// torusKnotPhongMesh.castShadow = true;
// torusKnotPhongMesh.receiveShadow = true;
// scene.add(torusKnotPhongMesh);

// const torusKnotBasicMaterial = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
// });
// const torusKnotBasicMesh = new THREE.Mesh(
//   torusKnotGeometry,
//   torusKnotBasicMaterial
// );
// torusKnotBasicMesh.position.set(2, 1, 0);
// torusKnotBasicMesh.castShadow = true;
// torusKnotBasicMesh.receiveShadow = true;
// scene.add(torusKnotBasicMesh);

// const torusKnotDepthMaterial = new THREE.MeshDepthMaterial({
//   color: 0xffffff,
// });
// torusKnotDepthMaterial.opacity = 0.5;
// const torusKnotDepthMesh = new THREE.Mesh(
//   torusKnotGeometry,
//   torusKnotDepthMaterial
// );
// torusKnotDepthMesh.position.set(4, 1, 0);
// torusKnotDepthMesh.castShadow = true;
// torusKnotDepthMesh.receiveShadow = true;
// scene.add(torusKnotDepthMesh);

// const textureLoader = new THREE.TextureLoader();
// // textureLoader.load("/threejs.webp", (texture) => {
// //   const textureBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
// //   const textureBoxMaterial = new THREE.MeshStandardMaterial({ map: texture });
// //   const textureBoxMesh = new THREE.Mesh(textureBoxGeometry, textureBoxMaterial);
// //   textureBoxMesh.position.set(0, 0.5, 2);
// //   textureBoxMesh.castShadow = true;
// //   textureBoxMesh.receiveShadow = true;
// //   scene.add(textureBoxMesh);
// // });

// const texture = await textureLoader.loadAsync("/threejs.webp");
// const textureBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const textureBoxMaterial = new THREE.MeshStandardMaterial({ map: texture });
// const textureBoxMesh = new THREE.Mesh(textureBoxGeometry, textureBoxMaterial);
// textureBoxMesh.position.set(0, 0.5, 2);
// textureBoxMesh.castShadow = true;
// textureBoxMesh.receiveShadow = true;
// scene.add(textureBoxMesh);

/**
 * NOTE: Light 실습
 */
// const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const BoxMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffffff,
//   // side: THREE.DoubleSide,
// });
// const BoxMesh = new THREE.Mesh(BoxGeometry, BoxMaterial);
// BoxMesh.position.set(0, 0.5, 0);
// BoxMesh.castShadow = true;
// BoxMesh.receiveShadow = true;
// scene.add(BoxMesh);

// const ambientLight = new THREE.AmbientLight(0xffffff, 5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0x5e00ff, 10);
// directionalLight.castShadow = true;
// directionalLight.position.set(3, 4, 5);
// directionalLight.lookAt(0, 0, 0); // 없어도 초기값이긴함
// scene.add(directionalLight);
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   1
// );
// scene.add(directionalLightHelper);

const hemisphereLight = new THREE.HemisphereLight(0x0022ff, 0xff0000, 2);
hemisphereLight.position.set(0, 2, 0);
hemisphereLight.lookAt(0, 0, 0);
scene.add(hemisphereLight);
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   1
// );
// scene.add(hemisphereLightHelper);

// const pointLight = new THREE.PointLight(0xffffff, 5, 5, 4);
// pointLight.position.set(1, 1, 1);
// pointLight.castShadow = true;
// scene.add(pointLight);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

const rectAreaLight = new THREE.RectAreaLight(0xffffff, 5, 2, 2);
rectAreaLight.position.set(0, 1, -4);
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

const targetObj = new THREE.Object3D();
scene.add(targetObj);

const spotLight = new THREE.SpotLight(0xfff700, 20, 100, Math.PI / 4, 1, 1);
spotLight.position.set(-2, 4, -1);
spotLight.castShadow = true;
spotLight.target = targetObj;
spotLight.target.position.set(1, 0, 0);
scene.add(spotLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

const spotLight2 = new THREE.SpotLight(0xff0000, 20, 100, Math.PI / 4, 1, 1);
spotLight2.position.set(2, 4, -1);
spotLight2.castShadow = true;
spotLight2.target = targetObj;
spotLight2.target.position.set(1, 0, 0);
scene.add(spotLight2);
// const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
// scene.add(spotLightHelper2);

/**
 * NOTE: Shadow 실습
 */
// const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const BoxMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffff00,
//   // side: THREE.DoubleSide,
// });
// const BoxMesh = new THREE.Mesh(BoxGeometry, BoxMaterial);
// BoxMesh.position.set(0, 0.5, 0);
// BoxMesh.castShadow = true;
// BoxMesh.receiveShadow = true;
// scene.add(BoxMesh);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
// directionalLight.castShadow = true;
// directionalLight.position.set(3, 4, 5);
// directionalLight.lookAt(0, 0, 0); // 없어도 초기값이긴함
// directionalLight.shadow.mapSize.width = 4096;
// directionalLight.shadow.mapSize.height = 4096;
// directionalLight.shadow.camera.top = 2;
// directionalLight.shadow.camera.bottom = -2;
// directionalLight.shadow.camera.left = -2;
// directionalLight.shadow.camera.right = 2;

// directionalLight.shadow.camera.near = 0.1;
// directionalLight.shadow.camera.far = 100;

// scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   1
// );
// scene.add(directionalLightHelper);

/**
 * NOTE: Controls 실습
 */

// const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const BoxMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffff00,
//   // side: THREE.DoubleSide,
// });
// const BoxMesh = new THREE.Mesh(BoxGeometry, BoxMaterial);
// BoxMesh.position.set(0, 0.5, 0);
// BoxMesh.castShadow = true;
// BoxMesh.receiveShadow = true;
// scene.add(BoxMesh);

// const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.enableDamping = true;
// orbitControls.dampingFactor = 0.03;
// orbitControls.enableZoom = true;
// orbitControls.enablePan = true;
// orbitControls.enableRotate = true;
// // orbitControls.autoRotate = true;
// orbitControls.autoRotateSpeed = 2;
// orbitControls.maxPolarAngle = Math.PI / 2;
// orbitControls.minPolarAngle = Math.PI / 4;
// orbitControls.maxAzimuthAngle = Math.PI / 2;
// orbitControls.minAzimuthAngle = -Math.PI / 2;
// // orbitControls.update();

// const flyControls = new FlyControls(camera, renderer.domElement);
// flyControls.movementSpeed = 1;
// flyControls.rollSpeed = Math.PI / 10;
// flyControls.autoForward = false;

// camera.position.set(0, 1, 5);
// const firstPersonControls = new FirstPersonControls(
//   camera,
//   renderer.domElement
// );
// firstPersonControls.lookSpeed = 0.1;
// firstPersonControls.movementSpeed = 1;
// firstPersonControls.lookVertical = true;

// const pointerLockControls = new PointerLockControls(
//   camera,
//   renderer.domElement
// );
// window.addEventListener("click", () => {
//   pointerLockControls.lock();
// });

// const trackballControls = new TrackballControls(camera, renderer.domElement);
// trackballControls.rotateSpeed = 2;
// trackballControls.zoomSpeed = 1.5;
// trackballControls.panSpeed = 0.5;
// trackballControls.noRotate = false;
// trackballControls.noZoom = false;
// trackballControls.noPan = false;
// trackballControls.staticMoving = false;
// trackballControls.dynamicDampingFactor = 0.05;

// const target = new THREE.Mesh(
//   new THREE.SphereGeometry(0.1),
//   new THREE.MeshBasicMaterial({ color: 0x0000ff })
// );
// target.position.set(4, 0.5, 0);
// scene.add(target);
// trackballControls.target = target.position;

/**
 * NOTE: GBL 실습
 */

const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const BoxMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  // side: THREE.DoubleSide,
});
const BoxMesh = new THREE.Mesh(BoxGeometry, BoxMaterial);
BoxMesh.position.set(0, 0.5, 0);
BoxMesh.castShadow = true;
BoxMesh.receiveShadow = true;
// scene.add(BoxMesh);

const gltfLoader = new GLTFLoader();
// gltfLoader.load("/dancer.glb", (gltf) => {
//   const character = gltf.scene;
//   character.position.y = 0.8;
//   character.scale.set(0.01, 0.01, 0.01);
//   scene.add(character);
// });
const gltf = await gltfLoader.loadAsync("/dancer.glb");
const character = gltf.scene;
character.position.y = 0.8;
character.scale.set(0.01, 0.01, 0.01);
character.castShadow = true;
character.receiveShadow = true;
character.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
scene.add(character);

const mixer = new THREE.AnimationMixer(character);
const action = mixer.clipAction(gltf.animations[1]);
// action.setLoop(THREE.LoopOnce);
action.setLoop(THREE.LoopRepeat);
// action.setLoop(THREE.LoopPingPong);
// action.setDuration(10);
action.setEffectiveTimeScale(0.5);
// action.setEffectiveWeight(0.5);
action.play();

// setTimeout(() => {
//   mixer.clipAction(gltf.animations[3]).paused = true;
// }, 3000);

//

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.03;

// const newPosition = new THREE.Vector3(0, 1, 0);
// const rayCaster = new THREE.Raycaster();
// renderer.domElement.addEventListener("pointerdown", (e) => {
//   const x = (e.clientX / window.innerWidth) * 2 - 1;
//   const y = -((e.clientY / window.innerHeight) * 2 - 1);

//   rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);
//   const intersects = rayCaster.intersectObjects(scene.children);
//   console.log(intersects);

//   const intersectFloor = intersects.find((i) => i.object.name === "FLOOR");
//   console.log(intersectFloor);

//   newPosition.copy(intersectFloor.point);
//   newPosition.y = 1;
// });

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

const clock = new THREE.Clock();
const targetVection = new THREE.Vector3();

const render = () => {
  // character.lookAt(newPosition);
  // targetVection
  //   .subVectors(newPosition, character.position)
  //   .normalize()
  //   .multiplyScalar(0.01);

  for (const torus of randomTorusArray) {
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;

    // const randomPosition = clock.getElapsedTime();
    // torus.position.x += Math.sin(randomPosition) * 0.01;
    // torus.position.y += Math.cos(randomPosition) * 0.01;
    // torus.position.z += Math.sin(randomPosition) * 0.01;
  }

  // const angle = clock.getElapsedTime();
  // spotLight.position.x = Math.sin(angle) * 2;
  // spotLight.position.z = Math.cos(angle) * 2;
  // spotLight2.position.x = Math.cos(angle + Math.PI) * 2;
  // spotLight2.position.z = Math.sin(angle + Math.PI) * 2;

  // if (
  //   Math.abs(character.position.x - newPosition.x) >= 1 ||
  //   Math.abs(character.position.z - newPosition.z) >= 1
  // ) {
  //   character.position.z += targetVection.z;
  //   character.position.x += targetVection.x;
  //   action.stop();
  // } else {
  //   action.play();
  // }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
  // textureBoxMesh.rotation.y += 0.01;
  orbitControls.update();
  // flyControls.update(clock.getDelta());
  // firstPersonControls.update(clock.getDelta());
  // pointerLockControls.update(clock.getDelta());
  // trackballControls.update();
  if (mixer) {
    mixer.update(clock.getDelta());
    action.play();
  }
};

render();
