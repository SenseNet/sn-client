import { Repository } from '@sensenet/client-core'
import { FieldControls as SnFieldControls, reactControlMapper as snReactControlMapper } from '@sensenet/controls-react'
import { LongTextFieldSetting, ReferenceFieldSetting, RichTextFieldSetting } from '@sensenet/default-content-types'
import * as FieldControls from './field-controls'

/**
 * A static Control Mapper instance, used to create the mapping between sensenet ContentTypes and FieldSettings and React components.
 */
export const reactControlMapper = (repository: Repository) => {
  const controlMapper = snReactControlMapper(repository)

  controlMapper
    .setupFieldSettingDefault('ShortTextFieldSetting', (setting) => {
      switch (setting.ControlHint) {
        case 'sn:FileName':
          return SnFieldControls.FileName
        case 'sn:ColorPicker':
          return SnFieldControls.ColorPicker
        case 'sn:Path':
          return FieldControls.Path
        default:
          return SnFieldControls.ShortText
      }
    })
    .setupFieldSettingDefault<ReferenceFieldSetting>('ReferenceFieldSetting', (setting) => {
      if (setting.AllowedTypes && setting.AllowedTypes.indexOf('User') !== -1 && setting.AllowMultiple) {
        return SnFieldControls.TagsInput
      } else {
        return FieldControls.ReferenceGrid
      }
    })
    .setupFieldSettingDefault<LongTextFieldSetting>('LongTextFieldSetting', (setting) => {
      switch (setting.ControlHint) {
        case 'sn:WebhookFilter':
          return FieldControls.WebhookTrigger
        case 'sn:WebhookHeaders':
          return FieldControls.WebhookHeaders
        case 'sn:WebhookPayload':
          return FieldControls.WebhookPayload
        default:
      }

      return SnFieldControls.Textarea
    })
    .setupFieldSettingDefault<RichTextFieldSetting>('RichTextFieldSetting', () => {
      return FieldControls.RichTextEditor
    })
    .setupFieldSettingDefault('NullFieldSetting', (setting) => {
      if (setting.Name === 'Avatar') {
        return FieldControls.Avatar
      } else if (
        ['SiteRelativeUrl', 'UploadBinary', 'ButtonList', 'ReferenceDropDown', 'PageTemplateSelector'].indexOf(
          setting.Name,
        ) > -1
      ) {
        return SnFieldControls.EmptyFieldControl
      } else if (setting.Name === 'AllowedChildTypes') {
        return FieldControls.AllowedChildTypes
      } else if (setting.Name === 'UrlList') {
        return SnFieldControls.Textarea
      } else if (setting.FieldClassName.indexOf('BooleanField') > -1) {
        switch (setting.ControlHint) {
          case 'sn:Checkbox':
            return SnFieldControls.Checkbox
          default:
            return SnFieldControls.Switcher
        }
      } else {
        return SnFieldControls.ShortText
      }
    })
    .setupFieldSettingDefault('BooleanFieldSetting', (setting) => {
      switch (setting.ControlHint) {
        case 'sn:Checkbox':
          return SnFieldControls.Checkbox
        default:
          return SnFieldControls.Switcher
      }
    })

  return controlMapper
}
