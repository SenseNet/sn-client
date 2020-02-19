import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import React from 'react'
import { useLocalization, useTheme } from '../hooks'
import { useDialog } from './dialogs'

export type LogoutButtonProps = {
  buttonStyle?: React.CSSProperties
}

export const LogoutButton: React.FunctionComponent<LogoutButtonProps> = props => {
  const theme = useTheme()
  const localization = useLocalization().logout
  const { openDialog } = useDialog()

  const onClick = () => {
    openDialog({ name: 'logout' })
  }

  return (
    <div>
      <Tooltip placement="bottom-end" title={localization.logoutButtonTitle}>
        <Button
          aria-label="{localization.logoutButtonTitle}"
          onClick={onClick}
          style={{ minWidth: 20, paddingTop: 4, paddingBottom: 4, borderRadius: 0 }}>
          <PowerSettingsNew style={{ ...props.buttonStyle, color: theme.palette.text.primary }} />
        </Button>
      </Tooltip>
    </div>
  )
}
