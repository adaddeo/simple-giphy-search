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

// it('has sets search input value to search.query state', () => {
//   const state = getInitialState()
//   state.search.query = 'hello'
//
//   const store = mockStore(state)
//   const input = <input type="text" value="hello" />
//
//   const app = mount(<App store={store} />)
//   expect(app.find('input').at(0)).toHaveValue('hello')
// })
