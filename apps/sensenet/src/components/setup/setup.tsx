import { ConstantContent } from '@sensenet/client-core'
import { Settings } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Query } from '@sensenet/query'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useQuery } from '../../hooks'
import { getPrimaryActionUrl, navigateToAction } from '../../services/content-context-service'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { EditBinary } from '../edit/edit-binary'
import { BrowseView, EditView, NewView, VersionView } from '../view-controls'
import { WellKnownContentCard } from './well-known-content-card'

const Setup = () => {
  const repository = useRepository()
  const localization = useLocalization().settings
  const uiSettings = useContext(ResponsivePersonalSettings)
  const globalClasses = useGlobalStyles()
  const history = useHistory()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const [wellKnownSettings, setWellKnownSettings] = useState<Settings[]>([])
  const [settings, setSettings] = useState<Settings[]>([])
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [contextMenuItem, setContextMenuItem] = useState<Settings | null>(null)

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

      setWellKnownSettings(
        response.d.results.filter((setting) => Object.keys(localization.descriptions).includes(setting.Path)),
      )

      setSettings(
        response.d.results.filter((setting) => !Object.keys(localization.descriptions).includes(setting.Path)),
      )
    })()
  }, [localization.descriptions, repository])

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
          <NewView
            contentTypeName={contentTypeName!}
            currentContentPath={PATHS.setup.snPath}
            submitCallback={() => navigateToAction({ history, routeMatch })}
          />
        )
      case 'version':
        return <VersionView contentPath={`${PATHS.setup.snPath}${activeContent}`} />
      case 'edit-binary':
        return <EditBinary contentPath={`${PATHS.setup.snPath}${activeContent}`} />
      default:
        return (
          <>
            {wellKnownSettings.length ? (
              <div className={globalClasses.centered} style={{ flexWrap: 'wrap' }}>
                <ContentContextMenu
                  isOpened={isContextMenuOpened}
                  content={contextMenuItem ?? wellKnownSettings[0]}
                  onClose={() => setIsContextMenuOpened(false)}
                  menuProps={{
                    anchorEl: contextMenuAnchor,
                    BackdropProps: {
                      onClick: () => setIsContextMenuOpened(false),
                      onContextMenu: (ev) => ev.preventDefault(),
                    },
                  }}
                />
                {wellKnownSettings.map((s) => (
                  <WellKnownContentCard
                    settings={s}
                    key={s.Id}
                    onContextMenu={(ev) => {
                      ev.preventDefault()
                      setContextMenuAnchor((ev.currentTarget as HTMLElement) || null)
                      setContextMenuItem(s)
                      setIsContextMenuOpened(true)
                    }}
                  />
                ))}
              </div>
            ) : null}
            <br />
            {settings && settings.length ? (
              <>
                <Typography variant="h5">{localization.otherSettings}</Typography>
                <List>
                  {settings.map((s) => (
                    <Link
                      key={s.Id}
                      to={getPrimaryActionUrl({ content: s, repository, uiSettings, location: history.location })}
                      style={{ textDecoration: 'none' }}>
                      <ListItem button={true}>
                        <ListItemText primary={s.DisplayName || s.Name} secondary={s.Path} />
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </>
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
