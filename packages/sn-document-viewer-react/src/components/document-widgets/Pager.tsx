import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import NavigateNext from '@material-ui/icons/NavigateNext'
import * as React from 'react'
import { connect } from 'react-redux'
import { RootReducerType, setActivePages } from '../../store'

// tslint:disable-next-line:no-var-requires
const debounce = require('lodash.debounce')

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    activePages: state.sensenetDocumentViewer.viewer.activePages,
    pageCount: state.sensenetDocumentViewer.documentState.document.pageCount,
    firstPage: state.sensenetDocumentViewer.localization.firstPage,
    previousPage: state.sensenetDocumentViewer.localization.previousPage,
    gotoPage: state.sensenetDocumentViewer.localization.gotoPage,
    nextPage: state.sensenetDocumentViewer.localization.nextPage,
    lastPage: state.sensenetDocumentViewer.localization.lastPage,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setActivePages,
}

/**
 * Defines the own props for the PagerState component
 */
export interface PagerState {
  currentPage: number
  lastPage: number
}

/**
 * Document widget component for paging
 */
export class PagerComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  PagerState
> {
  /** the component state */
  public state = { currentPage: this.props.activePages[0], lastPage: this.props.pageCount }

  private setPage = debounce(() => {
    this.props.setActivePages([this.state.currentPage])
  }, 200).bind(this)

  /** creates a derived state from props */
  public static getDerivedStateFromProps(
    nextProps: PagerComponent['props'],
    lastState: Partial<PagerComponent['state']>,
  ) {
    return {
      ...lastState,
      currentPage: lastState.currentPage || nextProps.activePages[0],
      lastPage: nextProps.pageCount,
    }
  }

  private gotoPage(page: string | number) {
    let pageInt = typeof page === 'string' ? parseInt(page, 10) : page
    if (!isNaN(pageInt)) {
      pageInt = Math.max(pageInt, 1)
      pageInt = Math.min(pageInt, this.props.pageCount)
      this.setState({
        currentPage: pageInt,
      })
      this.setPage()
    }
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton
          disabled={this.state.currentPage <= 1}
          title={this.props.firstPage}
          onClick={() => this.gotoPage(1)}
          id="FirstPage">
          <FirstPage />
        </IconButton>

        <IconButton
          disabled={this.state.currentPage <= 1}
          title={this.props.previousPage}
          onClick={() => this.gotoPage(this.props.activePages[0] - 1)}
          id="NavigateBefore">
          <NavigateBefore />
        </IconButton>

        <TextField
          title={this.props.gotoPage}
          value={this.state.currentPage}
          onChange={ev => this.gotoPage(ev.currentTarget.value)}
          type="number"
          required={true}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ min: 1, max: this.state.lastPage }}
          margin="dense"
        />

        <IconButton
          disabled={this.state.currentPage >= this.state.lastPage}
          title={this.props.nextPage}
          color={'primary'}
          onClick={() => this.gotoPage(this.props.activePages[0] + 1)}
          id="NavigateNext">
          <NavigateNext />
        </IconButton>

        <IconButton
          disabled={this.state.currentPage >= this.state.lastPage}
          title={this.props.lastPage}
          onClick={() => this.gotoPage(this.state.lastPage)}
          id="LastPage">
          <LastPage />
        </IconButton>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PagerComponent)

export { connectedComponent as PagerWidget }
