import type { TextureDef } from './types'

function compileShader (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)

  if (shader === null) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) !== true) {
    gl.deleteShader(shader)

    const log = String(gl.getShaderInfoLog(shader))

    console.error(`@webgl: An error occurred compiling the shaders: ${log}`)

    return null
  }

  return shader
}

function setupShaderProgram (gl: WebGLRenderingContext, vertexShaderSrc: string, fragmentShaderSrc: string): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)

  if (vertexShader === null || fragmentShader === null) return null

  const shaderProgram = gl.createProgram()

  if (shaderProgram === null) return null

  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) !== true) {
    const log = String(gl.getProgramInfoLog(shaderProgram))

    console.error(`@webgl: Unable to initialize the shader program: ${log}`)

    return null
  }

  return shaderProgram
}

function loadTexture (
  gl: WebGLRenderingContext,
  program: WebGLShader,
  textureDef: TextureDef,
  onTextureLoaded: (error?: Error) => void
): WebGLTexture | null {
  const texture = gl.createTexture()

  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE

  if (textureDef !== null) {
    const image = new Image(width, height)

    image.onload = () => {
      gl.useProgram(program)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

      if (typeof onTextureLoaded === 'function') onTextureLoaded()
    }

    image.onerror = (_event: Event | string, _source?: string, _lineno?: number, _colno?: number, error?: Error): any => {
      if (typeof onTextureLoaded === 'function') onTextureLoaded(error)
    }

    image.crossOrigin = 'anonymous'
    image.src = textureDef
  }

  return texture
}

function setVertexAttribPointer (gl: WebGLRenderingContext, index: number, buffer: WebGLBuffer, numComponents: number): void {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  gl.vertexAttribPointer(index, numComponents, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(index)
}

export default {
  setupShaderProgram,
  loadTexture,
  setVertexAttribPointer
}
