import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { useState } from 'react'
import TableCell from '@material-ui/core/TableCell'

export interface DisplayNameCellProps<T extends GenericContent = GenericContent> {
  content: T
  isSelected: boolean
  icons: any
}

export const DisplayNameCell: React.FC<DisplayNameCellProps> = (props) => {
  const [icon] = useState(props.content.Icon && props.icons[props.content.Icon.toLowerCase() as any])
  const [type] = useState(
    props.content.Icon === 'word' ||
      props.content.Icon === 'excel' ||
      props.content.Icon === 'acrobat' ||
      props.content.Icon === 'powerpoint'
      ? iconType.flaticon
      : iconType.materialui,
  )

  return (
    <TableCell className="display-name">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon ? <Icon type={type} iconName={icon} style={{ marginRight: '.5em' }} /> : null}
        <div>{props.content.DisplayName || props.content.Name}</div>
      </div>
    </TableCell>
  )
}
