import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { ConstantContent } from '@sensenet/client-core'
import { Settings } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Query } from '@sensenet/query'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalization } from '../../hooks'
import { ContentContextService } from '../../services'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { WellKnownContentCard } from './well-known-content-card'

const Setup = () => {
  const repo = useRepository()
  const contentContextService = new ContentContextService(repo)
  const localization = useLocalization().settings

  const [wellKnownSettings, setWellKnownSettings] = useState<Settings[]>([])
  const [settings, setSettings] = useState<Settings[]>([])
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [contextMenuItem, setContextMenuItem] = useState<Settings | null>(null)

  useEffect(() => {
    ;(async () => {
      const response = await repo.loadCollection({
        path: ConstantContent.PORTAL_ROOT.Path,
        oDataOptions: {
          orderby: [['Index' as any, 'asc']],
          query: `${new Query(q => q.typeIs(Settings)).toString()} .AUTOFILTERS:OFF`,
        },
      })

      setWellKnownSettings(
        response.d.results.filter(setting => Object.keys(localization.descriptions).includes(setting.Path)),
      )

      setSettings(response.d.results.filter(setting => !Object.keys(localization.descriptions).includes(setting.Path)))
    })()
  }, [localization.descriptions, repo])

  return (
    <div style={{ padding: '1em', margin: '1em', height: '100%', overflow: 'auto' }}>
      <Typography variant="h5">Setup</Typography>
      {wellKnownSettings.length ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            margin: '1em',
          }}>
          <ContentContextMenu
            isOpened={isContextMenuOpened}
            content={contextMenuItem ?? wellKnownSettings[0]}
            onClose={() => setIsContextMenuOpened(false)}
            menuProps={{
              anchorEl: contextMenuAnchor,
              BackdropProps: {
                onClick: () => setIsContextMenuOpened(false),
                onContextMenu: ev => ev.preventDefault(),
              },
            }}
          />
          {wellKnownSettings.map(s => (
            <WellKnownContentCard
              settings={s}
              key={s.Id}
              onContextMenu={ev => {
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
      {settings?.length ? (
        <>
          <Typography variant="h5">{localization.otherSettings}</Typography>
          <List>
            {settings.map(s => (
              <Link key={s.Id} to={contentContextService.getPrimaryActionUrl(s)} style={{ textDecoration: 'none' }}>
                <ListItem button={true}>
                  <ListItemText primary={s.DisplayName || s.Name} secondary={s.Path} />
                </ListItem>
              </Link>
            ))}
          </List>
        </>
      ) : null}
    </div>
  )
}

export default Setup
