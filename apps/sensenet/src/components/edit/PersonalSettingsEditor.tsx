import { deepMerge } from '@sensenet/client-utils'
import React, { useContext, useEffect, useState } from 'react'
import {
  CurrentContentContext,
  InjectorContext,
  LocalizationContext,
  PersonalSettingsContext,
  RepositoryContext,
} from '../../context'
import { setupModel } from '../../services/MonacoModels/PersonalSettingsModel'
import { defaultSettings, PersonalSettings } from '../../services/PersonalSettings'
import { TextEditor } from './TextEditor'

const SettingsEditor: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const service = injector.getInstance(PersonalSettings)
  const settings = useContext(PersonalSettingsContext)
  const localization = useContext(LocalizationContext)
  const repo = useContext(RepositoryContext)
  const [editorContent] = useState({
    Type: 'PersonalSettings',
    Name: `PersonalSettings`,
  })

  useEffect(() => {
    setupModel(localization.values, repo)
  }, [localization.values])

  return (
    <CurrentContentContext.Provider
      value={{ Id: 0, Type: 'PersonalSettings', Path: '', Name: localization.values.personalSettings.title }}>
      <TextEditor
        content={editorContent as any}
        loadContent={async () => JSON.stringify(settings, undefined, 3)}
        saveContent={async (_c, v) => {
          await service.setValue(deepMerge(defaultSettings, JSON.parse(v)))
        }}
      />
    </CurrentContentContext.Provider>
  )
}

const extendedComponent = SettingsEditor

export default extendedComponent
