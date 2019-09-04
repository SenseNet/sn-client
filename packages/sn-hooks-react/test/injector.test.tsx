import React from 'react'
import { shallow } from 'enzyme'
import { InjectorContext } from '../src/context/injector'

describe('Injector', () => {
  it('matches snapshot', () => {
    const p = shallow(<InjectorContext.Consumer>{() => <></>}</InjectorContext.Consumer>)
    expect(p).toMatchSnapshot()
  })
})
