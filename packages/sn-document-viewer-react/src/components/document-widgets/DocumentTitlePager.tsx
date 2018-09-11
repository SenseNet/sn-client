import { ClickAwayListener, TextField, Typography } from '@material-ui/core'
import _ = require('lodash')
import * as React from 'react'
import { connect } from 'react-redux'
import { RootReducerType, setActivePages } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        documentName: state.sensenetDocumentViewer.documentState.document.documentName,
        activePages: state.sensenetDocumentViewer.viewer.activePages,
        pageCount: state.sensenetDocumentViewer.documentState.document.pageCount,
        gotoPage: state.sensenetDocumentViewer.localization.gotoPage,
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
    focused: boolean
}

/**
 * Document widget component for paging
 */
export class DocumentTitlePagerComponent extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, PagerState> {

    /**
     *
     */
    constructor(props: DocumentTitlePagerComponent['props']) {
        super(props)
        this.submitPageNumber = this.submitPageNumber.bind(this)
    }

    /** the component state */
    public state: PagerState = {
        currentPage: (this.props.activePages[0]) || 1,
        lastPage: this.props.pageCount,
        focused: false,
    }

    private setPage = _.debounce(() => {
        this.props.setActivePages([this.state.currentPage])
    }, 200).bind(this)

    /** triggered when the component will receive props */
    public static getDerivedStateFromProps(nextProps: DocumentTitlePagerComponent['props'], lastState: Partial<PagerState>) {
        const newState: Partial<PagerState> = {
            ...lastState,
            lastPage: nextProps.pageCount,
        }
        return newState
    }

    /**
     * sets the page to the specified value
     * @param page
     */
    public gotoPage(page: string | number) {
        let pageInt = typeof page === 'string' ? parseInt(page, 10) : page
        if (!isNaN(pageInt)) {
            pageInt = Math.max(pageInt, 1)
            pageInt = Math.min(pageInt, this.props.pageCount)
            this.setState({
                currentPage: pageInt,
            }, () => {
                this.setPage()
            })
        }
    }

    private submitPageNumber(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault()
        const formData = new FormData(ev.currentTarget)
        const pageNo = formData.get('gotoPage') as string
        if (pageNo) {
            this.gotoPage(pageNo)
        }
    }

    private handleFocused() {
        this.setState({
            ...this.state,
            focused: true,
        })
    }

    private handleBlur() {
        this.setState({
            ...this.state,
            focused: false,
        })
    }

    /**
     * renders the component
     */
    public render() {
        return (
            <ClickAwayListener onClickAway={() => this.handleBlur()}>
                <Typography onClick={() => this.handleFocused()} variant="title" color="inherit" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', overflow: 'hidden', margin: '0 2.5em' }} title={this.props.documentName}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{this.props.documentName}&nbsp;</div>
                    {this.state.focused ?
                        <form onSubmit={this.submitPageNumber} >
                            <TextField
                                style={{ flexShrink: 0 }}
                                title={this.props.gotoPage}
                                defaultValue={this.state.currentPage}
                                onClick={(ev) => this.gotoPage((ev.target as HTMLInputElement).value)}
                                type="number"
                                required={true}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                name="gotoPage"
                                inputProps={{
                                    min: 1, max: this.state.lastPage, style: { textAlign: 'center', color: 'white' },
                                }}
                                margin="dense"
                            />
                        </form>
                        :
                        <div style={{ flexShrink: 0 }}>{this.props.activePages[0]} / {this.props.pageCount}</div>
                    }
                </Typography>
            </ClickAwayListener>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentTitlePagerComponent)

export { connectedComponent as DocumentTitlePager }
