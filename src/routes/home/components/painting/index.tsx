import React from 'react'

import style from './style.module.scss'

import { LoadingPainting } from './LoadingPainting'
import usePaintingController from './usePaintingEvents'
import usePaintingLoader from './usePaintingLoader'

interface PaintingProps {
  image1: string
  image1Thumb: string
  image2: string
  image2Thumb: string
  width?: number
  height?: number
  autoload?: boolean
  animate?: boolean
}

export default function Painting ({
  image1,
  image1Thumb,
  image2,
  image2Thumb,
  width = 400,
  height = 400,
  autoload = false,
  animate = false
}: PaintingProps): JSX.Element {
  const { painting, isLoaded, canvasRef, loadingImageRef } = usePaintingLoader(image1, image2, autoload)
  const paintingEventHandlers = usePaintingController(painting, isLoaded, animate)

  const cssSize = {
    width: `${width} px`,
    height: `${height} px`
  }

  const onClick = () => {
    const canvas = canvasRef.current

    if ((canvas?.requestFullscreen) != null) {
      canvas.requestFullscreen().then().catch(_ => { })

      canvas.onfullscreenchange = (e) => {
        const isFullscreen = document.fullscreenElement === e.target

        if (isFullscreen) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
        } else {
          canvas.width = width
          canvas.height = height
        }

        painting?.updateProjection()
      }
    }
  }

  return (
    <div className={style.painting} style={{...cssSize, cursor: !animate ? 'grab' : 'default'}}>
      <canvas
        aria-label='3D painting viewer. Use the arrows keys or drag with a pointer to move'
        className={style.canvas}
        tabIndex={0}
        ref={canvasRef}
        {...cssSize}
        {...paintingEventHandlers}
      />

      {!isLoaded ? <LoadingPainting
        ref={loadingImageRef} {...{
          cssSize,
          image1: image1Thumb,
          image2: image2Thumb,
          lazyLoading: !autoload
        }}
      /> : (!animate && <button className={style.fullscreenButton} aria-label='View painting in fullscreen' onClick={onClick}/>)}
    </div>
  )
}
