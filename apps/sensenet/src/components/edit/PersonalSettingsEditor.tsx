import { deepMerge, sleepAsync } from '@sensenet/client-utils'
import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  Typography,
} from '@material-ui/core'
import MonacoEditor from 'react-monaco-editor'
import { CurrentContentContext, LocalizationContext, ResponsiveContext } from '../../context'
import { useEventService, useInjector, useLogger, useRepository, useTheme } from '../../hooks'
import { setupModel } from '../../services/MonacoModels/PersonalSettingsModel'
import { defaultSettings, PersonalSettings } from '../../services/PersonalSettings'
import { RepositoryManager } from '../../services/RepositoryManager'
import { TextEditor } from './TextEditor'

const SettingsEditor: React.FunctionComponent = () => {
  const injector = useInjector()
  const service = injector.getInstance(PersonalSettings)
  const settings = service.userValue.getValue()
  const localization = useContext(LocalizationContext)
  const repo = useRepository()
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const eventService = useEventService()
  const [editorContent] = useState({
    Type: 'PersonalSettings',
    Name: `PersonalSettings`,
  })

  useEffect(() => {
    setupModel(localization.values, repo)
  }, [localization.values, repo])

  const [showDefaults, setShowDefaults] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const logger = useLogger('PersonalSettingsEditor')

  return (
    <CurrentContentContext.Provider
      value={{ Id: 0, Type: 'PersonalSettings', Path: '', Name: localization.values.personalSettings.title }}>
      <Dialog
        fullWidth
        disablePortal
        open={showRestoreDialog}
        onClose={() => !isResetting && setShowRestoreDialog(false)}>
        <DialogTitle>{localization.values.personalSettings.restoreDialogTitle}</DialogTitle>
        <>
          <DialogContent>
            {!isResetting ? (
              <DialogContentText>{localization.values.personalSettings.restoreDialogTText}</DialogContentText>
            ) : (
              <CircularProgress />
            )}
          </DialogContent>
          <DialogActions>
            <Button disabled={isResetting} onClick={() => setShowRestoreDialog(false)}>
              {localization.values.personalSettings.cancel}
            </Button>
            <Button
              disabled={isResetting}
              onClick={async () => {
                setIsResetting(true)
                const rm = injector.getInstance(RepositoryManager)
                const logoutPromises = service.effectiveValue
                  .getValue()
                  .repositories.map(repoEntry => rm.getRepository(repoEntry.url).authentication.logout())

                await Promise.all(logoutPromises)
                eventService.clear()
                service.setPersonalSettingsValue({})
                await sleepAsync(1000)
                setIsResetting(false)
                setShowRestoreDialog(false)
                logger.information({ message: 'The Personal Settings has been restored to defaults.' })
              }}>
              {localization.values.personalSettings.restore}
            </Button>
          </DialogActions>
        </>
      </Dialog>
      <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'row' }}>
        <div
          style={{
            width: showDefaults ? '50%' : '0',
            height: '100%',
            transition: 'width 200ms cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            overflow: 'hidden',
          }}>
          <Typography variant="button" style={{ lineHeight: '60px', height: '60px', marginLeft: '2em' }}>
            {localization.values.personalSettings.defaults}
          </Typography>
          <MonacoEditor
            theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
            width="100%"
            language={'json'}
            value={JSON.stringify(defaultSettings, undefined, 2)}
            options={{
              readOnly: true,
              automaticLayout: true,
              minimap: {
                enabled: platform === 'desktop' ? true : false,
              },
            }}
          />
        </div>
        <div
          style={{
            width: showDefaults ? '50%' : '100%',
            height: '100%',
            transition: 'width 200ms cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          }}>
          <TextEditor
            content={editorContent as any}
            loadContent={async () => JSON.stringify(settings, undefined, 3)}
            additionalButtons={
              <>
                <FormControlLabel
                  control={<Switch onClick={() => setShowDefaults(!showDefaults)} />}
                  label={localization.values.personalSettings.showDefaults}
                />
                <Button onClick={() => setShowRestoreDialog(true)}>
                  {localization.values.personalSettings.restoreDefaults}
                </Button>
              </>
            }
            saveContent={async (_c, v) => {
              await service.setPersonalSettingsValue(deepMerge(JSON.parse(v)))
            }}
          />
        </div>
      </div>
    </CurrentContentContext.Provider>
  )
}

const extendedComponent = SettingsEditor

export default extendedComponent
