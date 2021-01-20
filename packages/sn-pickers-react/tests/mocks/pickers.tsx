import { Repository } from '@sensenet/client-core'
import React from 'react'
import { useTreePicker } from '../../src/hooks'
import { GenericContentWithIsParent } from '../../src/types'

export const PickerWithoutOptions = (props: { repository: Repository }) => {
  const { items } = useTreePicker<GenericContentWithIsParent>({ repository: props.repository })

  return <ul>{items && items.map((item) => <li key={item.Id} />)}</ul>
}
