import * as React from 'react'
import { TableCell } from 'material-ui/Table';
import Icon from 'material-ui/Icon';

import { icons } from '../../../assets/icons'

const styles = {
    typeIcon: {
        width: 30,
        lineHeight: '9px'
    },
}

interface IIconCellProps {
    id: number,
    icon: string,
    handleRowSingleClick: Function,
    handleRowDoubleClick: Function
}
interface IIconCellState { }

export class IconCell extends React.Component<IIconCellProps, IIconCellState>{
    render() {
        const { id, icon } = this.props
        return (
            <TableCell
                style={styles.typeIcon}
                padding='none'
                onClick={event => this.props.handleRowSingleClick(event, id)}
                onDoubleClick={event => this.props.handleRowDoubleClick(event, id)}>
                <Icon color='primary'>{icons[icon]}</Icon>
            </TableCell>
        )
    }
}