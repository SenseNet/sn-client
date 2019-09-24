import { shallow } from 'enzyme'
import React from 'react'
import { Button } from '@material-ui/core'
import { DocumentViewerRegeneratePreviews } from '../src/components/DocumentViewerRegeneratePreviews'
import { DocumentViewerApiSettingsContext } from '../src/context/api-settings'
import { defaultSettings } from './__Mocks__/viewercontext'

describe('Document Regenerate Previews component', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<DocumentViewerRegeneratePreviews />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger regeneration on button click', () => {
    const regeneratePreviews = jest.fn(async () => undefined)
    const wrapper = shallow(
      <DocumentViewerApiSettingsContext.Provider value={{ ...defaultSettings, regeneratePreviews }}>
        <DocumentViewerRegeneratePreviews />
      </DocumentViewerApiSettingsContext.Provider>,
    )
    wrapper.find(Button).simulate('click')
    expect(regeneratePreviews).toBeCalled()

    expect(wrapper).toMatchSnapshot()
  })
})
