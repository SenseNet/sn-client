import { AppBar, createStyles, IconButton, makeStyles, Toolbar } from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import { PathHelper } from '@sensenet/client-utils'
import { Settings } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/sensenet_white.png'
import { ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { CommandPalette } from '../command-palette/CommandPalette'
import { DesktopNavMenu } from './desktop-nav-menu'

const useStyles = makeStyles(() => {
  return createStyles({
    appBar: {
      position: 'relative',
      height: globals.common.headerHeight,
      boxShadow: 'none',
    },
    toolBar: {
      position: 'static',
      height: '100%',
      minHeight: '42px',
      paddingLeft: '6px',
      paddingRight: 0,
    },
    logo: {
      marginRight: '21px',
    },
    commandPaletteReplacement: {
      flex: 1,
      marginRight: '10px',
    },
    linkText: {
      marginRight: '2rem',
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  })
})

const PORTAL_SETTING_PATH = '/Root/System/Settings/Portal.settings'

export const DesktopAppBar: React.FunctionComponent<{ openDrawer?: () => void }> = (props) => {
  const personalSettings = useContext(ResponsivePersonalSettings)
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const logger = useLogger('desktop-app-bar')
  const [headerColor, setHeaderColor] = useState<string>(globals.common.headerBackground)

  const copyAddress = () => {
    navigator.clipboard.writeText(repository.configuration.repositoryUrl)
  }

  useEffect(() => {
    async function getPermissionSettingJSON() {
      try {
        const result = await repository.load<Settings>({
          idOrPath: PORTAL_SETTING_PATH,
        })
        const binaryPath = result.d.Binary?.__mediaresource.media_src
        if (!binaryPath) {
          return
        }
        const textFile = await repository.fetch(
          PathHelper.joinPaths(repository.configuration.repositoryUrl, binaryPath),
        )
        if (textFile.ok && textFile.body) {
          const reader = textFile.body.getReader()
          const decoder = new TextDecoder()
          let jsonString = ''
          let isDone = false
          while (!isDone) {
            const res = await reader.read()
            isDone = res.done
            jsonString += decoder.decode(res.value, { stream: true })
          }
          jsonString += decoder.decode()
          const setting = JSON.parse(jsonString)
          console.log('setting.HeaderColor:', setting.HeaderColor)
          setHeaderColor(setting.HeaderColor)
        }
      } catch (error) {
        logger.error({
          message: 'Something went wrong during getting portal settings',
          data: {
            error,
          },
        })
      }
    }
    getPermissionSettingJSON()
  }, [repository, logger])

  return (
    <AppBar
      position="sticky"
      style={{
        background: `linear-gradient(90deg,${headerColor} 0%, ${headerColor} 20%, rgba(1, 146, 219, 1) 40%)`,
      }}
      className={clsx(globalClasses.centeredHorizontal, classes.appBar)}>
      <Toolbar className={classes.toolBar}>
        <div className={globalClasses.centeredVertical}>
          <Link to="/" className={`${globalClasses.centeredVertical} ${classes.logo}`}>
            <img src={logo} alt="logo" data-test="sensenet-logo" width="29" height="32" />
          </Link>
          {personalSettings.drawer.type === 'temporary' ? (
            <IconButton
              onClick={() => {
                props.openDrawer && props.openDrawer()
              }}>
              <Menu />
            </IconButton>
          ) : null}
          <div
            className={classes.linkText}
            data-test="sensenet-header"
            onClick={copyAddress}
            title="Copy to Clipboard ">
            {repository.configuration.repositoryUrl}
          </div>
        </div>

        {personalSettings.commandPalette.enabled ? (
          <CommandPalette />
        ) : (
          <div className={classes.commandPaletteReplacement} />
        )}
        <DesktopNavMenu />
      </Toolbar>
    </AppBar>
  )
}
