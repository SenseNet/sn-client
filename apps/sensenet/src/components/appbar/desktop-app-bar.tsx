import { AppBar, createStyles, makeStyles, Toolbar } from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/sensenet_white.png'
import { ResponsiveContext, ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { loadRepositorySettings } from '../../services/repository-settings-service'
import { CommandPalette } from '../command-palette/CommandPalette'
import { DesktopNavMenu } from './desktop-nav-menu'
import '../drawer/app-navigation.css'

const useStyles = makeStyles((theme) => {
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
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '2px',
      },
    },
    logo: {
      marginRight: '21px',
      [theme.breakpoints.down('sm')]: {
        marginRight: '4px',
      },
    },
    drawerButton: {
      padding: '8px',
      marginRight: '2px',
      flex: '0 0 auto',
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
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '36vw',
      '&:hover': {
        cursor: 'pointer',
      },
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
})

export const DesktopAppBar: React.FunctionComponent<{ openDrawer?: () => void; drawerOpened?: boolean }> = (props) => {
  const personalSettings = useContext(ResponsivePersonalSettings)
  const device = useContext(ResponsiveContext)
  const localization = useLocalization().drawer
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const logger = useLogger('desktop-app-bar')
  const [headerColor, setHeaderColor] = useState<string>(globals.common.headerBackground)

  const copyAddress = () => {
    navigator.clipboard.writeText(repository.configuration.repositoryUrl)
  }

  useEffect(() => {
    const controller = new AbortController()
    setHeaderColor(globals.common.headerBackground)
    async function loadHeaderColor() {
      try {
        const settings = await loadRepositorySettings(repository, '/Root', 'Portal', controller.signal)
        const color = settings?.HeaderColor
        if (!controller.signal.aborted && typeof color === 'string' && CSS.supports('color', color)) {
          setHeaderColor(color)
        }
      } catch (error) {
        if (controller.signal.aborted) return
        // Optional branding must not add a second failure notification to a failed folder load.
        logger.debug({
          message: 'Could not load the portal header color; using the default.',
          data: { error, relatedRepository: repository.configuration.repositoryUrl },
        })
      }
    }
    void loadHeaderColor()
    return () => controller.abort()
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
          {personalSettings.drawer.enabled && (personalSettings.drawer.type === 'temporary' || device === 'mobile') ? (
            <button
              type="button"
              className="sn-app-navigation-opener"
              aria-label={localization.openNavigation}
              title={localization.openNavigation}
              aria-expanded={props.drawerOpened || false}
              aria-controls="app-navigation-drawer"
              data-test="app-navigation-toggle"
              onClick={() => {
                props.openDrawer && props.openDrawer()
              }}>
              <Menu />
            </button>
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
