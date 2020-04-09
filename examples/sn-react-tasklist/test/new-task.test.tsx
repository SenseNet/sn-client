import { mount, shallow } from 'enzyme'
import React from 'react'
import { RepositoryContext } from '@sensenet/hooks-react'
import { act } from 'react-dom/test-utils'
import { TextField } from '@material-ui/core'
import { Repository } from '@sensenet/client-core'
import NewTaskPanel from '../src/components/new-task'
import { TestContentCollection } from './_mocks_/test_contents'

describe('The app layout instance', () => {
  let wrapper: any
  let repo: any
  const TodoItems = {
    data: TestContentCollection,
    setData: jest.fn(),
  }
  beforeEach(() => {
    repo = new Repository()
    repo.post = function postMethod() {
      return Promise.resolve({ d: { results: TestContentCollection[0] } } as any)
    }
  })
  it('should be rendered correctly', () => {
    expect(shallow(<NewTaskPanel {...(TodoItems as any)} />)).toMatchSnapshot()
  })
  it('should create a new form', async () => {
    const createtastkfunction = jest.fn()
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <NewTaskPanel {...(TodoItems as any)} />
        </RepositoryContext.Provider>,
      )
    })
    act(() => {
      wrapper.update().find(NewTaskPanel).find('form').prop('onSubmit')({
        preventDefault: () => undefined,
        createtastkfunction: createtastkfunction('newTaskName'),
      } as any)
    })
    expect(createtastkfunction).toBeCalledWith('newTaskName')
  })
  it('should change the name of the new task', async () => {
    const testevent = {
      target: {
        value: 'new test task name',
      },
    }
    act(() => {
      wrapper = shallow(<NewTaskPanel {...(TodoItems as any)} />)
    })
    act(() => {
      wrapper.update().find(TextField).prop('onChange')(testevent)
    })
    expect(wrapper.update().find(TextField).prop('value')).toBe('new test task name')
  })
})
