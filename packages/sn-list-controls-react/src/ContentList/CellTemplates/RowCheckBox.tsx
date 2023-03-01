import { Checkbox, CheckboxProps, TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'

interface RowCheckboxProps<T = GenericContent> {
  getSelectionControl?: (selected: boolean, content: T, callBack: () => void) => JSX.Element
  isSelected: boolean
  rowData: any
  checkboxProps?: CheckboxProps
  handleContentSelection: (item: any) => void
}

export const RowCheckbox: React.FunctionComponent<RowCheckboxProps> = (props) => {
  return (
    <TableCell
      style={{ height: '57px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}
      component="div"
      padding="checkbox"
      key="select">
      {props.getSelectionControl ? (
        props.getSelectionControl(props.isSelected, props.rowData, () => props.handleContentSelection(props.rowData))
      ) : (
        <Checkbox
          checked={props.isSelected ? true : false}
          onChange={() => props.handleContentSelection(props.rowData)}
          {...props.checkboxProps}
        />
      )}
    </TableCell>
  )
}
