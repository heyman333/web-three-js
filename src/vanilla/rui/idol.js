import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 5, 10);

// 바닥 생성
const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.name = "floor";
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

// 직사광선 생성
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true;
directionalLight.position.set(3, 4, 5);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

// 그림자 설정
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 500;
scene.add(directionalLight);

// 마우스로 카메라 시점 조작
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.03;

// 스포트라이트 생성
const spotLight = new THREE.SpotLight(0xffffff, 10, 10, Math.PI / 4, 1.5, 1);
spotLight.castShadow = true;
spotLight.position.set(0, 3, 0);
scene.add(spotLight);

// 댄서 로드
async function loadDancer(count = 1, isSameAction = false, actionIndex = 0) {
  const dancers = [];
  const gltfLoader = new GLTFLoader();

  for (let i = 0; i < count; i++) {
    const gltf = await gltfLoader.loadAsync("/dancer.glb");
    const animaintionClip = gltf.animations;
    const clipIndex = isSameAction ? actionIndex : i % animaintionClip.length;
    const character = gltf.scene;

    const halfCount = Math.round(count / 2);
    if(i < halfCount) {
      character.position.set(i * 2 , 0.9, 0);
    } else {
      character.position.set(0 , 0.9, (i - (halfCount - 1)) * 2);
    }
    character.scale.set(0.01, 0.01, 0.01);
    character.traverse((mesh) => {
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    dancers.push({ character, clip: animaintionClip[clipIndex] });
  }
  return dancers;
}

// 애니메이션 설정
function setAnimation(character, clip) {
  const mixer = new THREE.AnimationMixer(character);
  const action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopPingPong);
  action.play();
  return mixer;
}

// 댄서 생성
const dancers = await loadDancer(5, true, 0);
const mixers = [];
dancers.forEach((dancer) => {
  scene.add(dancer.character);
  const mixer = setAnimation(dancer.character, dancer.clip);
  mixers.push({ mixer, clock: new THREE.Clock() });
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

const render = () => {
  orbitControls.update();

  mixers.forEach(({ mixer, clock }) => {
    mixer.update(clock.getDelta());
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
render();

// 댄서 로드
// const gltfLoader = new GLTFLoader();
// const gltf = await gltfLoader.loadAsync("/dancer.glb");
// const character = gltf.scene;
// const animaintionClip = gltf.animations;
// character.position.y = 0.9;
// character.scale.set(0.01, 0.01, 0.01);
// character.traverse((mesh) => {
//   if (mesh.isMesh) {
//     mesh.castShadow = true;
//     mesh.receiveShadow = true;
//   }
// });

// 애니메이션 설정
// const mixer = new THREE.AnimationMixer(character);
// const action = mixer.clipAction(animaintionClip[0]);
// action.setLoop(THREE.LoopPingPong);
// action.play();

// const newPosition = new THREE.Vector3(1, 1, 0); // 클릭된 3D 상의 좌표를 저장할 벡터
// const rayCaster = new THREE.Raycaster();
// renderer.domElement.addEventListener("pointerdown", (e) => {
//   // client좌표를 threejs 평면상의 좌표로 환산
//   const x = (e.clientX / window.innerWidth) * 2 - 1; // 화면 상 가장 왼쪽이 -1, 중심이 0, 오른쪽이 1이 되도록 환산
//   const y = -((e.clientY / window.innerHeight) * 2 - 1); // 화면 상 가장 위쪽이 1, 중심이 0, 아래쪽이 -1이 되도록 환산

//   rayCaster.setFromCamera(new THREE.Vector2(x, y), camera); // rayCaster에 환산된 좌표와 카메라를 넘겨줌
//   const intersects = rayCaster.intersectObjects(scene.children); // scene의 children 오브젝트들 중 현재 rayCaster가 관통한 오브젝트들을 받음
//   console.log(intersects);
//   const intersectFloor = intersects.find((i) => i.object.name === "floor"); // 관통한 오브젝트들 중 이름이 'floor'인 객체를 찾음
//   newPosition.copy(intersectFloor.point); // 캐릭터가 이동할 위치벡터인 newPosition에 현재 클릭된 위치 좌표로 설정함
//   newPosition.y = 1;
// });
