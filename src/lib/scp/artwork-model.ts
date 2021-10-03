import { Model } from './types'

type StripsEnds = number[][]

function getStripsEnds (numStrips: number): StripsEnds {
  const stripsEnds = new Array(numStrips / 2)

  for (let i = 0; i < stripsEnds.length; i++) {
    const r = Math.random()

    const top = 0.05 + 0.05 * r
    const bottom = 1 - top

    stripsEnds[i] = [top, bottom]
  }

  return stripsEnds
}

function getVerticesPositions (numStrips: number, stripsEnds: StripsEnds): number[] {
  const verticesPerQuad = 4
  const componentsPerVertex = 4
  const stride = verticesPerQuad * componentsPerVertex

  const positions = new Array(numStrips * stride)

  const setVertex = (offset: number, x: number, y: number, z: number, textureIndex: number): void => {
    positions[offset] = x
    positions[offset + 1] = y
    positions[offset + 2] = z
    positions[offset + 3] = textureIndex
  }

  const stripWidth = 1.0 / numStrips

  let stripTop = 0
  let stripBottom = 0
  let stripLeft = -0.5

  for (let offset = 0, j = 0; offset < positions.length; offset += stride) {
    const strip = offset === 0 ? 0 : offset / stride

    const textureIndex = j++ % 2

    const z = 1
    const leftSideZ = z + stripWidth * textureIndex
    const rightSideZ = z + stripWidth * (j % 2)

    if (strip % 2 === 0) {
      const stripEnds = stripsEnds[strip * 0.5]

      stripTop = -0.5 + stripEnds[0]
      stripBottom = -0.5 + stripEnds[1]
    }

    const stripRight = stripLeft + stripWidth

    setVertex(offset, stripLeft, stripTop, leftSideZ, textureIndex)
    setVertex(offset + 4, stripLeft, stripBottom, leftSideZ, textureIndex)
    setVertex(offset + 8, stripRight, stripBottom, rightSideZ, textureIndex)
    setVertex(offset + 12, stripRight, stripTop, rightSideZ, textureIndex)

    stripLeft += stripWidth
  }

  return positions
}

function getVerticesNormals (numStrips: number): number[] {
  const verticesPerQuad = 4
  const componentsPerVertex = 3
  const stride = verticesPerQuad * componentsPerVertex

  const normals = new Array(numStrips * stride)

  const setVertex = (offset: number, x: number, y: number, z: number): void => {
    normals[offset] = x
    normals[offset + 1] = y
    normals[offset + 2] = z
  }

  for (let i = 0; i < normals.length; i += stride) {
    const strip = i === 0 ? 0 : i / stride
    const left = strip % 2 === 0

    const nx = left ? -0.5 : 0.5
    const ny = 0
    const nz = 1

    setVertex(i, nx, ny, nz)
    setVertex(i + 3, nx, ny, nz)
    setVertex(i + 6, nx, ny, nz)
    setVertex(i + 9, nx, ny, nz)
  }

  return normals
}

function getVerticesTexels (numStrips: number, stripsEnds: StripsEnds): number[] {
  const verticesPerQuad = 4
  const componentsPerVertex = 2
  const stride = verticesPerQuad * componentsPerVertex

  const texels = new Array(numStrips * stride)

  const setVertex = (offset: number, x: number, y: number): void => {
    texels[offset] = x
    texels[offset + 1] = y
  }

  const stripWidth = 1.0 / numStrips

  let left = -stripWidth
  let top = 0
  let bottom = 0

  for (let i = 0; i < texels.length; i += stride) {
    const strip = i === 0 ? 0 : i / stride

    if (strip % 2 === 0) {
      [top, bottom] = stripsEnds[strip * 0.5]

      left += stripWidth * 2
    }

    setVertex(i, left, bottom)
    setVertex(i + 2, left, top)
    setVertex(i + 4, left + stripWidth, top)
    setVertex(i + 6, left + stripWidth, bottom)
  }

  return texels
}

function getIndices (vertexCount: number): number[] {
  const indices = new Array(vertexCount)

  for (let i = 0, j = 0; i < indices.length; i += 6, j += 4) {
    indices[i] = j
    indices[i + 1] = j + 1
    indices[i + 2] = j + 2
    indices[i + 3] = j + 2
    indices[i + 4] = j + 3
    indices[i + 5] = j
  }

  return indices
}

function getModel (numStrips = 512): Model {
  const vertexCount = numStrips * 6

  const stripsEnds = getStripsEnds(numStrips)

  const positions = getVerticesPositions(numStrips, stripsEnds)
  const normals = getVerticesNormals(numStrips)
  const texels = getVerticesTexels(numStrips, stripsEnds)
  const indices = getIndices(vertexCount)

  return {
    vertexCount,

    positions,
    normals,
    texels,
    indices
  }
}

export default {
  get: getModel
}
