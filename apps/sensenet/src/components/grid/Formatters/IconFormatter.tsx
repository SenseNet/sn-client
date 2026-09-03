import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { Icon } from '../../Icon'

export function IconFormatter(props: { data?: GenericContent }) {
  return (
    <span className="icon-grid" title={props.data?.Type?.toString()}>
      {props.data && <Icon style={{ width: 32, height: 32 }} item={props.data} />}
    </span>
  )
}
