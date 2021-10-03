import { mat4 } from 'gl-matrix'

import shaderSrc from './shader'
import webgl from './webgl'

import canvasModel from './canvas-model'
import artworkModel from './artwork-model'

import { Model, ModelBuffers, PaintingState, ProgramInfo, SCPaintingController, TextureDef } from './types'

const toRadians = Math.PI / 180.0

function setModelBuffers (gl: WebGLRenderingContext, model: Model): ModelBuffers | null {
  const positionsBuffer = gl.createBuffer()
  const normalsBuffer = gl.createBuffer()
  const texelsBuffer = gl.createBuffer()
  const indicesBuffer = gl.createBuffer()

  if (positionsBuffer == null) return null
  if (normalsBuffer == null) return null
  if (texelsBuffer == null) return null
  if (indicesBuffer == null) return null

  gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.positions), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, texelsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.texels), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW)

  return {
    vertexCount: model.vertexCount,

    positions: positionsBuffer,
    normals: normalsBuffer,
    texels: texelsBuffer,
    indices: indicesBuffer
  }
}

function setupShaderProgram (gl: WebGLRenderingContext): ProgramInfo | null {
  const shaderProgram = webgl.setupShaderProgram(gl, shaderSrc.vertex, shaderSrc.fragment)

  if (shaderProgram == null) return null

  return {
    program: shaderProgram,

    attribLocations: {
      a_xyzt: gl.getAttribLocation(shaderProgram, 'a_xyzt'),
      a_normal: gl.getAttribLocation(shaderProgram, 'a_normal'),
      a_uv: gl.getAttribLocation(shaderProgram, 'a_uv')
    },

    uniformLocations: {
      u_projection_matrix: gl.getUniformLocation(shaderProgram, 'u_projection_matrix'),
      u_model_view_matrix: gl.getUniformLocation(shaderProgram, 'u_model_view_matrix'),
      u_normal_matrix: gl.getUniformLocation(shaderProgram, 'u_normal_matrix'),
      u_texture_0: gl.getUniformLocation(shaderProgram, 'u_texture_0'),
      u_texture_1: gl.getUniformLocation(shaderProgram, 'u_texture_1')
    }
  }
}

function setupScene (
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo
): void {
  gl.useProgram(programInfo.program)

  gl.clearColor(0.9, 0.9, 0.9, 1.0)
  gl.clearDepth(10.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  setProjection(gl, programInfo)
}

function bindTextures (
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  t1: WebGLTexture,
  t2: WebGLTexture
): void {
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, t1)

  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, t2)

  gl.uniform1i(programInfo.uniformLocations.u_texture_0, 1)
  gl.uniform1i(programInfo.uniformLocations.u_texture_1, 0)
}

function setProjection (
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo
): void {
  const fieldOfView = 45 * toRadians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 10.0
  const projectionMatrix = mat4.create()

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  gl.uniformMatrix4fv(programInfo.uniformLocations.u_projection_matrix, false, projectionMatrix)
}

function setModelMatrix (
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  canvasState: PaintingState
): void {
  const modelViewMatrix = mat4.create()

  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -2.5])
  mat4.scale(modelViewMatrix, modelViewMatrix, [1.0, 1.0, 1.0])

  mat4.rotate(modelViewMatrix, modelViewMatrix, 38 * toRadians * -canvasState.rotation.x, [0, 1, 0])
  mat4.rotate(modelViewMatrix, modelViewMatrix, 90 * toRadians * canvasState.rotation.y, [1, 0, 0])

  const normalMatrix = mat4.create()

  mat4.invert(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)

  gl.uniformMatrix4fv(programInfo.uniformLocations.u_model_view_matrix, false, modelViewMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.u_normal_matrix, false, normalMatrix)
}

function drawModel (
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: ModelBuffers
): void {
  webgl.setVertexAttribPointer(gl, programInfo.attribLocations.a_xyzt, buffers.positions, 4)
  webgl.setVertexAttribPointer(gl, programInfo.attribLocations.a_normal, buffers.normals, 3)
  webgl.setVertexAttribPointer(gl, programInfo.attribLocations.a_uv, buffers.texels, 2)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)
  gl.drawElements(gl.TRIANGLES, buffers.vertexCount, gl.UNSIGNED_SHORT, 0)
}

function drawScene (
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  paintingState: PaintingState,
  t1: WebGLTexture,
  t2: WebGLTexture,
  model1: ModelBuffers,
  model2: ModelBuffers
): () => void {
  return () => {
    gl.useProgram(programInfo.program)

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    bindTextures(gl, programInfo, t1, t2)

    setModelMatrix(gl, programInfo, paintingState)

    drawModel(gl, programInfo, model1)
    drawModel(gl, programInfo, model2)
  }
}

export function setup (
  canvasElement: HTMLCanvasElement,
  image1: TextureDef,
  image2: TextureDef,
  onLoadedCallback: (error?: Error) => void
): SCPaintingController {
  const gl = canvasElement.getContext('webgl', {
    alpha: false,
    antialias: true,
    depth: true,
    desynchronized: true,
    stencil: false
  }
  )

  if (gl == null) {
    console.error('@scp: Error getting a WebGL context')

    return null
  }

  const programInfo = setupShaderProgram(gl)

  if (programInfo === null) {
    console.error('@scp: Error setting up shaders')

    return null
  }

  const canvasModelBuffers = setModelBuffers(gl, canvasModel.get())
  const linesModelBuffers = setModelBuffers(gl, artworkModel.get(400/* gl.canvas.width * 0.6 */))

  if (canvasModelBuffers == null || linesModelBuffers == null) {
    console.error('@scp: Error creating buffers')

    return null
  }

  const paintingState: PaintingState = {
    rotation: {
      x: 0.0,
      y: -0.0
    }
  }

  let texturesLoaded = 0

  let t1: WebGLTexture | null = null
  let t2: WebGLTexture | null = null

  let draw: () => void

  const onTextureLoaded = (error?: Error) => {
    if (texturesLoaded >= 2) return

    if (error !== undefined) {
      if (onLoadedCallback !== undefined) {
        onLoadedCallback(error)

        return
      }
    }

    texturesLoaded++

    if (texturesLoaded === 2) {
      draw()
      onLoadedCallback()
    }
  }

  t1 = webgl.loadTexture(gl, programInfo.program, image1, onTextureLoaded)
  t2 = webgl.loadTexture(gl, programInfo.program, image2, onTextureLoaded)

  if (t1 == null || t2 == null) return null

  setupScene(gl, programInfo)

  draw = drawScene(gl, programInfo, paintingState, t1, t2, canvasModelBuffers, linesModelBuffers)

  return {
    isReady: true,

    getRotation () {
      return { ...paintingState.rotation }
    },

    rotate (x: number, y: number) {
      paintingState.rotation = { x, y }

      draw()
    },

    updateProjection () {
      setProjection(gl, programInfo)
      draw()
    }
  }
}
