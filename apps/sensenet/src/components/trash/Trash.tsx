import { ODataParams } from '@sensenet/client-core'
import { TrashBin } from '@sensenet/default-content-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { applicationPaths } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useLoadContent } from '../../hooks/use-loadContent'
import { SimpleList } from '../content/Simple'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }

const Trash = React.memo(() => {
  const { content } = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions })
  const globalClasses = useGlobalStyles()
  const history = useHistory()

  return (
    <div className={globalClasses.contentWrapper}>
      {content ? (
        <TrashHeader
          iconClickHandler={() => history.push(`${applicationPaths.editProperties}/${content.Id}`)}
          trash={content}
        />
      ) : null}
      <SimpleList
        parent="/Root/Trash"
        contentListProps={{
          enableBreadcrumbs: false,
          fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions'],
        }}
      />
    </div>
  )
})

export default Trash
