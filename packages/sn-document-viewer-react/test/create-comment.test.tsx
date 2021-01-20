import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton/IconButton'
import TextField from '@material-ui/core/TextField/TextField'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ThemeProvider } from 'styled-components'
import { defaultLocalization, defaultViewerState, DocumentViewerApiSettingsContext, ViewerStateContext } from '../src'
import { CreateComment } from '../src/components'
import { CommentStateContext, defaultCommentState } from '../src/context/comment-states'
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
  it('should show add comment button when not active', () => {
    const wrapper = mount(<CreateComment />, {
      wrappingComponent: ThemeProvider,
      wrappingComponentProps: { theme: defaultTheme },
    })
    expect(wrapper.find(Button).exists()).toBeTruthy()
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(Button).text()).toBe('+ Add Comment')
  })

  it('should change the state of isCreateCommentActive in viewer-state provider when add comment button is clicked', () => {
    const updateState = jest.fn()
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          updateState,
        }}>
        <CreateComment />
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
            <CreateComment />
          </CommentStateContext.Provider>
        </ViewerStateContext.Provider>
      </DocumentViewerApiSettingsContext.Provider>,
    )

    expect(wrapper.find(Button).first().text()).toBe('Submit')

    act(() => {
      wrapper
        .find(TextField)
        .props()
        .onChange({ target: { value: 'Hello' } } as any)
    })
    wrapper.find(Button).first().simulate('submit')

    expect(updateState).toBeCalledWith({ isCreateCommentActive: false, isPlacingCommentMarker: false })
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
            <CreateComment />
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

    expect(updateState).toBeCalledWith({ isCreateCommentActive: false, isPlacingCommentMarker: false })
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
            <CreateComment />
          </CommentStateContext.Provider>
        </ViewerStateContext.Provider>
      </DocumentViewerApiSettingsContext.Provider>,
    )

    expect(wrapper.find(Button).last().text()).toBe('Cancel')
    wrapper.find(Button).last().simulate('click')

    expect(updateState).toBeCalledWith({ isCreateCommentActive: false, isPlacingCommentMarker: false })
    expect(setDraft).toBeCalledWith(undefined)
  })

  it('should give an error message when input is empty', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          isCreateCommentActive: true,
        }}>
        <CreateComment />
      </ViewerStateContext.Provider>,
    )
    wrapper.find(Button).first().simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultLocalization.inputRequiredError)
  })

  it('should give an error message when input is filled but draftCommentMarker is undefined', () => {
    const wrapper = mount(
      <ViewerStateContext.Provider
        value={{
          ...defaultViewerState,
          isCreateCommentActive: true,
        }}>
        <CreateComment />
      </ViewerStateContext.Provider>,
    )

    act(() => {
      wrapper
        .find(TextField)
        .props()
        .onChange({ target: { value: 'Hello' } } as any)
    })
    wrapper.find(Button).first().simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultLocalization.markerRequiredError)
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
          <CreateComment />
        </CommentStateContext.Provider>
      </ViewerStateContext.Provider>,
    )

    wrapper.find(IconButton).simulate('click')
    expect(updateState).toBeCalledWith({ isPlacingCommentMarker: true })
  })
})
