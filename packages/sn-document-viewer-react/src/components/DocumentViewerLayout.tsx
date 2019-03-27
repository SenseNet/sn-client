import Drawer from '@material-ui/core/Drawer'
import { SlideProps } from '@material-ui/core/Slide'
import Typography from '@material-ui/core/Typography'
import React = require('react')
import { connect } from 'react-redux'
import { DraftCommentMarker } from '../models'
import { componentType } from '../services'
import { createComment, RootReducerType, setActivePages, setThumbnails } from '../store'
import { getComments, setSelectedCommentId } from '../store/Comments'
import { PageList } from './'
import Comment from './comment/Comment'
import { CreateComment } from './comment/CreateComment'

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
}

/** Props definition for the Document Viewer layout */
export interface DocumentLayoutOwnProps {
  drawerSlideProps?: Partial<SlideProps>
}

/** State type definition for the DocumentViewerLayout component */
export interface DocumentLayoutState {
  isPlacingCommentMarker: boolean
  draftCommentMarker?: DraftCommentMarker
  activePage?: number
  thumbnaislVisibility: boolean
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
      isPlacingCommentMarker: false,
    }
    this.createComment = this.createComment.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleMarkerCreation = this.handleMarkerCreation.bind(this)
  }

  public componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp)
  }

  public componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp)
  }

  /** scrolls the viewer to focus to the page with the provided index */
  public scrollTo(index: number, smoothScroll: boolean = true) {
    this.setState({ ...this.state, activePage: index }, () => {
      const pagesContainer = document.getElementById('sn-document-viewer-pages')
      const activePage = document.getElementById(`Page-${index}`)

      if (pagesContainer && pagesContainer.scrollTo && activePage) {
        pagesContainer.scrollTo({
          top: activePage.offsetTop - 8,
          behavior: smoothScroll ? 'smooth' : 'auto',
        })
      }

      const thumbnailsContainer = document.getElementById('sn-document-viewer-thumbnails')
      const activeThumbnail = document.getElementById(`Thumbnail-${index}`)

      if (thumbnailsContainer && thumbnailsContainer.scrollTo && activeThumbnail) {
        thumbnailsContainer.scrollTo({
          top: activeThumbnail.offsetTop - 16,
          behavior: 'smooth',
        })
      }

      if (this.props.activePages[0] !== index) {
        this.props.setActivePages([index])
        this.props.getComments()
      }
    })
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

  private toggleIsPlacingCommentMarker(isPlacingCommentMarker = !this.state.isPlacingCommentMarker) {
    this.setState({ ...this.state, isPlacingCommentMarker, draftCommentMarker: undefined })
  }

  private handleKeyUp(ev: KeyboardEvent) {
    if (ev.key !== 'Escape') {
      return
    }
    if (this.state.isPlacingCommentMarker) {
      this.toggleIsPlacingCommentMarker(false)
    }
    this.props.setSelectedCommentId('')
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
              elementNamePrefix="Thumbnail-"
              images="thumbnail"
              tolerance={0}
              padding={16}
              activePage={this.state.activePage}
            />
          </Drawer>
          <PageList
            handleMarkerCreation={this.handleMarkerCreation}
            isPlacingCommentMarker={this.state.isPlacingCommentMarker}
            showWidgets={true}
            id="sn-document-viewer-pages"
            zoomMode={this.props.zoomMode}
            zoomLevel={this.props.customZoomLevel}
            fitRelativeZoomLevel={this.props.fitRelativeZoomLevel}
            onPageClick={(_ev, index) => this.scrollTo(index)}
            elementNamePrefix="Page-"
            images="preview"
            tolerance={0}
            padding={8}
            activePage={this.state.activePage}
          />
          <Drawer
            variant={'persistent'}
            open={this.props.showComments}
            anchor="right"
            SlideProps={this.props.drawerSlideProps}
            PaperProps={{
              style: {
                width: '300px',
                right: '25px',
                top: '75px',
              },
            }}>
            <Typography variant="h4">Comments</Typography>
            <CreateComment
              draftCommentMarker={this.state.draftCommentMarker}
              handlePlaceMarkerClick={() => this.toggleIsPlacingCommentMarker()}
              isPlacingMarker={this.state.isPlacingCommentMarker}
              localization={this.props.localization}
              createComment={this.createComment}
            />
            {this.props.comments.map(comment => (
              <Comment key={comment.id} {...comment} />
            ))}
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
