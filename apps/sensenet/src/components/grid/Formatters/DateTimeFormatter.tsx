import React from 'react'
import { SimpleTextValueProps } from '../Props/SimpleTextValueProps'

export function DateTimeFormatter(props: SimpleTextValueProps) {
  function GetDate(date: any) {
    if (date === undefined) {
      return ''
    }
    const convertedDate = new Date(date).toLocaleString().replace('. ', '-').replace('. ', '-').replace('. ', ' ')
    const splittedDate = convertedDate.split(' ')
    if (splittedDate[1].length === 7) {
      return `${splittedDate[0]} 0${splittedDate[1]}`
    }
    return convertedDate
  }
  return <span>{GetDate(props.value)}</span>
}
