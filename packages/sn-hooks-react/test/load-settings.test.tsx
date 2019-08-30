import React from 'react'
import { shallow } from 'enzyme'
import { LoadSettingsContextProvider } from '../src/context/load-settings'

describe('LoadSettings', () => {
  it('matches snapshot', () => {
    const p = shallow(<LoadSettingsContextProvider />)
    expect(p).toMatchSnapshot()
  })
})
