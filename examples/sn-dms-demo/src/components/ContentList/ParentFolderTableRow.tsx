import * as React from 'react'
import {
    withRouter
} from 'react-router-dom'
import { connect } from 'react-redux';
import { DMSReducers } from '../../Reducers'
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
        return (
            <TableRow
                hover
                onClick={event => this.handleClick(event, this.props.parentId)}
                onKeyDown={event => this.handleKeyDown(event, this.props.parentId)}
                tabIndex={-1}
            //key={this.props.parentId}
            >
                <TableCell checkbox style={styles.checkboxButton}></TableCell>
                <TableCell style={styles.parentDisplayName as any}
                    disablePadding
                    onDoubleClick={event => this.handleDoubleClick(event, this.props.parentId)}>[ ... ]</TableCell>
                <TableCell style={styles.displayName as any}
                    onDoubleClick={event => this.handleDoubleClick(event, this.props.parentId)}></TableCell>
                <TableCell
                    onDoubleClick={event => this.handleDoubleClick(event, this.props.parentId)}></TableCell>
                <TableCell style={styles.actionMenuButton}></TableCell>
            </TableRow>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        parentId: DMSReducers.getParentId(state.sensenet)
    }
}

export default connect(mapStateToProps, {
})(ParentFolderTableRow)