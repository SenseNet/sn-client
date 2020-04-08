import { ODataParams } from '@sensenet/client-core'
import { TrashBin } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { useHistory } from 'react-router'
import { useGlobalStyles } from '../../globalStyles'
import { useLoadContent } from '../../hooks/use-loadContent'
import { SimpleList } from '../content/Simple'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }

const Trash = React.memo(() => {
  const { content } = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions })
  const globalClasses = useGlobalStyles()
  const history = useHistory()
  const repo = useRepository()

  return (
    <div className={globalClasses.contentWrapper}>
      {content ? (
        <TrashHeader
          iconClickHandler={() =>
            history.push(`/${btoa(repo.configuration.repositoryUrl)}/EditProperties/${content.Id}`)
          }
          trash={content}
        />
      ) : null}
      <SimpleList
        parent="/Root/Trash"
        contentListProps={{
          enableBreadcrumbs: false,
          fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy'],
        }}
      />
    </div>
  )
})

export default Trash
