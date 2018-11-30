import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'

import { ActionModel, GenericContent, Schema } from '@sensenet/default-content-types'
import * as React from 'react'
import { ActionsCell, CellProps, DateCell, DefaultCell, DisplayNameCell, ReferenceCell } from './CellTemplates'

/**
 * Interface for ContentList properties
 */
export interface ContentListProps<T extends GenericContent> {
  /**
   * Array of content items
   */
  items: T[]
  /**
   * Schema object
   */
  schema: Schema
  /**
   * Active content item
   */
  active?: T
  /**
   * Array of selected content items
   * @default []
   */
  selected?: T[]
  /**
   * Array of fields that should be displayed
   * @default []
   */
  fieldsToDisplay?: Array<keyof T>
  /**
   * Array of fields that descibe how the list items should be sorted
   * @default 'DisplayName'
   */
  orderBy?: keyof T
  /**
   * Direction of ordering
   * @default asc
   */
  orderDirection?: 'asc' | 'desc'
  /**
   * Contains custom cell template components
   */
  fieldComponent?: React.StatelessComponent<CellProps<T, keyof T>>
  /**
   * Object that contains icon names
   * @default null
   */
  icons?: any
  /**
   * Defines wheter a checkbox per row should be displayed or not
   */
  displayRowCheckbox?: boolean
  /**
   * Called when a content item is clicked
   */
  onItemClick?: (e: React.MouseEvent, content: T) => void
  /**
   * Called when a content item is double-clicked
   */
  onItemDoubleClick?: (e: React.MouseEvent, content: T) => void
  /**
   * Called when a content item is tapped
   */
  onItemTap?: (e: React.TouchEvent, content: T) => void
  /**
   * Called when a user hits right click on a content item
   */
  onItemContextMenu?: (e: React.MouseEvent, content: T) => void
  /**
   * Called when actionmenu is requested
   */
  onRequestActionsMenu?: (ev: React.MouseEvent, content: T) => void
  /**
   * Called when the order params are changed
   */
  onRequestOrderChange?: (field: keyof T, direction: 'asc' | 'desc') => void
  /**
   * Called when a content item is selected
   */
  onRequestSelectionChange?: (newSelection: T[]) => void
  /**
   * Called when there's a new active item
   */
  onRequestActiveItemChange?: (newActiveItem: T) => void
  /**
   * Called when a action is requested
   */
  onAction?: (item: T, action: ActionModel) => void
  /**
   * Props for the selection checkbox
   */
  checkboxProps?: CheckboxProps

  /**
   *
   */
  getSelectionControl?: (selected: boolean, content: T) => JSX.Element
}

export interface ContentListState {
  itemCount: number
  selectedCount: number
  isAllSelected: boolean
  hasSelected: boolean
}

export class ContentList<T extends GenericContent> extends React.Component<ContentListProps<T>, ContentListState> {
  public state = ContentList.getDerivedStateFromProps(this.props as any, null as any)

  public static getDerivedStateFromProps(nextProps: ContentListProps<GenericContent>, lastState: ContentListState) {
    const selected = nextProps.selected ? nextProps.selected : []
    const selectedCount = selected.length
    const itemCount = nextProps.items.length
    return {
      selectedCount,
      itemCount,
      hasSelected: selectedCount > 0,
      isAllSelected: itemCount === selectedCount,
    } as ContentListState
  }

  public handleSelectAllClick() {
    this.props.onRequestSelectionChange &&
      (this.state.isAllSelected
        ? this.props.onRequestSelectionChange([])
        : this.props.onRequestSelectionChange(this.props.items))
  }

  public handleContentSelection(content: T) {
    const selected = this.props.selected !== undefined && this.props.selected.length > 0 ? this.props.selected : []
    if (this.props.onRequestSelectionChange) {
      if (selected.find(c => c.Id === content.Id)) {
        this.props.onRequestSelectionChange(selected.filter(s => s.Id !== content.Id))
      } else {
        this.props.onRequestSelectionChange([...selected, content])
      }
    }
  }

  private defaultFieldComponents: React.StatelessComponent<CellProps<T, keyof T>> = (props: CellProps<T, keyof T>) => {
    switch (props.field) {
      case 'DisplayName':
        return <DisplayNameCell content={props.content} isSelected={props.isSelected} icons={this.props.icons} />
      case 'Actions':
        if (props.content.Actions && props.content.Actions instanceof Array) {
          return (
            <ActionsCell
              actions={props.content.Actions as ActionModel[]}
              content={props.content}
              openActionMenu={ev =>
                this.props.onRequestActionsMenu && this.props.onRequestActionsMenu(ev, props.content)
              }
            />
          )
        }
        break
      case 'ModificationDate':
        return <DateCell date={props.content.ModificationDate as string} />
    }
    const field: any = props.content[props.field]
    if (field && field.Id && field.Path && field.DisplayName) {
      return <ReferenceCell content={field} fieldName={'DisplayName'} />
    }
    return null
  }

  constructor(props: ContentListProps<T>) {
    super(props)
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this)
    this.handleContentSelection = this.handleContentSelection.bind(this)
  }
  public render() {
    const selected = this.props.selected ? this.props.selected : []
    const orderDirection = this.props.orderDirection ? this.props.orderDirection : 'asc'
    const orderBy = this.props.orderBy ? this.props.orderBy : 'DisplayName'
    return (
      <Table>
        <TableHead>
          <TableRow>
            {this.props.displayRowCheckbox !== false ? (
              <TableCell padding="checkbox" key="selectAll" style={{ width: '30px', paddingRight: 0 }}>
                <Checkbox
                  className="select-all"
                  indeterminate={this.state.hasSelected && !this.state.isAllSelected}
                  checked={this.state.isAllSelected}
                  onChange={this.handleSelectAllClick}
                />
              </TableCell>
            ) : null}
            {this.props.fieldsToDisplay
              ? this.props.fieldsToDisplay.map(field => {
                  const fieldSetting = this.props.schema.FieldSettings.find(s => s.Name === field)
                  const isNumeric =
                    fieldSetting &&
                    (fieldSetting.Type === 'IntegerFieldSetting' || fieldSetting.Type === 'NumberFieldSetting')
                  const description = (fieldSetting && fieldSetting.Description) || field
                  const displayName = (fieldSetting && fieldSetting.DisplayName) || field
                  return (
                    <TableCell key={field as string} numeric={isNumeric} className={field as string} padding="checkbox">
                      <Tooltip title={description}>
                        <TableSortLabel
                          active={orderBy === field}
                          direction={orderDirection}
                          onClick={() =>
                            this.props.onRequestOrderChange &&
                            this.props.onRequestOrderChange(field, orderDirection === 'asc' ? 'desc' : 'asc')
                          }>
                          {displayName}
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  )
                })
              : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.items.map(item => {
            const isSelected = selected.find(s => s.Id === item.Id) ? true : false
            const isActive = this.props.active && this.props.active.Id === item.Id ? true : false
            return (
              <TableRow
                key={item.Id}
                hover={true}
                className={`${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${item.Type &&
                  'type-' + item.Type.toLowerCase()}`}
                selected={isActive}
                onClick={e => {
                  this.props.onRequestActiveItemChange && this.props.onRequestActiveItemChange(item)
                  this.props.onItemClick && this.props.onItemClick(e, item)
                }}
                onDoubleClick={e => {
                  this.props.onItemDoubleClick && this.props.onItemDoubleClick(e, item)
                }}
                onTouchEnd={e => this.props.onItemTap && this.props.onItemTap(e, item)}
                onContextMenu={e => this.props.onItemContextMenu && this.props.onItemContextMenu(e, item)}>
                {this.props.displayRowCheckbox !== false ? (
                  <TableCell padding="checkbox" key="select">
                    {this.props.getSelectionControl ? (
                      this.props.getSelectionControl(selected.find(i => i.Id === item.Id) ? true : false, item)
                    ) : (
                      <Checkbox
                        checked={selected.find(i => i.Id === item.Id) ? true : false}
                        onChange={() => this.handleContentSelection(item)}
                        {...this.props.checkboxProps}
                      />
                    )}
                  </TableCell>
                ) : null}
                {this.props.fieldsToDisplay
                  ? this.props.fieldsToDisplay.map(field => {
                      const fieldSetting = this.props.schema.FieldSettings.find(s => s.Name === field)
                      const cellProps: CellProps<T, keyof T> = {
                        ...(this.props as ContentListProps<T>),
                        field,
                        content: item,
                        fieldSetting,
                        isSelected,
                      }

                      const fieldComponent = this.props.fieldComponent && this.props.fieldComponent(cellProps)
                      const defaultComponent = this.defaultFieldComponents(cellProps)

                      const el = {
                        ...React.createElement(
                          fieldComponent
                            ? (this.props.fieldComponent as any)
                            : defaultComponent
                            ? this.defaultFieldComponents
                            : DefaultCell,
                          cellProps,
                        ),
                        key: field as string,
                      }
                      return el
                    })
                  : null}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
}
