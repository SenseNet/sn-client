import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { RepositoryContext } from '@sensenet/hooks-react'
import { Repository } from '@sensenet/client-core'
import Button from '@material-ui/core/Button'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import { Dialog, FormHelperText, Select, TextField } from '@material-ui/core'
import MaterialTextField from '@material-ui/core/TextField'
import { AdvancedSearch } from '@sensenet/search-react'
import UserSearchPanel from '../src/components/user-search'
import { TestUserList } from './_mocks_/test_contents'

describe('The user search component instance', () => {
  let wrapper: any
  let repo: any

  beforeEach(() => {
    repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestUserList } } as any)
    }
  })

  it('should be rendered correctly', () => {
    const l = shallow(<UserSearchPanel />)
    expect(l).toMatchSnapshot()
  })

  it('should search and list users on click event', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const searchbtn = wrapper.update().find(Button)
    await act(async () => {
      ;(searchbtn.prop('onClick') as any)()
    })

    const TableRows = wrapper
      .update()
      .find(TableBody)
      .find(TableRow)

    expect(TableRows.length).toEqual(TestUserList.length)
  })

  it('should search and list users on submit', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const formpanel = wrapper.update().find('form')
    await act(async () => {
      ;(formpanel.prop('onSubmit') as any)({ preventDefault: jest.fn() })
    })

    const TableRows = wrapper
      .update()
      .find(TableBody)
      .find(TableRow)

    expect(TableRows.length).toEqual(TestUserList.length)
  })

  it('should open modal window', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const formpanel = wrapper.update().find('form')
    await act(async () => {
      ;(formpanel.prop('onSubmit') as any)({ preventDefault: jest.fn() })
    })

    act(() => {
      wrapper
        .update()
        .find(TableBody)
        .find(TableRow)
        .at(1)
        .prop('onClick')()
    })
    expect(
      wrapper
        .update()
        .find(Dialog)
        .prop('open'),
    ).toBe(true)
  })
  it('should close modal window when close button is clicked', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const formpanel = wrapper.update().find('form')
    await act(async () => {
      ;(formpanel.prop('onSubmit') as any)({ preventDefault: jest.fn() })
    })
    act(() => {
      wrapper
        .update()
        .find(TableBody)
        .find(TableRow)
        .at(1)
        .prop('onClick')()
    })
    act(() => {
      wrapper
        .update()
        .find(Dialog)
        .prop('onClose')()
    })
    expect(
      wrapper
        .update()
        .find(Dialog)
        .prop('open'),
    ).toBe(false)
  })
  it('should close modal window when OK button is clicked', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const formpanel = wrapper.update().find('form')
    await act(async () => {
      ;(formpanel.prop('onSubmit') as any)({ preventDefault: jest.fn() })
    })
    act(() => {
      wrapper
        .update()
        .find(TableBody)
        .find(TableRow)
        .at(1)
        .prop('onClick')()
    })
    act(() => {
      wrapper
        .update()
        .find(Dialog)
        .find(Button)
        .prop('onClick')()
    })
    expect(
      wrapper
        .update()
        .find(Dialog)
        .prop('open'),
    ).toBe(false)
  })

  it('should change query on field value change', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const advsearchpanel = wrapper.update().find(AdvancedSearch)
    act(() => {
      advsearchpanel.prop('onQueryChanged')("LoginName:'*businesscat*'")
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual("LoginName:'*businesscat*'")
  })

  it('should select an option in the language dropdown and change the query', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const dropdownlang = wrapper.update().find(AdvancedSearch)

    act(() => {
      dropdownlang.prop('onQueryChanged')('English')
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual('English')
  })

  it('should change the selected option in the language dropdown and change the helpertext', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })

    const langpresetfield = wrapper.update().find(Select)

    act(() => {
      langpresetfield.at(0).prop('onChange')({ target: { value: 'English' } })
    })

    const helperText = wrapper
      .update()
      .find(FormHelperText)
      .at(7)
      .find('p')
      .text()

    expect(helperText).toEqual('Language:English')
  })

  it('should change the selected value in the Gender dropdown', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const dropdownlang = wrapper.update().find(AdvancedSearch)

    act(() => {
      dropdownlang.prop('onQueryChanged')('Gender:Female')
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual('Gender:Female')
  })

  it('should change the value of the Gender dropdown and change the helpertext', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })

    const langpresetfield = wrapper.update().find(Select)

    act(() => {
      langpresetfield.at(1).prop('onChange')({ target: { value: 'Female' } })
    })

    const helperText = wrapper
      .update()
      .find(FormHelperText)
      .at(8)
      .find('p')
      .text()

    expect(helperText).toEqual('Gender:Female')
  })

  it('should change the value of the MaritalStatus dropdown', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const dropdownlang = wrapper.update().find(AdvancedSearch)

    act(() => {
      dropdownlang.prop('onQueryChanged')('MaritalStatus:Single')
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual('MaritalStatus:Single')
  })

  it('should clear MaritalStatus value', async () => {
    repo.schemas = {
      getSchemaByName: function schemasfn() {
        return { FieldSettings: [] }
      },
    }

    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const dropdownlang = wrapper.update().find(AdvancedSearch)

    act(() => {
      dropdownlang.prop('onQueryChanged')('MaritalStatus:Single')
    })

    const querytextfield = wrapper
      .update()
      .find(MaterialTextField)
      .find("[label='Full query']")

    expect(querytextfield.at(1).props().value).toEqual('MaritalStatus:Single')
  })

  it('should show helpertext', async () => {
    repo.schemas = {
      getSchemaByName: function schemasfn() {
        return { FieldSettings: [] }
      },
    }

    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo as any}>
          <UserSearchPanel />
        </RepositoryContext.Provider>,
      )
    })
    const textfield = wrapper.update().find(TextField)

    textfield.forEach((element: any, index: number) => {
      if ((element.prop('disabled') === undefined || index === 0) && index !== 5) {
        act(() => {
          element.prop('onChange')({ currentTarget: { value: 'test' } })
        })

        const helperText = wrapper
          .update()
          .find(TextField)
          .at(index)
          .prop('helperText')

        if (index === 0) {
          expect(helperText).toContain(`Type`)
        } else if (element.prop('disabled') === undefined) {
          expect(helperText).toContain(`'*test*'`)
        }
      }
    })
  })
})
