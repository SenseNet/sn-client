import React from 'react'
import { Typography } from '@material-ui/core'
import clsx from 'clsx'
import { SimpleList } from '../content/Simple'
import { useGlobalStyles } from '../../globalStyles'

export default function Localization() {
  const globalClasses = useGlobalStyles()

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <Typography variant="h6">Localization</Typography>
      </div>
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
