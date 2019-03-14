import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

/**
 * The default theme
 */
export const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: 'transparent',
      },
      docked: {
        backgroundColor: '#eaeaeb',
      },
    },
    MuiToolbar: {
      root: {
        backgroundColor: '#2a2a2c',
        color: '#707070',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
  },
  typography: {
    useNextVariants: true,
  },
})
