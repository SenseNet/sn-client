import Drawer from '@material-ui/core/Drawer'
import { SlideProps } from '@material-ui/core/Slide'
import Typography from '@material-ui/core/Typography'
import React = require('react')
import { connect } from 'react-redux'
import { DraftCommentMarker } from '../models'
import { componentType } from '../services'
import { createComment, RootReducerType, setActivePages, setThumbnails } from '../store'
import {
  getComments,
  setSelectedCommentId,
  toggleIsCreateCommentActive,
  toggleIsPlacingCommentMarker,
} from '../store/Comments'
import Comment from './comment/Comment'
import { CreateComment } from './comment/CreateComment'
import { CommentsContainer, PageList } from './'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType) => {
  return {
    activePages: state.sensenetDocumentViewer.viewer.activePages,
    zoomMode: state.sensenetDocumentViewer.viewer.zoomMode,
    customZoomLevel: state.sensenetDocumentViewer.viewer.customZoomLevel,
    showThumbnails: state.sensenetDocumentViewer.viewer.showThumbnails,
    showComments: state.sensenetDocumentViewer.viewer.showComments,
    comments: state.comments.items,
    pageCount: state.sensenetDocumentViewer.documentState.document.pageCount,
    isCreateCommentActive: state.comments.isCreateCommentActive,
    isPlacingCommentMarker: state.comments.isPlacingCommentMarker,
    selectedCommentId: state.comments.selectedCommentId,
    fitRelativeZoomLevel: state.sensenetDocumentViewer.viewer.fitRelativeZoomLevel,
    localization: state.sensenetDocumentViewer.localization,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
  setActivePages,
  getComments,
  setThumbnails,
  createComment,
  setSelectedCommentId,
  toggleIsCreateCommentActive,
  toggleIsPlacingCommentMarker,
}

/** Props definition for the Document Viewer layout */
export interface DocumentLayoutOwnProps {
  drawerSlideProps?: Partial<SlideProps>
}

/** State type definition for the DocumentViewerLayout component */
export interface DocumentLayoutState {
  draftCommentMarker?: DraftCommentMarker
  activePage?: number
  thumbnaislVisibility: boolean
  createCommentValue: string
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

/**
 * Component for the main DocumentViewer layout
 */
export class DocumentViewerLayoutComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps, DocumentLayoutOwnProps>,
  DocumentLayoutState
> {
  constructor(props: DocumentViewerLayoutComponent['props']) {
    super(props)
    this.state = {
      activePage: 1,
      thumbnaislVisibility: this.props.showThumbnails,
      createCommentValue: '',
    }
    this.commentsContainerRef = React.createRef()
    this.createComment = this.createComment.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleMarkerCreation = this.handleMarkerCreation.bind(this)
  }

  private commentsContainerRef: React.RefObject<HTMLDivElement>

  public componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp)
  }

  public componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp)
  }

  /** scrolls the viewer to focus to the page with the provided index */
  public scrollTo(index: number, smoothScroll = true) {
    this.setState({ ...this.state, activePage: index }, () => {
      this.scrollToImage({
        containerId: 'sn-document-viewer-pages',
        itemName: PAGE_NAME,
        padding: PAGE_PADDING,
        index,
        smoothScroll,
      })

      this.scrollToImage({
        containerId: 'sn-document-viewer-thumbnails',
        itemName: THUMBNAIL_NAME,
        padding: THUMBNAIL_PADDING,
        index,
        smoothScroll,
      })

      if (this.props.activePages[0] !== index) {
        this.props.setActivePages([index])
        this.props.getComments()
      }
    })
  }

  private scrollToImage({ containerId, index, itemName, padding, smoothScroll }: ScrollToOptions) {
    const container = document.getElementById(containerId)
    const item = document.querySelector(`.${itemName}`)
    if (container && container.scrollTo && item) {
      container.scrollTo({
        top: (item.clientHeight + padding * 4) * (index - 1),
        behavior: smoothScroll ? 'smooth' : 'auto',
      })
    }
  }

  private handleMarkerCreation(draftCommentMarker: DraftCommentMarker) {
    this.setState({ ...this.state, draftCommentMarker })
  }

  private createComment(text: string) {
    if (!this.state.draftCommentMarker || !this.state.activePage) {
      return
    }
    this.props.createComment({ page: this.state.activePage, text, ...this.state.draftCommentMarker })
    this.toggleIsPlacingCommentMarker(false)
  }

  private toggleIsPlacingCommentMarker(isPlacingCommentMarker = !this.props.isPlacingCommentMarker) {
    this.props.toggleIsPlacingCommentMarker(isPlacingCommentMarker)
    this.setState({ ...this.state, draftCommentMarker: undefined })
  }

  private handleKeyUp(ev: KeyboardEvent) {
    if (ev.key !== 'Escape') {
      return
    }
    if (this.props.isPlacingCommentMarker) {
      return this.toggleIsPlacingCommentMarker(false)
    }
    if (this.props.isCreateCommentActive) {
      this.props.toggleIsCreateCommentActive(false)
    }
    this.props.setSelectedCommentId('')
    this.setState({ ...this.state, createCommentValue: '' })
  }

  /** triggered when the component will receive props */
  public componentWillReceiveProps(newProps: this['props']) {
    if (
      this.props.activePages[0] !== newProps.activePages[0] ||
      this.props.fitRelativeZoomLevel !== newProps.fitRelativeZoomLevel
    ) {
      this.scrollTo(newProps.activePages[0], this.props.fitRelativeZoomLevel === newProps.fitRelativeZoomLevel)
      this.toggleIsPlacingCommentMarker(false)
    }
    if (this.props.showThumbnails !== newProps.showThumbnails) {
      if (newProps.showThumbnails) {
        this.setState({
          ...this.state,
          thumbnaislVisibility: true,
        })
        window.dispatchEvent(new Event('resize'))
      } else {
        setTimeout(() => {
          this.setState({
            ...this.state,
            thumbnaislVisibility: false,
          })
          window.dispatchEvent(new Event('resize'))
        }, 200)
      }
    }
    if (this.props.selectedCommentId !== newProps.selectedCommentId) {
      const selectedCommentNode = document.getElementById(newProps.selectedCommentId)
      if (!selectedCommentNode) {
        return
      }
      this.commentsContainerRef.current &&
        this.commentsContainerRef.current.scrollTo({
          top: selectedCommentNode.offsetTop - selectedCommentNode.scrollHeight,
          behavior: 'smooth',
        })
    }
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {this.props.children}
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            zIndex: 0,
            position: 'relative',
          }}>
          <Drawer
            variant={'persistent'}
            open={this.props.showThumbnails}
            anchor="left"
            SlideProps={this.props.drawerSlideProps}
            PaperProps={{
              style: {
                position: 'relative',
                width: this.state.thumbnaislVisibility ? '200px' : 0,
                height: '100%',
                overflow: 'hidden',
              },
            }}>
            <PageList
              showWidgets={false}
              style={{ minWidth: 200, marginRight: '-16px', paddingRight: 0 }}
              id="sn-document-viewer-thumbnails"
              zoomMode="fit"
              fitRelativeZoomLevel={0}
              zoomLevel={1}
              onPageClick={(_ev, index) => this.scrollTo(index)}
              elementName={THUMBNAIL_NAME}
              images="thumbnail"
              tolerance={0}
              padding={THUMBNAIL_PADDING}
              activePage={this.state.activePage}
            />
          </Drawer>
          <PageList
            handleMarkerCreation={this.handleMarkerCreation}
            showWidgets={true}
            id="sn-document-viewer-pages"
            zoomMode={this.props.zoomMode}
            zoomLevel={this.props.customZoomLevel}
            fitRelativeZoomLevel={this.props.fitRelativeZoomLevel}
            onPageClick={(_ev, index) => this.scrollTo(index)}
            elementName={PAGE_NAME}
            images="preview"
            tolerance={0}
            padding={PAGE_PADDING}
            activePage={this.state.activePage}
          />
          <Drawer
            variant={'persistent'}
            open={this.props.showComments}
            anchor="right"
            SlideProps={this.props.drawerSlideProps}
            PaperProps={{
              style: {
                position: 'relative',
                width: this.props.showComments ? '340px' : 0,
                height: '100%',
                overflow: 'hidden',
              },
            }}>
            <CommentsContainer ref={this.commentsContainerRef}>
              <Typography variant="h4">{this.props.localization.commentSideBarTitle}</Typography>
              <CreateComment
                isActive={this.props.isCreateCommentActive}
                handleIsActive={isActive => this.props.toggleIsCreateCommentActive(isActive)}
                draftCommentMarker={this.state.draftCommentMarker}
                handlePlaceMarkerClick={isPlacing => this.toggleIsPlacingCommentMarker(isPlacing)}
                isPlacingMarker={this.props.isPlacingCommentMarker}
                localization={this.props.localization}
                createComment={this.createComment}
                inputValue={this.state.createCommentValue}
                handleInputValueChange={value => this.setState({ ...this.state, createCommentValue: value })}
              />
              {this.props.comments.map(comment => (
                <Comment key={comment.id} {...comment} />
              ))}
            </CommentsContainer>
          </Drawer>
        </div>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentViewerLayoutComponent)

export { connectedComponent as DocumentViewerLayout }
