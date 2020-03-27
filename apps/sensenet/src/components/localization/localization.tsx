import { useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ContentContextService } from '../../services'
import { SimpleList } from '../content/Simple'

export default function Localization() {
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const history = useHistory()

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
            history.push(new ContentContextService(repository).getPrimaryActionUrl(p))
          },
        }}
      />
    </div>
  )
}
