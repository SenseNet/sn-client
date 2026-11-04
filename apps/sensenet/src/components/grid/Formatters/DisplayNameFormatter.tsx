import React from 'react'
import { SimpleTextValueProps } from '../Props/SimpleTextValueProps'
export function DisplayNameFormatter(props: SimpleTextValueProps) {
  function GetDisplayName() {
    return props.value
  }
  return (
    <>
      <span className="title">{GetDisplayName()}</span>
    </>
  )
}
