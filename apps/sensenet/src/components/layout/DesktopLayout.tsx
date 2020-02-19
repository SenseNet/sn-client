import CssBaseline from '@material-ui/core/CssBaseline'
import React, { useContext, useEffect, useState } from 'react'

import { useInjector, useRepository } from '@sensenet/hooks-react'
import snLogo from '../../assets/sensenet_logo_transparent.png'
import { ResponsivePersonalSetttings } from '../../context'
import { DesktopAppBar } from '../appbar/desktop-app-bar'
import { PermanentDrawer } from '../drawer/PermanentDrawer'
import { TemporaryDrawer } from '../drawer/TemporaryDrawer'
import { CustomActionCommandProvider } from '../../services/CommandProviders/CustomActionCommandProvider'
import { useDialog } from '../dialogs'
import { getMonacoModelUri } from '../edit/TextEditor'

export const DesktopLayout: React.FunctionComponent = props => {
  const settings = useContext(ResponsivePersonalSetttings)
  const repo = useRepository()
  const { openDialog, closeLastDialog } = useDialog()
  const customActionService = useInjector().getInstance(CustomActionCommandProvider)
  const [tempDrawerOpened, setTempDrawerOpened] = useState(false)

  useEffect(() => {
    const observables = [
      customActionService.onExecuteAction.subscribe(value => {
        const uri = getMonacoModelUri(value.content, repo, value.action)
        openDialog({ name: 'execute-action', props: { actionValue: value, uri } })
      }),
      customActionService.onActionExecuted.subscribe(value => {
        closeLastDialog()
        const response = JSON.stringify(
          {
            content: {
              Id: value.content.Id,
              Path: value.content.Path,
              Name: value.content.Name,
            },
            action: value.action.Name,
            response: value.response,
          },
          undefined,
          3,
        )
        openDialog({ name: 'custom-action-result', props: { response } })
      }),
    ]
    return () => observables.forEach(o => o.dispose())
  }, [closeLastDialog, customActionService.onActionExecuted, customActionService.onExecuteAction, openDialog, repo])

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
          height: 'calc(100% - 64px)',
          width: '100%',
          position: 'relative',
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
