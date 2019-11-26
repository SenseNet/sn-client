import { mount, shallow } from 'enzyme'
import React from 'react'
import Fab from '@material-ui/core/Fab'
import AddNewEvent from '../src/components/add-new-event'
import { SharedContext } from '../src/context/shared-context'


describe('Add new event component', () => {
  it('Snapshot', () => {
    const wrapper = shallow(<AddNewEvent />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Open modal', () => {
    const openmodfn = jest.fn()
    const wrapper = mount(
      <SharedContext.Provider value={{ setOpennewmodal: openmodfn } as any}>
        <AddNewEvent />
      </SharedContext.Provider>,
    )
    wrapper.find(Fab).simulate('click')
    expect(openmodfn).toBeCalledWith(true)
  })
})
