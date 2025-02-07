import { GenericContent, User } from '@sensenet/default-content-types'
import { CurrentChildrenContext, CurrentContentContext } from '@sensenet/hooks-react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
// @ts-ignore
import ReactDataGrid from 'react-data-grid'

import { DropFileArea } from '../DropFileArea'
import { ActionFormatter } from './Formatters/ActionFormatter'
import { CheckBoxFormatter } from './Formatters/CheckBoxFormatter'
import { DateTimeFormatter } from './Formatters/DateTimeFormatter'
import { DisplayNameFormatter } from './Formatters/DisplayNameFormatter'
import { IconFormatter } from './Formatters/IconFormatter'
import { UserNameFormatter } from './Formatters/UserNameFormatter'
import { GridProps } from './Props/GridProps'
import { EmptyRowsView } from './Views/EmptyRowsView'

export function Grid<T extends GenericContent = GenericContent>(this: any, props: GridProps<T>) {
  // @ts-ignore
  const [selectedIndexes, setSelectedIndexes] = useState<any[]>([])
  const [rowItems, setRowItems] = useState<any[]>([])
  const [sortColumn, setSortColumn] = useState<string>('DisplayName')
  const [sortDirection, setSortDirection] = useState<string>('ASC')
  // @ts-ignore

  const parentContent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext) as GenericContent[]
  const handleActivateItem = useCallback(
    (item: T) => {
      if (item.IsFolder) {
        props.onParentChange(item)
      } else {
        props.onActivateItem(item)
      }
    },
    [props],
  )
  const columns = [
    { key: 'check', name: '#', width: 0, formatter: CheckBoxFormatter, flex: 1 },
    { key: 'icon', name: '', width: 35, formatter: IconFormatter, flex: 1 },
    { key: 'id', name: 'ID', width: 55, sortable: true, flex: 1 },
    { key: 'index', name: 'Index', width: 45, sortable: true, flex: 1 },
    {
      key: 'DisplayName',
      name: 'Display Name',
      resizable: true,
      minWidth: 400,
      autofill: true,
      sortable: true,
      filterable: true,
      formatter: DisplayNameFormatter,
      flex: 1,
    },
    { key: 'Locked', name: 'Locked', resizable: true, width: 60, sortable: false, flex: 1 },
    {
      key: 'CreatedBy',
      name: 'Created By',
      resizable: true,
      sortable: true,
      width: 130,
      formatter: UserNameFormatter,
      flex: 1,
    },
    {
      key: 'CreationDate',
      name: 'Creation Date',
      resizable: true,
      sortable: true,
      width: 130,
      formatter: DateTimeFormatter,
      flex: 1,
    },
    {
      key: 'ModifiedBy',
      name: 'Modified By',
      resizable: true,
      sortable: true,
      width: 130,
      formatter: UserNameFormatter,
      flex: 1,
    },
    {
      key: 'ModificationDate',
      name: 'Modification Date',
      resizable: true,
      sortable: true,
      width: 130,
      formatter: DateTimeFormatter,
      flex: 1,
    },
    {
      key: 'Actions',
      name: 'Actions',
      resizable: false,
      sortable: false,
      width: 60,
      formatter: ActionFormatter,
      flex: 1,
    },
  ]

  const rowGetter = (rowNumber: number) => rowItems[rowNumber]

  const handleGridSort = (sColumn: any, sDirection: any) => {
    setSortColumn(sColumn)
    setSortDirection(sDirection)
  }
  const refContainer = useRef()

  if (refContainer.current) {
    const currentContainer = refContainer.current as any
    let sumofwidths = 0
    let needAutoFillIndex = -1
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].width !== undefined) {
        const numb = Number(columns[i].width)
        if (!Number.isNaN(numb)) sumofwidths += numb
      }
      if (columns[i].autofill !== undefined && columns[i].autofill === true) {
        needAutoFillIndex = i
      }
    }
    if (needAutoFillIndex > -1) {
      columns[needAutoFillIndex].width = Number(currentContainer.getTotalWidth()) - sumofwidths - 100
    }
  }
  useEffect(() => {
    for (let i = 0; i < selectedIndexes.length; i++) {
      const a = selectedIndexes[i]
      const item = rowItems[a]
      if (
        props !== undefined &&
        props.onActiveItemChange !== undefined &&
        item !== undefined &&
        item.Content !== undefined
      ) {
        props.onActiveItemChange(item.Content)
      }
    }
  }, [props, rowItems, selectedIndexes])
  useEffect(() => {
    const sortedchildrens = children
    if (sortDirection !== 'NONE') {
      sortedchildrens.sort((a: GenericContent, b: GenericContent) => {
        let result = 0
        if (sortColumn === 'index') {
          const aIndex = a.Index ?? 0
          const bIndex = b.Index ?? 0
          if (sortDirection === 'ASC') {
            result = aIndex - bIndex
          }
          if (sortDirection === 'DESC') {
            result = bIndex - aIndex
          }
        }
        if (sortColumn === 'DisplayName') {
          const aCol = (a.DisplayName ?? '').trim()
          const bCol = (b.DisplayName ?? '').trim()
          if (sortDirection === 'ASC') {
            result = aCol.localeCompare(bCol)
          }
          if (sortDirection === 'DESC') {
            result = bCol.localeCompare(aCol)
          }
        }
        if (sortColumn === 'CreatedBy') {
          const aCol = `${(a.CreatedBy as User).Domain}\\${(a.CreatedBy as User).LoginName}`
          const bCol = `${(b.CreatedBy as User).Domain}\\${(b.CreatedBy as User).LoginName}`
          if (sortDirection === 'ASC') {
            result = aCol.localeCompare(bCol)
          }
          if (sortDirection === 'DESC') {
            result = bCol.localeCompare(aCol)
          }
        }
        if (sortColumn === 'ModifiedBy') {
          const aCol = `${(a.ModifiedBy as User).Domain}\\${(a.ModifiedBy as User).LoginName}`
          const bCol = `${(b.ModifiedBy as User).Domain}\\${(b.ModifiedBy as User).LoginName}`
          if (sortDirection === 'ASC') {
            result = aCol.localeCompare(bCol)
          }
          if (sortDirection === 'DESC') {
            result = bCol.localeCompare(aCol)
          }
        }
        if (sortColumn === 'CreationDate') {
          const aCol = a.CreationDate ?? ''
          const bCol = b.CreationDate ?? ''
          if (sortDirection === 'ASC') {
            result = aCol.localeCompare(bCol)
          }
          if (sortDirection === 'DESC') {
            result = bCol.localeCompare(aCol)
          }
        }
        if (sortColumn === 'ModificationDate') {
          const aCol = a.CreationDate ?? ''
          const bCol = b.CreationDate ?? ''
          if (sortDirection === 'ASC') {
            result = aCol.localeCompare(bCol)
          }
          if (sortDirection === 'DESC') {
            result = bCol.localeCompare(aCol)
          }
        }
        return result
      })
    }
    const items = []
    for (let i = 0; i < sortedchildrens.length; i++) {
      const child = sortedchildrens[i]
      const item = {
        id: child.Id,
        index: child.Index,
        icon: child,
        DisplayName: child.DisplayName,
        Locked: child.Locked,
        CreatedBy: child.CreatedBy,
        CreationDate: child.CreationDate,
        ModifiedBy: child.ModifiedBy,
        ModificationDate: child.ModificationDate,
        Content: child,
        Actions: child,
      }
      items.push(item)
    }
    setRowItems(items)
  }, [children, sortColumn, sortDirection])
  //examples: https://github.com/adazzle/react-data-grid/blob/v6.0.0-alpha.0/packages/react-data-grid-examples/src/scripts
  return (
    <DropFileArea parentContent={parentContent} style={{ height: '100%', overflow: 'hidden' }}>
      <ReactDataGrid
        ref={refContainer}
        rowKey="id"
        rowGetter={rowGetter}
        columns={columns}
        rowsCount={children.length}
        onGridSort={handleGridSort}
        height={32}
        minColumnWidth={0}
        defaultColumnOptions={{
          minWidth: 100,
          resizable: true,
          // sortable: true,
          draggable: true,
        }}
        onRowDoubleClick={(row: any) => {
          handleActivateItem(rowItems[row].Content)
        }}
        rowSelection={{
          showCheckbox: true,
          enableShiftSelect: true,
          onRowsSelected: (rows: any[]) => {
            setSelectedIndexes(selectedIndexes.concat(rows.map((item: any) => (item as any).rowIdx)))
          },
          onRowsDeselected: (rows: any[]) => {
            const rowIndexes = rows.map((r) => r.rowIdx)
            setSelectedIndexes(selectedIndexes.filter((i) => rowIndexes.indexOf(i) === -1))
          },
          selectBy: {
            indexes: selectedIndexes,
          },
          emptyRowsView: { EmptyRowsView },
        }}
      />
    </DropFileArea>
  )
}
