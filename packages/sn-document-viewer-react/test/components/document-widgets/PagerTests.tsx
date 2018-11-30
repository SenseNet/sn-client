import * as React from 'react'
import { Provider } from 'react-redux'

import TextField from '@material-ui/core/TextField'

import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import NavigateNext from '@material-ui/icons/NavigateNext'

import { expect } from 'chai'
import * as renderer from 'react-test-renderer'
import { PagerWidget } from '../../../src/components/document-widgets/Pager'
import { documentReceivedAction } from '../../../src/store/Document'
import { setActivePages } from '../../../src/store/Viewer'
import { asyncDelay } from '../../asyncdelayer'
import { exampleDocumentData, useTestContext, useTestContextAsync } from '../../viewercontext'

/**
 * Pager widget tests
 */
export const pagerWidgetTests: Mocha.Suite = describe('PagerWidget component', () => {
  let c!: renderer.ReactTestRenderer

  after(() => {
    c.unmount()
  })

  it('Should render without crashing', () => {
    useTestContext(ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
      c = renderer.create(
        <Provider store={ctx.store}>
          <PagerWidget />
        </Provider>,
      )
    })
  })

  it('Numeric input should update the store active page', async () => {
    await useTestContextAsync(async ctx => {
      ctx.store.dispatch(documentReceivedAction({ ...exampleDocumentData, pageCount: 10 }))

      c = renderer.create(
        <Provider store={ctx.store}>
          <PagerWidget />
        </Provider>,
      )
      const textInput = c.root.findByType(TextField)

      // in range
      textInput.props.onChange({ currentTarget: { value: 5 } })
      await asyncDelay(300)
      const currentPage = ctx.store.getState().sensenetDocumentViewer.viewer.activePages[0]
      expect(currentPage).to.be.eq(5)

      // NaN
      textInput.props.onChange({ currentTarget: { value: 'NotANumber' } })
      await asyncDelay(300)
      const currentPage2 = ctx.store.getState().sensenetDocumentViewer.viewer.activePages[0]
      expect(currentPage2).to.be.eq(5)

      // limit min
      textInput.props.onChange({ currentTarget: { value: -5 } })
      await asyncDelay(300)
      const currentPage3 = ctx.store.getState().sensenetDocumentViewer.viewer.activePages[0]
      expect(currentPage3).to.be.eq(1)

      // limit max
      textInput.props.onChange({ currentTarget: { value: 500 } })
      await asyncDelay(300)
      const currentPage4 = ctx.store.getState().sensenetDocumentViewer.viewer.activePages[0]
      expect(currentPage4).to.be.eq(10)
    })
  })

  it('First page should jump to page 1', async () => {
    await useTestContextAsync(async ctx => {
      ctx.store.dispatch(documentReceivedAction({ ...exampleDocumentData, pageCount: 10 }))
      ctx.store.dispatch(setActivePages([5]))

      c = renderer.create(
        <Provider store={ctx.store}>
          <PagerWidget />
        </Provider>,
      )
      const button = c.root.findByType(FirstPage)

      // click test
      button.props.onClick()
      await asyncDelay(300)
      const currentPage = ctx.store.getState().sensenetDocumentViewer.viewer.activePages[0]
      expect(currentPage).to.be.eq(1)
    })
  })

  it('NavigateBefore should jump a page back', async () => {
    await useTestContextAsync(async ctx => {
      ctx.store.dispatch(documentReceivedAction({ ...exampleDocumentData, pageCount: 10 }))
      ctx.store.dispatch(setActivePages([5]))

      c = renderer.create(
        <Provider store={ctx.store}>
          <PagerWidget />
        </Provider>,
      )
      const button = c.root.findByType(NavigateBefore)

      // click test
      button.props.onClick()
      await asyncDelay(300)
      const currentPage = ctx.store.getState().sensenetDocumentViewer.viewer.activePages[0]
      expect(currentPage).to.be.eq(4)
    })
  })

  it('NavigateNext should jump to the next page', async () => {
    await useTestContextAsync(async ctx => {
      ctx.store.dispatch(documentReceivedAction({ ...exampleDocumentData, pageCount: 10 }))
      ctx.store.dispatch(setActivePages([5]))

      c = renderer.create(
        <Provider store={ctx.store}>
          <PagerWidget />
        </Provider>,
      )
      const button = c.root.findByType(NavigateNext)

      // click test
      button.props.onClick()
      await asyncDelay(300)
      const currentPage = ctx.store.getState().sensenetDocumentViewer.viewer.activePages[0]
      expect(currentPage).to.be.eq(6)
    })
  })

  it('Last page should jump to page 1', async () => {
    await useTestContextAsync(async ctx => {
      ctx.store.dispatch(documentReceivedAction({ ...exampleDocumentData, pageCount: 10 }))
      ctx.store.dispatch(setActivePages([5]))

      c = renderer.create(
        <Provider store={ctx.store}>
          <PagerWidget />
        </Provider>,
      )
      const button = c.root.findByType(LastPage)

      // click test
      button.props.onClick()
      await asyncDelay(300)
      const currentPage = ctx.store.getState().sensenetDocumentViewer.viewer.activePages[0]
      expect(currentPage).to.be.eq(10)
    })
  })
})
