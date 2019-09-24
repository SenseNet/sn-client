import TextField from '@material-ui/core/TextField/TextField'
import { sleepAsync } from '@sensenet/client-utils'
import { shallow } from 'enzyme'
import React from 'react'
import { PagerWidget } from '../src/components/document-widgets/Pager'

describe('PagerWidget component', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<PagerWidget />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Numeric input should update the active page', async () => {
    const setActivePages = jest.fn()
    const wrapper = shallow(<PagerWidget />)
    const changeValue = (value: number | string) =>
      wrapper.find(TextField).prop('onChange')!({ currentTarget: { value } } as any)
    const getValue = () => wrapper.find(TextField).props().value
    changeValue(5)
    await sleepAsync()
    expect(setActivePages).toHaveBeenCalled()
    expect(getValue()).toBe(5)

    // NaN
    changeValue('somestring')
    await sleepAsync()
    expect(getValue()).toBe(5)

    // limit min
    changeValue(-5)
    await sleepAsync()
    expect(setActivePages).toHaveBeenCalledTimes(2)
    expect(getValue()).toBe(1)

    // limit max
    changeValue(100)
    await sleepAsync()
    expect(setActivePages).toHaveBeenCalledTimes(3)
    expect(getValue()).toBe(10)
  })

  it('First page should jump to page 1', async () => {
    const wrapper = shallow(<PagerWidget />)
    wrapper.find('#FirstPage').simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(1)
  })

  it('NavigateBefore should jump a page back', async () => {
    const wrapper = shallow(<PagerWidget />)
    wrapper.find('#NavigateBefore').simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(4)
  })

  it('NavigateNext should jump to the next page', async () => {
    const wrapper = shallow(<PagerWidget />)
    wrapper.find('#NavigateNext').simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(6)
  })

  it('Last page should jump to page 10', async () => {
    const wrapper = shallow(<PagerWidget />)
    wrapper.find('#LastPage').simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(10)
  })
})
