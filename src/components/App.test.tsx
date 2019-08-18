import { shallow } from 'enzyme'
import React from 'react'
import { App } from './App'

it('renders without creashing', () => {
  const props = {
    search: jest.fn()
  }
  const wrapper = shallow(<App {...props} />)
  expect(wrapper.find('.app')).toExist()
  expect(wrapper.find('input')).toHaveValue('')
})
