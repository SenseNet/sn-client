import * as React from 'react'
import Moment from 'react-moment';
import { TableCell } from 'material-ui/Table';


interface IDateCellProps {
    date,
    id: number,
    handleRowSingleClick:  Function,
    handleRowDoubleClick: Function
}

export class DateCell extends React.Component<IDateCellProps, {}>{
    render() {
        const { id, date, handleRowSingleClick, handleRowDoubleClick } = this.props
        return (
            <TableCell
                onClick={event => handleRowSingleClick(event, id)}
                onDoubleClick={event => handleRowDoubleClick(event, id)}>
                <Moment fromNow>
                    {date}
                </Moment>
            </TableCell>
        )
    }
}