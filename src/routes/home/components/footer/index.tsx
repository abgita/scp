import React from 'react'

import style from './footer.module.scss'

export default function Footer (): JSX.Element {
  return (
    <footer className={style.footer}>
      <div>
        Source code on: {}

        <a href='https://github.com/abgita/scp'>https://github.com/abgita/scp</a>
      </div>

      <div>
        <a rel='license' href='http://creativecommons.org/licenses/by/4.0/'>
          <img alt='Creative Commons License' src='https://i.creativecommons.org/l/by/4.0/88x31.png' width='88px' height='31px' />
        </a>

        This work is licensed under a {}
        <a rel='license' href='http://creativecommons.org/licenses/by/4.0/'>
          Creative Commons Attribution 4.0 International License
        </a>
      </div>
    </footer>
  )
}
