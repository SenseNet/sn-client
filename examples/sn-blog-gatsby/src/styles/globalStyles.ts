import { createStyles, makeStyles } from '@material-ui/core'

export const globals = {
  common: {
    containerPadding: 1.5,
    linkColor: '#13a5ad',
    blogCardImageHeight: 270,
    borderRadius: 25,
    headerColor: '#353b4e !important',
  },
}

export const useGlobalStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      a: {
        textDecoration: 'unset',
        color: globals.common.linkColor,
      },
      img: {
        maxWidth: '100%',
      },
    },
  })
})

export const commonElementStyles = () => {
  return createStyles({
    container: {
      display: 'flex',
      flexFlow: 'column',
      flex: 1,
      position: 'relative',
      padding: `${globals.common.containerPadding}rem 0`,
      marginBottom: '3rem',
    },
  })
}
