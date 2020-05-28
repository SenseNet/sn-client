import { RepositoryContext } from '@sensenet/hooks-react'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { UploadControll } from '../src/components/UploadControll'

describe('UploadControll', () => {
  const testprop = {
    uploadsetdata: jest.fn(),
    notificationControll: jest.fn(),
  }
  it('Matches snapshot', () => {
    const wrapper = shallow(<UploadControll {...testprop} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should start the Upload function', async () => {
    const repository = {
      upload: {
        fromFileList: jest.fn(),
      },
    }
    const wrapper = mount(
      <RepositoryContext.Provider value={repository as any}>
        <UploadControll {...testprop} />
      </RepositoryContext.Provider>,
    )
    await act(async () => {
      wrapper.find('input').simulate('change')
    })
    expect(repository.upload.fromFileList).toBeCalled()
    expect(testprop.uploadsetdata).toBeCalled()
    expect(testprop.notificationControll).toBeCalled()
  })
})
