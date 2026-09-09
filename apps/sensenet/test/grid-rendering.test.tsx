import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Grid } from '../src/components/grid/Grid'

const mockContent = { Id: 7, Name: 'Document', Path: '/Root/Document', Type: 'File' }
const mockSetSelection = jest.fn()
const mockSubscription = { dispose: jest.fn() }
const mockSelection = {
  selection: { getValue: () => [mockContent], setValue: mockSetSelection, subscribe: () => mockSubscription },
}
const mockLoading = jest.fn()
const mockRepo = { schemas: { getSchemaByName: () => ({ FieldSettings: [] }) } }
jest.mock('@sensenet/hooks-react', () => {
  const { createContext } = jest.requireActual('react')
  return {
    useRepository: () => mockRepo,
    CurrentContentContext: createContext({ Id: 1, Path: '/Root' }),
    CurrentChildrenContext: createContext([{ Id: 7, Name: 'Document', Path: '/Root/Document', Type: 'File' }]),
    CurrentChildrenIsLoadingContext: createContext(false),
  }
})
jest.mock('../src/context', () => ({ ResponsiveContext: jest.requireActual('react').createContext('desktop') }))
jest.mock('../src/hooks', () => ({
  useLocalization: () => ({ common: { loadingContent: 'Loading' }, columnSettingsDialog: { title: 'Columns' } }),
  usePersonalSettings: () => ({ sortFoldersFirst: true }),
  useSelectionService: () => mockSelection,
}))
jest.mock('../src/services', () => ({ isImageContent: () => false }))
jest.mock('../src/components/grid/column-settings', () => ({
  applyLegacyColumnSettings: (columns: any) => columns,
  getAvailableColumnSettings: () => [],
}))
jest.mock('../src/components/dialogs', () => ({ useDialog: () => ({}) }))
jest.mock('../src/components/image-gallery', () => ({ useImageGallery: () => ({}) }))
jest.mock('../src/components/DropFileArea', () => ({ DropFileArea: ({ children }: any) => children }))
jest.mock('../src/components/context-menu/content-context-menu', () => ({ ContentContextMenu: () => null }))
jest.mock('../src/components/grid/Providers/GridLoadingProvider', () => ({
  useGridLoading: () => ({ isGridLoading: false, setIsGridLoading: mockLoading }),
}))

it('renders React cells, restores selection, handles activation and preserves draggable rows', async () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const onParentChange = jest.fn()
  const onActiveItemChange = jest.fn()
  const errors = jest.spyOn(console, 'error')
  const warnings = jest.spyOn(console, 'warn')
  try {
    await act(async () => {
      render(
        <Grid
          parentIdOrPath="/Root"
          gridKey="console-regression"
          rowHeight={32}
          headerHeight={32}
          colDef={[{ field: 'Name', cellRenderer: ({ value }: any) => <span data-test="react-cell">{value}</span> }]}
          onActivateItem={jest.fn()}
          onParentChange={onParentChange}
          onActiveItemChange={onActiveItemChange}
        />,
        container,
      )
      await new Promise((resolve) => setTimeout(resolve, 400))
    })
    expect(container.querySelector('[data-test="react-cell"]')?.textContent).toBe('Document')
    const row = container.querySelector('.ag-center-cols-container .ag-row[row-id="7"]')!
    expect(row).not.toBeNull()
    expect(row.getAttribute('draggable')).toBe('true')
    expect(JSON.parse(row.getAttribute('data-explorer-content')!)).toMatchObject(mockContent)
    expect(row.classList.contains('ag-row-selected')).toBe(true)
    await act(async () => {
      row.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(onParentChange).toHaveBeenCalledWith(mockContent)
    expect(onActiveItemChange).toHaveBeenCalledWith(mockContent)
    act(() => {
      unmountComponentAtNode(container)
    })
    expect(mockSubscription.dispose).toHaveBeenCalled()
    expect(errors).not.toHaveBeenCalled()
    expect(warnings).not.toHaveBeenCalled()
  } finally {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    errors.mockRestore()
    warnings.mockRestore()
  }
})
