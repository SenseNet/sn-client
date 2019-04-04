import { deepMerge } from '@sensenet/client-utils'
import React, { useContext, useEffect, useState } from 'react'
import { InjectorContext } from '../../context/InjectorContext'
import { LocalizationContext } from '../../context/LocalizationContext'
import { PersonalSettingsContext } from '../../context/PersonalSettingsContext'
import { setupModel } from '../../services/MonacoModels/PersonalSettingsModel'
import { defaultSettings, PersonalSettings } from '../../services/PersonalSettings'
import { TextEditor } from './TextEditor'

const SettingsEditor: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const service = injector.GetInstance(PersonalSettings)
  const settings = useContext(PersonalSettingsContext)
  const localization = useContext(LocalizationContext)
  const [editorContent] = useState({
    Type: 'Settings',
    Name: `PersonalSettings`,
  })

  useEffect(() => {
    setupModel(localization.values)
  }, [localization.values])

  return (
    <TextEditor
      content={editorContent as any}
      loadContent={async () => JSON.stringify(settings, undefined, 3)}
      saveContent={async (_c, v) => {
        try {
          await service.setValue(deepMerge(defaultSettings, JSON.parse(v)))
        } catch (error) {
          /** */
        }
      }}
    />
  )
}

const extendedComponent = SettingsEditor

export default extendedComponent
