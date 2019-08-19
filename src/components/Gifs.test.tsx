import { shallow } from 'enzyme'
import React from 'react'
import { Gifs } from './Gifs'
import Loader from './Loader'

describe('<Gifs />', () => {
  beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }
    })
  })

  it('renders without creashing', () => {
    const props = {
      query: '',
      gifs: [],
      isLoading: false,
      moreGifs: true,
      fetchGifs: jest.fn(),
      openGif: jest.fn()
    }
    const wrapper = shallow(<Gifs {...props} />)
    expect(wrapper.find('div')).toExist()
  })

  it('display gifs', () => {
    const props = {
      query: '',
      gifs: [{ id: 0 }],
      isLoading: false,
      moreGifs: true,
      fetchGifs: jest.fn(),
      openGif: jest.fn()
    }
    const wrapper = shallow(<Gifs {...props} />)
    expect(wrapper.find('div').at(1).children()).toHaveLength(1)
  })

  it('displays the loader when loading', () => {
    const props = {
      query: '',
      gifs: [{ id: 0 }],
      isLoading: true,
      moreGifs: true,
      fetchGifs: jest.fn(),
      openGif: jest.fn()
    }
    const wrapper = shallow(<Gifs {...props} />)
    expect(wrapper.find(Loader)).toExist()
  })

  it('does not display the loader when  not loading', () => {
    const props = {
      query: '',
      gifs: [{ id: 0 }],
      isLoading: false,
      moreGifs: true,
      fetchGifs: jest.fn(),
      openGif: jest.fn()
    }
    const wrapper = shallow(<Gifs {...props} />)
    expect(wrapper.find(Loader)).not.toExist()
  })
})
