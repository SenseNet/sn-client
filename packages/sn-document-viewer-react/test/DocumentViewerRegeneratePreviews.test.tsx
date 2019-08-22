import { shallow } from 'enzyme'
import React from 'react'
import { Button } from '@material-ui/core'
import { DocumentViewerRegeneratePreviewsComponent } from '../src/components/DocumentViewerRegeneratePreviews'

describe('Document Regenerate Previews component', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(
      <DocumentViewerRegeneratePreviewsComponent
        regenerateButton=""
        regeneratePreviewsText=""
        regeneratePreviews={() => ({
          type: '',
          inject: async () => {
            /** */
          },
        })}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Should trigger regeneration on button click', () => {
    const regenerate = jest.fn(async () => undefined)
    const wrapper = shallow(
      <DocumentViewerRegeneratePreviewsComponent
        regenerateButton=""
        regeneratePreviewsText=""
        regeneratePreviews={regenerate as any}
      />,
    )

    wrapper.find(Button).simulate('click')
    expect(regenerate).toBeCalled()

    expect(wrapper).toMatchSnapshot()
  })
})
