import { ODataParams } from '@sensenet/client-core'
import { GenericContent, TrashBin } from '@sensenet/default-content-types'
import React, { memo, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../../application-paths'
import { ResponsivePersonalSettings } from '../../context'
import { useLoadContent } from '../../hooks/use-loadContent'
import { pathWithQueryParams } from '../../services'
import { Content } from '../content'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }
const loadTreeSettings = { select: ['OriginalPath'] as any }

const Trash = memo(() => {
  const { content } = useLoadContent<TrashBin>({ idOrPath: PATHS.trash.snPath, oDataOptions })
  const history = useHistory()
  const settings = useContext(ResponsivePersonalSettings)

  return (
    <>
      <div>
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
        fieldsToDisplay={[
          { field: 'DisplayName' as keyof GenericContent },
          { field: 'Locked' as keyof GenericContent },
          { field: 'CreatedBy' as keyof GenericContent },
          { field: 'Actions' as keyof GenericContent },
        ]}
        loadTreeSettings={loadTreeSettings}
      />
    </>
  )
})

Trash.displayName = 'Trash'
export default Trash
