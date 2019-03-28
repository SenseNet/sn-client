import Avatar from '@material-ui/core/Avatar'
import TableCell from '@material-ui/core/TableCell'
import { GenericContent, User } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { Component } from 'react'

const styles = {
  avatar: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
}

export interface DisplayNameCellProps<T extends GenericContent> {
  content: T
  isSelected: boolean
  icons: any
  hostName: string
}

// tslint:disable-next-line:no-var-requires
const DEFAULT_AVATAR = '/Root/Sites/Default_Site/demoavatars/Admin.png'

export class DisplayNameCell<T extends GenericContent> extends Component<DisplayNameCellProps<T>> {
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
          ) : content.Type === 'User' && (content as User).Avatar ? (
            <Avatar
              src={`${hostName}${
                (content as User).Avatar !== undefined && ((content as User).Avatar as { Url: '' }).Url.length > 0
                  ? ((content as User).Avatar as { Url: '' }).Url
                  : DEFAULT_AVATAR
              }`}
              style={styles.avatar}
            />
          ) : icon ? (
            <Icon type={type} iconName={icon} style={{ marginRight: '.5em' }} />
          ) : null}
          <div>{content.Type === 'User' ? (content as User).FullName : content.DisplayName || content.Name}</div>
        </div>
      </TableCell>
    )
  }
}
