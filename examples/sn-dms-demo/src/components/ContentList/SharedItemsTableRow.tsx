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
    typeIcon: {
        width: 30,
        lineHeight: '9px'
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

interface ISharedItemsTableRow {
    currentId,
}

export class SharedItemsTableRow extends React.Component<ISharedItemsTableRow, {}>{
    handleClick(e, id){}
    handleKeyDown(e, id){}
    render() {
        return (
            <TableRow
                hover
                onClick={event => this.handleClick(event, this.props.currentId)}
                onKeyDown={event => this.handleKeyDown(event, this.props.currentId)}
                tabIndex='-1'
                key={this.props.currentId}
            >
                <TableCell checkbox style={styles.checkboxButton}></TableCell>
                <TableCell style={styles.typeIcon} disablePadding><Icon color='accent'>{icons.SmartFolder}</Icon></TableCell>
                <TableCell style={styles.displayName}>Shared items</TableCell>
                <TableCell></TableCell>
                <TableCell style={styles.actionMenuButton}></TableCell>
            </TableRow>
        )
    }
}