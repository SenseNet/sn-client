import { shallow } from 'enzyme'
import React from 'react'
import { EditPropertiesDialog } from '../src/components/edit-dialog'
import { CalendarTestEvent, MaterialDialogProps } from './mocks/test-objects'

describe('EditPropertiesDialog', () => {
  const testprops = {
    dialogProps: MaterialDialogProps,
    content: CalendarTestEvent,
  }

  it('EditPropertiesDialog snapshot', () => {
    const wrapper = shallow(<EditPropertiesDialog {...(testprops as any)} />)
    expect(wrapper).toMatchSnapshot()
  })
})
