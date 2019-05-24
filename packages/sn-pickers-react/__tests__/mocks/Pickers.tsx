import { Repository } from '@sensenet/client-core'
import React from 'react'
import { GenericContentWithIsParent, useListPicker } from '../../src/ListPicker'

export const PickerWithoutOptions = (props: { repository: Repository }) => {
  const { items } = useListPicker<GenericContentWithIsParent>({ repository: props.repository })

  return <ul>{items && items.map(item => <li key={item.Id} />)}</ul>
}

export const PickerWithInvalidAction = (props: { repository: Repository }) => {
  const { items, dispatch } = useListPicker<GenericContentWithIsParent>({ repository: props.repository })
  dispatch({ type: 'invalid' })

  return <ul>{items && items.map(item => <li key={item.Id} />)}</ul>
}
