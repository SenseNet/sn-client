import { useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization } from '../hooks'
import { getPrimaryActionUrl } from '../services'
import { SimpleList } from './content/Simple'

const contentTypesPath = '/Root/System/Schema/ContentTypes'
const fieldsToDisplay = ['DisplayName', 'Description', 'ParentTypeName' as any, 'ModificationDate', 'ModifiedBy']

export default function ContentTypes() {
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const history = useHistory()

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.ContentTypes}</span>
      </div>
      <SimpleList
        parent={contentTypesPath}
        rootPath={contentTypesPath}
        loadChildrenSettings={{
          select: fieldsToDisplay,
          query: "+TypeIs:'ContentType' .AUTOFILTERS:OFF",
        }}
        contentListProps={{
          enableBreadcrumbs: false,
          parentIdOrPath: contentTypesPath,
          fieldsToDisplay,
          onActivateItem: (p) => {
            history.push(getPrimaryActionUrl(p, repository))
          },
        }}
      />
    </div>
  )
}
