import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { withInfo } from "@storybook/addon-info";
import { checkA11y } from '@storybook/addon-a11y'

import { Repository } from '@sensenet/client-core'
import { File, Folder } from "@sensenet/default-content-types";
import { customSchema } from '../src/schema'
import { Reducers } from '@sensenet/redux'

import { EditView, NewView, BrowseView } from "../src/components/controls-react";
import { combineReducers, createStore } from "redux";

export const testSchema = {}

export const testRepository = new Repository({
    repositoryUrl: 'someurl',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'] as any,
    schemas: customSchema,
    sessionLifetime: 'expiration'
})
export const testFieldsOfAContent = {}
export const testFolder = {
    Id: 1,
    Name: 'LoremIpsum',
    DisplayName: 'Lorem Ipsum',
} as Folder

export const testFile = {
    Id: 1,
    Name: 'LoremIpsum.docx',
    DisplayName: 'LoremIpsum.docx',
    Path: '/Root/Profiles/MyProfile/DocumentLibrary',
    Watermark: 'sensenet',
    Type: 'File',
    Index: 42,
    Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.'
} as File

const sensenet = Reducers.sensenet
export const testStore = createStore(combineReducers({ sensenet }))

addDecorator(muiTheme())

storiesOf("ViewControls", module).addDecorator(withKnobs).addDecorator(checkA11y).addDecorator(withInfo())
    .add(
        "new view", withNotes(`A Content can be presented in 3 different modes depending on whether the Content is to be edited, to be browsed or to be created. Different Content Views can be chosen for the Content according to these 3 main scenarios. The name of the Content Views for the 3 modes is set:`)
            (() => (
                <NewView
                    store={testStore}
                    path='/Root/Profiles/MyProfile/DocumentLibrary'
                    repository={testRepository}
                    contentTypeName='File'
                    title={text('Title', 'File')}
                    extension={text('Extension', 'docx')} />
            )),
    )
    .add(
        "edit view", withNotes(`A Content can be presented in 3 different modes depending on whether the Content is to be edited, to be browsed or to be created. Different Content Views can be chosen for the Content according to these 3 main scenarios. The name of the Content Views for the 3 modes is set:`)
            (() => (
                <EditView
                    content={object('Content', testFile)}
                    repository={testRepository}
                    contentTypeName='File' />
            )),
    )
    .add(
        "browse view", withNotes(`A Content can be presented in 3 different modes depending on whether the Content is to be edited, to be browsed or to be created. Different Content Views can be chosen for the Content according to these 3 main scenarios. The name of the Content Views for the 3 modes is set:`)
            (() => (
                <BrowseView
                    content={object('Content', testFile)}
                    repository={testRepository} />
            ))
    )