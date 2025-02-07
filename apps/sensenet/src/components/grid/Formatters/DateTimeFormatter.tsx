import React from 'react'
import { SimpleTextValueProps } from '../Props/SimpleTextValueProps'

export function DateTimeFormatter(props: SimpleTextValueProps) {
  function GetDate(date: any) {
    if (date === undefined) {
      return ''
    }
    return date.replace('T', ' ').replace('Z', '').split('.', 1)[0]
  }
  return <span>{GetDate(props.value)}</span>
}
