import { Paper } from '@material-ui/core'
import React, { useContext } from 'react'
import { VirtualizedTable } from '@sensenet/list-controls-react'
import { CurrentChildrenContext } from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types/src'

export function ReactVirtualizedTable(props: { fieldsToDisplay: Array<keyof GenericContent> }) {
  const children = useContext(CurrentChildrenContext)

  return (
    <Paper style={{ height: '100%', width: '100%' }}>
      <VirtualizedTable
        fieldsToDisplay={props.fieldsToDisplay}
        tableProps={{
          rowCount: children.length,
          rowHeight: 48,
          headerHeight: 48,
          rowGetter: ({ index }) => children[index],
          height: 500,
          width: 800,
          onRowClick: ({ rowData }) => console.log(rowData),
        }}
      />
    </Paper>
  )
}
