import Grid from '@material-ui/core/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from '@sensenet/client-utils'
import { DraftCommentMarker, PreviewImageData } from '../models'
import { Dimensions, ImageUtil } from '../services'
import { ZoomMode } from '../models/viewer-state'
import { usePreviewImages } from '../hooks'
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
  style?: React.CSSProperties
  showWidgets: boolean
  handleMarkerCreation?: (coordinates: DraftCommentMarker) => void
}

export const PageList: React.FC<PageListProps> = props => {
  const [marginTop, setMarginTop] = useState(0)
  const [marginBottom, setMarginBottom] = useState(0)

  const [visiblePages, setVisiblePages] = useState<PreviewImageData[]>([])

  const [scrollState, setScrollState] = useState(0)

  const viewportElement = useRef<HTMLElement>()
  const [resizeToken, setResizeToken] = useState(0)
  const [viewport, setViewport] = useState<Dimensions>({ width: 0, height: 0 })

  const pages = usePreviewImages()

  const requestResize = useCallback(
    debounce(() => {
      setResizeToken(Math.random())
    }, 100),
    [],
  )

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
    addEventListener('resize', requestResize)
    return () => removeEventListener('resize', requestResize)
  }, [requestResize])

  useEffect(() => {
    if (viewportElement && viewportElement.current) {
      setViewport({
        height: viewportElement.current.clientHeight - props.padding * 2,
        width: viewportElement.current.clientWidth - props.padding * 2,
      })
    }
  }, [props.padding, resizeToken, viewportElement])

  useEffect(() => {
    if (!pages.imageData.length) {
      return
    }

    let defaultWidth!: number
    let defaultHeight!: number

    const _visiblePages = pages.imageData.map(p => {
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
    setMarginBottom(_marginBottom)

    setVisiblePages(_visiblePages.slice(_pagesToSkip, _pagesToSkip + _pagesToTake))
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

  return (
    <Grid
      item={true}
      style={{ ...props.style, flexGrow: 1, flexShrink: 1, overflow: 'auto', height: '100%' }}
      id={props.id}
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
        {visiblePages.map(page => (
          <Page
            handleMarkerCreation={props.handleMarkerCreation}
            showWidgets={props.showWidgets}
            viewportWidth={viewport.width}
            viewportHeight={viewport.height}
            key={page.Index}
            imageIndex={page.Index}
            onClick={ev => props.onPageClick(ev, page.Index)}
            zoomMode={props.zoomMode}
            zoomLevel={props.zoomLevel}
            fitRelativeZoomLevel={props.fitRelativeZoomLevel}
            elementName={props.elementName}
            image={props.images}
            margin={props.padding}
          />
        ))}
      </div>
    </Grid>
  )
}
