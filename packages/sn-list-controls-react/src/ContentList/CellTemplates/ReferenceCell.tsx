import TableCell from '@material-ui/core/TableCell'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'

export interface ReferenceCellProps<T extends GenericContent> {
    content: T,
    fieldName: keyof T,
}

export class ReferenceCell<T extends GenericContent> extends React.Component<ReferenceCellProps<T>, {}> {
    public render() {
        const { content, fieldName } = this.props
        return (<TableCell padding="checkbox">
            <span>{content[fieldName]}</span>
        </TableCell>
        )
    }
}
