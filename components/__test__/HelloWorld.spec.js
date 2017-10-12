import React from 'react'
import { shallow } from 'enzyme'
import { HelloWorld } from '../HelloWorld'

describe('Hello World!', () => {
  it(`Render 'Hello World!' Correctly!`, () => {
    const app = shallow(<HelloWorld />)
    expect(app).toHaveLength(1)
  })
})
