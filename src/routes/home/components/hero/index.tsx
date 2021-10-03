import React from 'react'

import style from './hero.module.scss'

import image1 from '../../../../../assets/images/t0.png'
import image2 from '../../../../../assets/images/t1.png'
import Painting from '../painting'

export default function Hero (): JSX.Element {
  return (
    <header className={style.hero}>
      <div className={style.content}>
        <div className={style.titleCont}>
          <div className={style.title}>
            <h1>Sergi Cadenas<sup><small>*</small></sup> <span className={style.marked}>Like</span> Digital Paintings.</h1>
          </div>

          <article className={style.painting}>
            <figure className={style.figure}>
              <Painting
                width={300} height={300}
                image1={image1}
                image2={image2}
                image1Thumb={image1}
                image2Thumb={image2}
                autoload
              />
              <figcaption>Beauty versus Intelligence (Marilyb/Einstein)</figcaption>
            </figure>
          </article>
        </div>

        <div className={style.description}>
          <p>
            Sergi Cadenas is a self-taught artist whose desire to experiment and discover new
            ways of creating has led him to paint three-dimensional works in oil in which, depending
            on which angle you look at them, the represented image changes.
          </p>

          <p>
            <a href='https://barnadas.com/en/artist/sergi_cadenas/' target='_blank' rel='noreferrer'>
              Know more about his work
            </a>
            {} on Jordi Barnadas™ Gallery.
          </p>
        </div>
      </div>

      <p className={style.disclaimer}>
        <sup>*</sup>This project is not produced, supported, or endorsed by neither Sergi Cadenas or Jordi Barnadas™ Gallery
      </p>
    </header>
  )
}
