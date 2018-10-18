import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from 'storybook-addon-material-ui';
import { action } from '@storybook/addon-actions';
import { withActions } from '@storybook/addon-actions/dist/preview'
import { withKnobs, boolean, text, number, select, date } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { withInfo } from "@storybook/addon-info";
import { checkA11y } from '@storybook/addon-a11y'

import { Repository } from '@sensenet/client-core'
import { customSchema } from '../src/schema'

import { CheckboxGroup, DisplayName, FileName, Name, Number, ShortText, Textarea, RichTextEditor, DatePicker, DateTimePicker, TimePicker, DropDownList, Password, RadioButtonGroup, TagsInput, AutoComplete } from "../src/components/controls-react";
import { User } from "@sensenet/default-content-types";

addDecorator(muiTheme())

export const testRepository = new Repository({
    repositoryUrl: 'https://dmsservice.demo.sensenet.com',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'] as any,
    schemas: customSchema,
    sessionLifetime: 'expiration'
})

const currencyOptions = {
    USD: '$',
    EUR: '€',
    BTC: '฿',
    JPY: '¥',
};

const tagsInputDataSource = [
    { DisplayName: 'Alba Monday', Id: 1 } as User,
    { DisplayName: 'Terry Cherry', Id: 2 } as User,
]

storiesOf('FieldControls.AutoComplete', module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add("new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <AutoComplete
                    data-actionName="new"
                    name='autocomplete'
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
    .add("edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <AutoComplete
                    data-actionName="edit"
                    name='autocomplete'
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
    .add("browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <AutoComplete
                    data-textType='LongText'
                    name='autocomplete'
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

storiesOf("FieldControls.CheckboxGroup", module).addDecorator(withKnobs).addDecorator(checkA11y).addDecorator(withInfo())
    .add(
        "new mode", withNotes(`The CheckBoxGroup Field Control displays a list of checkboxes for selecting an option from a single- or multiple-selection Choice field.`)
            (() => (
                <CheckboxGroup
                    data-labelText={text('Label', 'Checkboxgroup label')}
                    data-actionName='new'
                    onChange={action('change')}
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}
                    data-allowMultiple={boolean('Allow multiple', false)}
                    readOnly={boolean('Readonly', false)}
                    required={boolean('Required', false)}
                    data-errorText={text('Error text', '')}
                    data-hintText={text('Hint', 'Checkboxgroup hint')}
                    data-allowExtraValue={boolean('Allow extra value', false)}
                />
            )),
    )
    .add(
        "edit mode", withNotes('The CheckBoxGroup Field Control displays a list of checkboxes for selecting an option from a single- or multiple-selection Choice field.')
            (() => (
                <CheckboxGroup
                    data-labelText={text('Label', 'Checkboxgroup label')}
                    data-actionName='edit'
                    onChange={action('change')}
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}
                    data-fieldValue={[3]}
                    data-allowMultiple={boolean('Allow multiple', false)}
                    readOnly={boolean('Readonly', false)}
                    required={boolean('Required', false)}
                    data-errorText={text('Error text', '')}
                    data-hintText={text('Hint', 'Checkboxgroup hint')}
                    data-allowExtraValue={boolean('Allow extra value', false)}
                />
            )),
    )
    .add(
        "browse mode", withNotes('The CheckBoxGroup Field Control displays a list of checkboxes for selecting an option from a single- or multiple-selection Choice field.')
            (() => (
                <CheckboxGroup
                    data-labelText={text('Label', 'Checkboxgroup label')}
                    data-actionName='browse'
                    onChange={action('change')}
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}
                    data-fieldValue={[3]}
                    value={3}
                />
            )),
    )
storiesOf("FieldControls.DatePicker", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                    data-hintText={text('Hint', 'DatePicker hint')} />
            ))
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                    data-hintText={text('Hint', 'DatePicker hint')} />
            ))
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <DatePicker
                    data-actionName="browse"
                    data-labelText={text('Label', 'DatePicker label')}
                    value='2013-03-26T03:55:00'
                    onChange={action('change')}
                    data-displayMode={select('Display mode', ['relative', 'calendar', 'raw'], 'relative')}
                    className={text('Additional class name', 'datepicker-field')} />
            ))
    )
storiesOf("FieldControls.DateTimePicker", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                    data-hintText={text('Hint', 'DateTimePicker hint')} />
            ))
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                    data-hintText={text('Hint', 'DateTimePicker hint')} />
            ))
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <DateTimePicker
                    data-actionName="browse"
                    data-labelText={text('Label', 'DateTimePicker label')}
                    value='2018-10-03T03:55:00'
                    onChange={action('change')}
                    data-displayMode={select('Display mode', ['relative', 'calendar', 'raw'], 'relative')}
                    className={text('Additional class name', 'datetimepicker-field')} />
            ))
    )
storiesOf("FieldControls.DisplayName", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`
        )
            (() => (
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
                />
            )),
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <DisplayName
                    data-actionName="browse"
                    data-labelText={text('Label', 'DisplayName label')}
                    className={text('Additional class name', 'displayname-field')}
                    value={text('Value', 'DisplayName value')}
                    onChange={action('change')}
                />
            )),
    )
storiesOf("FieldControls.DropDownList", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <DropDownList
                    data-actionName="new"
                    data-labelText={text('Label', 'DropDownList label')}
                    data-defaultValue={[2]}
                    readOnly={boolean('Readonly', false)}
                    required={boolean('Required', false)}
                    className={text('Additional class name', 'dropdownlist-field')}
                    data-errorText={text('Error text')}
                    onChange={action('change')}
                    data-hintText={text('Hint', 'DropDownList hint')}
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}
                />
            )),
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`
        )
            (() => (
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
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}

                />
            )),
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <DropDownList
                    data-actionName="browse"
                    data-labelText={text('Label', 'DropDownList label')}
                    className={text('Additional class name', 'dropdownlist-field')}
                    data-fieldValue={text('Value', [2])}
                    onChange={action('change')}
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}
                />
            )),
    )

storiesOf('FieldControls.FileName', module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <FileName
                    data-actionName="browse"
                    data-labelText={text('Label', 'FileName label')}
                    className={text('Additional class name', 'filename-field')}
                    value={text('Value', 'FileName value')}
                    onChange={action('change')}
                />
            )),
    )




storiesOf('FieldControls.Name', module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <Name
                    data-actionName="browse"
                    data-labelText={text('Label', 'Name label')}
                    className={text('Additional class name', 'name-field')}
                    value={text('Value', 'Name value')}
                    onChange={action('change')}
                />
            )),
    )
storiesOf("FieldControls.Number", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode integer",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "new mode decimal",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "edit mode integer",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "edit mode decimal",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <Number
                    data-actionName="browse"
                    data-labelText={text('Label', 'Number label')}
                    value={number('Value', 4)}
                    className={text('Additional class name', 'number-field')}
                    onChange={action('change')}
                    data-isPercentage={boolean('Percentage', false)}
                    data-isCurrency={boolean('Currency', false)}
                    data-currency={select('Currency symbol', currencyOptions, '$')}
                />
            )),
    )
storiesOf("FieldControls.Password", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`
        )
            (() => (
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
                />
            )),
    )
storiesOf("FieldControls.RadioButtonGroup", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <RadioButtonGroup
                    data-actionName="new"
                    data-labelText={text('Label', 'RadioButtonGroup label')}
                    data-defaultValue={[3]}
                    readOnly={boolean('Readonly', false)}
                    required={boolean('Required', false)}
                    className={text('Additional class name', 'radiobuttongroup-field')}
                    data-errorText={text('Error text')}
                    onChange={action('change')}
                    data-hintText={text('Hint', 'RadioButtonGroup hint')}
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}
                />
            )),
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`
        )
            (() => (
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
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}

                />
            )),
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <RadioButtonGroup
                    data-actionName="browse"
                    data-labelText={text('Label', 'RadioButtonGroup label')}
                    className={text('Additional class name', 'radiobuttongroup-field')}
                    data-fieldValue={text('Value', [2])}
                    onChange={action('change')}
                    options={[{ Text: 'option1', Value: 1 },
                    { Text: 'option2', Value: 2 },
                    { Text: 'option3', Value: 3 }]}
                />
            )),
    )
storiesOf("FieldControls.RichTextEditor", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add("new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add("edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add("browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
    <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <RichTextEditor
                    data-actionName="browse"
                    data-labelText={text('Label', 'RichTextEditor label')}
                    value={text('Value', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.')}
                    className={text('Additional class name', 'richtext-field')}
                    onChange={action('change')}
                />
            )),
    )
storiesOf("FieldControls.ShortText", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`
        )
            (() => (
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
                />
            )),
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <ShortText
                    data-actionName="browse"
                    data-labelText={text('Label', 'ShortText label')}
                    className={text('Additional class name', 'shorttext-field')}
                    value={text('Value', 'ShortText value')}
                    onChange={action('change')}
                />
            )),
    )
storiesOf('FieldControls.TagsInput', module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add("new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add("edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                />
            )),
    )
    .add("browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <TagsInput
                    data-textType='LongText'
                    data-actionName="browse"
                    data-labelText={text('Label', 'Textarea label')}
                    className={text('Additional class name', 'textarea-field')}
                    data-fieldValue={[1, 2]}
                    onChange={action('change')}
                    dataSource={tagsInputDataSource}
                    repository={testRepository}
                />
            )),
    )
storiesOf('FieldControls.Textarea', module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add("new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <Textarea
                    data-actionName="new"
                    data-textType='LongText'
                    data-labelText={text('Label', 'Textarea label')}
                    data-defaultValue={text('Default value', 'Textarea default value')}
                    readOnly={boolean('Readonly', false)}
                    required={boolean('Required', false)}
                    className={text('Additional class name', 'textarea-field')}
                    data-placeHolderText={text('Placeholder', 'placeholder')}
                    data-errorText={text('Error text')}
                    onChange={action('change')}
                    data-hintText={text('Hint', 'Textarea hint')}
                />
            )),
    )
    .add("edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <Textarea
                    data-textType='LongText'
                    data-actionName="edit"
                    data-labelText={text('Label', 'Textarea label')}
                    readOnly={boolean('Readonly', false)}
                    required={boolean('Required', false)}
                    className={text('Additional class name', 'textarea-field')}
                    data-placeHolderText={text('Placeholder', 'placeholder')}
                    data-errorText={text('Error text')}
                    value={text('Value', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.')}
                    onChange={action('change')}
                    data-hintText={text('Hint', 'Textarea hint')}
                />
            )),
    )
    .add("browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <Textarea
                    data-textType='LongText'
                    data-actionName="browse"
                    data-labelText={text('Label', 'Textarea label')}
                    className={text('Additional class name', 'textarea-field')}
                    value={text('Value', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.')}
                    onChange={action('change')}
                />
            )),
    )
storiesOf("FieldControls.TimePicker", module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y).addDecorator(withActions('change'))
    .add(
        "new mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                    data-hintText={text('Hint', 'TimePicker hint')} />
            ))
    )
    .add(
        "edit mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
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
                    data-hintText={text('Hint', 'TimePicker hint')} />
            ))
    )
    .add(
        "browse mode",
        withNotes(`<p>The ShortText Field Control is a Field Control that handles ShortText Fields and provides an interface to <b>display/modify short text data</b>. With ShortText field control textual data can be displayed or edited up to 450 characters. (Longer text will be truncated on save!) Ideal for storing simple descriptions, but also can contain complex HTML formatted text to display custom visualized data.</p>
        <p>The ShortText Field Control is a simple Field Control that renders a single TextBox. In Browse mode simply the value of the Field is rendered.</p>`)
            (() => (
                <TimePicker
                    data-actionName="browse"
                    data-labelText={text('Label', 'TimePicker label')}
                    value={text('Value', '03:50:00')}
                    onChange={action('change')}
                    className={text('Additional class name', 'timepicker-field')} />
            ))
    )