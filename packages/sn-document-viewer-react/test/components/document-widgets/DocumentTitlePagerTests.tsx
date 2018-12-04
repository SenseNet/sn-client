import { expect } from 'chai'
import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import {
  DocumentTitlePager,
  DocumentTitlePagerComponent,
} from '../../../src/components/document-widgets/DocumentTitlePager'
import { documentReceivedAction } from '../../../src/store/Document'
import { exampleDocumentData, useTestContextAsync } from '../../viewercontext'

/**
 * Pager widget tests
 */
export const documentTitlePagerWidgetTests: Mocha.Suite = describe('DocumentTitlePagerWidget component', () => {
  let c!: renderer.ReactTestRenderer

  after(() => {
    c.unmount()
  })

  it('Should render without crashing', async () => {
    await useTestContextAsync(async ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
      c = renderer.create(
        <Provider store={ctx.store}>
          <DocumentTitlePager />
        </Provider>,
      )
      const t: DocumentTitlePagerComponent = c.root.findAllByType(DocumentTitlePagerComponent as any)[0].instance
      expect(t).to.be.instanceof(DocumentTitlePagerComponent)
    })
    c.unmount()
  })

  it('static getDerivedStateFromProps should parse the props', async () => {
    const derivedState = DocumentTitlePagerComponent.getDerivedStateFromProps(
      {
        documentName: '-',
        activePages: [3],
        pageCount: 5,
        gotoPage: 'gotoPage',
        children: [],
        setActivePages: () => ({} as any),
      },
      {} as any,
    )

    expect(derivedState.lastPage).to.be.eq(5)
  })

  it('Should change focused attribute with focus and blur handlers', async () => {
    await useTestContextAsync(async ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
      c = renderer.create(
        <Provider store={ctx.store}>
          <DocumentTitlePager />
        </Provider>,
      )
      const t: DocumentTitlePagerComponent = c.root.findAllByType(DocumentTitlePagerComponent as any)[0].instance
      expect(t.state.focused).to.be.eq(false)

      // tslint:disable-next-line:no-string-literal
      t['handleFocused']()
      expect(t.state.focused).to.be.eq(true)

      // tslint:disable-next-line:no-string-literal
      t['handleBlur']()
      expect(t.state.focused).to.be.eq(false)
    })

    c.unmount()
  })

  it('gotoPage() should trigger the setPage', (done: MochaDone) => {
    let promise!: Promise<void>
    promise = new Promise(resolve => {
      useTestContextAsync(async ctx => {
        ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
        c = renderer.create(
          <Provider store={ctx.store}>
            <DocumentTitlePagerComponent
              pageCount={5}
              activePages={[]}
              documentName=""
              setActivePages={() => {
                done()
                resolve()
                return null as any
              }}
              gotoPage=""
            />
          </Provider>,
        )
        const t: DocumentTitlePagerComponent = c.root.findAllByType(DocumentTitlePagerComponent as any)[0].instance
        expect(t.state.focused).to.be.eq(false)
        t.gotoPage(5)
        expect(t.state.currentPage).to.be.eq(5)
        await promise
      })
    })
    c.unmount()
  })
})
