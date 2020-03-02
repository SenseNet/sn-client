import React from 'react'
import { SimpleList } from '../content/Simple'

export default function UsersAndGroups() {
  return (
    <SimpleList
      parent="/Root/IMS/Public"
      rootPath="/Root/IMS/Public"
      contentListProps={{
        enableBreadcrumbs: false,
        parentIdOrPath: '/Root/IMS/Public',
        fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions'],
      }}
    />
  )
}
