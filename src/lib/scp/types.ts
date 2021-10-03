interface Model {
  vertexCount: number

  positions: number[]
  normals: number[]
  texels: number[]
  indices: number[]
}

interface ModelBuffers {
  vertexCount: number

  positions: WebGLBuffer
  normals: WebGLBuffer
  texels: WebGLBuffer
  indices: WebGLBuffer
}

interface AttribLocations {
  a_xyzt: number
  a_normal: number
  a_uv: number
}

interface UniformLocations {
  u_projection_matrix: WebGLUniformLocation | null
  u_model_view_matrix: WebGLUniformLocation | null
  u_normal_matrix: WebGLUniformLocation | null
  u_texture_0: WebGLUniformLocation | null
  u_texture_1: WebGLUniformLocation | null
}

interface ProgramInfo {
  program: WebGLProgram
  attribLocations: AttribLocations
  uniformLocations: UniformLocations
}

interface PaintingRotation { x: number, y: number };

interface PaintingState {
  rotation: PaintingRotation
}

type SCPaintingController = {
  isReady: boolean
  getRotation: () => PaintingRotation

  rotate: (x: number, y: number) => void
  updateProjection: () => void
} | null

// todo: replace null with Image buffer data type
export type TextureDef = string | null

export type {
  Model, ModelBuffers,
  AttribLocations, UniformLocations, ProgramInfo,
  PaintingState,
  SCPaintingController
}
