import { mount, shallow } from 'enzyme'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { SaveWidget } from '../src/components/document-widgets/SaveWidget'
import { defaultViewerState, ViewerStateContext } from '../src/context/viewer-state'
import { DocumentViewerApiSettingsContext } from '../src/context/api-settings'
import { DocumentPermissionsContext } from '../src/context/document-permissions'

describe('SaveDocumentComponent component', () => {
  it('Should render without crashing when has changes', () => {
    const wrapper = shallow(<SaveWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing when there are no changes', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider value={{ ...defaultViewerState, hasChanges: true }}>
        <SaveWidget />
      </ViewerStateContext.Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a save request when clicked', () => {
    const save = jest.fn()
    const wrapper = mount(
      <DocumentPermissionsContext.Provider value={{ canEdit: true } as any}>
        <DocumentViewerApiSettingsContext.Provider value={{ saveChanges: save } as any}>
          <ViewerStateContext.Provider value={{ ...defaultViewerState, hasChanges: true }}>
            <SaveWidget />
          </ViewerStateContext.Provider>
        </DocumentViewerApiSettingsContext.Provider>
      </DocumentPermissionsContext.Provider>,
    )

    wrapper.find(IconButton).simulate('click')
    expect(save).toBeCalled()
  })
})
