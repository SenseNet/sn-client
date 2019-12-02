import React from 'react'
import { RepositoryContext } from '@sensenet/hooks-react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import TodoListPanel from '../src/components/todo-list'
import { TestContentCollection } from './_mocks_/test_contents'

describe('The todo list component layout instance', () => {
  let wrapper: any
  let repo: any

  beforeEach(() => {
    window.fetch = function fetchMethod() {
      return Promise.resolve({ d: TestContentCollection } as any)
    }
    repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestContentCollection } } as any)
    }
    repo.load = function loadMethod() {
      return Promise.resolve({ d: { results: TestContentCollection } } as any)
    }
  })

  it('should be rendered correctly', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <TodoListPanel />
        </RepositoryContext.Provider>,
      )
    })

    expect(wrapper.update()).toMatchSnapshot()
  })
})
