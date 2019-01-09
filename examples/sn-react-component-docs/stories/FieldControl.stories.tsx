import { checkA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { withActions } from '@storybook/addon-actions/dist/preview'
import { withInfo } from '@storybook/addon-info'
import { boolean, date, number, select, text, withKnobs } from '@storybook/addon-knobs'
import { withMarkdownNotes } from '@storybook/addon-notes'
import { addDecorator, storiesOf } from '@storybook/react'
import React from 'react'
import { muiTheme } from 'storybook-addon-material-ui'

import { Repository } from '@sensenet/client-core'
import { customSchema } from './ViewControl.stories'

import {
  AutoComplete,
  CheckboxGroup,
  DatePicker,
  DateTimePicker,
  DisplayName,
  DropDownList,
  FileName,
  Name,
  Number,
  Password,
  RadioButtonGroup,
  RichTextEditor,
  ShortText,
  TagsInput,
  Textarea,
  TimePicker,
} from '@sensenet/controls-react/src'
import { User } from '@sensenet/default-content-types/src'

addDecorator(muiTheme())

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

const tagsInputDataSource = [
  { DisplayName: 'Alba Monday', Id: 1 } as User,
  { DisplayName: 'Terry Cherry', Id: 2 } as User,
]

const shorttextNotes = require('../notes/fieldcontrols/ShortText.md')
const displaynameNotes = require('../notes/fieldcontrols/DisplayName.md')
const checkboxgroupNotes = require('../notes/fieldcontrols/CheckboxGroup.md')
const dropdownlistNotes = require('../notes/fieldcontrols/DropDownList.md')
const radiobuttongroupNotes = require('../notes/fieldcontrols/RadioButtonGroup.md')
const datetimepickerNotes = require('../notes/fieldcontrols/DateTimePicker.md')
const datepickerNotes = require('../notes/fieldcontrols/DatePicker.md')
const timepickerNotes = require('../notes/fieldcontrols/TimePicker.md')
const textaresNotes = require('../notes/fieldcontrols/Textarea.md')
const richtextNotes = require('../notes/fieldcontrols/RichTextEditor.md')
const nameNotes = require('../notes/fieldcontrols/Name.md')
const filenameNotes = require('../notes/fieldcontrols/FileName.md')
const passwordNotes = require('../notes/fieldcontrols/Password.md')
const numberNotes = require('../notes/fieldcontrols/Number.md')
const tagsInputNotes = require('../notes/fieldcontrols/TagsInput.md')
const autocompleteNotes = require('../notes/fieldcontrols/AutoComplete.md')

storiesOf('FieldControls.AutoComplete', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(autocompleteNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(autocompleteNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(autocompleteNotes)(() => (
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
    )),
  )

storiesOf('FieldControls.CheckboxGroup', module)
  .addDecorator(withKnobs)
  .addDecorator(checkA11y)
  .addDecorator(withInfo())
  .add(
    'new mode',
    withMarkdownNotes(checkboxgroupNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(checkboxgroupNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(checkboxgroupNotes)(() => (
      <CheckboxGroup
        data-labelText={text('Label', 'Checkboxgroup label')}
        data-actionName="browse"
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        data-fieldValue={[3]}
        value={3}
        name="VersioningMode"
      />
    )),
  )
storiesOf('FieldControls.DatePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(datepickerNotes)(() => (
      <DatePicker
        data-actionName="new"
        data-labelText={text('Label', 'DatePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={date('Default value')}
        data-hintText={text('Hint', 'DatePicker hint')}
        name="ModificationDate"
      />
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(datepickerNotes)(() => (
      <DatePicker
        data-actionName="edit"
        data-labelText={text('Label', 'DatePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={date('Value')}
        data-hintText={text('Hint', 'DatePicker hint')}
        name="ModificationDate"
      />
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(datepickerNotes)(() => (
      <DatePicker
        data-actionName="browse"
        data-labelText={text('Label', 'DatePicker label')}
        value="2013-03-26T03:55:00"
        onChange={action('change')}
        data-displayMode={select('Display mode', ['relative', 'calendar', 'raw'], 'relative')}
        className={text('Additional class name', 'datepicker-field')}
        name="ModificationDate"
      />
    )),
  )
storiesOf('FieldControls.DateTimePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(datetimepickerNotes)(() => (
      <DateTimePicker
        data-actionName="new"
        data-labelText={text('Label', 'DateTimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datetimepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={date('Default value')}
        data-hintText={text('Hint', 'DateTimePicker hint')}
        name="Name"
      />
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(datetimepickerNotes)(() => (
      <DateTimePicker
        data-actionName="edit"
        data-labelText={text('Label', 'DateTimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datetimepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={date('Value')}
        data-hintText={text('Hint', 'DateTimePicker hint')}
        name="Name"
      />
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(datetimepickerNotes)(() => (
      <DateTimePicker
        data-actionName="browse"
        data-labelText={text('Label', 'DateTimePicker label')}
        value="2018-10-03T03:55:00"
        onChange={action('change')}
        data-displayMode={select('Display mode', ['relative', 'calendar', 'raw'], 'relative')}
        className={text('Additional class name', 'datetimepicker-field')}
        name="Name"
      />
    )),
  )
storiesOf('FieldControls.DisplayName', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(displaynameNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(displaynameNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(displaynameNotes)(() => (
      <DisplayName
        data-actionName="browse"
        data-labelText={text('Label', 'DisplayName label')}
        className={text('Additional class name', 'displayname-field')}
        value={text('Value', 'DisplayName value')}
        onChange={action('change')}
        name="Name"
      />
    )),
  )
storiesOf('FieldControls.DropDownList', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(dropdownlistNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(dropdownlistNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(dropdownlistNotes)(() => (
      <DropDownList
        data-actionName="browse"
        data-labelText={text('Label', 'DropDownList label')}
        className={text('Additional class name', 'dropdownlist-field')}
        data-fieldValue={text('Value', [2])}
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    )),
  )

storiesOf('FieldControls.FileName', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(filenameNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(filenameNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(filenameNotes)(() => (
      <FileName
        data-actionName="browse"
        data-labelText={text('Label', 'FileName label')}
        className={text('Additional class name', 'filename-field')}
        value={text('Value', 'Lorem-ipsum.docx')}
        onChange={action('change')}
        name="Name"
      />
    )),
  )

storiesOf('FieldControls.Name', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(nameNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(nameNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(nameNotes)(() => (
      <Name
        data-actionName="browse"
        data-labelText={text('Label', 'Name label')}
        className={text('Additional class name', 'name-field')}
        value={text('Value', 'Name value')}
        onChange={action('change')}
        name="Name"
      />
    )),
  )
storiesOf('FieldControls.Number', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode integer',
    withMarkdownNotes(numberNotes)(() => (
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
    )),
  )
  .add(
    'new mode decimal',
    withMarkdownNotes(numberNotes)(() => (
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
    )),
  )
  .add(
    'edit mode integer',
    withMarkdownNotes(numberNotes)(() => (
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
    )),
  )
  .add(
    'edit mode decimal',
    withMarkdownNotes(numberNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(numberNotes)(() => (
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
    )),
  )
storiesOf('FieldControls.Password', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(passwordNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(passwordNotes)(() => (
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
    )),
  )
storiesOf('FieldControls.RadioButtonGroup', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(passwordNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(radiobuttongroupNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(radiobuttongroupNotes)(() => (
      <RadioButtonGroup
        data-actionName="browse"
        data-labelText={text('Label', 'RadioButtonGroup label')}
        className={text('Additional class name', 'radiobuttongroup-field')}
        data-fieldValue={text('Value', [2])}
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    )),
  )
storiesOf('FieldControls.RichTextEditor', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(richtextNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(richtextNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(richtextNotes)(() => (
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
    )),
  )
storiesOf('FieldControls.ShortText', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(shorttextNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(shorttextNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(shorttextNotes)(() => (
      <ShortText
        data-actionName="browse"
        data-labelText={text('Label', 'ShortText label')}
        className={text('Additional class name', 'shorttext-field')}
        value={text('Value', 'ShortText value')}
        onChange={action('change')}
        name="Name"
      />
    )),
  )
storiesOf('FieldControls.TagsInput', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(tagsInputNotes)(() => (
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
      />
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(tagsInputNotes)(() => (
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
        data-fieldValue={[2]}
        name="ModifiedBy"
      />
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(tagsInputNotes)(() => (
      <TagsInput
        data-textType="LongText"
        data-actionName="browse"
        data-labelText={text('Label', 'Textarea label')}
        className={text('Additional class name', 'textarea-field')}
        data-fieldValue={[1, 2]}
        onChange={action('change')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        name="ModifiedBy"
      />
    )),
  )
storiesOf('FieldControls.Textarea', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(textaresNotes)(() => (
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
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(textaresNotes)(() => (
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
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(textaresNotes)(() => (
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
    )),
  )
storiesOf('FieldControls.TimePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo())
  .addDecorator(checkA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    withMarkdownNotes(timepickerNotes)(() => (
      <TimePicker
        data-actionName="new"
        data-labelText={text('Label', 'TimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'timepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={date('Default value')}
        data-hintText={text('Hint', 'TimePicker hint')}
        name="ModificationDate"
      />
    )),
  )
  .add(
    'edit mode',
    withMarkdownNotes(timepickerNotes)(() => (
      <TimePicker
        data-actionName="edit"
        data-labelText={text('Label', 'TimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'timepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={date('Value')}
        data-hintText={text('Hint', 'TimePicker hint')}
        name="ModificationDate"
      />
    )),
  )
  .add(
    'browse mode',
    withMarkdownNotes(timepickerNotes)(() => (
      <TimePicker
        data-actionName="browse"
        data-labelText={text('Label', 'TimePicker label')}
        value={text('Value', '03:50:00')}
        onChange={action('change')}
        className={text('Additional class name', 'timepicker-field')}
        name="ModificationDate"
      />
    )),
  )
