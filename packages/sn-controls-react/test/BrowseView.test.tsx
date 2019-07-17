import React from 'react'
import { Repository } from '@sensenet/client-core'
import { GenericContent, VersioningMode } from '@sensenet/default-content-types'
import { shallow } from 'enzyme'
import { BrowseView } from '../src/viewcontrols/BrowseView'
import { schema } from './__mocks__/schema'
import { json } from './__mocks__/snapshotSerializer'

export const testRepository = new Repository({
  repositoryUrl: 'https://devservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'],
  schemas: schema,
  sessionLifetime: 'expiration',
})

export const testFile: GenericContent = {
  Id: 1,
  Name: 'Sample-document.docx',
  DisplayName: 'Sample-document.docx',
  Path: '/Root/Profiles/Public/alba/Document_Library/Sample-document.docx',
  Type: 'File',
  Index: 42,
  VersioningMode: [VersioningMode.Option0],
  AllowedChildTypes: [1, 2],
  Description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
}

describe('Browse view component', () => {
  it('should render all the controls for Generic content', () => {
    const wrapper = shallow(<BrowseView content={testFile} repository={testRepository}></BrowseView>)
    expect(json(wrapper)).toMatchSnapshot()
  })
})
