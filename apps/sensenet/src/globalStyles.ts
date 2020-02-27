import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const globals = {
  common: {
    //Fix sizes
    headerHeight: 80,
    //Colors
    headerBackground: '#353B4E',
    headerText: 'rgba(255,255,255,0.87)',
  },
  light: {
    navMenuColor: '#F6F6F6',
    navMenuBorderColor: '#E2E2E2',
    textColor: 'rgba(0,0,0,0.87)',
  },
  dark: {
    navMenuColor: 'rgba(255, 255, 255, 0.16)',
    textColor: 'rgba(255,255,255,0.87)',
  },
}

export const useGlobalStyles = makeStyles((theme: Theme) => {
  return createStyles({
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
      width: '28px',
      height: '28px',
      minHeight: 0,
      padding: 0,
      backgroundColor: theme.palette.primary.main,
    },
    drawerIconButtonWrapper: {
      height: '65px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
  })
})
