import { useInjector, useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { CustomActionCommandProvider } from '../../services/CommandProviders/CustomActionCommandProvider'
import { DesktopAppBar } from '../appbar/desktop-app-bar'
import { useDialog } from '../dialogs'
import { PermanentDrawer } from '../drawer/PermanentDrawer'
import { TemporaryDrawer } from '../drawer/TemporaryDrawer'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    desktopLayoutWrapper: {
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
    },
    drawerandContentSlot: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'row',
      position: 'relative',
      height: `calc(100% - ${globals.common.headerHeight}px)`,
      width: '100%',
    },
    contentSlot: {
      display: 'flex',
      flexGrow: 1,
      flexFlow: 'column',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      height: '100%',
      paddingTop: '10px',
      '& > *': {
        paddingLeft: `${globals.common.explorePaddingLeft}`,
      },
    },
    executeActionPaper: {
      height: '100%',
      backgroundColor: theme.palette.type === 'light' ? globals.light.dialogBackground : globals.dark.dialogBackground,
      border: theme.palette.type === 'light' ? clsx(globals.light.borderColor, '1px') : 'none',
    },
  })
})

export const DesktopLayout: React.FunctionComponent = (props) => {
  const settings = useContext(ResponsivePersonalSettings)
  const repo = useRepository()
  const { openDialog, closeLastDialog } = useDialog()
  const customActionService = useInjector().getInstance(CustomActionCommandProvider)
  const [tempDrawerOpened, setTempDrawerOpened] = useState(false)
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  useEffect(() => {
    const observables = [
      customActionService.onExecuteAction.subscribe(async (value) => {
        openDialog({
          name: 'execute-action',
          props: { actionValue: value },
          dialogProps: value.metadata?.parameters?.length
            ? { classes: { paper: classes.executeActionPaper } }
            : undefined,
        })
      }),
      customActionService.onActionExecuted.subscribe((value) => {
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
    return () => observables.forEach((o) => o.dispose())
  }, [
    closeLastDialog,
    customActionService.onActionExecuted,
    customActionService.onExecuteAction,
    openDialog,
    repo,
    classes.executeActionPaper,
  ])

  return (
    <div className={clsx(globalClasses.full, classes.desktopLayoutWrapper)}>
      <DesktopAppBar openDrawer={() => setTempDrawerOpened(!tempDrawerOpened)} />
      <div className={classes.drawerandContentSlot}>
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

        <div className={classes.contentSlot}>{props.children}</div>
      </div>
    </div>
  )
}
