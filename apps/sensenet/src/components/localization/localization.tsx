import React from 'react'
import clsx from 'clsx'
import { SimpleList } from '../content/Simple'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

export default function Localization() {
  const globalClasses = useGlobalStyles()
  const localizationDrawerTitles = useLocalization().drawer.titles

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.Trash}</span>
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
