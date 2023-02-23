import { TableCell, Tooltip } from '@material-ui/core'
import { Switch } from '@sensenet/controls-react'
import { clsx } from 'clsx'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'

interface EnabledFieldProps {
  enabled: boolean
  description: string
  onChange?: (value: boolean) => Promise<boolean> | void
  displayName: string
}

export const EnabledField: FunctionComponent<EnabledFieldProps> = ({ enabled, description, onChange, displayName }) => {
  const globalClasses = useGlobalStyles()
  const [checked, setChecked] = useState(enabled)

  useEffect(() => {
    setChecked(!!enabled)
  }, [enabled])

  return (
    <TableCell className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle)} component="div">
      <Tooltip placeholder="bottom-end" title={description}>
        <Switch
          data-test={`switcher-${displayName.replace(/\s+/g, '-').toLowerCase()}`}
          checked={checked}
          size="small"
          onClick={async (event) => {
            const newValue = !checked
            event.stopPropagation()
            const isValueChanged = await onChange?.(newValue)

            if (isValueChanged || isValueChanged === undefined) {
              setChecked(newValue)
            }
          }}
        />
      </Tooltip>
    </TableCell>
  )
}
