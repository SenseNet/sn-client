import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { ConstantContent } from '@sensenet/client-core'
import { Settings } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentRoutingContext, CurrentContentContext, LocalizationContext, RepositoryContext } from '../../context'
import { ContentContextMenu } from '../ContentContextMenu'

const WellKnownContentCard: React.FunctionComponent<{
  settings: Settings
  onContextMenu: (ev: React.MouseEvent) => void
}> = ({ settings, onContextMenu }) => {
  const localization = useContext(LocalizationContext).values.settings
  const ctx = useContext(ContentRoutingContext)

  return (
    <Card
      onContextMenu={ev => {
        ev.preventDefault()
        onContextMenu(ev)
      }}
      style={{
        width: 330,
        height: 250,
        margin: '0.5em',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <CardContent>
        <Typography variant="h5" gutterBottom={true}>
          {settings.DisplayName || settings.Name}
        </Typography>
        <Typography color="textSecondary">{(localization.descriptions as any)[settings.Path]}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        <Link to={ctx.getPrimaryActionUrl(settings)} style={{ textDecoration: 'none' }}>
          <Button size="small">{localization.edit}</Button>
        </Link>
        <Button size="small">{localization.learnMore}</Button>
      </CardActions>
    </Card>
  )
}

const Setup: React.StatelessComponent = () => {
  const repo = useContext(RepositoryContext)
  const localization = useContext(LocalizationContext).values.settings
  const ctx = useContext(ContentRoutingContext)

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
          query: new Query(q => q.typeIs(Settings)).toString() + ' .AUTOFILTERS:OFF',
        },
      })

      setWellKnownSettings(
        response.d.results.filter(setting => Object.keys(localization.descriptions).includes(setting.Path)),
      )

      setSettings(response.d.results.filter(setting => !Object.keys(localization.descriptions).includes(setting.Path)))
    })()
  }, [repo])

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
          <CurrentContentContext.Provider value={contextMenuItem || wellKnownSettings[0]}>
            <ContentContextMenu
              isOpened={isContextMenuOpened}
              onClose={() => setIsContextMenuOpened(false)}
              menuProps={{
                anchorEl: contextMenuAnchor,
                BackdropProps: {
                  onClick: () => setIsContextMenuOpened(false),
                  onContextMenu: ev => ev.preventDefault(),
                },
              }}
            />
          </CurrentContentContext.Provider>
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
      {settings && settings.length ? (
        <>
          <Typography variant="h5">{localization.otherSettings}</Typography>
          <List>
            {settings.map(s => (
              <Link key={s.Id} to={ctx.getPrimaryActionUrl(s)} style={{ textDecoration: 'none' }}>
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
