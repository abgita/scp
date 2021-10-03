import React, { forwardRef } from 'react'

import style from './style.module.scss'

interface LoadingPaintingProps {
  cssSize: {
    width: string
    height: string
  }
  image1: string
  image2: string
  lazyLoading: boolean
}

export const LoadingPainting = forwardRef(({ cssSize, image1, image2, lazyLoading }: LoadingPaintingProps, ref: any) => (
  <div className={style.loading} style={cssSize} aria-hidden='true'>
    <img
      src={image1}
      alt='First image of the painting'
      {...cssSize}
      loading={lazyLoading ? 'lazy' : 'eager'}
    />

    <img
      ref={ref}
      src={image2}
      alt='Second image of the painting'
      {...cssSize}
      loading={lazyLoading ? 'lazy' : 'eager'}
    />
  </div>
))
