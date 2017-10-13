import * as React from 'react'
import {
    withRouter
} from 'react-router-dom'
import { connect } from 'react-redux';
import { DMSReducers } from '../../Reducers'
import MediaQuery from 'react-responsive';
import {
    TableCell,
    TableRow
} from 'material-ui/Table';

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'
    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'
    },
    parentDisplayName: {
        width: 30,
        lineHeight: '9px',
        fontFamily: 'roboto',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    loader: {
        margin: '0 auto'
    },
    displayName: {
        fontWeight: 'bold'
    },
    icon: {
        verticalAlign: 'middle'
    },
    table: {
        background: '#fff'
    }
}

interface IParentFolderTableRow {
    history,
    parentId
}

class ParentFolderTableRow extends React.Component<IParentFolderTableRow, {}>{
    constructor(props) {
        super(props)
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }
    handleClick(e, id) { }
    handleKeyDown(e, id) { }
    handleDoubleClick(e, id) {
        this.props.history.push(`/${id}`)
    }
    render() {
        const { parentId } = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    const padding = matches ? 'none' : 'dense';
                    return matches ? <TableRow
                        hover
                        onClick={event => matches ? this.handleClick(event, parentId) : this.handleDoubleClick(event, parentId)}
                        onKeyDown={event => this.handleKeyDown(event, parentId)}
                        tabIndex={-1}
                    >
                        <TableCell padding='checkbox' style={styles.checkboxButton}></TableCell>
                        <TableCell style={styles.parentDisplayName as any}
                            padding={padding}
                            onDoubleClick={event => this.handleDoubleClick(event, parentId)}>[ ... ]</TableCell>
                        <TableCell style={styles.displayName as any}
                            onDoubleClick={event => this.handleDoubleClick(event, parentId)}></TableCell>
                        <TableCell
                            onDoubleClick={event => this.handleDoubleClick(event, parentId)}></TableCell>
                        <TableCell style={styles.actionMenuButton} padding={padding}></TableCell>
                    </TableRow> :
                        <TableRow
                            hover
                            onClick={event => matches ? this.handleClick(event, parentId) : this.handleDoubleClick(event, parentId)}
                            onKeyDown={event => this.handleKeyDown(event, parentId)}
                            tabIndex={-1}
                        >
                            <TableCell style={styles.parentDisplayName as any}
                                padding={padding}
                                onDoubleClick={event => this.handleDoubleClick(event, parentId)}>[ ... ]</TableCell>
                            <TableCell
                                onDoubleClick={event => this.handleDoubleClick(event, parentId)}></TableCell>
                            <TableCell style={styles.actionMenuButton} padding={padding}></TableCell>
                        </TableRow>
                }}
            </MediaQuery>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        parentId: DMSReducers.getParentId(state.sensenet)
    }
}

export default withRouter(connect(mapStateToProps, {
})(ParentFolderTableRow))