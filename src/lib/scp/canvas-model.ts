import { Model } from './types'

function getModel (): Model {
  const pz = 1
  const pt = 0

  const indices = [0, 1, 2, 2, 3, 0]

  const positions = [
    -0.5, -0.5, pz, pt,
    -0.5, 0.5, pz, pt,
    0.5, 0.5, pz, pt,
    0.5, -0.5, pz, pt
  ]

  const normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
  const texels = [0, 1, 0, 0, 1, 0, 1, 1]

  return {
    vertexCount: indices.length,

    positions,
    normals,
    texels,
    indices
  }
}

export default {
  get: getModel
}
