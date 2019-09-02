import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount, shallow } from 'enzyme'
import { Repository } from '@sensenet/client-core'
import { useVersionInfo, VersionInfo } from '../src/hooks'
import { RepositoryContext } from '../src/context'

const VersionInfoDump = () => {
  const i = useVersionInfo()
  return <div>{JSON.stringify(i)}</div>
}

describe('Version Info', () => {
  it('Should match the snapshot', () => {
    expect(shallow(<VersionInfoDump />)).toMatchSnapshot()
  })

  it('Without updates', async () => {
    const repo = new Repository(
      {},
      async () =>
        ({
          ok: true,
          json: async () =>
            ({
              Assemblies: {
                Dynamic: [],
                GAC: [],
                Other: [],
                Plugins: [],
                SenseNet: [],
              },
              Components: [],
              DatabaseAvailable: true,
              InstalledPackages: [],
            } as VersionInfo),
        } as any),
    )
    await act(async () => {
      mount(
        <RepositoryContext.Provider value={repo}>
          <VersionInfoDump />
        </RepositoryContext.Provider>,
      )
    })
  })

  it('Has an outdated component', async () => {
    const repo = new Repository(
      {},
      async () =>
        ({
          ok: true,
          json: async () =>
            ({
              Assemblies: {
                Dynamic: [],
                GAC: [],
                Other: [],
                Plugins: [],
                SenseNet: [],
              },
              Components: [
                { ComponentId: 'SenseNet.Services', Version: '6.5.4', AcceptableVersion: '6.5.4', Description: '' },
              ],
              DatabaseAvailable: true,
              InstalledPackages: [],
            } as VersionInfo),
        } as any),
    )
    await act(async () => {
      mount(
        <RepositoryContext.Provider value={repo}>
          <VersionInfoDump />
        </RepositoryContext.Provider>,
      )
    })
  })
})
