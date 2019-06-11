import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import Info from '@material-ui/icons/Info'
import React, { useState } from 'react'
import { useLocalization } from '../../hooks'
import { Component } from './version-info-models'

export const ComponentInfo: React.FunctionComponent<{ component: Component; update?: any }> = props => {
  const [isOpened, setIsOpened] = useState(false)
  const localization = useLocalization().versionInfo
  const itemStyle: React.CSSProperties = { padding: '0.3em' }

  return (
    <>
      <ListItemSecondaryAction>
        <IconButton onClick={() => setIsOpened(true)}>
          <Info />
        </IconButton>
      </ListItemSecondaryAction>
      <Drawer variant="temporary" anchor="bottom" open={isOpened} onClose={() => setIsOpened(false)}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '1em' }}>
          <div
            style={{
              border: 'none',
              borderRight: `1px solid rgba(128,128,128,0.3)`,
              paddingRight: '1em',
            }}>
            <Typography style={itemStyle}>{localization.version}</Typography>
            <Typography style={itemStyle}>{localization.lastOfficialVersion}</Typography>
            <Typography style={itemStyle}>{localization.description}</Typography>
          </div>
          <div style={{ paddingLeft: '1em' }}>
            <Typography style={itemStyle}>{props.component.Version}</Typography>
            <Typography style={itemStyle}>{props.update ? props.update.items[0].upper : '-'}</Typography>
            <Typography style={itemStyle}>{props.component.Description}</Typography>
          </div>
        </div>
      </Drawer>
    </>
  )
}
