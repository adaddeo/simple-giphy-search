import { shallow } from 'enzyme'
import React from 'react'
import { App } from './App'
import FullscreenViewer from './FullscreenViewer'
import Gifs from './Gifs'

describe('<App />', () => {
  it('renders without creashing', () => {
    const props = {
      search: jest.fn()
    }
    const wrapper = shallow(<App {...props} />)
    expect(wrapper.find('.app')).toExist()
    expect(wrapper.find(Gifs)).toExist('')
    expect(wrapper.find(FullscreenViewer)).toExist('')
  })

  it('renders Gifs and FullscreenViewer', () => {
    const props = {
      search: jest.fn()
    }
    const wrapper = shallow(<App {...props} />)
    expect(wrapper.find(Gifs)).toExist('')
    expect(wrapper.find(FullscreenViewer)).toExist('')
  })

  it('renders a controlled input and updates onChange', () => {
    const props = {
      search: jest.fn()
    }
    const wrapper = shallow(<App {...props} />)
    expect(wrapper.find('input')).toHaveValue('')

    const value = 'new val'
    wrapper.find('input').simulate('change', { target: { value } })
    expect(wrapper.find('input')).toHaveValue(value)
  })
})
