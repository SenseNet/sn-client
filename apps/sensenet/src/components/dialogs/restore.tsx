import { PathHelper } from '@sensenet/client-utils'
import { TrashBag } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, DialogActions, DialogContent, InputAdornment, TextField } from '@material-ui/core'
import RestoreIcon from '@material-ui/icons/RestoreFromTrash'
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useQuery, useSnRoute } from '../../hooks'
import { getPathForContentPath, navigateToAction } from '../../services'
import { DialogTitle, useDialog } from '.'

export type RestoreProps = {
  content: TrashBag
}

export function Restore(props: RestoreProps) {
  const repo = useRepository()
  const localization = useLocalization().restore
  const { openDialog, closeLastDialog } = useDialog()
  const logger = useLogger('Restore')
  const [destination, setDestination] = useState(props.content.OriginalPath)
  const globalClasses = useGlobalStyles()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const history = useHistory()
  const snRoute = useSnRoute()
  const currentPath = useQuery().get('path')

  const rootPath = getPathForContentPath({ path: props.content.OriginalPath!, uiSettings }).snPath

  const editableDestination = destination?.replace(rootPath, '')

  const onClick = async () => {
    try {
      await repo.executeAction({
        idOrPath: props.content.Path,
        name: 'Restore',
        method: 'POST',
        body: {
          destination,
        },
      })
      logger.information({
        message: `${props.content.DisplayName || props.content.Name}' is restored to ${destination}`,
        data: { relatedContent: props.content },
      })

      if (PathHelper.isInSubTree(`${snRoute.path}${currentPath}`, props.content.Path)) {
        navigateToAction({
          history,
          routeMatch: snRoute.match,
          queryParams: {
            path: `/${PathHelper.getParentPath(props.content.Path)}`.replace(snRoute.path, ''),
          },
        })
      }

      closeLastDialog()
    } catch (error) {
      logger.warning({ message: error.message })
    }
  }

  return (
    <>
      <DialogTitle>
        <RestoreIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
        {localization.title}
      </DialogTitle>
      <DialogContent style={{ minWidth: 450, marginBottom: '12px' }}>
        <p
          dangerouslySetInnerHTML={{
            __html: localization.description(props.content.DisplayName || props.content.Name),
          }}
        />
        <div style={{ display: 'flex' }}>
          <TextField
            fullWidth={true}
            value={editableDestination}
            onChange={(ev) => setDestination(`${rootPath}${ev.currentTarget.value}`)}
            InputProps={{
              startAdornment: <InputAdornment position="start">{rootPath}</InputAdornment>,
            }}
          />
          <Button
            aria-label={localization.selectTarget}
            color="primary"
            variant="contained"
            onClick={() =>
              openDialog({
                name: 'content-picker',
                props: {
                  content: props.content,
                  currentPath: props.content.OriginalPath || '/Root',
                  rootPath,
                  handleSubmit: (path: string) => setDestination(path),
                },
                dialogProps: { disableBackdropClick: true, open: true },
              })
            }
            style={{ marginLeft: '8px', padding: '6px 0' }}>
            ...
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button aria-label={localization.cancel} className={globalClasses.cancelButton} onClick={closeLastDialog}>
          {localization.cancel}
        </Button>
        <Button aria-label={localization.title} color="primary" variant="contained" onClick={onClick}>
          {localization.title}
        </Button>
      </DialogActions>
    </>
  )
}

export default Restore
