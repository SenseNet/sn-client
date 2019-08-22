import { shallow } from 'enzyme'
import React from 'react'
import { Button } from '@material-ui/core'
import { DocumentViewerRegeneratePreviewsComponent } from '../src/components/DocumentViewerRegeneratePreviews'
import { defaultState, regeneratePreviews } from '../src/store'
import { DocumentViewerSettings } from '../src/models'
import { defaultSettings } from './__Mocks__/viewercontext'

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

  it('Should send an API Request', async () => {
    const dispatch = jest.fn()
    const regenerateFn = jest.fn()
    const getInjectable = jest.fn(
      () => ({ ...defaultSettings, regeneratePreviews: regenerateFn } as DocumentViewerSettings),
    )
    const getState = jest.fn(() => ({
      sensenetDocumentViewer: { documentState: defaultState },
    }))
    const result = regeneratePreviews()
    expect(result.type).toEqual('SN_DOCVIEWER_REGENERATE_PREVIEWS_INJECTABLE_ACTION')
    await result.inject({
      dispatch,
      getInjectable: getInjectable as any,
      getState: getState as any,
    })
    expect(regenerateFn).toBeCalled()
  })
})
