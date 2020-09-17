import { ODataParams } from '@sensenet/client-core'
import { TrashBin } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import { ResponsivePersonalSettings } from '../../context'
import { useLoadContent } from '../../hooks/use-loadContent'
import { pathWithQueryParams } from '../../services'
import { Content } from '../content'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }
const loadTreeSettings = { select: ['OriginalPath'] as any }

const Trash = React.memo(() => {
  const { content } = useLoadContent<TrashBin>({ idOrPath: PATHS.trash.snPath, oDataOptions })
  const history = useHistory()
  const settings = useContext(ResponsivePersonalSettings)

  return (
    <>
      <div style={{ padding: '0 15px' }}>
        {content && (
          <TrashHeader
            iconClickHandler={() => {
              const searchParams = new URLSearchParams(history.location.search)
              history.push(
                pathWithQueryParams({
                  path: resolvePathParams({
                    path: PATHS.trash.appPath,
                    params: { browseType: settings.content.browseType, action: 'edit' },
                  }),
                  newParams: { path: searchParams.get('path') },
                }),
              )
            }}
            trash={content}
          />
        )}
      </div>
      <Content
        rootPath={PATHS.trash.snPath}
        fieldsToDisplay={['DisplayName', 'ModificationDate', 'ModifiedBy', 'Actions']}
        loadTreeSettings={loadTreeSettings}
      />
    </>
  )
})

export default Trash
