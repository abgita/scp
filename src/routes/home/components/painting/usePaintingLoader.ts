import React, { useEffect, useReducer, useRef } from 'react'
import { SCPaintingController } from '../../../../lib/scp/types'
import { setup } from '../../../../lib/scp'

interface State {
  painting: SCPaintingController
  isLoaded: boolean
  isLoading: boolean
  failed: boolean
}

type Action = [
  'setPainting' | 'setLoaded' | 'setLoading' | 'failedToLoad',
  boolean | SCPaintingController | undefined
]

function paintingLoaderReducer (
  state: State,
  [type, value]: Action
): State {
  switch (type) {
    case 'setPainting': return { ...state, painting: value as SCPaintingController }
    case 'setLoaded': return { ...state, isLoaded: value as boolean }
    case 'setLoading': return { ...state, isLoading: value as boolean }

    case 'failedToLoad': return {
      ...state,
      painting: null,
      failed: true
    }

    default: throw Error('Wrong action type!')
  }
}

const initialState = (autoload: boolean): State => {
  return {
    painting: null,
    isLoaded: false,
    isLoading: autoload,
    failed: false
  }
}

interface Returns {
  painting: SCPaintingController
  isLoaded: boolean
  failed: boolean
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  loadingImageRef: React.MutableRefObject<HTMLImageElement | null>
}

export default function usePaintingLoader (
  image1: string,
  image2: string,
  autoload: boolean
): Returns {
  const [state, dispatch] = useReducer(paintingLoaderReducer, autoload, initialState)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loadingImageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (state.isLoading) return

    if (loadingImageRef.current === null) return

    const image = loadingImageRef.current

    image.onload = () => {
      image.onload = null

      dispatch(['setLoading', true])
    }
  }, [state.isLoading])

  useEffect(() => {
    if (!state.isLoading) return

    const timeoutId = setTimeout(() => {
      if (canvasRef.current === null) return

      const painting = setup(canvasRef.current, image1, image2, error => {
        if (error != null) {
          dispatch(['failedToLoad', true])
        } else {
          dispatch(['setLoaded', true])
        }
      })

      dispatch(['setPainting', painting])
    }, 1000)

    return () => { clearTimeout(timeoutId) }
  }, [state.isLoading, image1, image2])

  return {
    painting: state.painting,
    isLoaded: state.isLoaded,
    failed: state.failed,
    canvasRef,
    loadingImageRef
  }
}
