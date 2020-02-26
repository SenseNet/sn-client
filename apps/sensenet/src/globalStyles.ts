import { createStyles, makeStyles } from '@material-ui/core'

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
  },
  dark: {
    navMenuColor: 'rgba(18, 18, 18, 0.16)',
  },
}

export const useGlobalStyles = makeStyles(() => {
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
  })
})
