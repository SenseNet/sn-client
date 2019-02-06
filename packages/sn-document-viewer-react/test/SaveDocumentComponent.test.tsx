import { shallow } from 'enzyme'
import React from 'react'
import { SaveDocumentComponent } from '../src/components/document-widgets/SaveWidget'
import { exampleDocumentData, examplePreviewImageData } from './__Mocks__/viewercontext'

describe('SaveDocumentComponent component', () => {
  it('Should render without crashing when has changes', () => {
    const wrapper = shallow(
      <SaveDocumentComponent
        canEdit={true}
        document={exampleDocumentData}
        saveChanges="Save"
        save={jest.fn()}
        pages={[examplePreviewImageData]}
        hasChanges={true}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should render without crashing when there are no changes', () => {
    const wrapper = shallow(
      <SaveDocumentComponent
        canEdit={true}
        document={exampleDocumentData}
        saveChanges="Save"
        save={jest.fn()}
        pages={[examplePreviewImageData]}
        hasChanges={false}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger a save request when clicked', () => {
    const save = jest.fn()
    const wrapper = shallow(
      <SaveDocumentComponent
        canEdit={true}
        document={exampleDocumentData}
        saveChanges="Save"
        save={save}
        pages={[examplePreviewImageData]}
        hasChanges={true}
      />,
    )
    wrapper.find('#Save').simulate('click')
    expect(save).toBeCalled()
  })
})
