import Checkbox from '@material-ui/core/Checkbox'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'

import { ActionModel, FieldSetting, GenericContent } from '@sensenet/default-content-types'
import React, { useCallback, useMemo } from 'react'
import { ActionsCell, CellProps, DateCell, DefaultCell, DisplayNameCell, ReferenceCell } from './CellTemplates'
import { ContentListBaseProps } from './content-list-base-props'

/**
 * Interface for ContentList properties
 */
export interface ContentListProps<T extends GenericContent = GenericContent> extends ContentListBaseProps {
  /**
   * Contains custom cell template components
   */
  fieldComponent?: React.StatelessComponent<CellProps<T, keyof T>>
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
   * Called when there's a new active item
   */
  onRequestActiveItemChange?: (newActiveItem: T) => void
  /**
   * Called when a action is requested
   */
  onAction?: (item: T, action: ActionModel) => void

  /**
   * Setting to hide the table headers
   */
  hideHeader?: boolean
}

export const ContentList: React.FC<ContentListProps<GenericContent>> = props => {
  const handleSelectAllClick = useCallback(() => {
    props.onRequestSelectionChange &&
      (props.selected && props.selected.length === props.items.length
        ? props.onRequestSelectionChange([])
        : props.onRequestSelectionChange(props.items))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onRequestSelectionChange, props.selected, props.items])

  const handleContentSelection = useCallback(
    (content: GenericContent) => {
      const selected = props.selected !== undefined && props.selected.length > 0 ? props.selected : []
      if (props.onRequestSelectionChange) {
        if (selected.find(c => c.Id === content.Id)) {
          props.onRequestSelectionChange(selected.filter(s => s.Id !== content.Id))
        } else {
          props.onRequestSelectionChange([...selected, content])
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onRequestSelectionChange, props.selected, props.items],
  )

  const defaultFieldComponents: React.FC<CellProps<GenericContent, keyof GenericContent>> = useCallback(
    fieldProps => {
      switch (fieldProps.field) {
        case 'DisplayName':
          return <DisplayNameCell content={fieldProps.content} isSelected={fieldProps.isSelected} icons={props.icons} />
        case 'Actions':
          if (fieldProps.content.Actions && fieldProps.content.Actions instanceof Array) {
            return (
              <ActionsCell
                actions={fieldProps.content.Actions as ActionModel[]}
                content={fieldProps.content}
                openActionMenu={ev =>
                  fieldProps.onRequestActionsMenu && fieldProps.onRequestActionsMenu(ev, fieldProps.content)
                }
              />
            )
          }
          break
        case 'ModificationDate':
          return <DateCell date={fieldProps.content.ModificationDate as string} />
        default:
          break
      }
      const field: any = fieldProps.content[fieldProps.field]
      if (field && field.Id && field.Path && field.DisplayName) {
        return <ReferenceCell content={field} fieldName={'DisplayName'} />
      }
      return <DefaultCell {...fieldProps} />
    },
    [props.icons],
  )

  const fieldSchemas = useMemo<{ [key: string]: FieldSetting }>(
    () =>
      props.schema.FieldSettings.reduce((v, field) => {
        ;(v as any)[field.Name] = props.schema.FieldSettings.find(s => s.Name === field.Name)
        return v
      }, {}),
    [props.schema.FieldSettings],
  )

  const getSchemaForField = useCallback((fieldName: string) => fieldSchemas[fieldName] as FieldSetting, [fieldSchemas])

  return (
    <Table>
      {props.hideHeader ? null : (
        <TableHead>
          <TableRow>
            {props.displayRowCheckbox !== false ? (
              <TableCell padding="checkbox" key="selectAll" style={{ width: '30px', paddingRight: 0 }}>
                <Checkbox
                  className="select-all"
                  indeterminate={
                    props.selected && props.selected.length > 0 && props.selected.length !== props.items.length
                      ? true
                      : false
                  }
                  checked={props.selected && props.selected.length === props.items.length ? true : false}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
            ) : null}
            {props.fieldsToDisplay.map(field => {
              const fieldSetting = getSchemaForField(field)
              const isNumeric =
                fieldSetting &&
                (fieldSetting.Type === 'IntegerFieldSetting' || fieldSetting.Type === 'NumberFieldSetting')
              const description = (fieldSetting && fieldSetting.Description) || field
              const displayName = (fieldSetting && fieldSetting.DisplayName) || field
              return (
                <TableCell key={field as string} align={isNumeric ? 'right' : 'inherit'} className={field as string}>
                  <Tooltip title={description}>
                    <TableSortLabel
                      active={props.orderBy === field}
                      direction={props.orderDirection}
                      onClick={() =>
                        props.onRequestOrderChange &&
                        props.onRequestOrderChange(field, props.orderDirection === 'asc' ? 'desc' : 'asc')
                      }>
                      {displayName}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {props.items.map(item => {
          const isSelected = props.selected && props.selected.find(s => s.Id === item.Id) ? true : false
          const isActive = props.active && props.active.Id === item.Id ? true : false
          return (
            <TableRow
              key={item.Id}
              hover={true}
              className={`${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${item.Type &&
                `type-${item.Type.toLowerCase()}`}`}
              selected={isActive}
              onClick={e => {
                props.onRequestActiveItemChange && props.onRequestActiveItemChange(item)
                props.onItemClick && props.onItemClick(e, item)
              }}
              onDoubleClick={e => {
                props.onItemDoubleClick && props.onItemDoubleClick(e, item)
              }}
              onTouchEnd={e => props.onItemTap && props.onItemTap(e, item)}
              onContextMenu={e => props.onItemContextMenu && props.onItemContextMenu(e, item)}>
              {props.displayRowCheckbox !== false ? (
                <TableCell padding="checkbox" key="select">
                  {props.getSelectionControl ? (
                    props.getSelectionControl(isSelected, item, () => handleContentSelection(item))
                  ) : (
                    <Checkbox
                      checked={isSelected ? true : false}
                      onChange={() => handleContentSelection(item)}
                      {...props.checkboxProps}
                    />
                  )}
                </TableCell>
              ) : null}
              {props.fieldsToDisplay.map(field => {
                const fieldSetting = getSchemaForField(field)
                const cellProps: CellProps = {
                  ...(props as ContentListProps),
                  field,
                  content: item,
                  fieldSetting,
                  isSelected,
                }

                const FieldComponent = props.fieldComponent || defaultFieldComponents
                return <FieldComponent key={cellProps.field} {...cellProps} />
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
