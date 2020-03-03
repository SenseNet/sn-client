import React from 'react'
import { Typography } from '@material-ui/core'
import { SimpleList } from '../content/Simple'
import { useGlobalStyles } from '../../globalStyles'

export default function Localization() {
  const globalClasses = useGlobalStyles()

  return (
    <div className={globalClasses.contentWrapper}>
      <Typography variant="h6" className={globalClasses.contentTitle}>
        Localization
      </Typography>
      <SimpleList
        parent="/Root/Localization"
        rootPath="/Root/Localization"
        contentListProps={{
          enableBreadcrumbs: false,
          parentIdOrPath: '/Root/Localization',
        }}
      />
    </div>
  )
}
