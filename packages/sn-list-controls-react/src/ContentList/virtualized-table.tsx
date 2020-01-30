/* eslint-disable import/named */
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import clsx from 'clsx'
import React from 'react'
import { AutoSizer, Column, Table, TableCellRenderer, TableProps } from 'react-virtualized'
import { ActionsCell, DateCell, ReferenceCell, VirtualDefaultCell, VirtualDisplayNameCell } from '.'

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    tableRow: {
      cursor: 'pointer',
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: 'initial',
    },
  })

interface Row {
  index: number
}

interface MuiVirtualizedTableProps<T = GenericContent> extends WithStyles<typeof styles> {
  fieldsToDisplay: Array<keyof T>
  tableProps: TableProps
  onRequestActionsMenu?: (ev: React.MouseEvent, content: T) => void
  cellRenderer?: TableCellRenderer
}

const MuiVirtualizedTable: React.FC<MuiVirtualizedTableProps> = props => {
  const getRowClassName = ({ index }: Row) => {
    const {
      classes,
      tableProps: { onRowClick },
    } = props

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    })
  }

  const defaultCellRenderer: TableCellRenderer = ({ cellData, dataKey, rowData }) => {
    switch (dataKey) {
      case 'DisplayName':
        return <VirtualDisplayNameCell rowData={rowData} />
      case 'Actions':
        if (rowData.Actions && rowData.Actions instanceof Array) {
          return (
            <ActionsCell
              actions={rowData.Actions as ActionModel[]}
              content={rowData}
              openActionMenu={(ev: any) => props.onRequestActionsMenu && props.onRequestActionsMenu(ev, rowData)}
            />
          )
        }
        break
      case 'ModificationDate':
        return <DateCell date={cellData} />
      default:
        break
    }
    const field: any = rowData[dataKey]
    if (field && field.Id && field.Path && field.DisplayName) {
      return <ReferenceCell content={field} fieldName={'DisplayName'} />
    }
    return <VirtualDefaultCell cellData={cellData} />
  }

  const headerRenderer = (columnName: string) => {
    const {
      classes,
      tableProps: { headerHeight },
    } = props

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight || 48 }}>
        <span>{columnName}</span>
      </TableCell>
    )
  }

  const { classes, fieldsToDisplay, tableProps } = props
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          height={height}
          width={width}
          rowHeight={tableProps.rowHeight}
          gridStyle={{
            direction: 'inherit',
          }}
          headerHeight={tableProps.headerHeight || 48}
          {...tableProps}
          rowClassName={getRowClassName}>
          {fieldsToDisplay.map(field => {
            return (
              <Column
                key={field}
                columnData={{ label: field }}
                headerRenderer={() => headerRenderer(field)}
                className={classes.flexContainer}
                cellRenderer={props.cellRenderer || defaultCellRenderer}
                dataKey={field}
                width={width}
              />
            )
          })}
        </Table>
      )}
    </AutoSizer>
  )
}

export const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable)
