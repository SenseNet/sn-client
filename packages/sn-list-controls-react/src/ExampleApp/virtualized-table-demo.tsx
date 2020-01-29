/* eslint-disable require-jsdoc */
import { Paper } from '@material-ui/core'
import React from 'react'
import { VirtualizedTable } from '../ContentList/virtualized-table'

const items = [
  { Id: 1, Path: '/Root/Examples/Foo', Type: 'Folder', Name: 'Foo', DisplayName: 'FoOoOo', Icon: 'file' },
  { Id: 2, Path: '/Root/Examples/Bar', Type: 'Folder', Name: 'Bar', DisplayName: 'Bár', Icon: 'Settings' },
  { Id: 3, Path: '/Root/Examples/Baz', Type: 'Folder', Name: 'Baz', DisplayName: 'Z Baz', Icon: 'File' },
]

export function ReactVirtualizedTable() {
  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <VirtualizedTable
        fieldsToDisplay={['DisplayName', 'Name', 'Type', 'Id']}
        tableProps={{
          rowCount: items.length,
          rowHeight: 48,
          headerHeight: 48,
          rowGetter: ({ index }) => items[index],
          height: 400,
          width: 500,
        }}
      />
    </Paper>
  )
}
