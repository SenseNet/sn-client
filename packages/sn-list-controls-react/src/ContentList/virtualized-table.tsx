/* eslint-disable import/named */
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import { GenericContent } from '@sensenet/default-content-types'
import clsx from 'clsx'
import React from 'react'
import { AutoSizer, Column, Table, TableCellRenderer, TableProps } from 'react-virtualized'
import { VirtualDateCell, VirtualDefaultCell, VirtualDisplayNameCell } from '.'

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    table: {
      // temporary right-to-left patch, waiting for
      // https://github.com/bvaughn/react-virtualized/issues/454
      '& .ReactVirtualized__Table__headerRow': {
        paddingRight: theme.direction === 'rtl' ? '0px !important' : undefined,
      },
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
      case 'ModificationDate':
        return <VirtualDateCell date={cellData} />
      default:
        break
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
          className={classes.table}
          {...tableProps}
          rowClassName={getRowClassName}>
          {fieldsToDisplay.map(field => {
            return (
              <Column
                key={field}
                columnData={{ label: field }}
                headerRenderer={() => headerRenderer(field)}
                className={classes.flexContainer}
                cellRenderer={defaultCellRenderer}
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
