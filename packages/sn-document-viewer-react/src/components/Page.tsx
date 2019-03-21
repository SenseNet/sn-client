import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import React = require('react')
import { connect } from 'react-redux'
import { DocumentData, MarkerCoordinates, PreviewImageData } from '../models'
import { componentType, ImageUtil } from '../services'
import { previewAvailable, RootReducerType, ZoomMode } from '../store'
import { ShapesWidget } from './page-widgets'
import { MARKER_SIZE } from './page-widgets/style'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType, ownProps: { imageIndex: number }) => {
  return {
    documentData: state.sensenetDocumentViewer.documentState.document as DocumentData,
    version: state.sensenetDocumentViewer.documentState.version,
    page:
      state.sensenetDocumentViewer.previewImages.AvailableImages[ownProps.imageIndex - 1] || ({} as PreviewImageData),
    activePages: state.sensenetDocumentViewer.viewer.activePages,
    showWatermark: state.sensenetDocumentViewer.viewer.showWatermark,
    pollInterval: state.sensenetDocumentViewer.previewImages.pollInterval,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
  previewAvailable,
}

/**
 * Defined the component's own properties
 */
export interface OwnProps {
  showWidgets: boolean
  imageIndex: number
  viewportHeight: number
  viewportWidth: number
  elementNamePrefix: string
  zoomMode: ZoomMode
  zoomLevel: number
  fitRelativeZoomLevel: number
  onClick: (ev: React.MouseEvent<HTMLElement>) => any
  margin: number
  image: 'preview' | 'thumbnail'
  isPlacingCommentMarker?: boolean
  handleMarkerCreation?: (coordinates: MarkerCoordinates) => void
}

/**
 * State model for the Page component
 */
export interface PageState {
  imgSrc: string
  pageWidth: number
  pageHeight: number
  isActive: boolean
  imageWidth: string
  imageHeight: string
  imageTransform: string
  zoomRatio: number
  isPolling: boolean
  draftCommentMarker?: MarkerCoordinates
}

/**
 * Represents a Page component that show the preview image on a Paper component
 * @extends {React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>, PageState>}
 */
export class PageComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>,
  PageState
> {
  constructor(props: PageComponent['props']) {
    super(props)
    this.state = {} as any
  }

  /** event before the component did unmount */
  public componentWillUnmount() {
    this.stopPolling()
  }

  private stopPolling() {
    if (this.pollPreview) {
      clearInterval(this.pollPreview)
      this.pollPreview = undefined
    }
  }

  private handleMarkerPlacement(event: React.MouseEvent) {
    if (!this.props.isPlacingCommentMarker) {
      return
    }
    // TODO(Zoli): Remove Math.trunc once backend allows floating point numbers
    const draftCommentMarker = {
      x: Math.trunc(event.nativeEvent.offsetX / this.state.zoomRatio) - MARKER_SIZE,
      y: Math.trunc(event.nativeEvent.offsetY / this.state.zoomRatio) - MARKER_SIZE,
    }
    this.setState({
      ...this.state,
      draftCommentMarker,
    })
    this.props.handleMarkerCreation && this.props.handleMarkerCreation(draftCommentMarker)
  }

  private pollPreview?: number = (setInterval(() => {
    if (this.state.isPolling) {
      this.props.previewAvailable(this.props.documentData, this.props.version, this.props.imageIndex)
    }
  }, this.props.pollInterval) as any) as number

  /**
   * Returns a derived state from the specified props
   * @param props The props for state creation
   */
  public static getDerivedStateFromProps(props: PageComponent['props'], state: PageState): PageState {
    const imageRotation = ImageUtil.normalizeDegrees((props.page.Attributes && props.page.Attributes.degree) || 0)
    const imageRotationRads = ((imageRotation % 180) * Math.PI) / 180
    const imgSrc = (props.image === 'preview' ? props.page.PreviewImageUrl : props.page.ThumbnailImageUrl) || ''
    const relativePageSize = ImageUtil.getImageSize(
      {
        width: props.viewportWidth,
        height: props.viewportHeight,
      },
      {
        width: props.page.Width,
        height: props.page.Height,
        rotation: (props.page.Attributes && props.page.Attributes.degree) || 0,
      },
      props.zoomMode,
      props.zoomLevel,
      props.fitRelativeZoomLevel,
    )
    const boundingBox = ImageUtil.getRotatedBoundingBoxSize(
      {
        width: props.page.Width,
        height: props.page.Height,
      },
      imageRotation,
    )

    const maxDiff = (relativePageSize.height - relativePageSize.width) / 2
    const diffHeight = Math.sin(imageRotationRads) * maxDiff

    return {
      draftCommentMarker: props.isPlacingCommentMarker ? state.draftCommentMarker : undefined,
      isActive: props.activePages.indexOf(props.page.Index) >= 0,
      imgSrc,
      pageWidth: relativePageSize.width,
      pageHeight: relativePageSize.height,
      zoomRatio: relativePageSize.height / props.page.Height,
      imageWidth: `${100 * boundingBox.zoomRatio}%`,
      imageHeight: `${100 * boundingBox.zoomRatio}%`,
      imageTransform: `translateY(${diffHeight}px) rotate(${imageRotation}deg)`,
      isPolling: !(imgSrc ? true : false),
    }
  }

  /**
   * renders the component
   */
  public render() {
    const elementName = `${this.props.elementNamePrefix}${this.props.page.Index}`
    return (
      <Paper elevation={this.state.isActive ? 8 : 2} id={elementName} style={{ margin: this.props.margin }}>
        <div
          style={{
            padding: 0,
            overflow: 'hidden',
            width: this.state.pageWidth - 2 * this.props.margin,
            height: this.state.pageHeight - 2 * this.props.margin,
            position: 'relative',
          }}
          onClick={ev => {
            this.props.onClick(ev)
            this.handleMarkerPlacement(ev)
          }}>
          {this.props.showWidgets ? (
            <div>
              <ShapesWidget
                draftCommentMarker={this.state.draftCommentMarker}
                zoomRatio={this.state.zoomRatio}
                page={this.props.page}
                viewPort={{ height: this.state.pageHeight, width: this.state.pageWidth }}
              />
            </div>
          ) : null}
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            {this.state.imgSrc ? (
              <img
                src={`${this.state.imgSrc}${this.props.showWatermark ? '?watermark=true' : ''}`}
                style={{
                  transition: 'transform .1s ease-in-out',
                  width: this.state.imageWidth,
                  height: this.state.imageHeight,
                  transform: this.state.imageTransform,
                }}
              />
            ) : (
              <CircularProgress style={{ marginTop: '50%' }} />
            )}
          </span>
        </div>
      </Paper>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PageComponent)
export { connectedComponent as Page }
