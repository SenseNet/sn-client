import { createStyles, makeStyles } from '@material-ui/core'

export const globals = {
  common: {
    containerPadding: 1.5,
    linkColor: '#13a5ad',
  },
}

export const useGlobalStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      a: {
        textDecoration: 'unset',
        color: globals.common.linkColor,
      },
    },
    container: {
      display: 'flex',
      flexFlow: 'column',
    },
  })
})
