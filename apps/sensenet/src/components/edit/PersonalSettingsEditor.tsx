import { Button, FormControlLabel, Switch, Typography, useTheme } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { CurrentContentContext, useInjector, useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { LocalizationContext, ResponsiveContext } from '../../context'
import { setupModel } from '../../services/MonacoModels/PersonalSettingsModel'
import { defaultSettings, PersonalSettings } from '../../services/PersonalSettings'
import { useDialog } from '../dialogs'
import { TextEditor } from './TextEditor'

const editorContent: any = {
  Type: 'PersonalSettings',
  Name: `PersonalSettings`,
}

export function SettingsEditor() {
  const [showDefaults, setShowDefaults] = useState(false)
  const { openDialog, closeLastDialog } = useDialog()
  const injector = useInjector()
  const service = injector.getInstance(PersonalSettings)
  const settings = service.userValue.getValue()
  const localization = useContext(LocalizationContext)
  const repo = useRepository()
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const logger = useLogger('PersonalSettingsEditor')

  useEffect(() => {
    setupModel(localization.values, repo)
  }, [localization.values, repo])

  const callBack = async () => {
    service.setPersonalSettingsValue({})
    closeLastDialog()
    logger.information({ message: 'The Personal Settings has been restored to defaults.' })
  }

  const openAreYouSureDialog = () => {
    openDialog({
      name: 'are-you-sure',
      props: {
        bodyText: localization.values.personalSettings.restoreDialogText,
        submitText: localization.values.personalSettings.restore,
        titleText: localization.values.personalSettings.restoreDialogTitle,
        callBack,
      },
    })
  }

  return (
    <CurrentContentContext.Provider
      value={{ Id: 0, Type: 'PersonalSettings', Path: '', Name: localization.values.personalSettings.title }}>
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
            content={editorContent}
            loadContent={async () => JSON.stringify(settings, undefined, 3)}
            additionalButtons={
              <>
                <FormControlLabel
                  control={<Switch onClick={() => setShowDefaults(!showDefaults)} />}
                  label={localization.values.personalSettings.showDefaults}
                />
                <Button onClick={openAreYouSureDialog}>{localization.values.personalSettings.restoreDefaults}</Button>
              </>
            }
            saveContent={async (_c, v) => {
              service.setPersonalSettingsValue(deepMerge(JSON.parse(v)))
            }}
            showBreadCrumb={true}
          />
        </div>
      </div>
    </CurrentContentContext.Provider>
  )
}

export default SettingsEditor
