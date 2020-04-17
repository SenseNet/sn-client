import { useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ContentContextService } from '../../services'
import { SimpleList } from '../content/Simple'

export default function UsersAndGroups() {
  const globalClasses = useGlobalStyles()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const history = useHistory()
  const repository = useRepository()
  const contentRouter = new ContentContextService(repository)

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
          onActivateItem: (p) => {
            history.push(contentRouter.getPrimaryActionUrl(p))
          },
        }}
      />
    </div>
  )
}
