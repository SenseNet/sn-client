import Icon from '@material-ui/core/Icon'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import * as React from 'react'
import MediaQuery from 'react-responsive'
import { icons } from '../../assets/icons'

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'as any,
    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'as any,
    },
    typeIcon: {
        width: 30,
        lineHeight: '9px',
    },
    loader: {
        margin: '0 auto',
    },
    displayName: {
        fontWeight: 'bold'as any,
    },
    icon: {
        verticalAlign: 'middle'as any,
    },
    table: {
        background: '#fff',
    },
}

interface SharedItemsTableRowProps {
    currentId,
}

export class SharedItemsTableRow extends React.Component<SharedItemsTableRowProps, {}> {
    constructor(props) {
        super(props)
        this.handleContextMenu = this.handleContextMenu.bind(this)
    }
    public handleClick(e, id) {
        // TODO
    }
    public handleKeyDown(e, id) {
        // TODO
    }
    public handleContextMenu(e) {
        e.preventDefault()
    }
    public render() {
        return (
            <TableRow
                hover
                onClick={(event) => this.handleClick(event, this.props.currentId)}
                onKeyDown={(event) => this.handleKeyDown(event, this.props.currentId)}
                onContextMenu={(event) => this.handleContextMenu(event)}
                tabIndex={-1}
                key={this.props.currentId}
            >
                <MediaQuery minDeviceWidth={700}>
                    <TableCell padding="checkbox" style={styles.checkboxButton}></TableCell>
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        const padding = matches ? 'none' : 'dense'
                        return <TableCell style={styles.typeIcon} padding={padding}><Icon color="secondary">{icons.smartfolder}</Icon></TableCell>
                    }}
                </MediaQuery>
                <TableCell style={styles.displayName as any}>Shared items</TableCell>
                <MediaQuery minDeviceWidth={700}>
                    <TableCell></TableCell>
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        const padding = matches ? 'none' : 'checkbox'
                        return <TableCell style={styles.actionMenuButton} padding={padding}></TableCell>
                    }}
                </MediaQuery>
            </TableRow>
        )
    }
}
