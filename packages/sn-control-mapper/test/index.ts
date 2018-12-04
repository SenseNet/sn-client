import { Repository } from '@sensenet/client-core'
import {
  ChoiceFieldSetting,
  FieldSetting,
  FieldVisibility,
  ShortTextFieldSetting,
  Task,
} from '@sensenet/default-content-types'
import { expect } from 'chai'
import { ControlMapper } from '../src'

// tslint:disable:max-classes-per-file
// tslint:disable:completed-docs

class ExampleControlBase {}

class ExampleDefaultControl extends ExampleControlBase {}

class ExampleModifiedControl extends ExampleControlBase {}

class ExampleModifiedControl2 extends ExampleControlBase {}

class ExampleDefaultFieldControl extends ExampleControlBase {}

class ExampleClientSetting {
  constructor(public readonly setting: FieldSetting) {}
}

export const controlMapperTests = describe('ControlMapper', () => {
  let mapper: ControlMapper<ExampleControlBase, ExampleClientSetting>
  let repository: Repository

  beforeEach(() => {
    repository = new Repository({}, async () => ({} as any))
    mapper = new ControlMapper(
      repository,
      ExampleControlBase,
      setting => new ExampleClientSetting(setting),
      ExampleDefaultControl,
      ExampleDefaultFieldControl,
    )
  })

  it('Should be constructed', () => {
    expect(mapper).to.be.instanceof(ControlMapper)
  })

  it('Should be constructed with BaseType and ClientControlSettingsFactory', () => {
    const newMapper = new ControlMapper(repository, ExampleControlBase, setting => new ExampleClientSetting(setting))
    expect(newMapper).to.be.instanceof(ControlMapper)
  })

  it('Should be constructed with all parameters', () => {
    const newMapper = new ControlMapper(
      repository,
      ExampleControlBase,
      setting => new ExampleClientSetting(setting),
      ExampleDefaultControl,
      ExampleDefaultFieldControl,
    )
    expect(newMapper).to.be.instanceof(ControlMapper)
  })

  it('Should return correct Default Control for ContentTypes', () => {
    const controlType = mapper.getControlForContentType('Task')
    expect(controlType).to.be.eq(ExampleDefaultControl)
  })

  it('Should return correct explicit defined Control for ContentTypes', () => {
    mapper.mapContentTypeToControl('Task', ExampleModifiedControl)
    const controlType = mapper.getControlForContentType('Task')
    expect(controlType).to.be.eq(ExampleModifiedControl)
  })

  it('Should return correct Default Control for FieldSettings', () => {
    const fs = {} as ChoiceFieldSetting
    const controlType = mapper.getControlForFieldSetting(fs)
    expect(controlType).to.be.eq(ExampleDefaultFieldControl)
  })

  it('Should return correct explicit defined Control for FieldSettings', () => {
    mapper.setupFieldSettingDefault(ChoiceFieldSetting, setting => {
      if (setting.Compulsory) {
        return ExampleModifiedControl
      }
      return ExampleDefaultFieldControl
    })

    const fs = { Compulsory: true, Type: 'ChoiceFieldSetting' } as ChoiceFieldSetting
    const controlType = mapper.getControlForFieldSetting(fs)
    expect(controlType).to.be.eq(ExampleModifiedControl)

    const fs2 = { Compulsory: false, Type: 'ChoiceFieldSetting' } as ChoiceFieldSetting
    const controlType2 = mapper.getControlForFieldSetting(fs2)
    expect(controlType2).to.be.eq(ExampleDefaultFieldControl)
  })

  it('Should return a correct default control for a specified Content Field', () => {
    const control = mapper.getControlForContentField('Task', 'DisplayName', 'new')
    expect(control).to.be.eq(ExampleDefaultFieldControl)
  })

  it('Should return a correct default control for a specified Content Field when FieldSetting has default value', () => {
    mapper.setupFieldSettingDefault(ShortTextFieldSetting, () => {
      return ExampleModifiedControl
    })
    const control = mapper.getControlForContentField('Task', 'DisplayName', 'new')
    expect(control).to.be.eq(ExampleModifiedControl)

    const controlOther = mapper.getControlForContentField('User', 'DisplayName', 'new')
    expect(controlOther).to.be.eq(ExampleModifiedControl)

    const controlOtherDateTime = mapper.getControlForContentField('Task', 'DueDate', 'new')
    expect(controlOtherDateTime).to.be.eq(ExampleDefaultFieldControl)
  })

  it('Should return a correct default control for a specified Content Field when there is a ContentType bound setting specified', () => {
    mapper.setupFieldSettingForControl(Task, 'DisplayName', () => {
      return ExampleModifiedControl2
    })
    const control = mapper.getControlForContentField('Task', 'DisplayName', 'new')
    expect(control).to.be.eq(ExampleModifiedControl2)

    const control2 = mapper.getControlForContentField('User', 'DisplayName', 'new')
    expect(control2).to.be.eq(ExampleDefaultFieldControl)
  })

  it('CreateClientSetting should run with defult factory method by default', () => {
    const fieldSetting = { DisplayName: 'TestField' } as ShortTextFieldSetting
    const clientSetting = mapper.createClientSetting(fieldSetting)
    expect(clientSetting.setting.DisplayName).to.be.eq(fieldSetting.DisplayName)
  })

  it('CreateClientSetting should be able to run with an overridden factory method', () => {
    const fieldSetting = { DisplayName: 'TestField', Type: 'ShortTextFieldSetting' } as ShortTextFieldSetting
    mapper.setClientControlFactory(ShortTextFieldSetting, setting => {
      setting.DisplayName = (setting.DisplayName || '').toUpperCase()
      return new ExampleClientSetting(setting)
    })

    const clientSetting = mapper.createClientSetting(fieldSetting)
    expect(clientSetting.setting.DisplayName).to.be.eq('TESTFIELD')
  })

  it('GetAllMappingsForContentTye filtered to View should be able to return all mappings', () => {
    const fullMapping = mapper.getFullSchemaForContentType('Task', 'view').fieldMappings
    expect(fullMapping.length).to.be.greaterThan(0)
    fullMapping.forEach(m => {
      expect(m.clientSettings.setting.VisibleBrowse).to.be.not.eq(FieldVisibility.Hide)
      expect(m.clientSettings).to.be.instanceof(ExampleClientSetting)
      expect(m.controlType).to.be.eq(ExampleDefaultFieldControl)
    })
  })

  it('GetAllMappingsForContentTye filtered to Edit should be able to return all mappings', () => {
    const fullMapping = mapper.getFullSchemaForContentType('Task', 'edit').fieldMappings
    expect(fullMapping.length).to.be.greaterThan(0)
    fullMapping.forEach(m => {
      expect(m.clientSettings.setting.VisibleEdit).to.be.not.eq(FieldVisibility.Hide)
      expect(m.clientSettings).to.be.instanceof(ExampleClientSetting)
      expect(m.controlType).to.be.eq(ExampleDefaultFieldControl)
    })
  })

  it('GetAllMappingsForContentTye filtered to New should be able to return all mappings', () => {
    const fullMapping = mapper.getFullSchemaForContentType('Task', 'new').fieldMappings
    expect(fullMapping.length).to.be.greaterThan(0)
    fullMapping.forEach(m => {
      expect(m.clientSettings.setting.VisibleNew).to.be.not.eq(FieldVisibility.Hide)
      expect(m.clientSettings).to.be.instanceof(ExampleClientSetting)
      expect(m.controlType).to.be.eq(ExampleDefaultFieldControl)
    })
  })
})
