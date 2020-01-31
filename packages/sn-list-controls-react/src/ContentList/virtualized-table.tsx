/* eslint-disable import/named */
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { AutoSizer, Column, Table, TableCellProps, TableCellRenderer, TableProps } from 'react-virtualized'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import { ActionsCell, DateCell, ReferenceCell, RowCheckbox, VirtualDefaultCell, VirtualDisplayNameCell } from '.'

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
  displayRowCheckbox?: boolean
  items: T[]
  checkboxProps?: CheckboxProps
  getSelectionControl?: (selected: boolean, content: T, callBack: () => void) => JSX.Element
  onRequestSelectionChange?: (newSelection: T[]) => void
  selected: T[]
  active?: T
  onRequestActiveItemChange?: (newActiveItem: T) => void
  onItemClick?: (e: React.MouseEvent, content: T) => void
}

const MuiVirtualizedTable: React.FC<MuiVirtualizedTableProps> = props => {
  const handleSelectAllClick = useCallback(() => {
    props.onRequestSelectionChange &&
      (props.selected && props.selected.length === props.items.length
        ? props.onRequestSelectionChange([])
        : props.onRequestSelectionChange(props.items))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onRequestSelectionChange, props.selected, props.items])

  const handleContentSelection = useCallback(
    (content: GenericContent) => {
      const tempSelected = props.selected !== undefined && props.selected.length > 0 ? props.selected : []
      if (props.onRequestSelectionChange) {
        if (tempSelected.find(c => c.Id === content.Id)) {
          props.onRequestSelectionChange(tempSelected.filter(s => s.Id !== content.Id))
        } else {
          props.onRequestSelectionChange([...tempSelected, content])
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onRequestSelectionChange, props.selected, props.items],
  )

  const getRowClassName = ({ index }: Row) => {
    const {
      classes,
      tableProps: { onRowClick },
    } = props

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    })
  }

  const checkBoxRenderer = (tableCellProps: TableCellProps, isSelected: boolean) => {
    return (
      <RowCheckbox
        getSelectionControl={props.getSelectionControl}
        isSelected={isSelected}
        rowData={tableCellProps.rowData}
        checkboxProps={props.checkboxProps}
        handleContentSelection={handleContentSelection}
      />
    )
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

    if (columnName === 'Checkbox') {
      return (
        <TableCell padding="checkbox" key="selectAll" style={{ width: '30px', paddingRight: 0 }}>
          <Checkbox
            className="select-all"
            indeterminate={
              props.selected && props.selected.length > 0 && props.selected.length !== props.items.length ? true : false
            }
            checked={props.selected && props.selected.length === props.items.length ? true : false}
            onChange={handleSelectAllClick}
          />
        </TableCell>
      )
    }
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
  const fieldsToDisplayWithOrWithoutCheckbox = props.displayRowCheckbox
    ? ['Checkbox'].concat(fieldsToDisplay)
    : fieldsToDisplay

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
          {fieldsToDisplayWithOrWithoutCheckbox.map(field => {
            return (
              <Column
                key={field}
                columnData={{ label: field }}
                headerRenderer={() => headerRenderer(field)}
                className={classes.flexContainer}
                cellRenderer={tableCellProps => {
                  if (props.displayRowCheckbox && field === 'Checkbox') {
                    const isSelected =
                      props.selected && props.selected.find(s => s.Id === tableCellProps.rowData.Id) ? true : false
                    return checkBoxRenderer(tableCellProps, isSelected)
                  } else {
                    return props.cellRenderer ? props.cellRenderer(tableCellProps) : defaultCellRenderer(tableCellProps)
                  }
                }}
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
