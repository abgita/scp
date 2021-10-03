import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

if (import.meta.env.MODE !== 'production') {
  import('@axe-core/react').then(module => {
    module.default(React, ReactDOM, 1000).then(_ => { }, console.error)
  }).catch(console.error)
}

const root = document.getElementById('root')

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
)
