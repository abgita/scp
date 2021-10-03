import { store, useStore } from '../../../../app/store'

import React from 'react'

import { PaintingBox } from './PaintingBox'
import style from './style.module.scss'

// We start fetching as soon as this module is loaded
store.dispatch('gallery/fetch')

export default function Gallery (): JSX.Element {
  const { gallery } = useStore('gallery')

  let content = null

  if (gallery.loaded) {
    if (gallery.paintings.length === 0) {
      content = 'We couldn\'t fetch the paintings. Try reloading the page'
    } else {
      content = (
        <ul className={style.cont}>
          {gallery.paintings.map(painting => (
            <li key={painting.id} className={style.paintingCont}>
              <PaintingBox {...painting} />
            </li>
          ))}
        </ul>
      )
    }
  }

  return (
    <section id='gallery' className={style.gallery}>
      <h2>Gallery{!gallery.loaded ? '...' : ''}</h2>

      {content}
    </section>
  )
}
