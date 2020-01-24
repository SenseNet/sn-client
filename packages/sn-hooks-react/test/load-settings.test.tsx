import React, { useContext } from 'react'
import { shallow } from 'enzyme'
import { LoadSettingsContext, LoadSettingsContextProvider } from '../src/context/load-settings'

describe('LoadSettings', () => {
  it('matches snapshot', () => {
    const p = shallow(<LoadSettingsContextProvider />)
    expect(p).toMatchSnapshot()
  })

  it('Has the default methods and settings', () => {
    const MockComponent: React.FC = () => {
      const ls = useContext(LoadSettingsContext)
      expect(ls).toEqual(undefined)
      return <div />
    }
    shallow(<MockComponent />)
  })
})
