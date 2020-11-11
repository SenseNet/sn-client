import { IconButton, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ThemeProvider } from 'styled-components'
import { defaultViewerState, DocumentDataProvider, DocumentViewerApiSettingsContext, ViewerStateContext } from '../src'
import { CreateComment, CreateCommentProps } from '../src/components'
import { CommentStateContext, CommentStateProvider, defaultCommentState } from '../src/context/comment-states'
import { defaultTheme } from '../src/models'
import { defaultSettings, examplePreviewComment } from './__Mocks__/viewercontext'

const emptyDocumentData = {
  documentName: '',
  documentType: '',
  error: undefined,
  fileSizekB: 0,
  hostName: '',
  idOrPath: 0,
  pageCount: -1,
  shapes: {
    annotations: [],
    highlights: [],
    redactions: [],
  },
}

describe('Create comment component', () => {
  const defaultProps: CreateCommentProps = {
    localization: {
      addComment: 'addComment',
      commentInputPlaceholder: 'commentInputPlaceholder',
      submit: 'submit',
      inputRequiredError: 'inputRequiredError',
      markerRequiredError: 'markerRequiredError',
      markerTooltip: 'markerTooltip',
      cancelButton: 'cancel',
    },
  }

  it('should show add comment button when not active', () => {
    const wrapper = mount(<CreateComment {...defaultProps} />, {
      wrappingComponent: ThemeProvider,
      wrappingComponentProps: { theme: defaultTheme },
    })
    expect(wrapper.find(Button).exists()).toBeTruthy()
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(Button).text()).toBe('addComment')
  })

  it('should change the state of isCreateCommentActive in viewer-state provider when add comment button is clicked', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          updateState,
        }}>
        <CreateComment {...defaultProps} />
      </ViewerStateContext.Provider>,
      {
        wrappingComponent: ThemeProvider,
        wrappingComponentProps: { theme: defaultTheme },
      },
    )
    wrapper.find(Button).simulate('click')
    expect(updateState).toBeCalledWith({ isCreateCommentActive: true })
  })

  it('should add comment when submit button is clicked', () => {
    const updateState = jest.fn()
    const addPreviewComment = jest.fn()
    const wrapper = mount(
      <DocumentViewerApiSettingsContext.Provider
        value={{
          ...defaultSettings,
          commentActions: {
            addPreviewComment,
            deletePreviewComment: async () => {
              return { modified: true }
            },
            getPreviewComments: async () => [examplePreviewComment],
          },
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            isCreateCommentActive: true,
            updateState,
          }}>
          <CommentStateContext.Provider
            value={{
              ...defaultCommentState,
              draft: {
                id: 'asd',
                x: '1',
                y: '2',
                page: 1,
              },
            }}>
            <CreateComment {...defaultProps} />
          </CommentStateContext.Provider>
        </ViewerStateContext.Provider>
      </DocumentViewerApiSettingsContext.Provider>,
    )

    expect(wrapper.find(Button).first().text()).toBe('submit')

    act(() => {
      wrapper
        .find(TextField)
        .props()
        .onChange({ target: { value: 'Hello' } } as any)
    })
    wrapper.find(Button).first().simulate('submit')

    expect(updateState).toBeCalledWith({ isPlacingCommentMarker: false })
    expect(addPreviewComment).toBeCalledWith({
      abortController: new AbortController(),
      comment: {
        id: 'asd',
        x: '1',
        y: '2',
        page: 1,
        text: 'Hello',
      },
      document: emptyDocumentData,
    })
  })

  it('should clear everything after submitted', () => {
    const updateState = jest.fn()
    const setDraft = jest.fn()

    const wrapper = mount(
      <DocumentViewerApiSettingsContext.Provider
        value={{
          ...defaultSettings,
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            isCreateCommentActive: true,
            updateState,
          }}>
          <CommentStateContext.Provider
            value={{
              ...defaultCommentState,
              draft: {
                id: 'asd',
                x: '1',
                y: '2',
                page: 1,
              },
              setDraft,
            }}>
            <CreateComment {...defaultProps} />
          </CommentStateContext.Provider>
        </ViewerStateContext.Provider>
      </DocumentViewerApiSettingsContext.Provider>,
    )

    act(() => {
      wrapper
        .find(TextField)
        .props()
        .onChange({ target: { value: 'Hello' } } as any)
    })
    wrapper.find(Button).first().simulate('submit')

    expect(updateState).toBeCalledWith({ isCreateCommentActive: false })
    expect(setDraft).toBeCalledWith(undefined)
  })

  it('should clear input value when cancel clicked', () => {
    const updateState = jest.fn()
    const setDraft = jest.fn()

    const wrapper = mount(
      <DocumentViewerApiSettingsContext.Provider
        value={{
          ...defaultSettings,
        }}>
        <ViewerStateContext.Provider
          value={{
            ...defaultViewerState,
            isCreateCommentActive: true,
            updateState,
          }}>
          <CommentStateContext.Provider
            value={{
              ...defaultCommentState,
              setDraft,
            }}>
            <CreateComment {...defaultProps} />
          </CommentStateContext.Provider>
        </ViewerStateContext.Provider>
      </DocumentViewerApiSettingsContext.Provider>,
    )

    expect(wrapper.find(Button).last().text()).toBe('cancel')
    wrapper.find(Button).last().simulate('click')

    expect(updateState).toBeCalledWith({ isCreateCommentActive: false })
    expect(setDraft).toBeCalledWith(undefined)
  })

  it('should give an error message when input is empty', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          isCreateCommentActive: true,
        }}>
        <CreateComment {...defaultProps} />
      </ViewerStateContext.Provider>,
    )
    wrapper.find(Button).first().simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultProps.localization.inputRequiredError)
  })

  it('should give an error message when input is filled but draftCommentMarker is undefined', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          isCreateCommentActive: true,
        }}>
        <CreateComment {...defaultProps} />
      </ViewerStateContext.Provider>,
    )

    act(() => {
      wrapper
        .find(TextField)
        .props()
        .onChange({ target: { value: 'Hello' } } as any)
    })
    wrapper.find(Button).first().simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultProps.localization.markerRequiredError)
  })

  it('should change the state of isPlacingCommentMarker in viewer-state provider when marker button is clicked', () => {
    const updateState = jest.fn()

    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          isCreateCommentActive: true,
          updateState,
        }}>
        <CommentStateContext.Provider
          value={{
            ...defaultCommentState,
          }}>
          <CreateComment {...defaultProps} />
        </CommentStateContext.Provider>
      </ViewerStateContext.Provider>,
    )

    wrapper.find(IconButton).simulate('click')
    expect(updateState).toBeCalledWith({ isPlacingCommentMarker: true })
  })
})
