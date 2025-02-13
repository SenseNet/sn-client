import React from 'react'
// import { Icon } from '../../Icon'
import { Icon } from '../../Icon'
import { SimpleTextValueProps } from '../Props/SimpleTextValueProps'
export function IconFormatter(props: SimpleTextValueProps) {
  return (
    <>
      <span className="icon" title={`${(props.value as any)?.Type.toString()}`}>
        {<Icon item={props.value} />}
      </span>
    </>
  )
}
