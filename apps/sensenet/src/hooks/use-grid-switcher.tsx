import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Button, ButtonGroup } from '@material-ui/core'
import React, { useState } from 'react'

interface GridSwitcherItem {
  icon?: JSX.Element
  name: string
  displayName: string
  schema?: string
  fieldsToDisplay: string[]
  loadSettings?: ODataParams<GenericContent>
}

interface GridSwitcherProps {
  config: GridSwitcherItem[]
  defaultItem: GridSwitcherItem
}

export const useGridSwitcher = ({ config, defaultItem }: GridSwitcherProps) => {
  const [activeItem, setActiveItem] = useState<GridSwitcherItem>(defaultItem)

  function renderButtons() {
    return (
      <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
        {config.map((item) => (
          <Button
            key={item.name}
            startIcon={item.icon}
            onClick={() => setActiveItem(item)}
            style={activeItem.name !== item.name ? { backgroundColor: '#929292' } : {}}>
            {item.displayName}
          </Button>
        ))}
      </ButtonGroup>
    )
  }

  return {
    activeItem,
    renderButtons,
  }
}
