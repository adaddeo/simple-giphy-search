import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import { createStore } from './state/createStore'

const rootElement = document.getElementById('root')
const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
