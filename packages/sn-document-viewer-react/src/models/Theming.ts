import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

/**
 * The default theme
 */
export const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#3c91f1',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
  },
  overrides: {
    MuiTypography: {
      h4: { padding: '10px', paddingBottom: '16px' },
    },
    MuiCard: {
      root: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: '16px',
        },
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: '#fff',
      },
      multiline: {
        padding: '27px 0px 10px 10px',
      },
    },
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
        backgroundColor: '#fff',
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
