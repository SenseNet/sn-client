import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { ContentList } from "../src/components/list-controls-react/ContentList";
import { action } from '@storybook/addon-actions';
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs, array, boolean, select, text } from '@storybook/addon-knobs';
import { withMarkdownNotes } from '@storybook/addon-notes';
import { withInfo } from "@storybook/addon-info";
import { checkA11y } from '@storybook/addon-a11y'

import { customSchema } from './ViewControl.stories'
import { icons } from '../assets/icons'
import { IActionModel } from "@sensenet/default-content-types";

const orderDirectionOptions = {
    asc: 'asc',
    desc: 'desc',
};

addDecorator(muiTheme())

const contentListNotes = require('../notes/listcontrols/ContentList.md')

const items = [
    {
        DisplayName: 'Sample folder',
        Name: 'SampleFolder',
        Locked: true,
        ModificationDate: '2018-11-05T00:44:55.767Z',
        Actions: [
            {
                DisplayName: "Rename",
                Icon: "rename",
                Name: "Rename",
            } as IActionModel,
            {
                DisplayName: "Delete",
                Icon: "delete",
                Name: "Delete",
            } as IActionModel
        ],
        Id: 1,
        Path: '/Root/Profiles/Public/alba/Document_Library/Sample-folder',
        Type: 'Folder',
        Icon: "folder",
    },
    {
        DisplayName: 'Sample-document.docx',
        Name: 'Sample-document.docx',
        Locked: false,
        ModificationDate: '2018-11-05T00:44:55.843Z',
        Actions: [
            {
                DisplayName: "Preview",
                Icon: "preview",
                Name: "Preview",
            } as IActionModel,
            {
                DisplayName: "Download",
                Icon: "download",
                Name: "Browse",
            } as IActionModel,
            {
                DisplayName: "Delete",
                Icon: "delete",
                Name: "Delete",
            } as IActionModel
        ],
        Id: 2,
        Path: '/Root/Profiles/Public/alba/Document_Library/Sample-document.docx',
        Type: 'File',
        Icon: 'word',
    }
]

storiesOf('ListControls', module).addDecorator(withKnobs).addDecorator(withInfo()).addDecorator(checkA11y)
    .add("ContentList",
        withMarkdownNotes(contentListNotes)
            (() => (
                <ContentList
                    items={items}
                    schema={customSchema.find((s) => s.ContentTypeName === 'GenericContent')}
                    icons={icons}
                    fieldsToDisplay={array('Fields to display', ['DisplayName', 'Locked', 'ModificationDate', 'Actions'])}
                    orderBy={text('Order by', 'DisplayName')}
                    orderDirection={select('Order direction', orderDirectionOptions, 'asc')}
                    displayRowCheckbox={boolean('Display checkbox for selection', true)}
                    onItemClick={action('item clicked')}
                    onItemDoubleClick={action('item double-clicked')}
                    onItemTap={action('item tapped')}
                    onItemContextMenu={action('item right-clicked')}
                    onRequestActionsMenu={action('actionmenu-button clicked')}
                    onRequestOrderChange={action('ordering is changed')}
                    onRequestSelectionChange={action('selection is changed')}
                    onRequestActiveItemChange={action('active item is changed')}
                    onAction={action('an action is requested')}
                />
            )),
    )