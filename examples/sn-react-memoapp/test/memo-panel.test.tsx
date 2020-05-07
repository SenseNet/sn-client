import { mount } from 'enzyme'
import React from 'react'
import { Repository } from '@sensenet/client-core'
import { act } from 'react-dom/test-utils'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import { Fab, TextField } from '@material-ui/core'
import { RepositoryContext } from '@sensenet/hooks-react'
import { MemoPanel } from '../src/components/memo-panel'
import { AddNew } from '../src/components/add-new-memo'
import { TestMemoCollection, TestNewMemo } from './mocks/test-objects'

describe('The main memo panel instance', () => {
  let wrapper: any
  let repo: any

  beforeEach(() => {
    window.fetch = function fetchMethod() {
      return Promise.resolve({ d: TestMemoCollection } as any)
    }
    repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestMemoCollection } } as any)
    }
  })

  it('should render memo list when initialized', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MemoPanel />
        </RepositoryContext.Provider>,
      )
    })

    const memoListElement = wrapper.update().find('div.MuiExpansionPanelSummary-content p').at(0)
    expect(memoListElement.text()).toContain(TestMemoCollection[0].DisplayName)
  })

  it('should add new memo to list', async () => {
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestMemoCollection } } as any)
    }
    repo.post = function post() {
      return Promise.resolve({ d: TestNewMemo, ok: true } as any)
    }

    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MemoPanel />
        </RepositoryContext.Provider>,
      )
    })

    await act(async () => {
      ;(wrapper.update().find(AddNew).prop('onCreate') as any)(TestNewMemo)
    })

    const memoListElement = wrapper.update().find('div.MuiExpansionPanelSummary-content').at(0)

    expect(memoListElement.text()).toContain(TestNewMemo.DisplayName)
  })

  it('should remove memo from the list', async () => {
    repo.post = function post() {
      return Promise.resolve({ d: TestNewMemo, ok: true } as any)
    }
    repo.delete = jest.fn()

    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MemoPanel />
        </RepositoryContext.Provider>,
      )
    })

    act(() => {
      ;(wrapper.update().find(Fab).at(3).prop('onClick') as any)(TestMemoCollection[0])
    })

    const yesbtn = wrapper.update().find('div.MuiDialogActions-root button').at(0)

    expect(wrapper.find('div.MuiPaper-root')).toHaveLength(4)
    await act(async () => {
      yesbtn.simulate('click')
    })

    expect(wrapper.update().find('div.MuiPaper-root')).toHaveLength(3)
  })

  it('should modify memo', async () => {
    repo.patch = function patch() {
      return Promise.resolve({ d: { ...TestNewMemo, Description: 'Modified memo' }, ok: true } as any)
    }
    repo.delete = jest.fn()

    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MemoPanel />
        </RepositoryContext.Provider>,
      )
    })

    act(() => {
      ;(wrapper.update().find(ExpansionPanel).first().prop('onChange') as any)(TestMemoCollection[0])
    })

    act(() => {
      wrapper.find(`svg[data-icon="edit"]`).at(0).simulate('click')
    })

    expect(wrapper.update().find('button').at(2).hasClass('makeStyles-hidden-2')).toBeTruthy()

    const textfield = wrapper.find(TextField).at(2)
    act(() => {
      ;(textfield.prop('onChange') as any)({ target: { value: 'This is a modified memo' } })
    })

    const savebtn = wrapper.find('button[aria-label="Save"]').at(0)

    await act(async () => {
      savebtn.simulate('click')
    })

    expect(wrapper.update().find(TextField).at(2).text()).toEqual('This is a modified memo')
  })
})
