import { shallow } from 'enzyme'
import React from 'react'
import { InjectorContext } from '../src/context/injector'

describe('Injector', () => {
  it('matches snapshot', () => {
    const p = shallow(<InjectorContext.Consumer>{() => <></>}</InjectorContext.Consumer>)
    expect(p).toMatchSnapshot()
  })
})
