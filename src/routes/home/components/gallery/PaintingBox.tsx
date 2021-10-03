import React from 'react'

import Painting from '../painting'

import { Painting as PaintingType } from '../../../../app/store/gallery'
import { UnsplashLink } from './UnsplashLink'

import style from './style.module.scss'

export function PaintingBox ({ images, links, authors }: PaintingType): JSX.Element {
  return (
    <article className={style.painting}>
      <figure aria-label={`Painting formed by blending a photo by ${authors[0]} on the left and a photo by ${authors[1]} on the right`}>
        <Painting
          width={300}
          height={300}
          image1={images[0].painting}
          image2={images[1].painting}
          image1Thumb={images[0].thumb}
          image2Thumb={images[1].thumb}
          autoload={false}
        />
      </figure>

      <section className={style.paintingAttribution}>
        <div className={style.authorsAttribution}>
          <div>
            <img src={images[0].thumb} loading='lazy' alt='' />
            <span>Left photo by</span>
            <UnsplashLink url={links[0]} text={authors[0]} />
          </div>

          <div>
            <img src={images[1].thumb} loading='lazy' alt='' />
            <span>Right photo by</span>
            <UnsplashLink url={links[1]} text={authors[1]} />
          </div>
        </div>

        <div className={style.unsplashAttribution}>
          Photos by <UnsplashLink url='https://unsplash.com/' text='Unsplash' />
        </div>
      </section>
    </article>
  )
}
