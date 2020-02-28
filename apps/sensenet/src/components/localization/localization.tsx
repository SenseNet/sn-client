import React from 'react'
import { SimpleList } from '../content/Simple'

export default function Localization() {
  return (
    <SimpleList
      parent="/Root/Localization"
      rootPath="/Root/Localization"
      contentListProps={{
        enableBreadcrumbs: false,
        parentIdOrPath: '/Root/Localization',
      }}
    />
  )
}
