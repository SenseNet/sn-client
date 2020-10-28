import { PreviewImageData } from '@sensenet/client-core'
import { Button } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CommentsContextProvider } from '../context/comments'
import { useDocumentData, usePreviewImages, useViewerState } from '../hooks'
import { ZoomMode } from '../models/viewer-state'
import { Dimensions, ImageUtil } from '../services'
import { Page } from './'

/**
 * Defines the own properties for the PageList component
 */
export interface PageListProps {
  tolerance: number
  padding: number
  id: string
  elementName: string
  zoomMode: ZoomMode
  zoomLevel: number
  fitRelativeZoomLevel: number
  images: 'preview' | 'thumbnail'
  activePage?: number
  onPageClick: (ev: React.MouseEvent<HTMLElement>, pageIndex: number) => void
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

  const { documentData, updateDocumentData } = useDocumentData()

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
      const newHeight = viewportElement.current.clientHeight - props.padding * 2
      const newWidth = viewportElement.current.clientWidth - props.padding * 2
      setViewport({
        height: newHeight >= 0 ? newHeight : 0,
        width: newWidth >= 0 ? newWidth : 0,
      })
    }
  }, [props.padding, resizeToken, viewportElement])

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
          rotation: (p.Attributes && p.Attributes.degree) || 0,
        },
        props.zoomMode,
        props.zoomLevel,
        props.fitRelativeZoomLevel,
      )

      return {
        ...p,
        Width: relativeSize.width,
        Height: relativeSize.height,
      }
    })

    let _marginTop = 0
    let _pagesToSkip = 0

    while (
      _visiblePages[_pagesToSkip] &&
      _marginTop + _visiblePages[_pagesToSkip].Height + props.tolerance < scrollState
    ) {
      _marginTop += _visiblePages[_pagesToSkip].Height + props.padding * 2
      _pagesToSkip++
    }

    let _pagesToTake = 1
    let _pagesHeight = 0

    while (_visiblePages[_pagesToSkip + _pagesToTake] && _pagesHeight < viewport.height + props.tolerance) {
      _pagesHeight += _visiblePages[_pagesToSkip + _pagesToTake].Height + props.padding * 2
      _pagesToTake++
    }

    let _marginBottom = 0
    for (let i = _pagesToSkip + _pagesToTake - 1; i < _visiblePages.length - 1; i++) {
      _marginBottom += _visiblePages[i].Height + props.padding * 2
    }

    setMarginTop(_marginTop)
    setMarginBottom(_marginBottom < 20 ? 20 : _marginBottom)
    const newVisiblePages = _visiblePages.slice(_pagesToSkip, _pagesToSkip + _pagesToTake)
    setVisiblePages(newVisiblePages)
  }, [
    pages.imageData,
    props.fitRelativeZoomLevel,
    props.padding,
    props.tolerance,
    props.zoomLevel,
    props.zoomMode,
    scrollState,
    viewport.height,
    viewport.width,
  ])

  const updateScrollState = useCallback(() => {
    viewerState.updateState({ activePages: [(visiblePages[0] && visiblePages[0].Index) || 1] })
  }, [visiblePages])

  useEffect(updateScrollState, [updateScrollState])

  const addshape = () => {
    documentData.shapes.redactions.push({ h: 100, w: 300, x: 10, y: 10, imageIndex: 1, guid: '1012' })
    documentData.shapes.highlights.push({ h: 100, w: 300, x: 10, y: 120, imageIndex: 1, guid: '1013' })
    documentData.shapes.annotations.push({
      h: 100,
      w: 300,
      x: 10,
      y: 240,
      imageIndex: 1,
      guid: '1014',
      index: 1,
      lineHeight: 17,
      text: 'balbal',
      fontBold: 'none',
      fontColor: 'black',
      fontFamily: 'Ariel',
      fontItalic: 'none',
      fontSize: '12px',
    })

    updateDocumentData(documentData)
    viewerState.updateState({ hasChanges: true })
  }
  return (
    <Grid item={true} style={{ flexGrow: 1, flexShrink: 1, overflow: 'auto' }} id={props.id} innerRef={viewportElement}>
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
          <CommentsContextProvider page={page.Index} key={page.Index} images={props.images}>
            <Button aria-label={'test'} onClick={addshape}>
              <span style={{ textTransform: 'none', fontSize: '32px' }}>VALAMI</span>
            </Button>
            <Page
              showWidgets={true}
              viewportWidth={viewport.width}
              viewportHeight={viewport.height}
              imageIndex={page.Index}
              onClick={(ev) => props.onPageClick(ev, page.Index)}
              zoomMode={props.zoomMode}
              zoomLevel={props.zoomLevel}
              fitRelativeZoomLevel={props.fitRelativeZoomLevel}
              elementName={props.elementName}
              image={props.images}
              margin={props.padding}
            />
          </CommentsContextProvider>
        ))}
      </div>
    </Grid>
  )
}
