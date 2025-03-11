import "./style.css"

import {
  AnimationMixer,
  Clock,
  DoubleSide,
  LoopPingPong,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  RectAreaLight,
  Scene,
  SpotLight,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js"
import { isMesh } from "./utils/isMesh.ts"
import { aspect } from "./utils/aspect.ts"

const SPOT_LIGHT_COUNT = 10
const SPOT_LIGHT_COLORS = [0xff0000, 0x00ff00, 0x0000ff]
const AUDIENCE_NUMBER = 40
const FLOOR_SIZE = 30
const FLOOR_HALF_SIZE = FLOOR_SIZE / 2
const root = document.body

const scene = new Scene()

const light = new SpotLight(0xffffff, 10, undefined, Math.PI / 6, 1, 0.5)
light.position.set(0, 10, 0)
light.castShadow = true
scene.add(light)

const spotLights = Array.from({ length: SPOT_LIGHT_COUNT }, () => {
  const index = Math.floor(Math.random() * SPOT_LIGHT_COLORS.length)
  const light = new SpotLight(
    SPOT_LIGHT_COLORS[index],
    10,
    undefined,
    Math.PI / 15,
    1,
    0.5
  )
  light.position.set(0, 10, 0)

  const target = new Object3D()
  const theta = Math.random() * 2 * Math.PI
  const r = Math.floor(Math.random() * FLOOR_HALF_SIZE)
  const direction = Math.random() > 0.5 ? -1 : 1

  target.position.set(r * Math.cos(theta), 0, r * Math.sin(theta))
  light.target = target

  scene.add(light)
  scene.add(target)

  return { light, target, r, direction }
})

const positions: [x: number, y: number, z: number][] = [
  [FLOOR_HALF_SIZE, 0.5, 0],
  [-FLOOR_HALF_SIZE, 0.5, 0],
  [0, 0.5, FLOOR_HALF_SIZE],
  [0, 0.5, -FLOOR_HALF_SIZE]
]
positions.forEach((position) => {
  const rectAreaLight = new RectAreaLight(0x0000ff, 5, FLOOR_SIZE, 1)
  rectAreaLight.position.set(...position)
  rectAreaLight.lookAt(0, 0, 0)
  scene.add(rectAreaLight)
})

const floor = new Mesh(
  new PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE),
  new MeshStandardMaterial({
    color: 0xffffff,
    side: DoubleSide
  })
)
floor.name = "floor"
floor.rotation.set(Math.PI / 2, 0, 0)
floor.receiveShadow = true
scene.add(floor)

const loader = new GLTFLoader()
const { scene: dancer, animations } = await loader.loadAsync("/dancer.glb")
dancer.position.set(0, 1.66, 0)
dancer.scale.set(0.02, 0.02, 0.02)
dancer.receiveShadow = true
dancer.castShadow = true
dancer.traverse((object) => {
  if (isMesh(object)) {
    object.castShadow = true
    object.receiveShadow = true
  }
})
scene.add(dancer)

const audience = Array.from({ length: AUDIENCE_NUMBER }, () => {
  return [
    Math.floor(Math.random() * FLOOR_HALF_SIZE) *
      (Math.random() > 0.5 ? -1 : 1),
    1.66,
    Math.floor(Math.random() * FLOOR_HALF_SIZE) * (Math.random() > 0.5 ? -1 : 1)
  ]
}).map(([x, y, z]) => {
  const person = clone(dancer)
  const mixer = new AnimationMixer(person)
  person.position.set(x, y, z)
  return { person, mixer }
})

audience.forEach(({ person, mixer }) => {
  scene.add(person)
  const index = Math.floor(Math.random() * animations.length)
  mixer.clipAction(animations[index]).setLoop(LoopPingPong, Infinity).play()
})

light.target = dancer

const mixer = new AnimationMixer(dancer)
const actions = animations.map((animation) => {
  const action = mixer.clipAction(animation)
  action.setLoop(LoopPingPong, Infinity)
  return action
})

const destination = new Vector3(0, 1.66, 0)
const rayCaster = new Raycaster()
root.addEventListener("pointerdown", (e: PointerEvent) => {
  if (e.pointerType === "mouse" && e.button !== 2) {
    return
  }
  const { clientX, clientY } = e
  const x = (2 * clientX) / window.innerWidth - 1
  const y = 1 - (2 * clientY) / window.innerHeight
  rayCaster.setFromCamera(new Vector2(x, y), camera)
  const intersections = rayCaster.intersectObjects(scene.children)
  const floor = intersections.find(
    (intersection) => intersection.object.name === "floor"
  )
  if (floor) {
    destination.copy(floor.point)
  }
  destination.setY(1.66)
})

const camera = new PerspectiveCamera(60, aspect())
camera.aspect = aspect()
camera.position.set(FLOOR_HALF_SIZE, FLOOR_HALF_SIZE, FLOOR_HALF_SIZE)
camera.lookAt(dancer.position.x, dancer.position.y, dancer.position.z)

const controls = new OrbitControls(camera, root)
controls.enableDamping = true
controls.enablePan = false

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
root.appendChild(renderer.domElement)

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = aspect()
  camera.updateProjectionMatrix()
})

const delta = new Vector3()

const clock = new Clock()
const render = () => {
  dancer.lookAt(destination)
  camera.lookAt(dancer.position)

  delta
    .subVectors(destination, dancer.position)
    .normalize()
    .multiplyScalar(0.08)

  const isMove =
    Math.abs(dancer.position.x - destination.x) > 0.05 &&
    Math.abs(dancer.position.z - destination.z) > 0.05
  if (isMove) {
    dancer.position.x += delta.x
    dancer.position.z += delta.z
    actions.forEach((action, index) => {
      if (index !== 3 && action.isRunning()) {
        action.stop()
      }
      if (index === 3 && !action.isRunning()) {
        action.play()
      }
    })
  }
  if (!isMove) {
    actions.forEach((action, index) => {
      if (index !== 4 && action.isRunning()) {
        action.stop()
      }
      if (index === 4 && !action.isRunning()) {
        action.play()
      }
    })
  }

  const deltaT = clock.getDelta()

  spotLights.forEach(({ target, r, direction }) => {
    let theta = Math.atan(target.position.z / Math.abs(target.position.x))
    if (Math.sign(target.position.x) === -1) {
      theta +=
        theta > 0 ? 2 * (Math.PI / 2 - theta) : -2 * (Math.PI / 2 + theta)
    }
    target.position.x = r * Math.cos(theta + direction * 2 * deltaT)
    target.position.z = r * Math.sin(theta + direction * 2 * deltaT)
  })

  mixer.update(deltaT)
  audience.forEach(({ mixer }) => mixer.update(deltaT))
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

requestAnimationFrame(render)

const audio = document.createElement("audio")
audio.autoplay = true
audio.loop = true
audio.volume = 1
audio.style.visibility = "hidden"

const source = document.createElement("source")
source.src = "club.mp3"
source.type = "audio/mp3"

audio.appendChild(source)
document.body.appendChild(audio)

root.addEventListener("pointerdown", () => {
  if (audio.paused) {
    audio.play()
  }
})
