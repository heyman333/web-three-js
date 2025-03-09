// Threejs로 애니메이션 구현하기

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


const audioElement = new Audio("/hiphop.mp3");

window.addEventListener("click", () => {
  audioElement.play();
});

// 
// renderer(송출 기계)
const renderer = new THREE.WebGLRenderer({ antialias: true });

// renderer가 그림자를 나타낼 수 있도록 함
renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 품질은 가장 좋음, 성능은 가장 낮음

// renderer 크기 설정
renderer.setSize(window.innerWidth, window.innerHeight);

// renderer의 캔버스를 body에 추가
document.body.appendChild(renderer.domElement);

// scene(촬영 장소)
const scene = new THREE.Scene();

// camera(촬영 카메라)
const camera = new THREE.PerspectiveCamera(
  60, // fov(시야각)
  window.innerWidth / window.innerHeight, // 카메라가 담을 가로 세로 비율
  0.1, // 카메라가 피사체를 담을 수 있는 범위의 하한
  1000 // 카메라가 피사체를 담을 수 있는 범위의 상한
);

// 바닥 만들기
const geometry = new THREE.BoxGeometry(15, 3, 15); 
const floorMaterial = new THREE.MeshStandardMaterial({ color: 'white' });
const floor = new THREE.Mesh(geometry, floorMaterial);
floor.position.y = -1.5;
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

// const emientLight = new THREE.AmbientLight("white", 10);
// scene.add(emientLight);


// 화면 사이즈가 변경될 때
window.addEventListener("resize", () => {
  // 카메라의 가로세로 비율을 바뀐 비율로 재설정
  camera.aspect = window.innerWidth / window.innerHeight;

  // 위에서 바뀐 속성 정보 적용
  camera.updateProjectionMatrix();

  // renderer에도 바뀐 가로 세로 사이즈 적용
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 바뀐 상태로 리랜더
  renderer.render(scene, camera);
});

const gltfLoader = new GLTFLoader();

// gltfLoader를 이용해서 glb파일 모델링을 로드함
const gltf = await gltfLoader.loadAsync('./dancer.glb');
const character = gltf.scene; // 모델링의 골격과 옷
const animationClips = gltf.animations; // 모델링의 애니메이션[]

character.position.y = 1.25; // 높이 조정
character.position.z = 3; // 앞뒤 조정
character.scale.set(0.015, 0.015, 0.015); // 크기 조정

// character는 여러개의 부품 메시로 이루어져 있으므로, 각각의 메시에 대하여 그림자 설정을 모두 해주어야 정상적으로 그림자 효과를 낼 수 있다.
character.traverse((mesh) => {
  if (mesh.isMesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
});

// 애니메이션 클립을 관리하는 믹서

let currentActionIndex = 0;

const mixer = new THREE.AnimationMixer(character);
const playNextAction = () => {
  const clip = animationClips[currentActionIndex];
  const action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1);
  
  action.play();
  
};

mixer.addEventListener('finished', () => {
  currentActionIndex = (currentActionIndex + 1) % animationClips.length;
  playNextAction();
});

// Start the first action
playNextAction();






scene.add(character);

camera.position.set(-1, 9, 10);

const targetObj1 = new THREE.Object3D();
scene.add(targetObj1);
const targetObj2 = new THREE.Object3D();
scene.add(targetObj2);
const targetObj3 = new THREE.Object3D();
scene.add(targetObj3);



const spotLight = new THREE.SpotLight("red", 10, 100, Math.PI / 4, 1, 1);
spotLight.castShadow = true;
spotLight.position.set(8, 2, 8);
spotLight.target = targetObj1;
spotLight.target.position.set(0, 0, 2);
scene.add(spotLight);


const spotLight2 = new THREE.SpotLight("yellow", 10, 100, Math.PI / 4, 1, 1);
spotLight2.castShadow = true;
spotLight2.position.set(-9, 2, 8);
spotLight2.target = targetObj2;
spotLight2.target.position.set(0, 0, 2);
scene.add(spotLight2);

const spotLight3 = new THREE.SpotLight("blue", 10, 100, Math.PI / 4, 1, 1);
spotLight3.castShadow = true;
spotLight3.position.set(0, 2, 8);
spotLight3.target = targetObj3;
spotLight3.target.position.set(0, 0, 2);
scene.add(spotLight3);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // 기본값: false, 카메라 시점을 돌릴 때, 바로 멈추는게 아닌, 좀 더 진행방향으로 이동 후 멈추는 효과 (update 메소드를 애니메이션 프레임 안에서 실행해야 정상적으로 동작함)
orbitControls.dampingFactor = 0.03; // 기본값: 0.05, enableDamping이 true일 때, 값이 작아질수록 더욱 부드럽게 정지됨

const clock = new THREE.Clock();
const render = () => {
  orbitControls.update();

  camera.position.x = Math.sin(Date.now() * 0.0005) * 5;
  camera.position.y = Math.abs(Math.sin(Date.now() * 0.0005)) + 1;
  camera.lookAt(0, 0, 0);

  spotLight.target.position.x = Math.sin(Date.now() * 0.004) * 3;
  spotLight2.target.position.x = Math.sin(Date.now() * 0.004) * 3;
  spotLight3.target.position.y = Math.sin(Date.now() * 0.004) * 3;

  // 믹서 업데이트
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
  // 애니메이션 프레임 루프에서 재귀적으로 계속 렌더함수를 호출하여 애니메이션 처리
  requestAnimationFrame(render);
};
// renderer로 scene과 camera를 받아 render(캔버스에 송출)
render();