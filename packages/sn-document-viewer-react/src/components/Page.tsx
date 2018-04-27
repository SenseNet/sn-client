import { Paper } from 'material-ui'
import { CircularProgress } from 'material-ui/Progress'
import React = require('react')
import { connect } from 'react-redux'
import { Element } from 'react-scroll'
import { DocumentData, DocumentViewerSettings, PreviewImageData } from '../models'
import { componentType, ImageUtil } from '../services'
import { previewAvailable, RootReducerType, ZoomMode } from '../store'

import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RotatePageWidget, ShapesWidget } from './page-widgets'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType, ownProps: { imageIndex: number }) => {
    return {
        store: state,
        documentData: state.sensenetDocumentViewer.documentState.document as DocumentData,
        version: state.sensenetDocumentViewer.documentState.version,
        page: state.sensenetDocumentViewer.previewImages.AvailableImages[ownProps.imageIndex - 1] || {} as PreviewImageData,
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
    previewAvailable: previewAvailable as ActionCreator<ThunkAction<Promise<void>, RootReducerType, DocumentViewerSettings>>,
}

/**
 * Defined the component's own properties
 */
export interface OwnProps {
    showWidgets: boolean,
    imageIndex: number,
    viewportHeight: number,
    viewportWidth: number,
    elementNamePrefix: string,
    zoomMode: ZoomMode,
    zoomLevel: number,
    onClick: (ev: React.MouseEvent<HTMLElement>) => any,
    image: 'preview' | 'thumbnail'
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
}

class Page extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>, PageState> {

    private pollPreview?: number
    /** the component state */
    public state = this.getStateFromProps(this.props)

    private stopPolling() {
        if (this.pollPreview) {
            clearInterval(this.pollPreview)
            this.pollPreview = undefined
        }
    }

    /** event after the component did mount */
    public componentDidMount() {
        this.componentWillReceiveProps(this.props)
    }

    /** event before the component did unmount */
    public componentWillUnmount() {
        this.stopPolling()
    }

    private getStateFromProps(props: this['props']): PageState {
        const imageRotation = ImageUtil.normalizeDegrees(props.page.Attributes && props.page.Attributes.degree || 0)
        const imageRotationRads = (imageRotation % 180) * Math.PI / 180
        const imgSrc = (this.props.image === 'preview' ? props.page.PreviewImageUrl : props.page.ThumbnailImageUrl) || ''
        const relativePageSize = ImageUtil.getImageSize({
            width: props.viewportWidth,
            height: props.viewportHeight,
        }, {
                width: props.page.Width,
                height: props.page.Height,
                rotation: props.page.Attributes && props.page.Attributes.degree || 0,
            }, props.zoomMode, props.zoomLevel)
        const boundingBox = ImageUtil.getRotatedBoundingBoxSize({
            width: props.page.Width,
            height: props.page.Height,
        }, imageRotation)

        const maxDiff = (relativePageSize.height - relativePageSize.width) / 2
        const diffHeight = Math.sin(imageRotationRads) * maxDiff

        if (!imgSrc) {
            this.stopPolling()
            this.pollPreview = setInterval(() => {
                this.props.previewAvailable(this.props.documentData, this.props.version, this.props.imageIndex)
            }, this.props.pollInterval) as any as number
        } else {
            this.stopPolling()
        }

        return {
            isActive: props.activePages.indexOf(this.props.page.Index) >= 0,
            imgSrc,
            pageWidth: relativePageSize.width,
            pageHeight: relativePageSize.height,
            zoomRatio: relativePageSize.height / props.page.Height,
            imageWidth: `${100 * boundingBox.zoomRatio}%`,
            imageHeight: `${100 * boundingBox.zoomRatio}%`,
            imageTransform: `translateY(${diffHeight}px) rotate(${imageRotation}deg)`,
        }
    }

    /** triggered when the component will receive props */

    public componentWillReceiveProps(nextProps: this['props']) {
        const newState = this.getStateFromProps(nextProps)
        this.setState({ ...newState })
    }

    /**
     * renders the component
     */
    public render() {
        return (
            <Element name={`${this.props.elementNamePrefix}${this.props.page.Index}`} style={{ margin: '8px' }}>
                <Paper elevation={this.state.isActive ? 8 : 2}>
                    <div style={{
                        padding: 0,
                        overflow: 'hidden',
                        width: this.state.pageWidth,
                        height: this.state.pageHeight,
                        position: 'relative',
                    }} onClick={(ev) => this.props.onClick(ev)}>
                        {this.props.showWidgets ?
                            <div>
                                <ShapesWidget zoomRatio={this.state.zoomRatio} page={this.props.page} viewPort={{ height: this.state.pageHeight, width: this.state.pageWidth }} />
                                <RotatePageWidget zoomRatio={this.state.zoomRatio} page={this.props.page} viewPort={{ height: this.state.pageHeight, width: this.state.pageWidth }} />
                            </div>
                            : null}
                        <span style={{ display: 'flex', justifyContent: 'center' }}>
                            {this.state.imgSrc ?
                                <img src={`${this.state.imgSrc}${this.props.showWatermark ? '?watermark=true' : ''}`}
                                    style={{ transition: 'transform .1s ease-in-out', width: this.state.imageWidth, height: this.state.imageHeight, transform: this.state.imageTransform }}
                                /> :
                                <CircularProgress />
                            }
                        </span>
                    </div>
                </Paper>
            </Element >
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(Page)
export { connectedComponent as Page }
