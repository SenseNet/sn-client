import { InsertDriveFileOutlined } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { Icon } from '../../Icon'

export function IconFormatter(props: { data?: GenericContent }) {
  return (
    <span className="icon-grid" title={props.data?.Type?.toString()}>
      {props.data &&
        (props.data.Icon?.toLowerCase() === 'file' ? (
          <InsertDriveFileOutlined style={{ width: 24, height: 24 }} />
        ) : (
          <Icon style={{ width: 32, height: 32 }} item={props.data} />
        ))}
    </span>
  )
}
