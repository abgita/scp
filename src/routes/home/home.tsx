import React, { Suspense } from 'react'

import style from './home.module.scss'

import Hero from './components/hero'
import Footer from './components/footer'

const Gallery = React.lazy(async () => await import('./components/gallery'))

export default function Home (): any {
  return (
    <>
      <Hero />

      <main className={style.main}>
        <Suspense fallback={<span>Loading...</span>}>
          <Gallery />
        </Suspense>
      </main>

      <Footer />
    </>
  )
}
