import React from 'react'
import { Icon } from '../../Icon'
export function IconFormatter(props: { data: string }) {
  return (
    <>
      <span className="icon-grid" title={`${(props.data as any)?.Type.toString()}`}>
        {<Icon item={props.data} />}
      </span>
    </>
  )
}
