import React from 'react'
import { SimpleBooleanValueProps } from '../Props/SimpleBooleanValueProps'
export function LockedFormatter(props: SimpleBooleanValueProps) {
  return <>{props.value ? <span className="locked cellvalue">🔒</span> : null}</>
}
