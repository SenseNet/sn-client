import * as React from 'react'
import { Provider } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import * as renderer from 'react-test-renderer'
import { ZoomWidgetComponent } from '../../../src/components/document-widgets/ZoomMode'
import { documentReceivedAction } from '../../../src/store/Document'
import { defaultLocalization } from '../../../src/store/Localization'
import { exampleDocumentData, useTestContext } from '../../viewercontext'

/**
 * Zoom Mode widget tests
 */
export const zoomModeWidgetTests: Mocha.Suite = describe('ZoomModeWidget component', () => {
  let c!: renderer.ReactTestRenderer

  after(() => {
    c.unmount()
  })

  it('Should render without crashing', () => {
    useTestContext(ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

      c = renderer.create(
        <Provider store={ctx.store}>
          <ZoomWidgetComponent
            customZoomLevel={0}
            localization={defaultLocalization}
            setZoomLevel={() => ({} as any)}
            setZoomMode={() => ({} as any)}
            zoomMode="custom"
          />
        </Provider>,
      )
    })
  })

  it('ZoomMenu open / close', () => {
    c = renderer.create(
      <ZoomWidgetComponent
        customZoomLevel={0}
        localization={defaultLocalization}
        setZoomLevel={() => ({} as any)}
        setZoomMode={() => ({} as any)}
        zoomMode="custom"
      />,
    )
    const zoomMenuButton = c.root.findByType(IconButton)
    zoomMenuButton.props.onClick({ currentTarget: undefined })
    const zoomMenu = c.root.findByType(Menu)
    zoomMenu.props.onClose()
  })

  it('set zoom mode to fit', async () => {
    c = renderer.create(
      <ZoomWidgetComponent
        customZoomLevel={0}
        localization={defaultLocalization}
        setZoomLevel={() => ({} as any)}
        setZoomMode={() => ({} as any)}
        zoomMode="custom"
      />,
    )

    /* ToDo: Fix me!!!
        const zoomMenuButton = c.root.findByType(IconButton)
        zoomMenuButton.props.onClick({ currentTarget: { ...zoomMenuButton, children: [] } })
        await asyncDelay(1000)
        const button = c.root.findAllByType(MenuItem)[0];
        (button as any).props.onClick({})*/
  })
})
