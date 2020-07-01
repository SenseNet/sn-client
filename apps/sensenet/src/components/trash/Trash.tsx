import { ODataParams } from '@sensenet/client-core'
import { TrashBin } from '@sensenet/default-content-types'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import { useLoadContent } from '../../hooks/use-loadContent'
import { Content } from '../content'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }

const Trash = React.memo(() => {
  const { content } = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions })
  const history = useHistory()

  return (
    <>
      <div style={{ padding: '0 15px' }}>
        {content && (
          <TrashHeader
            iconClickHandler={() =>
              history.push(resolvePathParams({ path: PATHS.editProperties.appPath, params: { contentId: content.Id } }))
            }
            trash={content}
          />
        )}
      </div>
      <Content rootPath="/Root/Trash" fieldsToDisplay={['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions']} />
    </>
  )
})

export default Trash
