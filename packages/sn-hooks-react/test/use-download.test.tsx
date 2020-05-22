import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { mount } from 'enzyme'
import * as downloadHook from '../src/hooks/use-download'

const DownloadDump: React.FC<{ content: GenericContent }> = ({ content }) => {
  const d = downloadHook.useDownload(content)
  return <div onClick={d.download}>IsFile: {d.isFile}</div>
}

describe('useDownload()', () => {
  it('for non-file contents', () => {
    const t = mount(
      <DownloadDump
        content={{
          Id: 1,
          Type: 'User',
          Name: '',
          Path: '',
        }}
      />,
    )
    expect(t).toMatchSnapshot()
  })

  it('for file contents', () => {
    const t = mount(
      <DownloadDump
        content={{
          Id: 1,
          Type: 'File',
          Name: '',
          Path: '',
        }}
      />,
    )
    expect(t).toMatchSnapshot()
  })

  it('should trigger download on click', () => {
    jest.spyOn(downloadHook, 'downloadFile')
    jest.spyOn(downloadHook, 'fakeClick')
    const t = mount(
      <DownloadDump
        content={{
          Id: 1,
          Type: 'File',
          Name: '',
          Path: '',
        }}
      />,
    )
    ;(t.find('div').prop('onClick') as any)()
    expect(downloadHook.downloadFile).toBeCalled()
    expect(downloadHook.fakeClick).toBeCalled()
  })
})
