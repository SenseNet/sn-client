import { Icon, TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import React = require('react')

export interface DisplayNameCellProps<T extends GenericContent> {
    content: T
    isSelected: boolean
    icons: any
}

export class DisplayNameCell<T extends GenericContent> extends React.Component<DisplayNameCellProps<T>> {
    public render() {
        const icon = this.props.content.Icon && this.props.icons[this.props.content.Icon.toLowerCase() as any]
        return (<TableCell className="display-name" padding="checkbox">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {icon ?
                    <Icon style={{ marginRight: '.5em' }}>{icon}</Icon>
                    : null}
                <div>{this.props.content.DisplayName || this.props.content.Name}</div>
            </div>
        </TableCell>)
    }
}
