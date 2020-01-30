import { Repository } from '@sensenet/client-core'
import { ChoiceFieldSetting, FieldVisibility, Task } from '@sensenet/default-content-types'
import { ControlMapper } from '../src'

class ExampleControlBase {}

class ExampleModifiedControl extends ExampleControlBase {}

class ExampleModifiedControl2 extends ExampleControlBase {}

class ExampleDefaultFieldControl extends ExampleControlBase {}

class ExampleClientSetting {}

export const controlMapperTests = describe('ControlMapper', () => {
  let mapper: ControlMapper<ExampleControlBase, ExampleClientSetting>
  let repository: Repository

  beforeEach(() => {
    repository = new Repository({}, async () => ({} as any))
    mapper = new ControlMapper(repository, ExampleControlBase, ExampleDefaultFieldControl)
  })

  it('Should be constructed', () => {
    expect(mapper).toBeInstanceOf(ControlMapper)
  })

  it('Should be constructed with BaseType and ClientControlSettingsFactory', () => {
    const newMapper = new ControlMapper(repository, ExampleControlBase, ExampleClientSetting)
    expect(newMapper).toBeInstanceOf(ControlMapper)
  })

  it('Should return correct Default Control for ContentTypes', () => {
    const controlType = mapper.getControlForContentType('Task')
    expect(controlType).toBe(ExampleControlBase)
  })

  it('Should return correct explicit defined Control for ContentTypes', () => {
    mapper.mapContentTypeToControl('Task', ExampleModifiedControl)
    const controlType = mapper.getControlForContentType('Task')
    expect(controlType).toBe(ExampleModifiedControl)
  })

  it('Should return correct Default Control for FieldSettings', () => {
    const fs = {} as ChoiceFieldSetting
    const controlType = mapper.getControlForFieldSetting(fs)
    expect(controlType).toBe(ExampleDefaultFieldControl)
  })

  it('Should return correct explicit defined Control for FieldSettings', () => {
    mapper.setupFieldSettingDefault('ChoiceFieldSetting', setting => {
      if (setting.Compulsory) {
        return ExampleModifiedControl
      }
      return ExampleDefaultFieldControl
    })

    const fs = { Compulsory: true, Type: 'ChoiceFieldSetting' } as ChoiceFieldSetting
    const controlType = mapper.getControlForFieldSetting(fs)
    expect(controlType).toBe(ExampleModifiedControl)

    const fs2 = { Compulsory: false, Type: 'ChoiceFieldSetting' } as ChoiceFieldSetting
    const controlType2 = mapper.getControlForFieldSetting(fs2)
    expect(controlType2).toBe(ExampleDefaultFieldControl)
  })

  it('Should return a correct default control for a specified Content Field', () => {
    const control = mapper.getControlForContentField('Task', 'DisplayName', 'new')
    expect(control).toBe(ExampleDefaultFieldControl)
  })

  it('Should return a correct default control for a specified Content Field when FieldSetting has default value', () => {
    mapper.setupFieldSettingDefault('ShortTextFieldSetting', () => {
      return ExampleModifiedControl
    })
    const control = mapper.getControlForContentField('Task', 'DisplayName', 'new')
    expect(control).toBe(ExampleModifiedControl)

    const controlOther = mapper.getControlForContentField('User', 'DisplayName', 'new')
    expect(controlOther).toBe(ExampleModifiedControl)

    const controlOtherDateTime = mapper.getControlForContentField('Task', 'DueDate', 'new')
    expect(controlOtherDateTime).toBe(ExampleDefaultFieldControl)
  })

  it('Should return a correct default control for a specified Content Field when there is a ContentType bound setting specified', () => {
    mapper.setupFieldSettingForControl(Task, 'DisplayName', () => {
      return ExampleModifiedControl2
    })
    const control = mapper.getControlForContentField('Task', 'DisplayName', 'new')
    expect(control).toBe(ExampleModifiedControl2)

    const control2 = mapper.getControlForContentField('User', 'DisplayName', 'new')
    expect(control2).toBe(ExampleDefaultFieldControl)
  })

  it('GetAllMappingsForContentTye filtered to View should be able to return all mappings', () => {
    const fullMapping = mapper.getFullSchemaForContentType('Task', 'browse').fieldMappings
    expect(fullMapping.length).toBeGreaterThan(0)
    fullMapping.forEach(m => {
      expect(m.fieldSettings.VisibleBrowse).not.toBe(FieldVisibility.Hide)
      expect(m.controlType).toBe(ExampleDefaultFieldControl)
    })
  })

  it('GetAllMappingsForContentTye filtered to Edit should be able to return all mappings', () => {
    const fullMapping = mapper.getFullSchemaForContentType('Task', 'edit').fieldMappings
    expect(fullMapping.length).toBeGreaterThan(0)
    fullMapping.forEach(m => {
      expect(m.fieldSettings.VisibleEdit).not.toBe(FieldVisibility.Hide)
      expect(m.controlType).toBe(ExampleDefaultFieldControl)
    })
  })

  it('GetAllMappingsForContentTye filtered to New should be able to return all mappings', () => {
    const fullMapping = mapper.getFullSchemaForContentType('Task', 'new').fieldMappings
    expect(fullMapping.length).toBeGreaterThan(0)
    fullMapping.forEach(m => {
      expect(m.fieldSettings.VisibleNew).not.toBe(FieldVisibility.Hide)
      expect(m.controlType).toBe(ExampleDefaultFieldControl)
    })
  })

  it('getFullSchemaForContentType with the type Folder should skip AllowedChildTypes', () => {
    const mapping = mapper.getFullSchemaForContentType('Folder', 'new').fieldMappings
    expect(mapping.length).toBeGreaterThan(0)
    mapping.forEach(m => {
      expect(m.fieldSettings.Name).not.toBe('AllowedChildTypes')
    })
  })

  it('getFullSchemaForContentType with the type SystemFolder should skip AllowedChildTypes', () => {
    const mapping = mapper.getFullSchemaForContentType('SystemFolder', 'new').fieldMappings
    expect(mapping.length).toBeGreaterThan(0)
    mapping.forEach(m => {
      expect(m.fieldSettings.Name).not.toBe('AllowedChildTypes')
    })
  })
})
