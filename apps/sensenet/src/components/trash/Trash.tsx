import { ODataParams } from '@sensenet/client-core'
import { TrashBin } from '@sensenet/default-content-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { applicationPaths, resolvePathParams } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useLoadContent } from '../../hooks/use-loadContent'
import { useTreeNavigation } from '../../hooks/use-tree-navigation'
import { Explore } from '../content/Explore'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }

const Trash = React.memo(() => {
  const { content } = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions })
  const globalClasses = useGlobalStyles()
  const history = useHistory()
  const { currentPath, onNavigate } = useTreeNavigation('/Root/Trash')

  return (
    <div className={globalClasses.contentWrapper}>
      {content ? (
        <TrashHeader
          iconClickHandler={() =>
            history.push(
              resolvePathParams({ path: applicationPaths.editProperties, params: { contentId: content.Id } }),
            )
          }
          trash={content}
        />
      ) : null}
      <Explore
        currentPath={currentPath}
        rootPath="/Root/Trash"
        fieldsToDisplay={['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions']}
        onNavigate={onNavigate}
      />
    </div>
  )
})

export default Trash
