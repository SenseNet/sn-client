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
        return (
            <TableRow
                hover
                onClick={event => this.handleClick(event, this.props.parentId)}
                onKeyDown={event => this.handleKeyDown(event, this.props.parentId)}
                tabIndex={-1}
            //key={this.props.parentId}
            >
                <MediaQuery minDeviceWidth={700}>
                    <TableCell padding='checkbox' style={styles.checkboxButton}></TableCell>
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        const padding = matches ? 'none' : 'dense';
                        return <TableCell style={styles.parentDisplayName as any}
                            padding={padding}
                            onDoubleClick={event => this.handleDoubleClick(event, this.props.parentId)}>[ ... ]</TableCell>
                    }}
                </MediaQuery>
                <TableCell style={styles.displayName as any}
                    onDoubleClick={event => this.handleDoubleClick(event, this.props.parentId)}></TableCell>
                <MediaQuery minDeviceWidth={700}>
                    <TableCell
                        onDoubleClick={event => this.handleDoubleClick(event, this.props.parentId)}></TableCell>
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        const padding = matches ? 'none' : 'checkbox';
                        return <TableCell style={styles.actionMenuButton} padding={padding}></TableCell>
                    }}
                </MediaQuery>
            </TableRow>
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