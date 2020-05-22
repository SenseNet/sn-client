import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import { mount } from 'enzyme'
import { ConfirmationDialog, DeleteButton, DeleteButtonProps } from '../src/components'
import { DocumentViewerApiSettingsContext } from '../src/context/api-settings'
import { DocumentViewerApiSettings } from '../src/models'
import { defaultSettings } from './__Mocks__/viewercontext'

describe('Delete comment button component', () => {
  const defaultProps: DeleteButtonProps = {
    comment: {
      createdBy: {
        id: 123,
        avatarUrl: 'https://google.com',
        displayName: 'E',
        path: '/Root/IMS/Public/E',
        userName: 'E',
      },
      id: '1',
      page: 1,
      text: 'alma',
      x: 0,
      y: 0,
    },
  }

  it('should open a confirmation dialog when clicked', () => {
    const wrapper = mount(<DeleteButton {...defaultProps} />)
    wrapper.find(Button).simulate('click')
    expect(wrapper.find(Dialog).prop('open')).toBeTruthy()
  })

  it('should call delete comment when confirmation comes back false', () => {
    const currentSettings: DocumentViewerApiSettings = {
      ...defaultSettings,
      commentActions: { ...defaultSettings.commentActions, deletePreviewComment: jest.fn() },
    }
    const wrapper = mount(
      <DocumentViewerApiSettingsContext.Provider value={currentSettings}>
        <DeleteButton {...defaultProps} />
      </DocumentViewerApiSettingsContext.Provider>,
    )
    wrapper.find(ConfirmationDialog).prop('onClose')(false)
    expect(currentSettings.commentActions.deletePreviewComment).toBeCalled()
  })

  it("shouldn't call delete comment when confirmation comes back true and closes dialog", () => {
    const currentSettings: DocumentViewerApiSettings = {
      ...defaultSettings,
      commentActions: { ...defaultSettings.commentActions, deletePreviewComment: jest.fn() },
    }
    const wrapper = mount(
      <DocumentViewerApiSettingsContext.Provider value={currentSettings}>
        <DeleteButton {...defaultProps} />
      </DocumentViewerApiSettingsContext.Provider>,
    )
    wrapper.find(ConfirmationDialog).prop('onClose')(true)
    expect(currentSettings.commentActions.deletePreviewComment).not.toBeCalled()
    expect(wrapper.find(Dialog).prop('open')).toBeFalsy()
  })
})
