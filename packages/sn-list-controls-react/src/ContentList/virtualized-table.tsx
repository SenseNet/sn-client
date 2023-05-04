import { Checkbox, createStyles, makeStyles, TableCell, TableSortLabel, Theme, Tooltip } from '@material-ui/core'
import { Build } from '@material-ui/icons'
import { ActionModel, FieldSetting, GenericContent } from '@sensenet/default-content-types'
import clsx from 'clsx'
import React, { useCallback, useMemo } from 'react'
import {
  AutoSizer,
  Column,
  Index,
  RowMouseEventHandlerParams,
  Table,
  TableCellProps,
  TableCellRenderer,
} from 'react-virtualized'
import { ContentListBaseProps } from './content-list-base-props'
import { ActionsCell, DateCell, ReferenceCell, RowCheckbox, VirtualDefaultCell, VirtualDisplayNameCell } from '.'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    columnSetting: {
      position: 'absolute',
      top: '13px',
      left: '13px',
    },
    root: {
      '& .ReactVirtualized__Table__headerRow': {
        backgroundColor: theme.palette.type === 'dark' ? 'hsl(0deg 0% 24%)' : 'hsl(0deg 0% 92%)',
        boxShadow:
          theme.palette.type === 'dark' ? '0px 3px 2px hsl(0deg 0% 0% / 30%)' : '1px 1px 3px 0px hsl(0deg 0% 0% / 28%)',
        paddingLeft: '40px',
      },
      '& .ReactVirtualized__Table__row': {},
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    tableRow: {
      cursor: 'pointer',
      paddingLeft: '40px',
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? 'hsl(0deg 0% 51% / 10%)' : 'hsl(0deg 0% 0% / 3.5%)',
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: 'initial',
    },
    selected: {
      backgroundColor: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    },
    label: {
      display: 'flex',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      letterSpacing: '1px',
      color: theme.palette.type === 'dark' ? 'hsl(0deg 0% 60%)' : 'hsl(0deg 0% 40%)',
    },
  }),
)

export interface VirtualCellProps {
  tableCellProps: TableCellProps
  fieldSettings: FieldSetting
}

interface VirtualizedTableProps<T extends GenericContent> extends ContentListBaseProps<T> {
  /**
   * Contains custom cell template components
   */
  cellRenderer?: (props: VirtualCellProps) => React.ReactNode

  /**
   * Contains custom reference cell template components
   */
  referenceCellRenderer?: (tableCellProps: TableCellProps) => React.ReactNode

  handleColumnSettingsClick?: () => void

  tableProps: {
    /**
     * Number of rows in table.
     */
    rowCount: number
    /**
     * Callback responsible for returning a data row given an index.
     * ({ index: number }): any
     */
    rowHeight: number | ((params: Index) => number)
    /** Fixed height of header row */
    headerHeight: number
    /**
     * Callback responsible for returning a data row given an index.
     * ({ index: number }): any
     */
    rowGetter: (info: Index) => any
    /**
     * Callback invoked when a user clicks on a table row.
     * ({ index: number }): void
     */
    onRowClick?: (info: RowMouseEventHandlerParams) => void
    /**
     * Callback invoked when a user double-clicks on a table row.
     * ({ index: number }): void
     */
    onRowDoubleClick?: (info: RowMouseEventHandlerParams) => void
    /**
     * Disable rendering the header at all
     */
    disableHeader?: boolean
  }
}

export const VirtualizedTable = <T extends GenericContent = GenericContent>(props: VirtualizedTableProps<T>) => {
  const classes = useStyles()

  const handleSelectAllClick = () => {
    props.onRequestSelectionChange &&
      (props.selected && props.selected.length === props.items.length
        ? props.onRequestSelectionChange([])
        : props.onRequestSelectionChange(props.items))
  }

  const handleContentSelection = (content: T) => {
    const tempSelected = props.selected !== undefined && props.selected.length > 0 ? props.selected : []
    if (props.onRequestSelectionChange) {
      if (tempSelected.find((c) => c.Id === content.Id)) {
        props.onRequestSelectionChange(tempSelected.filter((s) => s.Id !== content.Id))
      } else {
        props.onRequestSelectionChange([...tempSelected, content])
      }
    }
  }

  const getRowClassName = ({ index }: Index) => {
    const {
      tableProps: { onRowClick },
    } = props

    const isActive = index !== -1 && props.active && props.active.Id === props.items[index].Id ? true : false

    return clsx(
      classes.tableRow,
      classes.flexContainer,
      {
        [classes.tableRowHover]: index !== -1 && onRowClick != null,
      },
      { [classes.selected]: isActive },
    )
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
              virtual={true}
            />
          )
        }
        break
      case 'ModificationDate':
        return <DateCell date={cellData as string} virtual={true} />
      default:
        break
    }
    const field: any = rowData[dataKey]
    if (field && field.Id && field.Path && field.DisplayName) {
      return <ReferenceCell content={field} fieldName={'DisplayName'} virtual={true} />
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
    [props.schema],
  )

  const getSchemaForField = useCallback((fieldName: string) => fieldSchemas[fieldName] as FieldSetting, [fieldSchemas])

  const headerRenderer = (columnName: string, columnCount: number, autoSizerWidth: number) => {
    const {
      tableProps: { headerHeight },
    } = props

    if (columnName === 'Checkbox') {
      return (
        <TableCell
          padding="checkbox"
          key="selectAll"
          style={{
            width: '48px',
            height: '42px',
            paddingRight: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          component="div">
          <Checkbox
            className="select-all"
            indeterminate={
              props.selected && props.selected.length > 0 && props.selected.length !== props.items.length ? true : false
            }
            checked={props.selected && props.selected.length === props.items.length ? true : false}
            onChange={handleSelectAllClick}
            {...props.checkboxProps}
          />
        </TableCell>
      )
    }

    const fieldSetting = getSchemaForField(columnName)
    const displayName = (fieldSetting && fieldSetting.DisplayName) || columnName
    const description = (fieldSetting && fieldSetting.Description) || columnName

    return (
      <TableCell
        data-test={`table-header-${columnName?.replace(/\s+/g, '-').toLowerCase()}`}
        component="div"
        variant="head"
        style={{
          height: headerHeight || 42,
          width: props.displayRowCheckbox
            ? (autoSizerWidth - 48 - 10) / (columnCount - 1)
            : autoSizerWidth / columnCount,
          display: 'flex',
          padding: columnName === 'Actions' ? '0 0 0 0px' : 0,
          alignItems: 'center',
          justifyContent: columnName === 'Actions' ? 'center' : 'left',
        }}
        className={columnName as string}>
        <Tooltip title={description}>
          <TableSortLabel
            className={classes.label}
            active={props.orderBy === columnName}
            direction={props.orderDirection}
            onClick={() =>
              props.onRequestOrderChange &&
              props.onRequestOrderChange(
                columnName as keyof GenericContent,
                props.orderDirection === 'asc' ? 'desc' : 'asc',
              )
            }>
            {displayName}
          </TableSortLabel>
        </Tooltip>
      </TableCell>
    )
  }

  const { fieldsToDisplay, tableProps } = props

  const extendedFieldsToDisplay = props.displayRowCheckbox ? ['Checkbox'].concat(fieldsToDisplay) : fieldsToDisplay

  return (
    <AutoSizer>
      {({ height, width }) => (
        <>
          <div className={classes.columnSetting} onClick={props.handleColumnSettingsClick}>
            <Build />
          </div>
          <Table
            className={classes.root}
            height={height}
            width={width}
            gridStyle={{
              direction: 'inherit',
              outline: 'none',
            }}
            {...tableProps}
            rowClassName={getRowClassName}>
            {extendedFieldsToDisplay.map((field) => {
              return (
                <Column
                  flexGrow={props.displayRowCheckbox && field === 'Checkbox' ? 0 : 0}
                  flexShrink={props.displayRowCheckbox && field === 'Checkbox' ? 5 : 1}
                  key={field}
                  columnData={{ label: field }}
                  headerRenderer={() => headerRenderer(field, extendedFieldsToDisplay.length, width)}
                  className={classes.flexContainer}
                  cellRenderer={(tableCellProps) => {
                    if (props.displayRowCheckbox && field === 'Checkbox') {
                      const isSelected =
                        props.selected && props.selected.find((s) => s.Id === tableCellProps.rowData.Id) ? true : false
                      return checkBoxRenderer(tableCellProps, isSelected)
                    } else {
                      if (tableCellProps.dataKey.includes('/')) {
                        return props.referenceCellRenderer
                          ? props.referenceCellRenderer(tableCellProps)
                          : defaultCellRenderer(tableCellProps)
                      } else {
                        return props.cellRenderer
                          ? props.cellRenderer({
                              tableCellProps,
                              fieldSettings: getSchemaForField(tableCellProps.dataKey),
                            })
                          : defaultCellRenderer(tableCellProps)
                      }
                    }
                  }}
                  dataKey={field}
                  width={width}
                  minWidth={props.displayRowCheckbox && field === 'Checkbox' ? 48 : undefined}
                  maxWidth={props.displayRowCheckbox && field === 'Checkbox' ? 48 : undefined}
                />
              )
            })}
          </Table>
        </>
      )}
    </AutoSizer>
  )
}
