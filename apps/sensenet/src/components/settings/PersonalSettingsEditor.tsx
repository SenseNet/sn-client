import { deepMerge } from '@sensenet/client-utils'
import { CurrentContentContext, useInjector, useLogger } from '@sensenet/hooks-react'
import { Button, createStyles, FormControlLabel, makeStyles, Switch, Typography, useTheme } from '@material-ui/core'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { LocalizationContext, ResponsiveContext } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { setupModel } from '../../services/MonacoModels/PersonalSettingsModel'
import { defaultSettings, PersonalSettings } from '../../services/PersonalSettings'
import { useDialog } from '../dialogs'
import { TextEditor } from '../editor/text-editor'

const editorContent: any = {
  Type: 'PersonalSettings',
  Name: `PersonalSettings`,
}

const useStyles = makeStyles(() => {
  return createStyles({
    personalSettingsWrapper: {
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
    },
    monacoWrapper: {
      height: '100%',
    },
    monacoAnimated: {
      transition: 'width 200ms cubic-bezier(0.215, 0.610, 0.355, 1.000)',
    },
    typography: {
      lineHeight: '60px',
      height: globals.common.drawerItemHeight,
      marginLeft: '2em',
    },
  })
})

export function SettingsEditor() {
  const [showDefaults, setShowDefaults] = useState(false)
  const { openDialog, closeLastDialog } = useDialog()
  const injector = useInjector()
  const service = injector.getInstance(PersonalSettings)
  const settings = service.userValue.getValue()
  const localization = useContext(LocalizationContext)
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const logger = useLogger('PersonalSettingsEditor')
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  useEffect(() => {
    setupModel(localization.values)
  }, [localization.values])

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
      <div style={{ position: 'relative', width: '100%', height: '100%', boxSizing: 'border-box' }}>
        <div className={clsx(globalClasses.full, classes.personalSettingsWrapper)}>
          <div
            className={clsx(classes.monacoWrapper, classes.monacoAnimated)}
            style={{
              width: showDefaults ? '50%' : '0',
              minWidth: showDefaults ? '50%' : '0',
              overflow: 'hidden',
            }}>
            <Typography variant="button" className={classes.typography}>
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
            className={classes.monacoWrapper}
            style={{
              width: showDefaults ? '50%' : '100%',
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
                  <Button
                    aria-label={localization.values.personalSettings.restoreDefaults}
                    onClick={openAreYouSureDialog}>
                    {localization.values.personalSettings.restoreDefaults}
                  </Button>
                </>
              }
              saveContent={async (_c, v) => {
                service.setPersonalSettingsValue(deepMerge(JSON.parse(v)))
              }}
              showBreadCrumb={true}
            />
          </div>
        </div>
      </div>
    </CurrentContentContext.Provider>
  )
}

export default SettingsEditor
