import { Grid } from '@material-ui/core'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { defaultViewerState, Page, PreviewImageDataContext, ViewerStateContext } from '../src'
import { PageList } from '../src/components/PageList'
import { examplePreviewImageData } from './__Mocks__/viewercontext'

/**
 * resize the window for the requested size
 * @param {number} width requested width.
 * @param {number} height requested height.
 */
function resize(width: number, height: number) {
  const resizeEvent = document.createEvent('Event')
  resizeEvent.initEvent('resize', true, true)
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: height })
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: width })
  global.window.dispatchEvent(resizeEvent)
}

describe('PageList component', () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
  it('should match snapshot with one page', () => {
    const wrapper = shallow(<PageList onPageClick={() => jest.fn} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should handle resize', () => {
    const onPageClick = jest.fn()

    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 500 })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 })

    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [{ ...examplePreviewImageData }, { ...examplePreviewImageData, Index: 2 }],
          setImageData: () => {},
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
          }}>
          <PageList onPageClick={onPageClick} />
        </ViewerStateContext.Provider>
      </PreviewImageDataContext.Provider>,
    )
    expect(wrapper.find(Page).first().props().viewportHeight).toBe(484)
    expect(wrapper.find(Page).first().props().imageIndex).toBe(1)
    expect(wrapper.find(Page).last().props().imageIndex).toBe(2)

    act(() => {
      resize(200, 200)
    })

    expect(wrapper.update().find(Page).first().props().viewportHeight).toBe(184)
  })

  it('should handle scroll', () => {
    const onPageClick = jest.fn()

    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 500 })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 })

    const wrapper = mount(
      <PreviewImageDataContext.Provider
        value={{
          imageData: [{ ...examplePreviewImageData }, { ...examplePreviewImageData, Index: 2 }],
          setImageData: () => {},
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            rotation: [{ degree: 90, pageNum: 1 }],
            activePage: 2,
          }}>
          <PageList onPageClick={onPageClick} />
        </ViewerStateContext.Provider>
      </PreviewImageDataContext.Provider>,
    )

    const scrollEvent = document.createEvent('Event')
    scrollEvent.initEvent('scroll', true, true)
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 100 })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 100 })

    act(() => {
      wrapper.find(Grid).getDOMNode().dispatchEvent(scrollEvent)
    })
    expect(wrapper.update().find(Page).first().props().viewportHeight).toBe(84)
  })

  Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalOffsetHeight)
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalOffsetWidth)
})
