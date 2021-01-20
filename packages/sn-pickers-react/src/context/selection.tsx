import { GenericContent } from '@sensenet/default-content-types'
import React, { useCallback, useState } from 'react'

export interface SelectionState {
  selection: GenericContent[]
  setSelection: (nodes: GenericContent[]) => void
  allowMultiple: boolean
}

export const defaultSelectionState: SelectionState = {
  selection: [],
  setSelection: () => undefined,
  allowMultiple: false,
}

export const SelectionContext = React.createContext<SelectionState>(defaultSelectionState)

export const SelectionProvider: React.FC<{
  defaultValue?: GenericContent[]
  allowMultiple?: boolean
  selectionChangeCallback?: (selection: GenericContent[]) => void
}> = (props) => {
  const { allowMultiple = false, children, selectionChangeCallback } = props

  const [selection, setSelectionValue] = useState<GenericContent[]>(
    props.defaultValue?.length ? props.defaultValue : [],
  )

  const setSelection = useCallback(
    (nodes: GenericContent[]) => {
      const newSelection = allowMultiple ? nodes : nodes.slice(-1)
      setSelectionValue(newSelection)
      selectionChangeCallback?.(newSelection)
    },
    [allowMultiple, selectionChangeCallback],
  )

  return (
    <SelectionContext.Provider value={{ selection, setSelection, allowMultiple }}>{children}</SelectionContext.Provider>
  )
}
