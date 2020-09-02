import { ConstantContent } from '@sensenet/client-core'
import { Settings } from '@sensenet/default-content-types'
import { useRepository, useRepositoryEvents } from '@sensenet/hooks-react'
import { Query } from '@sensenet/query'
import clsx from 'clsx'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useQuery } from '../../hooks'
import { navigateToAction } from '../../services/content-context-service'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { EditBinary } from '../edit/edit-binary'
import { BrowseView, EditView, NewView, VersionView } from '../view-controls'
import { ContentCard } from './content-card'

const Setup = () => {
  const repository = useRepository()
  const globalClasses = useGlobalStyles()
  const history = useHistory()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const eventHub = useRepositoryEvents()
  const [reloadToken, setReloadToken] = useState(Date.now())
  const [settings, setSettings] = useState<Settings[]>([])
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [contextMenuItem, setContextMenuItem] = useState<Settings | null>(null)
  const requestReload = useCallback(() => setReloadToken(Date.now()), [])

  const activeContent = useQuery().get('content') ?? ''
  const contentTypeName = useQuery().get('content-type')
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const activeAction = routeMatch.params.action

  useEffect(() => {
    ;(async () => {
      const response = await repository.loadCollection({
        path: ConstantContent.PORTAL_ROOT.Path,
        oDataOptions: {
          orderby: [['Index' as any, 'asc']],
          query: `${new Query((q) => q.typeIs(Settings)).toString()} .AUTOFILTERS:OFF`,
        },
      })
      setSettings(response.d.results)
    })()
  }, [repository, reloadToken])

  useEffect(() => {
    const subscriptions = [
      eventHub.onContentModified.subscribe(requestReload),
      eventHub.onContentCopied.subscribe(requestReload),
      eventHub.onUploadFinished.subscribe(requestReload),
      eventHub.onContentDeleted.subscribe(requestReload),
    ]
    return () => subscriptions.forEach((s) => s.dispose())
  }, [
    eventHub.onUploadFinished,
    eventHub.onContentModified,
    eventHub.onContentDeleted,
    eventHub.onContentCopied,
    eventHub.onContentMoved,
    requestReload,
  ])

  const renderContent = () => {
    switch (activeAction) {
      case 'browse':
        return <BrowseView contentPath={`${PATHS.setup.snPath}${activeContent}`} />
      case 'edit':
        return (
          <EditView
            actionName={activeAction}
            contentPath={`${PATHS.setup.snPath}${activeContent}`}
            submitCallback={() => navigateToAction({ history, routeMatch })}
          />
        )
      case 'new':
        return (
          <div style={{ overflow: 'hidden' }}>
            <NewView
              contentTypeName={contentTypeName!}
              currentContentPath={PATHS.setup.snPath}
              submitCallback={() => navigateToAction({ history, routeMatch })}
            />
          </div>
        )
      case 'version':
        return <VersionView contentPath={`${PATHS.setup.snPath}${activeContent}`} />
      case 'edit-binary':
        return <EditBinary contentPath={`${PATHS.setup.snPath}${activeContent}`} />
      default:
        return (
          <>
            {settings.length ? (
              <div className={globalClasses.centered} style={{ flexWrap: 'wrap' }}>
                <ContentContextMenu
                  isOpened={isContextMenuOpened}
                  content={contextMenuItem ?? settings[0]}
                  onClose={() => setIsContextMenuOpened(false)}
                  menuProps={{
                    anchorEl: contextMenuAnchor,
                    BackdropProps: {
                      onClick: () => setIsContextMenuOpened(false),
                      onContextMenu: (ev) => ev.preventDefault(),
                    },
                  }}
                />
                {settings.map((s) => {
                  return (
                    <ContentCard
                      settings={s}
                      key={s.Id}
                      onContextMenu={(ev) => {
                        ev.preventDefault()
                        setContextMenuAnchor((ev.currentTarget as HTMLElement) || null)
                        setContextMenuItem(s)
                        setIsContextMenuOpened(true)
                      }}
                    />
                  )
                })}
              </div>
            ) : null}
          </>
        )
    }
  }

  return (
    <div className={globalClasses.contentWrapper} style={{ paddingLeft: 0 }}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ display: 'grid' }}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.Setup}</span>
      </div>
      {renderContent()}
    </div>
  )
}

export default Setup
