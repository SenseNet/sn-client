import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { useState } from 'react'
import TableCell from '@material-ui/core/TableCell'

export interface VirtualDisplayNameCellProps<T extends GenericContent = GenericContent> {
  rowData: T
  icons?: any
}

export const VirtualDisplayNameCell: React.FC<VirtualDisplayNameCellProps> = (props) => {
  const [icon] = useState(props.rowData.Icon && props.icons && props.icons[props.rowData.Icon.toLowerCase() as any])
  const [type] = useState(
    props.rowData.Icon === 'word' ||
      props.rowData.Icon === 'excel' ||
      props.rowData.Icon === 'acrobat' ||
      props.rowData.Icon === 'powerpoint'
      ? iconType.flaticon
      : iconType.materialui,
  )

  return (
    <TableCell
      style={{
        height: '57px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: 0,
      }}
      component="div"
      className="display-name">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon ? <Icon type={type} iconName={icon} style={{ marginRight: '.5em' }} /> : null}
        <div>{props.rowData.DisplayName || props.rowData.Name}</div>
      </div>
    </TableCell>
  )
}
