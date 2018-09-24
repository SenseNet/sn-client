import { TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React = require('react')

export interface DisplayNameCellProps<T extends GenericContent> {
    content: T
    isSelected: boolean
    icons: any
}

export class DisplayNameCell<T extends GenericContent> extends React.Component<DisplayNameCellProps<T>> {
    public render() {
        const icon = this.props.content.Icon && this.props.icons[this.props.content.Icon.toLowerCase() as any]
        const type = this.props.content.Icon === 'word' || this.props.content.Icon === 'excel' || this.props.content.Icon === 'acrobat' || this.props.content.Icon === 'powerpoint'
         ? iconType.flaticon : iconType.materialui

        return (<TableCell className="display-name" padding="checkbox">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {icon ?
                    <Icon
                        type={type}
                        iconName={icon}
                        style={{ marginRight: '.5em' }} />
                    : null}
                <div>{this.props.content.DisplayName || this.props.content.Name}</div>
            </div>
        </TableCell>)
    }
}
