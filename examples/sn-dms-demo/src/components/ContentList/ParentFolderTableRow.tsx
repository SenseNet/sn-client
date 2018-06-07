import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import {
    withRouter,
} from 'react-router-dom'
import * as DMSReducers from '../../Reducers'

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer' as any,
    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer' as any,
    },
    parentDisplayName: {
        width: 30,
        lineHeight: '9px',
        fontFamily: 'roboto',
        fontWeight: 'bold' as any,
        cursor: 'pointer' as any,
    },
    loader: {
        margin: '0 auto',
    },
    displayName: {
        fontWeight: 'bold' as any,
    },
    icon: {
        verticalAlign: 'middle' as any,
    },
    table: {
        background: '#fff',
    },
}

interface ParentFolderTableRowProps {
    history,
    parentId
}

class ParentFolderTableRow extends React.Component<ParentFolderTableRowProps, {}> {
    constructor(props) {
        super(props)
        this.handleDoubleClick = this.handleDoubleClick.bind(this)
    }
    public handleClick(e, id) {
        // TODO
    }
    public handleKeyDown(e, id) {
        // TODO
    }
    public handleDoubleClick(e, id) {
        this.props.history.push(`/${id}`)
    }
    public render() {
        const { parentId } = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    const padding = matches ? 'none' : 'dense'
                    return matches ? <TableRow
                        hover
                        onClick={(event) => matches ? this.handleClick(event, parentId) : this.handleDoubleClick(event, parentId)}
                        onKeyDown={(event) => this.handleKeyDown(event, parentId)}
                        tabIndex={-1}
                    >
                        <TableCell padding="checkbox" style={styles.checkboxButton}></TableCell>
                        <TableCell style={styles.parentDisplayName as any}
                            padding={padding}
                            onDoubleClick={(event) => this.handleDoubleClick(event, parentId)}>[ ... ]</TableCell>
                        <TableCell style={styles.displayName as any}
                            onDoubleClick={(event) => this.handleDoubleClick(event, parentId)}></TableCell>
                        <TableCell
                            onDoubleClick={(event) => this.handleDoubleClick(event, parentId)}></TableCell>
                        <TableCell style={styles.actionMenuButton} padding={padding}></TableCell>
                    </TableRow> :
                        <TableRow
                            hover
                            onClick={(event) => matches ? this.handleClick(event, parentId) : this.handleDoubleClick(event, parentId)}
                            onKeyDown={(event) => this.handleKeyDown(event, parentId)}
                            tabIndex={-1}
                        >
                            <TableCell style={styles.parentDisplayName as any}
                                padding={padding}
                                onDoubleClick={(event) => this.handleDoubleClick(event, parentId)}>[ ... ]</TableCell>
                            <TableCell
                                onDoubleClick={(event) => this.handleDoubleClick(event, parentId)}></TableCell>
                            <TableCell style={styles.actionMenuButton} padding={padding}></TableCell>
                        </TableRow>
                }}
            </MediaQuery>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        parentId: DMSReducers.getParentId(state.sensenet),
    }
}

export default withRouter(connect(mapStateToProps, {
})(ParentFolderTableRow))
