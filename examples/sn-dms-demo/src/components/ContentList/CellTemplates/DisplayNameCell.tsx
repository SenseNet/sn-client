import { TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'

export interface DisplayNameCellProps<T extends GenericContent> {
    content: T
    isSelected: boolean
    icons: any
    hostName: string
}

export class DisplayNameCell<T extends GenericContent> extends React.Component<DisplayNameCellProps<T>> {
    public render() {
        const icon = this.props.content.Icon && this.props.icons[this.props.content.Icon.toLowerCase() as any]
        const type = this.props.content.Icon === 'word' || this.props.content.Icon === 'excel' || this.props.content.Icon === 'acrobat' || this.props.content.Icon === 'powerpoint'
            ? iconType.flaticon : iconType.materialui
        const { content, hostName } = this.props
        const isImage = content.Name.indexOf('jpg') > -1 || content.Name.indexOf('jpeg') > -1 || content.Name.indexOf('png') > -1 || content.Name.indexOf('gif') > -1 ? true : false
        return (<TableCell className="display-name" padding="checkbox">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isImage ?
                    <img src={`${hostName}${content.Path}`} style={{ marginRight: '.5em', maxWidth: 24, maxHeight: 24 }} />
                    : icon ?
                        <Icon
                            type={type}
                            iconName={icon}
                            style={{ marginRight: '.5em' }} />
                        : null}
                <div>{content.DisplayName || content.Name}</div>
            </div>
        </TableCell>)
    }
}
