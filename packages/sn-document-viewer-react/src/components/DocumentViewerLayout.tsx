import Drawer from '@material-ui/core/Drawer'
import { SlideProps } from '@material-ui/core/Slide'
import Typography from '@material-ui/core/Typography'
import React, { useCallback, useEffect, useRef } from 'react'
import { CommentsContext, CommentsContextProvider } from '../context/comments'
import { useLocalization, useViewerState } from '../hooks'
import { Comment } from './comment'
import { CreateComment } from './comment/CreateComment'
import { CommentsContainer, PageList } from './'

/** Props definition for the Document Viewer layout */
export interface DocumentViewerLayoutProps {
  drawerSlideProps?: Partial<SlideProps>
  thumbnailPadding?: number
  pagePadding?: number
}

const THUMBNAIL_PADDING = 16
const THUMBNAIL_NAME = 'Thumbnail'
const PAGE_PADDING = 8
const PAGE_NAME = 'Page'

interface ScrollToOptions {
  containerId: string
  index: number
  itemName: string
  padding: number
  smoothScroll: boolean
}

export const DocumentViewerLayout: React.FC<DocumentViewerLayoutProps> = (props) => {
  const viewerState = useViewerState()
  const localization = useLocalization()

  const thumbnailPadding = props.thumbnailPadding != null ? props.thumbnailPadding : THUMBNAIL_PADDING
  const pagePadding = props.pagePadding != null ? props.pagePadding : PAGE_PADDING

  const commentsContainerRef = useRef<HTMLDivElement>()

  const scrollToImage = useCallback(({ containerId, index, itemName, padding, smoothScroll }: ScrollToOptions) => {
    const container = document.getElementById(containerId)
    const item = document.querySelector(`.${itemName}`)
    if (container && container.scrollTo && item) {
      container.scrollTo({
        top: (item.clientHeight + padding * 4) * (index - 1),
        behavior: smoothScroll ? 'smooth' : 'auto',
      })
    }
  }, [])

  const scrollTo = useCallback(
    (index: number, smoothScroll = true) => {
      scrollToImage({
        containerId: 'sn-document-viewer-pages',
        itemName: PAGE_NAME,
        padding: pagePadding,
        index,
        smoothScroll,
      })

      scrollToImage({
        containerId: 'sn-document-viewer-thumbnails',
        itemName: THUMBNAIL_NAME,
        padding: thumbnailPadding,
        index,
        smoothScroll,
      })
    },
    [pagePadding, scrollToImage, thumbnailPadding],
  )

  useEffect(() => {
    const observer = viewerState.onPageChange.subscribe((p) => {
      scrollTo(p)
    })
    return () => observer.dispose()
  }, [scrollTo, viewerState.onPageChange])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}>
      {props.children}
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          width: '100%',
          overflow: 'hidden',
          zIndex: 0,
          position: 'relative',
        }}>
        <Drawer
          variant={'persistent'}
          open={viewerState.showThumbnails}
          anchor="left"
          SlideProps={props.drawerSlideProps}
          PaperProps={{
            style: {
              position: 'relative',
              width: viewerState.showThumbnails ? '200px' : 0,
              height: '100%',
              overflow: 'hidden',
            },
          }}>
          <PageList
            id="sn-document-viewer-thumbnails"
            onPageClick={(index) => scrollTo(index)}
            elementName={THUMBNAIL_NAME}
            images="thumbnail"
            padding={thumbnailPadding}
          />
        </Drawer>
        <PageList
          id="sn-document-viewer-pages"
          onPageClick={(index) => scrollTo(index)}
          elementName={PAGE_NAME}
          images="preview"
          padding={pagePadding}
        />
        <Drawer
          variant={'persistent'}
          open={viewerState.showComments}
          anchor="right"
          SlideProps={props.drawerSlideProps}
          PaperProps={{
            style: {
              position: 'relative',
              width: viewerState.showComments ? '340px' : 0,
              height: '100%',
              overflow: 'hidden',
            },
          }}>
          <CommentsContextProvider page={viewerState.activePage} images="preview">
            <CommentsContainer ref={commentsContainerRef as any} style={{ display: 'flex', flexFlow: 'column' }}>
              <Typography variant="h4">{localization.commentSideBarTitle}</Typography>
              <CreateComment localization={localization} />
              <CommentsContext.Consumer>
                {(commentsContext) =>
                  commentsContext.comments.map((comment) => <Comment key={comment.id} comment={comment} />)
                }
              </CommentsContext.Consumer>
            </CommentsContainer>
          </CommentsContextProvider>
        </Drawer>
      </div>
    </div>
  )
}
