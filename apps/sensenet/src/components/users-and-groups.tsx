import { useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization } from '../hooks'
import { getPrimaryActionUrl } from '../services'
import { SimpleList } from './content/Simple'

export default function UsersAndGroups() {
  const globalClasses = useGlobalStyles()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const history = useHistory()
  const repository = useRepository()

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.UsersAndGroups}</span>
      </div>
      <SimpleList
        parent="/Root/IMS/Public"
        rootPath="/Root/IMS/Public"
        contentListProps={{
          enableBreadcrumbs: false,
          parentIdOrPath: '/Root/IMS/Public',
          fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions'],
          onActivateItem: (p) => {
            history.push(getPrimaryActionUrl(p, repository))
          },
        }}
      />
    </div>
  )
}
