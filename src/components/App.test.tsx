import { mount } from 'enzyme'
import React from 'react'
import ReactDOM from 'react-dom'
import createMockStore from 'redux-mock-store'
import App from './App'

const mockStore = createMockStore()
const getInitialState = () => ({
  search: {
    query: '',
    gifs: []
  },
  trending: {
    gifs: []
  }
})

it('renders without crashing', () => {
  const store = mockStore(getInitialState())
  const div = document.createElement('div')
  ReactDOM.render(<App store={store} /> , div)
  ReactDOM.unmountComponentAtNode(div)
})
