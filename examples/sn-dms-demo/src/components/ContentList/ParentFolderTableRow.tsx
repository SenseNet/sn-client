import * as React from 'react'
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import { icons } from '../../assets/icons'

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
    parentId    
}

export class ParentFolderTableRow extends React.Component<IParentFolderTableRow, {}>{
    handleClick(e, id){}
    handleKeyDown(e, id){}
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
                <TableCell style={styles.parentDisplayName as any} disablePadding>[ ... ]</TableCell>
                <TableCell style={styles.displayName as any}></TableCell>
                <TableCell>aaa{this.props.parentId}</TableCell>
                <TableCell style={styles.actionMenuButton}></TableCell>
            </TableRow>
        )
    }
}