import TextField from '@material-ui/core/TextField/TextField'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import NavigateNext from '@material-ui/icons/NavigateNext'
import { sleepAsync } from '@sensenet/client-utils'
import { shallow } from 'enzyme'
import React from 'react'
import { PagerComponent } from '../src/components/document-widgets/Pager'

describe('PagerWidget component', () => {
  const local = {
    firstPage: 'firstpage',
    lastPage: 'lastpage',
    gotoPage: 'gotopage',
    previousPage: 'previouspage',
    nextPage: 'nextpage',
  }
  it('Should render without crashing', () => {
    const wrapper = shallow(<PagerComponent activePages={[1]} pageCount={10} setActivePages={jest.fn()} {...local} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Numeric input should update the active page', async () => {
    const setActivePages = jest.fn()
    const wrapper = shallow(
      <PagerComponent activePages={[1]} pageCount={10} setActivePages={setActivePages} {...local} />,
    )
    const changeValue = (value: number | string) =>
      wrapper.find(TextField).prop('onChange')({ currentTarget: { value } })
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
    const wrapper = shallow(<PagerComponent activePages={[5]} pageCount={10} setActivePages={jest.fn()} {...local} />)
    wrapper.find(FirstPage).simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(1)
  })

  it('NavigateBefore should jump a page back', async () => {
    const wrapper = shallow(<PagerComponent activePages={[5]} pageCount={10} setActivePages={jest.fn()} {...local} />)
    wrapper.find(NavigateBefore).simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(4)
  })

  it('NavigateNext should jump to the next page', async () => {
    const wrapper = shallow(<PagerComponent activePages={[5]} pageCount={10} setActivePages={jest.fn()} {...local} />)
    wrapper.find(NavigateNext).simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(6)
  })

  it('Last page should jump to page 10', async () => {
    const wrapper = shallow(<PagerComponent activePages={[5]} pageCount={10} setActivePages={jest.fn()} {...local} />)
    wrapper.find(LastPage).simulate('click')
    await sleepAsync()
    expect(wrapper.find(TextField).props().value).toBe(10)
  })
})
