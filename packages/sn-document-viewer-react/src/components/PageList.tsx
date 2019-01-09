import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import { connect } from 'react-redux'
import { PreviewImageData } from '../models'
import { componentType, ImageUtil } from '../services'
import { RootReducerType, ZoomMode } from '../store'
import { Page } from './'

// tslint:disable-next-line:no-var-requires
const debounce = require('lodash.debounce')

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType) => {
  return {
    pages: state.sensenetDocumentViewer.previewImages.AvailableImages || [],
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {}

/**
 * Defines the own properties for the PageList component
 */
export interface PageListProps {
  tolerance: number
  padding: number
  id: string
  elementNamePrefix: string
  zoomMode: ZoomMode
  zoomLevel: number
  fitRelativeZoomLevel: number
  images: 'preview' | 'thumbnail'
  activePage?: number
  onPageClick: (ev: React.MouseEvent<HTMLElement>, pageIndex: number) => void
  style?: React.CSSProperties
  showWidgets: boolean
}

/**
 * Type definition for the PageList component's State
 */
export interface PageListState {
  marginTop: number
  marginBottom: number
  scrollState: number
  pagesToSkip: number
  pagesToTake: number
  viewportWidth: number
  viewportHeight: number
  visiblePages: PreviewImageData[]
}

class PageList extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps, PageListProps>,
  PageListState
> {
  /** the component state */
  public state: PageListState = {
    marginTop: 0,
    marginBottom: 0,
    scrollState: 0,
    pagesToSkip: 0,
    viewportWidth: 110,
    viewportHeight: 110,
    pagesToTake: 32,
    visiblePages: this.props.pages.slice(0, 3),
  }

  private canUpdate: boolean = false
  private viewPort?: Element
  private onResize!: () => void
  private onScroll!: () => void

  /** event that will be triggered before mounting the component */
  public componentWillMount() {
    this.onResize = debounce(() => this.setupViewPort(), 50).bind(this)
    addEventListener('resize', this.onResize)
    this.onResize()
    this.canUpdate = true
  }

  /** event that will be triggered after mounting the component */
  public componentDidMount() {
    this.setupViewPort()
    this.onScroll = debounce(() => this.setupVisiblePages(this.props), 10).bind(this)
    this.viewPort && this.viewPort.addEventListener('scroll', this.onScroll)
    this.onScroll()
  }

  /** event that will be triggered before unmounting the component */
  public componentWillUnmount() {
    removeEventListener('resize', this.onResize)
    this.viewPort && this.viewPort.removeEventListener('scroll', this.onScroll)
    this.canUpdate = false
  }

  /** triggered when the component will receive props */
  public componentWillReceiveProps(newProps: this['props']) {
    this.setupVisiblePages(newProps, newProps.activePage !== this.props.activePage ? newProps.activePage : undefined)
  }

  private setupVisiblePages(props: this['props'], pageNo?: number) {
    if (!props.pages.length || !this.canUpdate) {
      return
    }

    let defaultWidth!: number
    let defaultHeight!: number

    const pages = props.pages.map(p => {
      if ((p && !defaultWidth) || !defaultHeight) {
        ;[defaultWidth, defaultHeight] = [p.Width, p.Height]
      }

      if (!p.Width || !p.Height) {
        ;[p.Width, p.Height] = [defaultWidth, defaultHeight]
      }

      const relativeSize = ImageUtil.getImageSize(
        {
          width: this.state.viewportWidth,
          height: this.state.viewportHeight,
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

    const scrollState = (this.viewPort && this.viewPort.scrollTop) || 0
    let marginTop: number = 0
    let pagesToSkip: number = 0

    while (
      pageNo !== undefined
        ? pagesToSkip < pageNo - 1
        : pages[pagesToSkip] && marginTop + pages[pagesToSkip].Height + props.tolerance < scrollState
    ) {
      marginTop += pages[pagesToSkip].Height + props.padding * 2
      pagesToSkip++
    }

    let pagesToTake: number = 1
    let pagesHeight: number = 0

    while (pages[pagesToSkip + pagesToTake] && pagesHeight < this.state.viewportHeight + props.tolerance) {
      pagesHeight += pages[pagesToSkip + pagesToTake].Height + props.padding * 2
      pagesToTake++
    }

    let marginBottom: number = 0
    for (let i = pagesToSkip + pagesToTake - 1; i < pages.length - 1; i++) {
      marginBottom += pages[i].Height + props.padding * 2
    }

    if (pagesToSkip !== this.state.pagesToSkip || pagesToTake !== this.state.pagesToTake) {
      this.setState({
        ...this.state,
        marginTop,
        marginBottom,
        pagesToSkip,
        pagesToTake,
        scrollState,
        visiblePages: pages.slice(pagesToSkip, pagesToSkip + pagesToTake),
      })
      // this.forceUpdate()
    }
  }

  private setupViewPort() {
    if (!this.viewPort) {
      this.viewPort = document.querySelector(`#${this.props.id}`) || undefined
    }
    if (this.canUpdate && this.viewPort) {
      const newHeight = this.viewPort.clientHeight - this.props.padding * 2
      const newWidth = this.viewPort.clientWidth - this.props.padding * 2
      if (!this.state || newHeight !== this.state.viewportHeight || newWidth !== this.state.viewportWidth) {
        this.setState({
          ...this.state,
          visiblePages: this.state.visiblePages,
          viewportHeight: newHeight,
          viewportWidth: newWidth,
        })
        this.forceUpdate()
      }
    }
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <Grid
        item={true}
        style={{ ...this.props.style, flexGrow: 1, flexShrink: 1, overflow: 'auto', height: '100%' }}
        id={this.props.id}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: this.state.marginTop || 0,
            paddingBottom: this.state.marginBottom || 0,
          }}>
          {this.state.visiblePages.map(value => (
            <Page
              showWidgets={this.props.showWidgets}
              viewportWidth={this.state.viewportWidth}
              viewportHeight={this.state.viewportHeight}
              key={value.Index}
              imageIndex={value.Index}
              onClick={ev => this.props.onPageClick(ev, value.Index)}
              zoomMode={this.props.zoomMode}
              zoomLevel={this.props.zoomLevel}
              fitRelativeZoomLevel={this.props.fitRelativeZoomLevel}
              elementNamePrefix={this.props.elementNamePrefix}
              image={this.props.images}
              margin={this.props.padding}
            />
          ))}
        </div>
      </Grid>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PageList)
export { connectedComponent as PageList }
