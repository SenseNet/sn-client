import { withA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { withActions } from '@storybook/addon-actions/dist/preview'
import { boolean, date, number, select, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Repository } from '@sensenet/client-core'
import {
  AllowedChildTypes,
  AutoComplete,
  Avatar,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  DateTimePicker,
  DisplayName,
  DropDownList,
  FileName,
  FileUpload,
  Name,
  Number,
  Password,
  RadioButtonGroup,
  ReferenceGrid,
  RichTextEditor,
  ShortText,
  TagsInput,
  Textarea,
  TimePicker,
} from '@sensenet/controls-react/src'
import { GenericContent, User } from '@sensenet/default-content-types/src'
import shorttextNotes from '../notes/fieldcontrols/ShortText.md'
import displaynameNotes from '../notes/fieldcontrols/DisplayName.md'
import checkboxgroupNotes from '../notes/fieldcontrols/CheckboxGroup.md'
import dropdownlistNotes from '../notes/fieldcontrols/DropDownList.md'
import radiobuttongroupNotes from '../notes/fieldcontrols/RadioButtonGroup.md'
import datetimepickerNotes from '../notes/fieldcontrols/DateTimePicker.md'
import datepickerNotes from '../notes/fieldcontrols/DatePicker.md'
import timepickerNotes from '../notes/fieldcontrols/TimePicker.md'
import textareasNotes from '../notes/fieldcontrols/Textarea.md'
import richtextNotes from '../notes/fieldcontrols/RichTextEditor.md'
import nameNotes from '../notes/fieldcontrols/Name.md'
import filenameNotes from '../notes/fieldcontrols/FileName.md'
import passwordNotes from '../notes/fieldcontrols/Password.md'
import numberNotes from '../notes/fieldcontrols/Number.md'
import tagsInputNotes from '../notes/fieldcontrols/TagsInput.md'
import autocompleteNotes from '../notes/fieldcontrols/AutoComplete.md'
import fileUploadNotes from '../notes/fieldcontrols/FileUpload.md'
import referenceGridNotes from '../notes/fieldcontrols/ReferenceGrid.md'
import avatarNotes from '../notes/fieldcontrols/Avatar.md'
import approvingModeChoiceNotes from '../notes/fieldcontrols/ApprovingModeChoice.md'
import versioningModeChoiceNotes from '../notes/fieldcontrols/VersioningModeChoice.md'
import versioningModeNotes from '../notes/fieldcontrols/VersioningMode.md'
import colorPickerNotes from '../notes/fieldcontrols/ColorPicker.md'
import allowedTypeNotes from '../notes/fieldcontrols/AllowedChildTypes.md'
import { customSchema } from './ViewControl.stories'

/**
 * Date knob
 */
function dateKnob(name: string, defaultValue = new Date()) {
  const stringTimestamp = date(name, defaultValue)
  return new Date(stringTimestamp).toISOString()
}

export const testRepository = new Repository({
  repositoryUrl: 'https://dmsservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'] as any,
  schemas: customSchema,
  sessionLifetime: 'expiration',
})

const currencyOptions = {
  USD: '$',
  EUR: '€',
  BTC: '฿',
  JPY: '¥',
}

const tagsInputDataSource: User[] = [
  { Path: 'Root/Users/Alba', Name: 'Alba Monday', DisplayName: 'Alba Monday', Id: 1, Type: 'User' },
  { Path: 'Root/Users/Terry', Name: 'Terry Cherry', DisplayName: 'Terry Cherry', Id: 2, Type: 'User' },
]

const referenceGridDataSource = [
  { DisplayName: 'Aenean semper.doc', Id: 4083, IsFolder: false, Children: [], Type: 'File' },
  { DisplayName: 'Aliquam porta suscipit ante.doc', Id: 4082, IsFolder: false, Children: [], Type: 'File' },
  { DisplayName: 'Duis et lorem.doc', Id: 4085, IsFolder: false, Children: [], Type: 'File' },
]

const testContent: GenericContent = {
  Name: 'Document_Library',
  Id: 4808,
  Path: '/Root/Sites/Default_Site',
  Type: 'GenericContent',
}

storiesOf('FieldControls.AllowedChildTypes', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <div>
        <div style={{ fontStyle: 'italic', fontSize: 13 }}>
          To see this control in action, please login at{' '}
          <a target="_blank" href="https://devservice.demo.sensenet.com" rel="noopener noreferrer ">
            https://devservice.demo.sensenet.com
          </a>
        </div>
        <br />
        <AllowedChildTypes
          data-actionName="new"
          name="Name"
          data-labelText={text('Label', 'AllowedChildTypes label')}
          className={text('Additional class name', 'allowedChildTypes-field')}
          data-errorText={text('Error text')}
          onChange={action('change')}
          data-hintText={text('Hint', 'AllowedChildTypes hint')}
          repository={testRepository}
          content={testContent}
          data-defaultValue={
            [
              { Name: 'Folder', DisplayName: 'Folder', Icon: 'Folder' },
              { Name: 'File', DisplayName: 'File', Icon: 'file' },
            ] as any
          }
        />
      </div>
    ),
    { notes: { markdown: allowedTypeNotes } },
  )
  .add(
    'edit mode',
    () => (
      <div>
        <div style={{ fontStyle: 'italic', fontSize: 13 }}>
          To see this control in action, please login at{' '}
          <a target="_blank" href="https://devservice.demo.sensenet.com" rel="noopener noreferrer ">
            https://devservice.demo.sensenet.com
          </a>
        </div>
        <br />
        <AllowedChildTypes
          data-actionName="edit"
          name="Name"
          data-labelText={text('Label', 'AllowedChildTypes label')}
          className={text('Additional class name', 'allowedChildTypes-field')}
          data-errorText={text('Error text')}
          onChange={action('change')}
          data-hintText={text('Hint', 'AllowedChildTypes hint')}
          repository={testRepository}
          content={testContent}
        />
      </div>
    ),
    { notes: { markdown: allowedTypeNotes } },
  )
  .add(
    'browse mode',
    () => (
      <div>
        <div style={{ fontStyle: 'italic', fontSize: 13 }}>
          To see this control in action, please login at{' '}
          <a target="_blank" href="https://devservice.demo.sensenet.com" rel="noopener noreferrer ">
            https://devservice.demo.sensenet.com
          </a>
        </div>
        <br />
        <AllowedChildTypes
          data-actionName="browse"
          name="Name"
          data-labelText={text('Label', 'AllowedChildTypes label')}
          className={text('Additional class name', 'allowedChildTypes-field')}
          data-errorText={text('Error text')}
          onChange={action('change')}
          data-hintText={text('Hint', 'AllowedChildTypes hint')}
          repository={testRepository}
          content={testContent}
        />
      </div>
    ),
    { notes: { markdown: allowedTypeNotes } },
  )

storiesOf('FieldControls.AutoComplete', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <AutoComplete
        data-actionName="new"
        name="Name"
        data-labelText={text('Label', 'AutoComplete label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'autocomplete-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'AutoComplete hint')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
      />
    ),
    { notes: { markdown: autocompleteNotes } },
  )
  .add(
    'edit mode',
    () => (
      <AutoComplete
        data-actionName="edit"
        name="Name"
        data-labelText={text('Label', 'AutoComplete label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'autoomplete-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'AutoComplete hint')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        data-fieldValue={[2]}
      />
    ),
    { notes: { markdown: autocompleteNotes } },
  )
  .add(
    'browse mode',
    () => (
      <AutoComplete
        data-textType="LongText"
        name="Name"
        data-actionName="browse"
        data-labelText={text('Label', 'AutoComplete label')}
        className={text('Additional class name', 'autocomplete-field')}
        data-fieldValue={[1, 2]}
        onChange={action('change')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
      />
    ),
    { notes: { markdown: autocompleteNotes } },
  )

storiesOf('FieldControls.Avatar', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <Avatar
        data-actionName="new"
        name="Name"
        data-labelText={text('Label', 'Avatar label')}
        readOnly={boolean('Readonly', false)}
        className={text('Additional class name', 'avatar-field')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Avatar hint')}
        dataSource={referenceGridDataSource}
        repository={testRepository}
        data-selectionRoot={['/demoavatars']}
        content={{
          Name: 'Alba Monday',
          Path: 'Root/Users/Alba',
          DisplayName: 'Alba Monday',
          Id: 4,
          Icon: 'user',
          Type: 'User',
          Avatar: { Url: 'https://devservice.demo.sensenet.com/Root/Sites/Default_Site/demoavatars/alba.jpg' },
        }}
      />
    ),
    { notes: { markdown: avatarNotes } },
  )
  .add(
    'edit mode',
    () => (
      <Avatar
        data-actionName="edit"
        name="Name"
        data-labelText={text('Label', 'Avatar label')}
        readOnly={boolean('Readonly', false)}
        className={text('Additional class name', 'avatar-field')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Avatar hint')}
        dataSource={referenceGridDataSource}
        repository={testRepository}
        data-fieldValue="/Root/Sites/Default_Site/demoavatars/alba.jpg"
        data-selectionRoot={['/demoavatars']}
        content={{
          Name: 'Alba Monday',
          Path: 'Root/Users/Alba',
          DisplayName: 'Alba Monday',
          Id: 4,
          Icon: 'user',
          Type: 'User',
          Avatar: { Url: 'https://devservice.demo.sensenet.com/Root/Sites/Default_Site/demoavatars/alba.jpg' },
        }}
      />
    ),
    { notes: { markdown: avatarNotes } },
  )
  .add(
    'browse mode',
    () => (
      <Avatar
        name="Name"
        data-actionName="browse"
        data-labelText={text('Label', 'Avatar label')}
        className={text('Additional class name', 'avatar-field')}
        data-fieldValue="/Root/Sites/Default_Site/demoavatars/alba.jpg"
        onChange={action('change')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        content={{
          Name: 'Alba Monday',
          Path: 'Root/Users/Alba',
          DisplayName: 'Alba Monday',
          Id: 4,
          Icon: 'user',
          Type: 'User',
          Avatar: { Url: 'https://devservice.demo.sensenet.com/Root/Sites/Default_Site/demoavatars/alba.jpg' },
        }}
      />
    ),
    { notes: { markdown: avatarNotes } },
  )

storiesOf('FieldControls.CheckboxGroup', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .add(
    'new mode',
    () => (
      <CheckboxGroup
        data-labelText={text('Label', 'Checkboxgroup label')}
        data-actionName="new"
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        data-allowMultiple={boolean('Allow multiple', false)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        data-errorText={text('Error text', '')}
        data-hintText={text('Hint', 'Checkboxgroup hint')}
        data-allowExtraValue={boolean('Allow extra value', false)}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: checkboxgroupNotes } },
  )
  .add(
    'edit mode',
    () => (
      <CheckboxGroup
        data-labelText={text('Label', 'Checkboxgroup label')}
        data-actionName="edit"
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        data-fieldValue={[3]}
        data-allowMultiple={boolean('Allow multiple', false)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        data-errorText={text('Error text', '')}
        data-hintText={text('Hint', 'Checkboxgroup hint')}
        data-allowExtraValue={boolean('Allow extra value', false)}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: checkboxgroupNotes } },
  )
  .add(
    'browse mode',
    () => (
      <CheckboxGroup
        data-labelText={text('Label', 'Checkboxgroup label')}
        data-actionName="browse"
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        data-fieldValue={[3]}
        value={3}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: checkboxgroupNotes } },
  )

storiesOf('FieldControls.ColorPicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <ColorPicker
        data-labelText={text('Label', 'ColorPicker label')}
        data-actionName="new"
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'colorpicker-field')}
        data-errorText={text('Error text')}
        data-hintText={text('Hint', 'ColorPicker hint')}
        name={'Color' as any}
        palette={['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505']}
      />
    ),
    { notes: { markdown: colorPickerNotes } },
  )
  .add(
    'edit mode',
    () => (
      <ColorPicker
        data-labelText={text('Label', 'ColorPicker label')}
        data-actionName="edit"
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'colorpicker-field')}
        data-errorText={text('Error text')}
        data-hintText={text('Hint', 'ColorPicker hint')}
        data-fieldValue="#D0021B"
        name={'Color' as any}
        palette={['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505']}
      />
    ),
    { notes: { markdown: colorPickerNotes } },
  )
  .add(
    'browse mode',
    () => (
      <ColorPicker
        data-labelText={text('Label', 'ColorPicker label')}
        data-actionName="browse"
        className={text('Additional class name', 'colorpicker-field')}
        name={'Color' as any}
        value="#D0021B"
        onChange={action('change')}
      />
    ),
    { notes: { markdown: colorPickerNotes } },
  )

storiesOf('FieldControls.DatePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <DatePicker
        data-actionName="new"
        data-labelText={text('Label', 'DatePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={dateKnob('Default value')}
        data-hintText={text('Hint', 'DatePicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: datepickerNotes } },
  )
  .add(
    'edit mode',
    () => (
      <DatePicker
        data-actionName="edit"
        data-labelText={text('Label', 'DatePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={dateKnob('Value')}
        data-hintText={text('Hint', 'DatePicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: datepickerNotes } },
  )
  .add(
    'browse mode',
    () => (
      <DatePicker
        data-actionName="browse"
        data-labelText={text('Label', 'DatePicker label')}
        value="2013-03-26T03:55:00"
        onChange={action('change')}
        data-displayMode={select('Display mode', ['relative', 'calendar', 'raw'], 'relative')}
        className={text('Additional class name', 'datepicker-field')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: datepickerNotes } },
  )

storiesOf('FieldControls.DateTimePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <DateTimePicker
        data-actionName="new"
        data-labelText={text('Label', 'DateTimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datetimepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={dateKnob('Default value')}
        data-hintText={text('Hint', 'DateTimePicker hint')}
        name="Name"
      />
    ),
    { notes: { markdown: datetimepickerNotes } },
  )
  .add(
    'edit mode',
    () => (
      <DateTimePicker
        data-actionName="edit"
        data-labelText={text('Label', 'DateTimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datetimepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={dateKnob('Value')}
        data-hintText={text('Hint', 'DateTimePicker hint')}
        name="Name"
      />
    ),
    { notes: { markdown: datetimepickerNotes } },
  )
  .add(
    'browse mode',
    () => (
      <DateTimePicker
        data-actionName="browse"
        data-labelText={text('Label', 'DateTimePicker label')}
        value="2018-10-03T03:55:00"
        onChange={action('change')}
        data-displayMode={select('Display mode', ['relative', 'calendar', 'raw'], 'relative')}
        className={text('Additional class name', 'datetimepicker-field')}
        name="Name"
      />
    ),
    { notes: { markdown: datetimepickerNotes } },
  )

storiesOf('FieldControls.DisplayName', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <DisplayName
        data-actionName="new"
        data-labelText={text('Label', 'DisplayName label')}
        data-defaultValue={text('Default value', 'DisplayName default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'displayname-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'DisplayName hint')}
        name="Name"
      />
    ),
    { notes: { markdown: displaynameNotes } },
  )
  .add(
    'edit mode',
    () => (
      <DisplayName
        data-labelText={text('Label', 'DisplayName label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'displayname-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'DisplayName value')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'DisplayName hint')}
        name="Name"
      />
    ),
    { notes: { markdown: displaynameNotes } },
  )
  .add(
    'browse mode',
    () => (
      <DisplayName
        data-actionName="browse"
        data-labelText={text('Label', 'DisplayName label')}
        className={text('Additional class name', 'displayname-field')}
        value={text('Value', 'DisplayName value')}
        onChange={action('change')}
        name="Name"
      />
    ),
    { notes: { markdown: displaynameNotes } },
  )

storiesOf('FieldControls.DropDownList', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <DropDownList
        data-actionName="new"
        data-labelText={text('Label', 'DropDownList label')}
        data-defaultValue={'2'}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'dropdownlist-field')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'DropDownList hint')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="Version"
      />
    ),
    { notes: { markdown: dropdownlistNotes } },
  )
  .add(
    'edit mode',
    () => (
      <DropDownList
        data-labelText={text('Label', 'DropDownList label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'dropdownlist-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'DropDownList hint')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: dropdownlistNotes } },
  )
  .add(
    'browse mode',
    () => (
      <DropDownList
        data-actionName="browse"
        data-labelText={text('Label', 'DropDownList label')}
        className={text('Additional class name', 'dropdownlist-field')}
        data-fieldValue={text('Value', [2])}
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: dropdownlistNotes } },
  )
  .add(
    'ApprovingModeChoice',
    () => (
      <DropDownList
        data-labelText={text('Label', 'ApprovingModeChoice label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'approvingmodechoice-field')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'It shows the approval mode of the current content.')}
        options={[{ Text: 'Inherited (Off)', Value: 1 }, { Text: 'Off', Value: 2 }, { Text: 'On', Value: 3 }]}
        name="ApprovingMode"
      />
    ),
    { notes: { markdown: approvingModeChoiceNotes } },
  )
  .add(
    'VersioningModeChoice',
    () => (
      <DropDownList
        data-labelText={text('Label', 'Version history')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'versioningmodechoice-field')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text(
          'Hint',
          'Specify whether the system should create a new version whenever you create or modify a content below this content.',
        )}
        options={[
          { Text: 'Inherited', Value: 1 },
          { Text: 'None', Value: 2 },
          { Text: 'Major only', Value: 3 },
          { Text: 'Major and minor', Value: 4 },
        ]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: versioningModeChoiceNotes } },
  )

  .add(
    'VersioningMode',
    () => (
      <DropDownList
        data-labelText={text('Label', 'Versioning for current content')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'versioningmodechoice-field')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'It shows the versioning mode of the current content.')}
        options={[
          { Text: 'Inherited', Value: 1 },
          { Text: 'None', Value: 2 },
          { Text: 'Major only', Value: 3 },
          { Text: 'Major and minor', Value: 4 },
        ]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: versioningModeNotes } },
  )

storiesOf('FieldControls.FileName', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <FileName
        data-actionName="new"
        data-labelText={text('Label', 'FileName label')}
        data-defaultValue={text('Default value', 'FileName default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'filename-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'FileName hint')}
        data-extension={text('Extension', 'docx')}
        name="Name"
      />
    ),
    { notes: { markdown: filenameNotes } },
  )
  .add(
    'edit mode',
    () => (
      <FileName
        data-labelText={text('Label', 'FileName label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'filename-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'filename.docx')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'FileName hint')}
        name="Name"
      />
    ),
    { notes: { markdown: filenameNotes } },
  )
  .add(
    'browse mode',
    () => (
      <FileName
        data-actionName="browse"
        data-labelText={text('Label', 'FileName label')}
        className={text('Additional class name', 'filename-field')}
        value={text('Value', 'Lorem-ipsum.docx')}
        onChange={action('change')}
        name="Name"
      />
    ),
    { notes: { markdown: filenameNotes } },
  )

storiesOf('FieldControls.FileUpload', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <FileUpload
        data-actionName="new"
        data-labelText={text('Label', 'FileUpload label')}
        onChange={action('change')}
        className={text('Additional class name', 'fileupload-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-hintText={text('Hint', 'FileUpload hint')}
        repository={testRepository}
        name="Name"
      />
    ),
    { notes: { markdown: fileUploadNotes } },
  )

storiesOf('FieldControls.Name', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <Name
        data-actionName="new"
        data-labelText={text('Label', 'Name label')}
        data-defaultValue={text('Default value', 'Name default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'name-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Name hint')}
        name="Name"
      />
    ),
    { notes: { markdown: nameNotes } },
  )
  .add(
    'edit mode',
    () => (
      <Name
        data-labelText={text('Label', 'Name label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'name-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'Name value')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'Name hint')}
        name="Name"
      />
    ),
    { notes: { markdown: nameNotes } },
  )
  .add(
    'browse mode',
    () => (
      <Name
        data-actionName="browse"
        data-labelText={text('Label', 'Name label')}
        className={text('Additional class name', 'name-field')}
        value={text('Value', 'Name value')}
        onChange={action('change')}
        name="Name"
      />
    ),
    { notes: { markdown: nameNotes } },
  )

storiesOf('FieldControls.Number', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode integer',
    () => (
      <Number
        data-actionName="new"
        data-labelText={text('Label', 'Number label')}
        data-defaultValue={number('Default value', 2)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'number-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Number hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-decimal={boolean('Decimal', false)}
        data-digits={number('Digits', 2)}
        data-step={number('Step', 1)}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'new mode decimal',
    () => (
      <Number
        data-actionName="new"
        data-labelText={text('Label', 'Number label')}
        data-defaultValue={number('Default value', 2.1)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'number-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Number hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-decimal={boolean('Decimal', true)}
        data-digits={number('Digits', 2)}
        data-step={number('Step', 0.01)}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'edit mode integer',
    () => (
      <Number
        data-actionName="edit"
        data-labelText={text('Label', 'Number label')}
        value={number('Value', 4)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'number-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Number hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-decimal={boolean('Decimal', false)}
        data-digits={number('Digits', 2)}
        data-step={number('Step', 1)}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'edit mode decimal',
    () => (
      <Number
        data-actionName="edit"
        data-labelText={text('Label', 'Number label')}
        value={number('Value', 4.45)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'number-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Number hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-decimal={boolean('Decimal', true)}
        data-digits={number('Digits', 2)}
        data-step={number('Step', 1.12)}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'browse mode',
    () => (
      <Number
        data-actionName="browse"
        data-labelText={text('Label', 'Number label')}
        value={number('Value', 4)}
        className={text('Additional class name', 'number-field')}
        onChange={action('change')}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'new mode currency',
    () => (
      <Number
        data-actionName="new"
        data-labelText={text('Label', 'Currency label')}
        data-defaultValue={number('Default value', 2.1)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'currency-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Currency hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-isCurrency={boolean('Currency', true)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'edit mode currency',
    () => (
      <Number
        data-actionName="edit"
        data-labelText={text('Label', 'Currency label')}
        value={number('Value', 4)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'currency-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Currency hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-isCurrency={boolean('Currency', true)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'browse mode currency',
    () => (
      <Number
        data-actionName="browse"
        data-labelText={text('Label', 'Currency label')}
        value={number('Value', 4.45)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'currency-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Currency hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-isCurrency={boolean('Currency', true)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )

storiesOf('FieldControls.Password', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <Password
        data-actionName="new"
        data-labelText={text('Label', 'Password label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'pasword-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Password hint')}
        name="Name"
      />
    ),
    { notes: { markdown: passwordNotes } },
  )
  .add(
    'edit mode',
    () => (
      <Password
        data-labelText={text('Label', 'Password label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'password-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'Password value')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'Password hint')}
        name="Name"
      />
    ),
    { notes: { markdown: passwordNotes } },
  )

storiesOf('FieldControls.RadioButtonGroup', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <RadioButtonGroup
        data-actionName="new"
        data-labelText={text('Label', 'RadioButtonGroup label')}
        data-defaultValue={'3'}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'radiobuttongroup-field')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'RadioButtonGroup hint')}
        options={[
          {
            Value: '0',
            Text: 'Inherited',
          },
          {
            Value: '1',
            Text: 'None',
          },
          {
            Value: '2',
            Text: 'Major only',
          },
          {
            Value: '3',
            Text: 'Major and minor',
          },
        ]}
        name="Version"
      />
    ),
    { notes: { markdown: radiobuttongroupNotes } },
  )
  .add(
    'edit mode',
    () => (
      <RadioButtonGroup
        data-labelText={text('Label', 'RadioButtonGroup label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'radiobuttongroup-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'RadioButtonGroup hint')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: radiobuttongroupNotes } },
  )
  .add(
    'browse mode',
    () => (
      <RadioButtonGroup
        data-actionName="browse"
        data-labelText={text('Label', 'RadioButtonGroup label')}
        className={text('Additional class name', 'radiobuttongroup-field')}
        data-fieldValue={text('Value', [2])}
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: radiobuttongroupNotes } },
  )

storiesOf('FieldControls.ReferenceGrid', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <ReferenceGrid
        data-actionName="new"
        data-labelText={text('Label', 'ReferenceGrid label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'reference-field')}
        onChange={action('change')}
        name="Name"
        data-fieldValue={undefined}
        dataSource={referenceGridDataSource}
        repository={testRepository}
        data-selectionRoot={['/workspaces']}
        data-allowedTypes={['File']}
      />
    ),
    { notes: { markdown: referenceGridNotes } },
  )
  .add(
    'edit mode',
    () => (
      <ReferenceGrid
        data-labelText={text('Label', 'ReferenceGrid label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'reference-field')}
        data-errorText={text('Error text')}
        data-fieldValue={[{ DisplayName: 'Aenean semper.docx', Id: 4, Icon: 'word', Type: 'File' }]}
        data-actionName="edit"
        onChange={action('change')}
        name="Name"
        dataSource={referenceGridDataSource}
        repository={testRepository}
        data-selectionRoot={['/workspaces']}
        data-allowedTypes={['File']}
        data-allowMultiple={true}
      />
    ),
    { notes: { markdown: referenceGridNotes } },
  )
  .add(
    'browse mode',
    () => (
      <ReferenceGrid
        data-actionName="browse"
        data-labelText={text('Label', 'ReferenceGrid label')}
        className={text('Additional class name', 'reference-field')}
        data-fieldValue={{
          Name: 'Alba Monday',
          Path: 'Root/Users/Alba',
          DisplayName: 'Alba Monday',
          Id: 4,
          Icon: 'user',
          Type: 'User',
          Avatar: { Url: 'https://devservice.demo.sensenet.com/Root/Sites/Default_Site/demoavatars/alba.jpg' },
        }}
        onChange={action('change')}
        name="Name"
        dataSource={tagsInputDataSource}
        repository={testRepository}
      />
    ),
    { notes: { markdown: referenceGridNotes } },
  )

storiesOf('FieldControls.RichTextEditor', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <RichTextEditor
        data-actionName="new"
        data-labelText={text('Label', 'RichTextEditor label')}
        data-defaultValue={text('Default value', 'RichTextEditor default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'richtext-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'RichTextEditor hint')}
        name="Description"
      />
    ),
    { notes: { markdown: richtextNotes } },
  )
  .add(
    'edit mode',
    () => (
      <RichTextEditor
        data-actionName="edit"
        data-labelText={text('Label', 'RichTextEditor label')}
        value={text('Value', 'RichTextEditor value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'richtext-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'RichTextEditor hint')}
        name="Description"
      />
    ),
    { notes: { markdown: richtextNotes } },
  )
  .add(
    'browse mode',
    () => (
      <RichTextEditor
        data-actionName="browse"
        data-labelText={text('Label', 'RichTextEditor label')}
        value={text(
          'Value',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
        )}
        className={text('Additional class name', 'richtext-field')}
        name="Description"
        onChange={action('change')}
      />
    ),
    { notes: { markdown: richtextNotes } },
  )

storiesOf('FieldControls.ShortText', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <ShortText
        data-actionName="new"
        data-labelText={text('Label', 'ShortText label')}
        data-defaultValue={text('Default value', 'ShortText default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'shorttext-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Shorttext hint')}
        name="Name"
      />
    ),
    { notes: { markdown: shorttextNotes } },
  )
  .add(
    'edit mode',
    () => (
      <ShortText
        data-labelText={text('Label', 'ShortText label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'shorttext-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'ShortText value')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'Shorttext hint')}
        name="Name"
      />
    ),
    { notes: { markdown: shorttextNotes } },
  )
  .add(
    'browse mode',
    () => (
      <ShortText
        data-actionName="browse"
        data-labelText={text('Label', 'ShortText label')}
        className={text('Additional class name', 'shorttext-field')}
        value={text('Value', 'ShortText value')}
        onChange={action('change')}
        name="Name"
      />
    ),
    { notes: { markdown: shorttextNotes } },
  )

storiesOf('FieldControls.TagsInput', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <TagsInput
        data-actionName="new"
        data-labelText={text('Label', 'TagsInput label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'tagsinput-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'TagsInput hint')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        data-allowMultiple={boolean('Allow multiple selection', false)}
        name="ModifiedBy"
        content={testContent}
      />
    ),
    { notes: { markdown: tagsInputNotes } },
  )
  .add(
    'edit mode',
    () => (
      <TagsInput
        data-actionName="edit"
        data-labelText={text('Label', 'TagsInput label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'tagsinput-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'TagsInput hint')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        data-allowMultiple={boolean('Allow multiple selection', false)}
        data-fieldValue={[tagsInputDataSource[1]]}
        name="ModifiedBy"
        content={testContent}
      />
    ),
    { notes: { markdown: tagsInputNotes } },
  )
  .add(
    'browse mode',
    () => (
      <TagsInput
        data-actionName="browse"
        data-labelText={text('Label', 'TagsInput label')}
        className={text('Additional class name', 'tagsinput-field')}
        data-fieldValue={[tagsInputDataSource[0], tagsInputDataSource[1]]}
        onChange={action('change')}
        repository={testRepository}
        dataSource={tagsInputDataSource}
        name="ModifiedBy"
        content={testContent}
      />
    ),
    { notes: { markdown: tagsInputNotes } },
  )

storiesOf('FieldControls.Textarea', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <Textarea
        data-actionName="new"
        data-textType="LongText"
        data-labelText={text('Label', 'Textarea label')}
        data-defaultValue={text('Default value', 'Textarea default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'textarea-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Textarea hint')}
        name="Description"
      />
    ),
    { notes: { markdown: textareasNotes } },
  )
  .add(
    'edit mode',
    () => (
      <Textarea
        data-textType="LongText"
        data-actionName="edit"
        data-labelText={text('Label', 'Textarea label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'textarea-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text(
          'Value',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
        )}
        onChange={action('change')}
        data-hintText={text('Hint', 'Textarea hint')}
        name="Description"
      />
    ),
    { notes: { markdown: textareasNotes } },
  )
  .add(
    'browse mode',
    () => (
      <Textarea
        data-textType="LongText"
        data-actionName="browse"
        data-labelText={text('Label', 'Textarea label')}
        className={text('Additional class name', 'textarea-field')}
        value={text(
          'Value',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
        )}
        onChange={action('change')}
        name="Description"
      />
    ),
    { notes: { markdown: textareasNotes } },
  )

storiesOf('FieldControls.TimePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <TimePicker
        data-actionName="new"
        data-labelText={text('Label', 'TimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'timepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={dateKnob('Default value')}
        data-hintText={text('Hint', 'TimePicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: timepickerNotes } },
  )
  .add(
    'edit mode',
    () => (
      <TimePicker
        data-actionName="edit"
        data-labelText={text('Label', 'TimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'timepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={dateKnob('Value')}
        data-hintText={text('Hint', 'TimePicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: timepickerNotes } },
  )
  .add(
    'browse mode',
    () => (
      <TimePicker
        data-actionName="browse"
        data-labelText={text('Label', 'TimePicker label')}
        value={text('Value', '03:50:00')}
        onChange={action('change')}
        className={text('Additional class name', 'timepicker-field')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: timepickerNotes } },
  )
