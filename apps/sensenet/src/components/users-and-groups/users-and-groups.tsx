import React from 'react'
import { Typography } from '@material-ui/core'
import clsx from 'clsx'
import { SimpleList } from '../content/Simple'
import { useGlobalStyles } from '../../globalStyles'

export default function UsersAndGroups() {
  const globalClasses = useGlobalStyles()

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <Typography variant="h6">Users and groups</Typography>
      </div>
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
