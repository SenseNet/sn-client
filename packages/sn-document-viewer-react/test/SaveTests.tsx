import Save from '@material-ui/icons/Save'
import { sleepAsync } from '@sensenet/client-utils'
import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { SaveWidget } from '../src/components/document-widgets/SaveWidget'
import { documentPermissionsReceived, documentReceivedAction } from '../src/store/Document'
import {
  exampleDocumentData,
  useTestContext,
  useTestContextWithSettings,
  useTestContextWithSettingsAsync,
} from './__Mocks__/viewercontext'

/**
 * Save widget tests
 */
describe('SaveWidget component', () => {
  let c!: renderer.ReactTestRenderer

  afterEach(() => {
    c.unmount()
  })

  it('Should render without crashing', () => {
    useTestContext(ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
      c = renderer.create(
        <Provider store={ctx.store}>
          <SaveWidget />
        </Provider>,
      )
    })
  })

  it('Click on save should trigger a save request', (done: jest.DoneCallback) => {
    useTestContextWithSettings(
      {
        saveChanges: async () => {
          done()
        },
      },
      ctx => {
        ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
        ctx.store.dispatch(documentPermissionsReceived(true, true, true))

        c = renderer.create(
          <Provider store={ctx.store}>
            <SaveWidget />
          </Provider>,
        )
        const button = c.root.findByType(Save)
        button.props.onClick()
      },
    )
  })

  it('Click on save should not trigger a save request when the user has no edit permission', async () => {
    await useTestContextWithSettingsAsync(
      {
        saveChanges: async () => {
          throw Error('Save is permitted')
        },
      },
      async ctx => {
        ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
        ctx.store.dispatch(documentPermissionsReceived(false, false, false))

        c = renderer.create(
          <Provider store={ctx.store}>
            <SaveWidget />
          </Provider>,
        )
        const button = c.root.findByType(Save)
        button.props.onClick()
        await sleepAsync(100)
      },
    )
  })
})
