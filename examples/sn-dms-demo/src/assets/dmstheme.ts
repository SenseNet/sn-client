import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { theme } from './theme'

export const dmsTheme = createMuiTheme({
  ...theme,
  overrides: {
    MuiTypography: {
      h5: {
        [theme.breakpoints.down('md')]: {
          fontSize: 14,
        },
      },
      gutterBottom: {
        marginBottom: 10,
      },
    },
    MuiDialogContent: {
      root: {
        padding: '0 24px 24px',
        '&:first-child': {
          paddingTop: 24,
        },
      },
    },
    MuiListItem: {
      gutters: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    MuiListItemText: {
      primary: {
        [theme.breakpoints.down('md')]: {
          fontSize: 12,
          fontFamily: 'Raleway SemiBold',
          opacity: 0.54,
        },
      },
      secondary: {
        [theme.breakpoints.down('md')]: {
          fontSize: 13,
          fontFamily: 'Raleway Medium',
        },
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        minHeight: 64,
        expanded: {
          minHeight: 64,
        },
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: '0 24px 10px',
      },
    },
    MuiSnackbarContent: {
      message: {
        [theme.breakpoints.down('md')]: {
          width: '80%',
        },
      },
    },
    MuiInput: {
      inputMultiline: {
        [theme.breakpoints.down('md')]: {
          fontSize: 13,
        },
      },
    },
    MuiInputLabel: {
      root: {
        [theme.breakpoints.down('md')]: {
          fontSize: 14,
        },
      },
    },
    MuiIcon: {
      root: {
        '&.flaticon-upload-button:before': {
          fontSize: 16,
        },
      },
    },
    MuiFormHelperText: {
      root: {
        lineHeight: '1.5em',
        color: '#999',
      },
    },
  },
})
