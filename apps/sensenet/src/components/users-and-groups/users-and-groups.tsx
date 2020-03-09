import React from 'react'
import clsx from 'clsx'
import { SimpleList } from '../content/Simple'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

export default function UsersAndGroups() {
  const globalClasses = useGlobalStyles()
  const localizationDrawerTitles = useLocalization().drawer.titles

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles['Users and groups']}</span>
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
