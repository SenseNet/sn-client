import Checkbox from 'material-ui/Checkbox'
import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table'
import * as React from 'react'

const columnData = [
    { id: 'Icon', numeric: false, disablePadding: true, label: 'Type' },
    { id: 'DisplayName', numeric: false, disablePadding: false, label: 'Display Name' },
    { id: 'ModificationDate', numeric: false, disablePadding: false, label: 'Last modified' },
]

interface ListHeadProps {
    numSelected,
    onRequestSort,
    onSelectAllClick,
    order,
    orderBy,
    count
}

export class ListHead extends React.Component<ListHeadProps, {}> {
    public createSortHandler = (property) => (event) => {
        this.props.onRequestSort(event, property)
    }
    public render() {
        const { onSelectAllClick, order, orderBy, numSelected } = this.props

        return (
            <TableHead>
                <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={numSelected > 0 && numSelected < this.props.count}
                                checked={numSelected === this.props.count}
                                onChange={onSelectAllClick}
                            />
                        </TableCell>
                    {columnData.map((column) => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                padding={column.disablePadding ? 'none' : 'dense'}
                            >
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={this.createSortHandler(column.id)}
                                >
                                    {column.label}
                                </TableSortLabel>
                            </TableCell>
                        )
                    }, this)}
                    <TableCell>
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }
}
