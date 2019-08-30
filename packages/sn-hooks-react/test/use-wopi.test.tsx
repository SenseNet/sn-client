import React from 'react'
import { shallow } from 'enzyme'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { useWopi } from '../src/hooks'

const WopiDump: React.FC<{ content: GenericContent }> = ({ content }) => {
  const i = useWopi(content)
  return <div>{JSON.stringify(i)}</div>
}

describe('Wopi', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<WopiDump content={{ Id: 1, Path: '', Type: 'File', Name: 'aaa.txt' }} />)).toMatchSnapshot()
  })

  it('Should allow edit based on available action', () => {
    expect(
      shallow(
        <WopiDump
          content={{
            Id: 1,
            Path: '',
            Type: 'File',
            Name: 'aaa.txt',
            Actions: [{ Name: 'WopiOpenEdit' } as ActionModel],
          }}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('Should allow view based on available action', () => {
    expect(
      shallow(
        <WopiDump
          content={{
            Id: 1,
            Path: '',
            Type: 'File',
            Name: 'aaa.txt',
            Actions: [{ Name: 'WopiOpenView' } as ActionModel],
          }}
        />,
      ),
    ).toMatchSnapshot()
  })
})
