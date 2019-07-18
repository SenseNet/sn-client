import React from 'react'
import { Repository } from '@sensenet/client-core'
import { GenericContent, VersioningMode } from '@sensenet/default-content-types'
import { shallow } from 'enzyme'
import { EditView } from '../src/viewcontrols'
import { CheckboxGroup } from '../src/fieldcontrols'
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

describe('Edit view component', () => {
  it('should render all components', () => {
    const wrapper = shallow(<EditView repository={testRepository} content={testFile}></EditView>)
    expect(json(wrapper)).toMatchSnapshot()
  })
  it('should handle change', () => {
    const submitCallback = jest.fn()
    const onSubmit = jest.fn()
    const wrapper = shallow(
      <EditView
        repository={testRepository}
        submitCallback={submitCallback}
        onSubmit={onSubmit}
        content={testFile}></EditView>,
    )
    const onChange = wrapper
      .find(CheckboxGroup)
      .first()
      .prop('fieldOnChange')
    onChange && onChange('VersioningMode', VersioningMode.Option1)
    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
    expect(onSubmit).toBeCalledWith(testFile.Id, { VersioningMode: '1' })
    expect(submitCallback).toBeCalled()
  })
})
