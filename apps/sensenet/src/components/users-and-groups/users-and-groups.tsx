import React from 'react'
import { Typography } from '@material-ui/core'
import { SimpleList } from '../content/Simple'
import { useGlobalStyles } from '../../globalStyles'

export default function UsersAndGroups() {
  const globalClasses = useGlobalStyles()

  return (
    <div className={globalClasses.contentWrapper}>
      <Typography variant="h6" className={globalClasses.contentTitle}>
        Users and groups
      </Typography>
      <SimpleList
        parent="/Root/IMS/Public"
        rootPath="/Root/IMS/Public"
        contentListProps={{
          enableBreadcrumbs: false,
          parentIdOrPath: '/Root/IMS/Public',
          fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions'],
        }}
      />
    </div>
  )
}
