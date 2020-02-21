import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { Settings } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useLocalization } from '../../hooks'
import { ContentContextService } from '../../services'

export const SETUP_DOCS_URL = 'https://community.sensenet.com/docs/admin-ui/setup/'

export const createAnchorFromName = (displayName: string) => `#${displayName.replace('.', '-').toLocaleLowerCase()}`

type WellKnownContentCardProps = {
  settings: Settings
  onContextMenu: (ev: React.MouseEvent) => void
}

export const WellKnownContentCard = ({ settings, onContextMenu }: WellKnownContentCardProps) => {
  const localization = useLocalization().settings
  const repo = useRepository()
  const contentContextService = new ContentContextService(repo)

  return (
    <Card
      onContextMenu={ev => {
        ev.preventDefault()
        onContextMenu(ev)
      }}
      style={{
        width: 330,
        height: 320,
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
        <Link to={contentContextService.getPrimaryActionUrl(settings)} style={{ textDecoration: 'none' }}>
          <Button size="small">{localization.edit}</Button>
        </Link>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${SETUP_DOCS_URL}${createAnchorFromName(settings.DisplayName ? settings.DisplayName : '')}`}
          style={{ textDecoration: 'none' }}>
          <Button size="small">{localization.learnMore}</Button>
        </a>
      </CardActions>
    </Card>
  )
}
