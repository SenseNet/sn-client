import { TableCell } from '@material-ui/core'
import * as React from 'react'
import Moment from 'react-moment'

interface DateCellProps {
    date: string
}

export const DateCell: React.StatelessComponent<DateCellProps> = (props) => {
    return (<TableCell padding="checkbox">
        <Moment fromNow>
            {props.date}
        </Moment>
    </TableCell >)
}
