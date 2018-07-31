import { Drawer } from '@material-ui/core'
import { SlideProps } from '@material-ui/core/Slide'
import React = require('react')
import { connect } from 'react-redux'
import { componentType } from '../services'
import { RootReducerType, setActivePages, setThumbnails } from '../store'
import { PageList } from './'

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
        fitRelativeZoomLevel: state.sensenetDocumentViewer.viewer.fitRelativeZoomLevel,

    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
    setActivePages,
    setThumbnails,
}

/** Props definition for the Document Viewer layout */
export interface DocumentLayoutOwnProps {
    drawerSlideProps?: Partial<SlideProps>
}

/** State type definition for the DocumentViewerLayout component */
export interface DocumentLayoutState {
    activePage?: number
    thumbnaislVisibility: boolean
}

/**
 * Component for the main DocumentViewer layout
 */
class DocumentViewerLayoutComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, DocumentLayoutOwnProps>, DocumentLayoutState> {

    /** the component state */
    public state = { activePage: 1, thumbnaislVisibility: this.props.showThumbnails }

    /** scrolls the viewer to focus to the page with the provided index */
    public scrollTo(index: number, smoothScroll: boolean = true) {
        this.setState({ ...this.state, activePage: index }, () => {
            const pagesContainer = document.getElementById('sn-document-viewer-pages')
            const activePage = document.getElementById(`Page-${index}`)

            if (pagesContainer && pagesContainer.scrollTo && activePage) {
                pagesContainer.scrollTo({
                    top: activePage.offsetTop - 8,
                    behavior: smoothScroll ? 'smooth' : 'instant',
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
            }
        })
    }

    /** triggered when the component will receive props */
    public componentWillReceiveProps(newProps: this['props']) {
        if (this.props.activePages[0] !== newProps.activePages[0] || this.props.fitRelativeZoomLevel !== newProps.fitRelativeZoomLevel) {
            this.scrollTo(newProps.activePages[0], this.props.fitRelativeZoomLevel === newProps.fitRelativeZoomLevel)
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
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {this.props.children}
                <div style={{
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
                        PaperProps={{ style: { position: 'relative', width: this.state.thumbnaislVisibility ? '200px' : 0, height: '100%', overflow: 'hidden' } }}>
                        <PageList
                            showWidgets={false}
                            style={{ minWidth: 200, marginRight: '-16px', paddingRight: 0 }}
                            id="sn-document-viewer-thumbnails"
                            zoomMode="fit"
                            fitRelativeZoomLevel={0}
                            zoomLevel={1}
                            onPageClick={(ev, index) => this.scrollTo(index)}
                            elementNamePrefix="Thumbnail-"
                            images="thumbnail"
                            tolerance={0}
                            padding={16}
                            activePage={this.state.activePage}
                        />
                    </Drawer>
                    <PageList
                        showWidgets={true}
                        id="sn-document-viewer-pages"
                        zoomMode={this.props.zoomMode}
                        zoomLevel={this.props.customZoomLevel}
                        fitRelativeZoomLevel={this.props.fitRelativeZoomLevel}
                        onPageClick={(ev, index) => this.scrollTo(index)}
                        elementNamePrefix="Page-"
                        images="preview"
                        tolerance={0}
                        padding={8}
                        activePage={this.state.activePage}
                    />
                </div>
            </div >
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLayoutComponent)

export { connectedComponent as DocumentViewerLayout }
