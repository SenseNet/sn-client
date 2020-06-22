import { ODataParams } from '@sensenet/client-core'
import { TrashBin } from '@sensenet/default-content-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { applicationPaths, resolvePathParams } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useLoadContent } from '../../hooks/use-loadContent'
import { Content } from '../content'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }

const Trash = React.memo(() => {
  const { content } = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions })
  const globalClasses = useGlobalStyles()
  const history = useHistory()

  return (
    <div className={globalClasses.contentWrapper}>
      {content && (
        <TrashHeader
          iconClickHandler={() =>
            history.push(
              resolvePathParams({ path: applicationPaths.editProperties, params: { contentId: content.Id } }),
            )
          }
          trash={content}
        />
      )}
      <Content rootPath="/Root/Trash" fieldsToDisplay={['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions']} />
    </div>
  )
})

export default Trash
