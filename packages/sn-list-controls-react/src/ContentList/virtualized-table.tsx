/* eslint-disable import/named */
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import { ActionModel, FieldSetting, GenericContent, Schema } from '@sensenet/default-content-types'
import clsx from 'clsx'
import React, { useCallback, useMemo } from 'react'
import { AutoSizer, Column, Table, TableCellProps, TableCellRenderer, TableProps } from 'react-virtualized'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import { TableSortLabel, Tooltip } from '@material-ui/core'
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
  active?: T
  cellRenderer?: TableCellRenderer
  checkboxProps?: CheckboxProps
  displayRowCheckbox?: boolean
  fieldsToDisplay: Array<keyof T>
  getSelectionControl?: (selected: boolean, content: T, callBack: () => void) => JSX.Element
  icons?: any
  items: T[]
  onItemTap?: (e: React.TouchEvent, content: T) => void
  onItemContextMenu?: (e: React.MouseEvent, content: T) => void
  onRequestActionsMenu?: (ev: React.MouseEvent, content: T) => void
  onRequestOrderChange?: (field: keyof T, direction: 'asc' | 'desc') => void
  onRequestSelectionChange?: (newSelection: T[]) => void
  orderBy?: keyof T
  orderDirection?: 'asc' | 'desc'
  schema: Schema
  selected: T[]
  tableProps: TableProps
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
        return <VirtualDisplayNameCell rowData={rowData} icons={props.icons} />
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

  const fieldSchemas = useMemo<{ [key: string]: FieldSetting }>(
    () =>
      props.schema.FieldSettings.reduce((v: any, field: { Name: React.ReactText }) => {
        ;(v as any)[field.Name] = props.schema.FieldSettings.find(
          (s: { Name: React.ReactText }) => s.Name === field.Name,
        )
        return v
      }, {}),
    [props.schema.FieldSettings],
  )

  const getSchemaForField = useCallback((fieldName: string) => fieldSchemas[fieldName] as FieldSetting, [fieldSchemas])

  const headerRenderer = (columnName: string) => {
    const {
      tableProps: { headerHeight },
    } = props

    if (columnName === 'Checkbox') {
      return (
        <TableCell padding="checkbox" key="selectAll" style={{ width: '30px', paddingRight: 0 }} component="div">
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

    const fieldSetting = getSchemaForField(columnName)
    const description = (fieldSetting && fieldSetting.Description) || columnName

    return (
      <TableCell component="div" variant="head" style={{ height: headerHeight || 48 }} className={columnName as string}>
        <Tooltip title={description}>
          <TableSortLabel
            active={props.orderBy === columnName}
            direction={props.orderDirection}
            onClick={() =>
              props.onRequestOrderChange &&
              props.onRequestOrderChange(
                columnName as keyof GenericContent,
                props.orderDirection === 'asc' ? 'desc' : 'asc',
              )
            }>
            {columnName}
          </TableSortLabel>
        </Tooltip>
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
