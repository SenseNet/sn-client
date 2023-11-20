import { createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import { Settings } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization } from '../../hooks'
import { getPrimaryActionUrl } from '../../services'
import { useDialog } from '../dialogs'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      width: 339,
      minHeight: 374,
      margin: '0.5em',
      marginRight: '49px',
      marginBottom: '49px',
      backgroundColor: theme.palette.type === 'light' ? '#F8F8F8' : 'rgba(255,255,255,0.11)',
      border: theme.palette.type === 'light' ? '1px solid #D6D6D6' : 'none',
      boxShadow: theme.palette.type === 'light' ? '4px 4px 8px #0000001A' : 'none',
    },
    button: {
      minWidth: '110px',
      height: '36px',
      border: clsx('1px solid', theme.palette.primary.main),
      margin: '7px',
    },
    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  })
})

export const SETUP_DOCS_URL = 'https://docs.sensenet.com/guides/settings/setup'

export const createAnchorFromName = (name: string) => `#${name.toLocaleLowerCase()}`

type ContentCardProps = {
  settings: Settings
  onContextMenu: (ev: React.MouseEvent) => void
}

const hasDocumentation = ['Portal', 'OAuth', 'DocumentPreview', 'OfficeOnline', 'Indexing', 'Sharing']
const isSystemSettings = [
  'DocumentPreview',
  'OAuth',
  'OfficeOnline',
  'Indexing',
  'Sharing',
  'Logging',
  'Portal',
  'Permission',
  'MailProcessor',
  'UserProfile',
  'ColumnSettings',
  'TaskManagement',
  'MultiFactorAuthentication',
]

export const ContentCard = ({ settings, onContextMenu }: ContentCardProps) => {
  const localization = useLocalization().settings
  const repository = useRepository()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const history = useHistory()
  const classes = useStyles()
  const { openDialog } = useDialog()
  const settingsName = settings.DisplayName || settings.Name
  const settingsTitle = settingsName.replace(/\.settings/gi, '')
  const dataTestName = settingsTitle.replace(/\s+/g, '-').toLowerCase()

  return (
    <Card
      onContextMenu={(ev) => {
        ev.preventDefault()
        onContextMenu(ev)
      }}
      className={classes.card}
      data-test={`content-card-${settingsName.replace(/\s+/g, '-').toLowerCase()}`}>
      <CardContent>
        <Tooltip placement="top" title={settingsName}>
          <Typography variant="h5" gutterBottom={true} className={classes.title}>
            {settingsTitle}
          </Typography>
        </Tooltip>
        <Typography
          color="textSecondary"
          style={{ wordWrap: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: settings.Description || '' }}
        />
      </CardContent>
      <CardActions style={{ justifyContent: 'flex-end' }}>
        {!isSystemSettings.includes(settingsTitle) && (
          <IconButton
            data-test={`${dataTestName}-delete-button`}
            aria-label="delete"
            onClick={() => {
              openDialog({
                name: 'delete',
                props: { content: [settings] },
                dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true },
              })
            }}>
            <DeleteIcon />
          </IconButton>
        )}
        <Link
          to={getPrimaryActionUrl({ content: settings, repository, uiSettings, location: history.location })}
          style={{ textDecoration: 'none' }}>
          <Button
            aria-label={localization.edit}
            size="small"
            className={classes.button}
            data-test={`${dataTestName}-edit-button`}>
            {localization.edit}
          </Button>
        </Link>
        {hasDocumentation.includes(settingsTitle) && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${SETUP_DOCS_URL}${createAnchorFromName(settings.Name)}`}
            style={{ textDecoration: 'none' }}>
            <Button
              aria-label={localization.learnMore}
              size="small"
              className={classes.button}
              data-test={`${dataTestName}-learnmore-button`}>
              {localization.learnMore}
            </Button>
          </a>
        )}
      </CardActions>
    </Card>
  )
}
