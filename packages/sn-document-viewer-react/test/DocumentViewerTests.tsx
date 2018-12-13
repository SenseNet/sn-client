import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { DocumentViewerError } from '../src/components'
import { DocumentViewer } from '../src/components/DocumentViewer'
import { exampleDocumentData, useTestContext, useTestContextWithSettings } from './__Mocks__/viewercontext'

/**
 * Tests for the Document Viewer main component
 */
describe('Document Viewer component', () => {
  it('Should render without crashing', () => {
    useTestContext(ctx => {
      const c = renderer.create(
        <Provider store={ctx.store}>
          <DocumentViewer documentIdOrPath="" hostName="" drawerSlideProps={{ in: true }} />
        </Provider>,
      )
      c.unmount()
    })
  })

  it('Should poll document data if there is an Id or Path provided and stop polling on unmount', (done: jest.DoneCallback) => {
    let c!: renderer.ReactTestRenderer
    afterEach(() => {
      c.unmount()
    })
    const exampleIdOrPath = 'Example/Id/Or/Path'
    useTestContextWithSettings(
      {
        getDocumentData: async ({ idOrPath }) => {
          expect(idOrPath).toBe(exampleIdOrPath)
          done()
          return exampleDocumentData
        },
      },
      ctx => {
        c = renderer.create(
          <Provider store={ctx.store}>
            <DocumentViewer documentIdOrPath={exampleIdOrPath} hostName="" drawerSlideProps={{ in: true }} />
          </Provider>,
        )
      },
    )
  })

  it('Should start polling again on path change', (done: jest.DoneCallback) => {
    let c!: renderer.ReactTestRenderer
    let pollCount = 0
    let promise!: Promise<void>
    afterEach(() => {
      c.unmount()
    })

    promise = new Promise(resolve => {
      const exampleIdOrPath = 'Example/Id/Or/Path'
      useTestContextWithSettings(
        {
          getDocumentData: async () => {
            pollCount++
            if (pollCount === 2) {
              resolve()
              done()
            }
            return exampleDocumentData
          },
        },
        async ctx => {
          c = renderer.create(
            <Provider store={ctx.store}>
              <DocumentViewer documentIdOrPath={exampleIdOrPath} hostName="" drawerSlideProps={{ in: true }} />
            </Provider>,
          )
          setTimeout(() => {
            const component = c.root.findByType(DocumentViewer).children[0] as renderer.ReactTestInstance
            component.instance.componentWillReceiveProps({ ...component.instance.props, documentIdOrPath: 123456 })
          }, 100)
          await promise
        },
      )
    })
  })

  it('should render the Error component when failed to get doc data', (done: jest.DoneCallback) => {
    let c!: renderer.ReactTestRenderer
    afterEach(() => {
      c.unmount()
    })
    const exampleIdOrPath = 'Example/Id/Or/Path'
    useTestContextWithSettings(
      {
        getDocumentData: () => Promise.reject('Nooo') as Promise<any>,
      },
      ctx => {
        c = renderer.create(
          <Provider store={ctx.store}>
            <DocumentViewer documentIdOrPath={exampleIdOrPath} hostName="" drawerSlideProps={{ in: true }} />
          </Provider>,
        )
        setTimeout(() => {
          const error = c.root.findByType(DocumentViewerError).instance
          expect(error).not.toBe(null)
          done()
        }, 100)
      },
    )
  })
})
