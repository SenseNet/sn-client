import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'

export const globals = {
  common: {
    //Fix sizes
    headerHeight: 80,
    drawerWidthCollapsed: 90,
    drawerWidthExpanded: 250,
    drawerItemHeight: 65,
    //Colors
    headerBackground: '#353B4E',
    headerText: 'rgba(255,255,255,0.87)',
  },
  light: {
    navMenuColor: '#F6F6F6',
    borderColor: '#E2E2E2',
    drawerBackground: '#F8F8F8',
    textColor: 'rgba(0,0,0,0.87)',
    dialogBackground: '#F8F8F8',
  },
  dark: {
    navMenuColor: 'rgba(255, 255, 255, 0.16)',
    drawerBackground: 'rgba(255,255,255, 0.05)',
    textColor: 'rgba(255,255,255,0.87)',
    dialogBackground: 'rgba(255, 255, 255, 0.12)',
  },
}

export const useGlobalStyles = makeStyles((theme: Theme) => {
  return createStyles({
    '@global': {
      a: {
        textDecoration: 'unset',
      },
    },
    centered: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredHorizontal: {
      display: 'flex',
      justifyContent: 'center',
    },
    centeredVertical: {
      display: 'flex',
      alignItems: 'center',
    },
    relative: {
      position: 'relative',
    },
    full: {
      width: '100%',
      height: '100%',
    },
    contentWrapper: {
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      width: '100%',
      padding: '30px 0 0 30px',
      overflowY: 'auto',
    },
    contentTitle: {
      padding: '0 0 48px 15px',
    },
    drawerButton: {
      width: '32px',
      height: '32px',
      minHeight: 0,
      padding: 0,
      margin: '0.5rem 0.5rem',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    drawerButtonIcon: {
      color: theme.palette.common.white,
    },
    drawerButtonExpanded: {
      width: '32px',
      height: '32px',
      minHeight: 0,
      padding: 0,
      backgroundColor: theme.palette.primary.main,
    },
    drawerIconButtonWrapper: {
      height: globals.common.drawerItemHeight,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    virtualizedCellStyle: {
      height: '57px',
      width: '100%',
      padding: 0,
    },
    dialog: {
      backgroundColor: theme.palette.type === 'light' ? globals.light.dialogBackground : globals.dark.dialogBackground,
      border: theme.palette.type === 'light' ? clsx(globals.light.borderColor, '1px') : 'none',
    },
  })
})
