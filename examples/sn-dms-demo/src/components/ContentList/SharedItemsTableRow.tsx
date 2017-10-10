import * as React from 'react'
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import MediaQuery from 'react-responsive';
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
    constructor(props) {
        super(props)
        this.handleContextMenu = this.handleContextMenu.bind(this)
    }
    handleClick(e, id) { }
    handleKeyDown(e, id) { }
    handleContextMenu(e) {
        e.preventDefault()
    }
    render() {
        return (
            <TableRow
                hover
                onClick={event => this.handleClick(event, this.props.currentId)}
                onKeyDown={event => this.handleKeyDown(event, this.props.currentId)}
                onContextMenu={event => this.handleContextMenu(event)}
                tabIndex={-1}
                key={this.props.currentId}
            >
                <MediaQuery minDeviceWidth={700}>
                    <TableCell padding='checkbox' style={styles.checkboxButton}></TableCell>
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        const padding = matches ? 'none' : 'dense';
                        return <TableCell style={styles.typeIcon} padding={padding}><Icon color='accent'>{icons.SmartFolder}</Icon></TableCell>
                    }}
                </MediaQuery>
                <TableCell style={styles.displayName as any}>Shared items</TableCell>
                <MediaQuery minDeviceWidth={700}>
                    <TableCell></TableCell>
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