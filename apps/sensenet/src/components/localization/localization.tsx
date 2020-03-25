import React from 'react'
import clsx from 'clsx'
import { useHistory } from 'react-router'
import { SimpleList } from '../content/Simple'
import { useGlobalStyles } from '../../globalStyles'
import { useContentRouting, useLocalization } from '../../hooks'

export default function Localization() {
  const globalClasses = useGlobalStyles()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const history = useHistory()
  const contentRouter = useContentRouting()

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.Localization}</span>
      </div>
      <SimpleList
        parent="/Root/Localization"
        rootPath="/Root/Localization"
        contentListProps={{
          enableBreadcrumbs: false,
          parentIdOrPath: '/Root/Localization',
          onActivateItem: p => {
            history.push(contentRouter.getPrimaryActionUrl(p))
          },
        }}
      />
    </div>
  )
}
