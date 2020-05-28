import { GenericContent } from '@sensenet/default-content-types'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import TableCell from '@material-ui/core/TableCell'
import React from 'react'

interface RowCheckboxProps<T = GenericContent> {
  getSelectionControl?: (selected: boolean, content: T, callBack: () => void) => JSX.Element
  isSelected: boolean
  rowData: any
  checkboxProps?: CheckboxProps
  handleContentSelection: (item: any) => void
}

export const RowCheckbox: React.StatelessComponent<RowCheckboxProps> = (props) => {
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
