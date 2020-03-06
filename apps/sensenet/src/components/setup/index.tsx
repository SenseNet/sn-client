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
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { useContentRouting, useLocalization } from '../../hooks'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { useGlobalStyles } from '../../globalStyles'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      width: 339,
      height: 374,
      margin: '0.5em',
      marginRight: '49px',
      marginBottom: '49px',
      backgroundColor: theme.palette.type === 'light' ? '#F8F8F8' : 'rgba(255,255,255,0.11)',
      border: theme.palette.type === 'light' ? '1px solid #D6D6D6' : 'none',
      boxShadow: theme.palette.type === 'light' ? '4px 4px 8px #0000001A' : 'none',
    },
    cardWrapper: {
      flexWrap: 'wrap',
    },
    button: {
      width: '110px',
      height: '36px',
      border: clsx('1px solid', theme.palette.primary.main),
      margin: '7px',
    },
  })
})

const SETUP_DOCS_URL = 'https://community.sensenet.com/docs/admin-ui/setup/'

const createAnchorFromName = (displayName: string) => `#${displayName.replace('.', '-').toLocaleLowerCase()}`

const WellKnownContentCard: React.FunctionComponent<{
  settings: Settings
  onContextMenu: (ev: React.MouseEvent) => void
}> = ({ settings, onContextMenu }) => {
  const localization = useLocalization().settings
  const contentRouter = useContentRouting()
  const classes = useStyles()

  return (
    <Card
      onContextMenu={ev => {
        ev.preventDefault()
        onContextMenu(ev)
      }}
      className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom={true} style={{ marginBottom: '30px' }}>
          {settings.DisplayName || settings.Name}
        </Typography>
        <Typography color="textSecondary">{(localization.descriptions as any)[settings.Path]}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        <Link to={contentRouter.getPrimaryActionUrl(settings)} style={{ textDecoration: 'none' }}>
          <Button size="small" className={classes.button} style={{ marginRight: '35px' }}>
            {localization.edit}
          </Button>
        </Link>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${SETUP_DOCS_URL}${createAnchorFromName(settings.DisplayName ? settings.DisplayName : '')}`}
          style={{ textDecoration: 'none' }}>
          <Button size="small" className={classes.button}>
            {localization.learnMore}
          </Button>
        </a>
      </CardActions>
    </Card>
  )
}

const Setup: React.StatelessComponent = () => {
  const repo = useRepository()
  const localization = useLocalization().settings
  const contentRouter = useContentRouting()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const localizationDrawerTitles = useLocalization().drawer.titles

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
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ display: 'grid' }}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.Setup}</span>
      </div>
      {wellKnownSettings.length ? (
        <div className={clsx(classes.cardWrapper, globalClasses.centered)}>
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
      {settings && settings.length ? (
        <>
          <Typography variant="h5">{localization.otherSettings}</Typography>
          <List>
            {settings.map(s => (
              <Link key={s.Id} to={contentRouter.getPrimaryActionUrl(s)} style={{ textDecoration: 'none' }}>
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
