import React from 'react'
import { SimpleTextValueProps } from '../Props/SimpleTextValueProps'

export const formatDateTime = (value: unknown) => {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value as string | number)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
}

export function DateTimeFormatter(props: SimpleTextValueProps) {
  return <span>{formatDateTime(props.value)}</span>
}
