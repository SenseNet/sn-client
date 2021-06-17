/* eslint-disable no-irregular-whitespace */

import { Editor } from '@sensenet/editor-react'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import { mount, shallow } from 'enzyme'
import React, { FC, useEffect, useState } from 'react'
import { act } from 'react-dom/test-utils'
import { defaultLocalization, RichTextEditor } from '../src/fieldcontrols'

// The test must wait for React.lazy to resolve
const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve))
    wrapper.update()
  })
}

beforeAll(() => {
  // React lazy and Suspense are not supported by server-side rendering, so it must be mocked
  // https://stackoverflow.com/a/65751177
  jest.mock('react', () => {
    const react = jest.requireActual('react')
    const Suspense = ({ children }) => {
      return children
    }

    const lazy = jest.fn().mockImplementation((fn) => {
      const Component: FC = (props) => {
        type DefaultExportedFC = { default: FC }
        const [C, setC] = useState<DefaultExportedFC>()

        useEffect(() => {
          fn().then((v: DefaultExportedFC) => {
            setC(v)
          })
        }, [])

        return C ? <C.default {...props} /> : null
      }

      return Component
    })

    return {
      ...react,
      lazy,
      Suspense,
    }
  })
})

describe('Rich text editor field control', () => {
  const defaultSettings = {
    Name: 'Description',
    Type: 'LongTextFieldSetting',
    DisplayName: 'Description of the field',
    FieldClassName: 'SenseNet.ContentRepository.Fields.LongTextField',
  }
  describe('in browse view', () => {
    it('should show the displayname and fieldValue when fieldValue is provided', () => {
      const value = '<h1>Hello World</h1>'
      const wrapper = shallow(<RichTextEditor fieldValue={value} actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).text()).toBe(defaultSettings.DisplayName)
      expect(wrapper.find('div').last().html()).toBe(`<div>${value}</div>`)
      expect(wrapper).toMatchSnapshot()
    })
    it('should show no value message when field value is not provided', () => {
      const wrapper = shallow(<RichTextEditor actionName="browse" settings={defaultSettings} />)
      expect(wrapper.find(Typography).last().text()).toBe(defaultLocalization.richTextEditor.noValue)
    })
  })
  describe('in edit/new view', () => {
    it('should set all the props', async () => {
      const value = 'Hello World'
      const wrapper = mount(
        <RichTextEditor
          fieldValue={value}
          actionName="edit"
          settings={{
            ...defaultSettings,
            ReadOnly: true,
            Compulsory: true,
            Description: 'description',
          }}
        />,
      )
      await waitForComponentToPaint(wrapper)

      expect(wrapper.find(Editor).prop('content')).toBe(value)
      expect(wrapper.find(Editor).prop('placeholder')).toBe(defaultSettings.DisplayName)
      expect(wrapper.find(Editor).prop('readOnly')).toBeTruthy()
      expect(wrapper.find(InputLabel).text()).toBe(`${defaultSettings.DisplayName} *`)
      expect(wrapper.find(InputLabel).prop('required')).toBeTruthy()
      expect(wrapper.find(FormHelperText).text()).toBe('description')
    })

    it('should set default value', async () => {
      const wrapper = mount(
        <RichTextEditor
          actionName="new"
          settings={{
            ...defaultSettings,
            DefaultValue: 'defaultValue',
          }}
        />,
      )
      await waitForComponentToPaint(wrapper)

      expect(wrapper.find(Editor).prop('content')).toBe('defaultValue')
    })
  })
})
