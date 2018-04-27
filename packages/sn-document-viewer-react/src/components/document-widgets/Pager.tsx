import _ = require('lodash')
import { IconButton, TextField } from 'material-ui'
import { FirstPage, LastPage, NavigateBefore, NavigateNext } from 'material-ui-icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setActivePages } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        activePages: state.sensenetDocumentViewer.viewer.activePages,
        pageCount: state.sensenetDocumentViewer.documentState.document.pageCount,
        fistPage: state.sensenetDocumentViewer.localization.firstPage,
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
export class PagerComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>, PagerState> {

    /** the component state */
    public state = { currentPage: this.props.activePages[0], lastPage: this.props.pageCount }

    private setPage = _.debounce(() => {
        this.props.setActivePages([this.state.currentPage])
    }, 200).bind(this)

    /** triggered when the component will receive props */
    public componentWillReceiveProps(nextProps: this['props']) {
        this.setState({ currentPage: nextProps.activePages[0], lastPage: nextProps.pageCount })
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
                <IconButton disabled={this.state.currentPage <= 1} title={this.props.fistPage}>
                    <FirstPage onClick={(ev) => this.gotoPage(1)} />
                </IconButton>

                <IconButton disabled={this.state.currentPage <= 1} title={this.props.previousPage}>
                    <NavigateBefore onClick={(ev) => this.gotoPage(this.props.activePages[0] - 1)} />
                </IconButton>

                <TextField
                    title={this.props.gotoPage}
                    value={this.state.currentPage}
                    onChange={(ev) => this.gotoPage(ev.currentTarget.value)}
                    type="number"
                    required={true}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{ min: 1, max: this.state.lastPage }}
                    margin="dense"
                />

                <IconButton disabled={this.state.currentPage >= this.state.lastPage} title={this.props.nextPage}>
                    <NavigateNext onClick={(ev) => this.gotoPage(this.props.activePages[0] + 1)} />
                </IconButton>

                <IconButton disabled={this.state.currentPage >= this.state.lastPage} title={this.props.lastPage}>
                    <LastPage onClick={(ev) => this.gotoPage(this.state.lastPage)} />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(PagerComponent)

export {connectedComponent as PagerWidget}
