import React, { useContext } from 'react'
import { InjectorContext } from '../../context/InjectorContext'
import { PersonalSettingsContext } from '../../context/PersonalSettingsContext'
import '../../services/MonacoModels/PersonalSettingsModel'
import { defaultSettings, PersonalSettings } from '../../services/PersonalSettings'
import { mergeDeep } from '../../utils/deepMerge'
import { TextEditor } from './TextEditor'

const SettingsEditor: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const service = injector.GetInstance(PersonalSettings)
  const settings = useContext(PersonalSettingsContext)

  return (
    <TextEditor
      content={{ Type: 'Settings', Name: 'PersonalSettings' } as any}
      loadContent={async () => JSON.stringify(settings, undefined, 3)}
      saveContent={async (_c, v) => {
        try {
          service.setValue(mergeDeep(defaultSettings, JSON.parse(v)))
        } catch (error) {
          /** */
        }
      }}
    />
  )
}

const extendedComponent = SettingsEditor

export default extendedComponent
