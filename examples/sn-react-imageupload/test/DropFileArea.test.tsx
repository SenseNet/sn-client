import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { RepositoryContext } from '@sensenet/hooks-react'
import { DropFileArea } from '../src/components/DropFileArea'

Object.defineProperty(window, 'DragEvent', {
  value: class DragEvent {},
})

describe('DropFileArea', () => {
  const testprop = {
    uploadsetdata: jest.fn(),
    notificationControll: jest.fn(),
    uploadPath: 'string',
    style: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    setDragOver: jest.fn(),
    isDragOver: false,
  }
  it('Matches snapshot', () => {
    const wrapper = shallow(<DropFileArea {...testprop} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should set setDragOver on DragEnter', () => {
    const wrapper = mount(<DropFileArea {...testprop} />)
    act(() => {
      wrapper.find('.dropfilearea').prop('onDragEnter')!({
        stopPropagation: () => undefined,
        preventDefault: () => undefined,
      } as any)
    })

    expect(testprop.setDragOver).toBeCalledWith(true)
  })
  it('should set setDragOver on DragLeave', () => {
    const wrapper = mount(<DropFileArea {...testprop} />)
    act(() => {
      wrapper.find('.dropfilearea').prop('onDragLeave')!({
        stopPropagation: () => undefined,
        preventDefault: () => undefined,
      } as any)
    })

    expect(testprop.setDragOver).toBeCalledWith(false)
  })
  it('should set setDragOver on DragOver', () => {
    const wrapper = mount(<DropFileArea {...testprop} />)
    act(() => {
      wrapper.find('.dropfilearea').prop('onDragOver')!({
        stopPropagation: () => undefined,
        preventDefault: () => undefined,
      } as any)
    })

    expect(testprop.setDragOver).toBeCalledWith(true)
  })
  it('should set setDragOver and start Upload on Drop', async () => {
    const repository = {
      upload: {
        fromDropEvent: jest.fn(),
      },
    }

    const wrapper = mount(
      <RepositoryContext.Provider value={repository as any}>
        <DropFileArea {...testprop} />
      </RepositoryContext.Provider>,
    )
    await act(async () => {
      wrapper.find('.dropfilearea').prop('onDrop')!({
        stopPropagation: () => undefined,
        preventDefault: () => undefined,
      } as any)
    })

    expect(testprop.setDragOver).toBeCalledWith(false)
    expect(repository.upload.fromDropEvent).toBeCalled()
    expect(testprop.uploadsetdata).toBeCalled()
    expect(testprop.notificationControll).toBeCalled()
  })
})
