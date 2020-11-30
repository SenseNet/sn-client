import { PreviewImageData } from '@sensenet/client-core'
import Grid from '@material-ui/core/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePreviewImages, useViewerState } from '../hooks'
import { Dimensions, ImageUtil } from '../services'
import { PAGE_CONTAINER_ID, PAGE_PADDING } from './DocumentViewerLayout'
import { Page } from './'

/**
 * Defines the own properties for the PageList component
 */
export interface PageListProps {
  onPageClick: (pageIndex: number) => void
}

export const PageList: React.FC<PageListProps> = (props) => {
  const [marginTop, setMarginTop] = useState(0)
  const [marginBottom, setMarginBottom] = useState(0)
  const [visiblePages, setVisiblePages] = useState<PreviewImageData[]>([])
  const [scrollState, setScrollState] = useState(0)
  const viewportElement = useRef<HTMLElement>()
  const viewerState = useViewerState()
  const [resizeToken, setResizeToken] = useState(0)
  const [viewport, setViewport] = useState<Dimensions>({ width: 0, height: 0 })
  const pages = usePreviewImages()

  const requestResize = useCallback(() => {
    setResizeToken(Math.random())
  }, [])

  const onScroll = useCallback(() => {
    requestResize()
    setScrollState((viewportElement.current && viewportElement.current.scrollTop) || 0)
  }, [requestResize])

  useEffect(() => {
    const currentViewport = viewportElement.current
    if (currentViewport) {
      currentViewport.addEventListener('scroll', onScroll)
    }
    return () => currentViewport && currentViewport.removeEventListener('scroll', onScroll)
  }, [onScroll, viewportElement])

  useEffect(() => {
    window.addEventListener('resize', requestResize)
    return () => window.removeEventListener('resize', requestResize)
  }, [requestResize])

  useEffect(() => {
    if (viewportElement && viewportElement.current) {
      const newHeight = viewportElement.current.clientHeight - PAGE_PADDING * 2
      const newWidth = viewportElement.current.clientWidth - PAGE_PADDING * 2
      setViewport({
        height: newHeight >= 0 ? newHeight : 0,
        width: newWidth >= 0 ? newWidth : 0,
      })
    }
  }, [resizeToken, viewportElement])

  useEffect(() => {
    if (!pages.imageData.length) {
      return
    }

    let defaultWidth!: number
    let defaultHeight!: number

    const _visiblePages = pages.imageData.map((p) => {
      if ((p && !defaultWidth) || !defaultHeight) {
        ;[defaultWidth, defaultHeight] = [p.Width, p.Height]
      }

      if (!p.Width || !p.Height) {
        ;[p.Width, p.Height] = [defaultWidth, defaultHeight]
      }

      const relativeSize = ImageUtil.getImageSize(
        {
          width: viewport.width,
          height: viewport.height,
        },
        {
          width: p.Width,
          height: p.Height,
          rotation: viewerState.rotation?.find((rotation) => rotation.pageNum === p.Index)?.degree || 0,
        },
        viewerState.zoomLevel,
      )

      return {
        ...p,
        Width: relativeSize.width,
        Height: relativeSize.height,
      }
    })

    let _marginTop = 0
    let _pagesToSkip = 0

    while (_visiblePages[_pagesToSkip] && _marginTop + _visiblePages[_pagesToSkip].Height < scrollState) {
      _marginTop += _visiblePages[_pagesToSkip].Height + PAGE_PADDING * 2
      _pagesToSkip++
    }

    let _pagesToTake = 1
    let _pagesHeight = 0

    while (_visiblePages[_pagesToSkip + _pagesToTake] && _pagesHeight < viewport.height) {
      _pagesHeight += _visiblePages[_pagesToSkip + _pagesToTake].Height + PAGE_PADDING * 2
      _pagesToTake++
    }

    let _marginBottom = 0
    for (let i = _pagesToSkip + _pagesToTake - 1; i < _visiblePages.length - 1; i++) {
      _marginBottom += _visiblePages[i].Height + PAGE_PADDING * 2
    }

    setMarginTop(_marginTop)
    setMarginBottom(_marginBottom)
    const newVisiblePages = _visiblePages.slice(_pagesToSkip, _pagesToSkip + _pagesToTake)
    setVisiblePages(newVisiblePages)

    if (newVisiblePages.length > 0) {
      let newActivePage
      if (newVisiblePages.length === 1) {
        newActivePage = newVisiblePages[0].Index
      } else {
        newActivePage =
          scrollState - _marginTop >= 0 && scrollState - _marginTop > newVisiblePages[0].Height / 2
            ? newVisiblePages[1].Index
            : newVisiblePages[0].Index
      }
      if (viewerState.activePage !== newActivePage) {
        viewerState.updateState({ activePage: newActivePage })
      }
    }
  }, [pages.imageData, scrollState, viewerState, viewport.height, viewport.width])

  return (
    <Grid
      item={true}
      style={{ flexGrow: 1, flexShrink: 1, overflow: 'auto' }}
      id={PAGE_CONTAINER_ID}
      innerRef={viewportElement}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: marginTop || 0,
          paddingBottom: marginBottom || 0,
        }}>
        {visiblePages.map((page) => (
          <Page
            key={page.Index}
            page={page}
            viewportWidth={viewport.width}
            viewportHeight={viewport.height}
            onClick={() => props.onPageClick(page.Index)}
          />
        ))}
      </div>
    </Grid>
  )
}
