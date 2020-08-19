import { EntryType } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { Settings } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, createStyles, DialogActions, DialogContent, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { DialogTitle, useDialog } from '.'

const useStyles = makeStyles(() => {
  return createStyles({
    contentWrapper: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '100%',
    },
    leftColumn: {
      flex: 1,
    },
    rightColumn: {
      flex: 2,
    },
  })
})

export class PermissionGroupType {
  /* Permission elements */
  public groupObject!: { [permissionName: string]: string[] }
}

export class PermissionSettingType {
  /* Groups of permissions */
  public groups!: PermissionGroupType[]
}

export type PermissionEditorDialogProps = {
  entry: EntryType
}

const PERMISSION_SETTING_PATH = '/Root/System/Settings/Permission.settings'

export function PermissionEditorDialog(props: PermissionEditorDialogProps) {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  const repo = useRepository()
  const logger = useLogger('permissionEditorDialog')
  const localization = useLocalization()
  const { closeLastDialog } = useDialog()

  const [permissionSettingJSON, setPermissionSettingJSON] = useState<PermissionSettingType>()

  useEffect(() => {
    async function getPermissionSettingJSON() {
      try {
        const result = await repo.load<Settings>({
          idOrPath: PERMISSION_SETTING_PATH,
        })

        const binaryPath = result.d.Binary && result.d.Binary.__mediaresource.media_src
        if (!binaryPath) {
          return
        }
        const textFile = await repo.fetch(PathHelper.joinPaths(repo.configuration.repositoryUrl, binaryPath))
        if (textFile.ok) {
          const text = await textFile.text()
          setPermissionSettingJSON(JSON.parse(text))
        }
      } catch (error) {
        logger.error({
          message: localization.permissionEditor.errorGetPermissionSetting,
          data: {
            details: { error },
          },
        })
      }
    }
    getPermissionSettingJSON()
  }, [localization.permissionEditor.errorGetPermissionSetting, logger, repo])

  return (
    <>
      <DialogTitle>{props.entry.identity.displayName}</DialogTitle>
      <DialogContent className={classes.contentWrapper}>
        <div className={clsx(classes.column, classes.leftColumn)}>
          <div>Permissions</div>
          {permissionSettingJSON?.groups.map((group: Object) => (
            <div key={group.toString()}>{Object.keys(group)}</div>
          ))}
        </div>
        <div className={clsx(classes.column, classes.rightColumn)}>blasd23f</div>
      </DialogContent>
      <DialogActions>
        <Button aria-label={localization.forms.cancel} className={globalClasses.cancelButton} onClick={closeLastDialog}>
          {localization.forms.cancel}
        </Button>
        <Button aria-label={localization.forms.submit} color="primary" variant="contained" autoFocus={true}>
          {localization.forms.submit}
        </Button>
      </DialogActions>
    </>
  )
}

export default PermissionEditorDialog
