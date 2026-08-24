import React from 'react'
import { Icon } from '../../Icon'
export function IconFormatter(props: { data: string }) {
  return (
    <>
      <span className="icon-grid" title={`${(props.data as any)?.Type.toString()}`}>
        {<Icon style={{ width: 32, height: 32 }} item={props.data} />}
      </span>
    </>
  )
}
