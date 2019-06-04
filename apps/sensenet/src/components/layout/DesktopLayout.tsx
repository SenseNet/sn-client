import CssBaseline from '@material-ui/core/CssBaseline'
import React, { useState } from 'react'
import { useContext } from 'react'
import snLogo from '../../assets/sensenet_logo_transparent.png'
import { ResponsivePersonalSetttings } from '../../context'
import { DesktopAppBar } from '../appbar/DesktopAppBar'
import { PermanentDrawer } from '../drawer/PermanentDrawer'
import { TemporaryDrawer } from '../drawer/TemporaryDrawer'

export const DesktopLayout: React.FunctionComponent = props => {
  const settings = useContext(ResponsivePersonalSetttings)
  const [tempDrawerOpened, setTempDrawerOpened] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}>
      <CssBaseline />
      <DesktopAppBar openDrawer={() => setTempDrawerOpened(!tempDrawerOpened)} />
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          width: '100%',
        }}>
        {settings.drawer.enabled ? (
          <>
            {settings.drawer.type === 'temporary' ? (
              <TemporaryDrawer
                onClose={() => setTempDrawerOpened(false)}
                onOpen={() => setTempDrawerOpened(true)}
                isOpened={tempDrawerOpened}
              />
            ) : (
              <PermanentDrawer />
            )}
          </>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${snLogo})`,
            backgroundSize: 'contain',
            overflow: 'hidden',
            height: '100%',
          }}>
          {props.children}
        </div>
      </div>
    </div>
  )
}
