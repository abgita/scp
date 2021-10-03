import React from 'react'
import { StoreContext } from 'storeon/react'
import { store } from './app/store'

import Home from './routes/home/home'

function App (): any {
  return (
    <StoreContext.Provider value={store}>
      <Home />
    </StoreContext.Provider>
  )
}

export default App
