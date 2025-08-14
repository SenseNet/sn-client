import React from 'react'
import { SimpleTextValueProps } from '../Props/SimpleTextValueProps'

export function DateTimeFormatter(props: SimpleTextValueProps) {
  function GetDate(date: any) {
    if (!date) return ''

    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return <span>{GetDate(props.value)}</span>
}
