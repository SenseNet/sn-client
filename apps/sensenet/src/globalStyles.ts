import { createStyles, makeStyles } from '@material-ui/core'

export const globals = {
  common: {
    //Fix sizes
    headerHeight: 80,
    //Colors
    headerBackground: '#353B4E',
    repoText: '#FFFFFFDE',
  },
  light: {},
  dark: {},
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
