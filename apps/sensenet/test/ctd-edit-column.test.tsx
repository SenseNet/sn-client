import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { ColDef } from 'ag-grid-community'
import { createMemoryHistory } from 'history'
import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'
import { applyLegacyColumnSettings, getAvailableColumnSettings } from '../src/components/grid/column-settings'
import { EditBinaryFormatter } from '../src/components/grid/Formatters/EditBinaryFormatter'
import { useSnRoute } from '../src/hooks'
import { addFullscreenEditAction, supportsFullscreenEdit } from '../src/services/fullscreen-edit-service'

jest.mock('../src/context', () => ({
  ResponsivePersonalSettings: jest.requireActual('react').createContext({
    content: { browseType: 'explorer' },
    drawer: { items: [] },
  }),
}))
jest.mock('../src/hooks', () => ({
  useSnRoute: jest.fn(),
  useLocalization: () => ({ settings: { fullscreenEdit: 'Full-screen edit' } }),
}))
jest.mock('../src/services', () => ({
  ...jest.requireActual('../src/services/fullscreen-edit-service'),
  ...jest.requireActual('../src/services/content-context-service'),
  ...jest.requireActual('../src/services/query-string-builder'),
}))
jest.mock('../src/components/grid/Formatters/DateTimeFormatter', () => ({
  DateTimeFormatter: () => null,
  formatDateTime: (value: string) => value,
}))

const rootPath = '/Root/System/Schema/ContentTypes'
const type = (overrides: Partial<GenericContent> = {}) =>
  ({
    Id: 85,
    Name: 'Memo',
    DisplayName: 'Memo type',
    Path: `${rootPath}/GenericContent/Memo`,
    Type: 'ContentType',
    IsFile: true,
    ...overrides,
  } as GenericContent)
const action = (Name: string, Forbidden = false) => ({ Name, Forbidden } as ActionModel)
const defaults: ColDef[] = [
  { checkboxSelection: true },
  { field: 'Icon' },
  { field: 'DisplayName' },
  { colId: 'edit-binary', headerName: 'Edit', cellRenderer: EditBinaryFormatter },
  { field: 'Description' },
  { field: 'Actions' },
]

describe('CTD XML edit action and columns', () => {
  it('supports CTD documents including nested types without exposing folders or neighboring roots', () => {
    expect(supportsFullscreenEdit(type())).toBe(true)
    expect(supportsFullscreenEdit(type({ Path: rootPath, IsFile: false, IsFolder: true }))).toBe(false)
    expect(
      supportsFullscreenEdit(type({ Path: `${rootPath}/Group`, IsFile: false, IsFolder: true, Type: 'Folder' })),
    ).toBe(false)
    expect(supportsFullscreenEdit(type({ Path: `${rootPath}Archive/Memo` }))).toBe(false)
    expect(supportsFullscreenEdit(type({ Path: undefined }))).toBe(false)
    expect(supportsFullscreenEdit(type({ Path: '/Root/System/Settings/Portal.settings', Type: 'Settings' }))).toBe(true)
  })

  it('adds the localized full-screen menu action beside metadata Edit exactly once', () => {
    const content = type({ Actions: [action('Browse'), action('Edit')] })
    const result = addFullscreenEditAction(content, content.Actions as ActionModel[], 'XML szerkesztése')
    expect(result.map(({ Name }) => Name)).toEqual(['Browse', 'Edit', 'EditBinary'])
    expect(result[2].DisplayName).toBe('XML szerkesztése')
    expect(addFullscreenEditAction(content, result)).toBe(result)
  })

  it.each(['Edit', 'EditBinary'])(
    'honors an explicit forbidden %s action even after visible menu actions were filtered',
    (name) => {
      const content = type({ Actions: [action('Browse'), action(name, true)] })
      expect(supportsFullscreenEdit(content)).toBe(false)
      const visible = [action('Browse')]
      expect(addFullscreenEditAction(content, visible)).toBe(visible)
    },
  )

  it('keeps the pencil next to the name when persisted column settings omit it', () => {
    const configured = applyLegacyColumnSettings(defaults, [{ field: 'Name' }, { field: 'Description' }])
    expect(configured.map((column) => column.colId || column.field || 'selection')).toEqual([
      'selection',
      'Icon',
      'Name',
      'edit-binary',
      'Description',
      'Actions',
    ])
    expect(configured.find(({ colId }) => colId === 'edit-binary')?.field).toBeUndefined()
    expect(getAvailableColumnSettings(defaults).some(({ field }) => field === 'edit-binary')).toBe(false)
  })

  it('does not duplicate a legacy edit setting or turn it into an OData field', () => {
    const configured = applyLegacyColumnSettings(defaults, [
      { field: 'DisplayName' },
      { field: 'edit' },
      { field: 'EditBinary' },
    ])
    expect(configured.filter(({ colId }) => colId === 'edit-binary')).toHaveLength(1)
    expect(configured.some(({ field }) => field === 'edit' || field === 'EditBinary')).toBe(false)
    const otherList = applyLegacyColumnSettings([{ field: 'Name' }], [{ field: 'edit' }])
    expect(otherList[0].colId).toBe('edit')
  })
})

describe('CTD pencil navigation', () => {
  let element: HTMLDivElement
  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    ;(useSnRoute as jest.Mock).mockReturnValue({
      path: rootPath,
      match: { path: '/content-types/:browseType/:action?', params: { browseType: 'explorer' } },
    })
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    element.remove()
  })

  it('opens the clicked nested CTD XML editor, keeps its parent location, and does not select the row', () => {
    const history = createMemoryHistory({ initialEntries: ['/content-types/explorer?path=%2FGenericContent'] })
    const rowClick = jest.fn()
    act(() => {
      renderDom(
        <Router history={history}>
          <div onClick={rowClick}>
            <EditBinaryFormatter data={type()} />
          </div>
        </Router>,
        element,
      )
    })
    const button = element.querySelector<HTMLButtonElement>('[data-test="grid-edit-binary"]')!
    expect(button.getAttribute('data-content-id')).toBe('85')
    expect(button.getAttribute('aria-label')).toBe('Full-screen edit: Memo type')
    act(() => {
      button.click()
    })
    expect(history.location.pathname).toBe('/content-types/explorer/edit-binary')
    expect(new URLSearchParams(history.location.search).get('content')).toBe('/GenericContent/Memo')
    expect(new URLSearchParams(history.location.search).get('path')).toBe('/GenericContent')
    expect(rowClick).not.toHaveBeenCalled()
  })

  it('does not render an executable pencil for forbidden CTD edits or unloaded rows', () => {
    const history = createMemoryHistory()
    act(() => {
      renderDom(
        <Router history={history}>
          <>
            <EditBinaryFormatter data={type({ Actions: [action('Edit', true)] })} />
            <EditBinaryFormatter />
          </>
        </Router>,
        element,
      )
    })
    expect(element.querySelector('button')).toBeNull()
  })
})
