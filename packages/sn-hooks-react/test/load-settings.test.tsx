import { shallow } from 'enzyme'
import React, { useContext } from 'react'
import { LoadSettingsContext, LoadSettingsContextProvider } from '../src/context/load-settings'

describe('LoadSettings', () => {
  it('matches snapshot', () => {
    const p = shallow(<LoadSettingsContextProvider />)
    expect(p).toMatchSnapshot()
  })

  it('Has the default methods and settings', () => {
    const MockComponent: React.FC = () => {
      const ls = useContext(LoadSettingsContext)
      ls.setLoadAncestorsSettings({})
      ls.setLoadChildrenSettings({})
      ls.setLoadSettings({})
      expect(ls.loadAncestorsSettings).toEqual({})
      expect(ls.loadChildrenSettings).toEqual({})
      expect(ls.loadSettings).toEqual({})
      return <div />
    }
    shallow(<MockComponent />)
  })
})
