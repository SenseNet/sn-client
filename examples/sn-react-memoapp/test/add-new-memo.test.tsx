import React from 'react'
import { shallow } from 'enzyme'
import { Fab, TextField } from '@material-ui/core'
import { AddNew } from '../src/components/add-new-memo'

describe('The new memo panel instance', () => {
  const addnewprops = {
    show: true,
    onCreate: jest.fn(),
    onClose: jest.fn(),
  }

  it('should be rendered correctly', () => {
    expect(shallow(<AddNew {...addnewprops} />)).toMatchSnapshot()
  })

  it('clears inputs after submit', () => {
    const wrapper = shallow(<AddNew {...addnewprops} />)
    const getTextFieldAt = (at: number) => wrapper.find(TextField).at(at)
    const title = 'New memo title'
    const description = 'New memo description'
    ;(getTextFieldAt(0).prop('onChange') as any)({ target: { value: title } })
    ;(getTextFieldAt(1).prop('onChange') as any)({ target: { value: description } })

    expect(getTextFieldAt(0).prop('value')).toEqual(title)
    expect(getTextFieldAt(1).prop('value')).toEqual(description)

    wrapper
      .find(Fab)
      .first()
      .simulate('click')

    expect(addnewprops.onCreate).toBeCalledWith({ DisplayName: title, Description: description })

    expect(getTextFieldAt(0).prop('value')).toEqual('')
    expect(getTextFieldAt(1).prop('value')).toEqual('')
  })
})
