import { GenericContent } from '@sensenet/default-content-types'
import Checkbox from '@material-ui/core/Checkbox'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useSelectionService } from '../hooks'
import { Icon } from './Icon'

type SelectionControlProps = {
  isSelected: boolean
  content: GenericContent
  onChangeCallback: () => void
}

export const SelectionControl: FunctionComponent<SelectionControlProps> = ({
  isSelected,
  content,
  onChangeCallback,
}) => {
  const selectionService = useSelectionService()
  const [selection, setSelection] = useState(selectionService.selection.getValue())

  useEffect(() => {
    const selectionComponentObserve = selectionService.selection.subscribe((newSelectedComponents) =>
      setSelection(newSelectedComponents),
    )

    return function cleanup() {
      selectionComponentObserve.dispose()
    }
  }, [selectionService.selection])

  return (
    <div
      data-test={`table-row-selection-control-${content.Name.replace(/\s+/g, '-').toLowerCase()}`}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
      <Checkbox
        checked={isSelected}
        style={{ display: selection.length > 0 ? undefined : 'none' }}
        onChange={onChangeCallback}
        color="primary"
      />
      <Icon item={content} style={{ display: selection.length > 0 ? 'none' : undefined }} />
    </div>
  )
}
