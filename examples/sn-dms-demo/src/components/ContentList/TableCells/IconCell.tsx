import * as React from 'react'
import { TableCell } from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import MediaQuery from 'react-responsive';

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
    selected: boolean,
    handleRowSingleClick: Function,
    handleRowDoubleClick: Function
}
interface IIconCellState { }

export class IconCell extends React.Component<IIconCellProps, IIconCellState>{
    render() {
        const { id, icon, selected } = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    const padding = matches ? 'none' : 'dense';
                    return <TableCell
                        style={styles.typeIcon}
                        padding={padding}
                        onClick={event => this.props.handleRowSingleClick(event, id)}
                        onDoubleClick={event => this.props.handleRowDoubleClick(event, id)}>
                        <Icon color='primary'>{matches || !selected ? icons[icon] : icons.tick}</Icon>
                    </TableCell>
                }}
            </MediaQuery>
        )
    }
}