import { deepMerge } from '@sensenet/client-utils'
import React, { useContext, useEffect, useState } from 'react'
import { FormControlLabel, Switch, Typography } from '@material-ui/core'
import MonacoEditor from 'react-monaco-editor'
import { CurrentContentContext, LocalizationContext, ResponsiveContext } from '../../context'
import { useInjector, useRepository, useTheme } from '../../hooks'
import { setupModel } from '../../services/MonacoModels/PersonalSettingsModel'
import { defaultSettings, PersonalSettings } from '../../services/PersonalSettings'
import { TextEditor } from './TextEditor'

const SettingsEditor: React.FunctionComponent = () => {
  const injector = useInjector()
  const service = injector.getInstance(PersonalSettings)
  const settings = service.userValue.getValue()
  const localization = useContext(LocalizationContext)
  const repo = useRepository()
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const [editorContent] = useState({
    Type: 'PersonalSettings',
    Name: `PersonalSettings`,
  })

  useEffect(() => {
    setupModel(localization.values, repo)
  }, [localization.values, repo])

  const [showDefaults, setShowDefaults] = useState(false)

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
            content={editorContent as any}
            loadContent={async () => JSON.stringify(settings, undefined, 3)}
            additionalButtons={
              <FormControlLabel
                control={<Switch onClick={() => setShowDefaults(!showDefaults)} />}
                label={localization.values.personalSettings.showDefaults}
              />
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
