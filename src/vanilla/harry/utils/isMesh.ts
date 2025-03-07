import { Mesh, Object3D } from "three"

export const isMesh = (object: Object3D): object is Mesh =>
  object instanceof Mesh
