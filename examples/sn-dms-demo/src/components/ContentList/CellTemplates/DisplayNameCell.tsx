import TableCell from '@material-ui/core/TableCell'
import { GenericContent, User } from '@sensenet/default-content-types'
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
    const icon =
      this.props.content.Icon &&
      (this.props.icons[this.props.content.Icon.toLowerCase().replace('-', '')] ||
        this.props.content.Icon.toLowerCase())
    const type =
      this.props.content.Icon === 'word' ||
      this.props.content.Icon === 'excel' ||
      this.props.content.Icon === 'acrobat' ||
      this.props.content.Icon === 'powerpoint' ||
      (this.props.content.Icon && this.props.content.Icon.indexOf('workspace') > -1)
        ? iconType.flaticon
        : iconType.materialui
    const { content, hostName } = this.props
    const isImage =
      content.Name.indexOf('jpg') > -1 ||
      content.Name.indexOf('jpeg') > -1 ||
      content.Name.indexOf('png') > -1 ||
      content.Name.indexOf('gif') > -1
        ? true
        : false

    return (
      <TableCell className="display-name" padding="checkbox">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isImage ? (
            <img src={`${hostName}${content.Path}`} style={{ marginRight: '.5em', maxWidth: 24, maxHeight: 24 }} />
          ) : icon ? (
            <Icon type={type} iconName={icon} style={{ marginRight: '.5em' }} />
          ) : null}
          <div>{content.Type === 'User' ? (content as User).FullName : content.DisplayName || content.Name}</div>
        </div>
      </TableCell>
    )
  }
}
