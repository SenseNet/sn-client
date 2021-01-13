import Drawer from '@material-ui/core/Drawer'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import React, { useCallback, useEffect } from 'react'
import { CommentsContext } from '../context/comments'
import { useLocalization, useViewerSettings, useViewerState } from '../hooks'
import { Comment, CreateComment } from './comment'
import { PageList, Thumbnails } from './'

export const THUMBNAIL_PADDING = 16
export const THUMBNAIL_NAME = 'Thumbnail'
export const THUMBNAIL_CONTAINER_ID = 'sn-document-viewer-thumbnails'
export const PAGE_PADDING = 8
export const PAGE_NAME = 'Page'
export const PAGE_CONTAINER_ID = 'sn-document-viewer-pages'

const useStyles = makeStyles(() => {
  return createStyles({
    mainWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    layout: {
      display: 'flex',
      flexGrow: 1,
      width: '100%',
      overflow: 'hidden',
      zIndex: 0,
      position: 'relative',
    },
    commentContainer: {
      display: 'flex',
      flexFlow: 'column',
      padding: '15px',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      overflow: 'auto',
    },
  })
})

interface ScrollToOptions {
  containerId: string
  index: number
  itemName: string
  padding: number
  smoothScroll: boolean
}

export const DocumentViewerLayout: React.FC = () => {
  const classes = useStyles()
  const viewerState = useViewerState()
  const localization = useLocalization()
  const viewerSettings = useViewerSettings()

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
        containerId: PAGE_CONTAINER_ID,
        itemName: PAGE_NAME,
        padding: PAGE_PADDING,
        index,
        smoothScroll,
      })

      scrollToImage({
        containerId: THUMBNAIL_CONTAINER_ID,
        itemName: THUMBNAIL_NAME,
        padding: THUMBNAIL_PADDING,
        index,
        smoothScroll,
      })
    },
    [scrollToImage],
  )

  useEffect(() => {
    const observer = viewerState.pageToGo.subscribe(({ page }) => {
      scrollTo(page)
    })
    return () => observer.dispose()
  }, [scrollTo, viewerState.pageToGo])

  return (
    <div className={classes.mainWrapper}>
      {viewerSettings.renderAppBar()}
      <div className={classes.layout}>
        <Drawer
          variant={'persistent'}
          open={viewerState.showThumbnails}
          anchor="left"
          SlideProps={viewerSettings.drawerSlideProps}
          PaperProps={{
            style: {
              position: 'relative',
              width: viewerState.showThumbnails ? '200px' : 0,
              height: '100%',
              overflow: 'hidden',
            },
          }}>
          {viewerState.showThumbnails && <Thumbnails onPageClick={(index) => scrollTo(index)} />}
        </Drawer>
        <PageList onPageClick={(index) => scrollTo(index)} />
        <Drawer
          variant={'persistent'}
          open={viewerState.showComments}
          anchor="right"
          SlideProps={viewerSettings.drawerSlideProps}
          PaperProps={{
            style: {
              position: 'relative',
              width: viewerState.showComments ? '340px' : 0,
              height: '100%',
              overflow: 'hidden',
            },
          }}>
          <div className={classes.commentContainer}>
            <Typography variant="h4">{localization.commentSideBarTitle}</Typography>
            <CreateComment />
            <CommentsContext.Consumer>
              {(commentsContext) =>
                commentsContext.comments.map((comment) => <Comment key={comment.id} comment={comment} />)
              }
            </CommentsContext.Consumer>
          </div>
        </Drawer>
      </div>
    </div>
  )
}
