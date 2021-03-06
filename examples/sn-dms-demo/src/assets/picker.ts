import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { theme } from './theme'

export const pickerTheme = createMuiTheme({
  ...theme,
  overrides: {
    MuiPopover: {
      paper: {
        padding: 0,
      },
    },
    MuiDialogTitle: {
      root: {
        padding: 0,
      },
    },
    MuiToolbar: {
      root: {
        background: '#666',
        color: '#fff',
      },
      regular: {
        padding: 0,
        minHeight: '50px !important',
      },
    },
    MuiTypography: {
      h6: {
        fontFamily: 'Raleway Semibold',
        fontSize: 18,
        flex: 1,
        paddingLeft: theme.spacing(2),
      },
      subtitle1: {
        fontFamily: 'Raleway Medium',
        fontSize: 15,
        '&.selected, &.active': {
          color: '#fff',
        },
      },
      body1: {
        '&.picker-item': {
          [theme.breakpoints.down('md')]: {
            fontSize: 14,
          },
        },
        '&.picker-item-selected': {
          color: '#fff',
        },
        '&.picker-item-hovered': {
          color: '#fff',
        },
      },
    },
    MuiDialogContent: {
      root: {
        padding: 0,
        '&:first-child': {
          paddingTop: 0,
        },
      },
    },
    MuiList: {
      root: {
        padding: '0px !important',
        '&:hover': {
          color: '#fff !important',
        },
      },
    },
    MuiListItem: {
      root: {
        '&:hover': {
          backgroundColor: '#016D9E !important',
          '& path': {
            fill: '#fff',
          },
          '& span': {
            color: '#fff',
          },
        },
        borderBottom: 'solid 1px #ddd',
        '&$selected, &$selected:hover, &$selected:focus': {
          '& path': {
            fill: '#fff',
          },
          '& span': {
            color: '#fff',
          },
          backgroundColor: '#016d9e',
          color: '#fff',
        },
      },
      button: {
        '&:focus': { backgroundColor: 'unset' },
      },
      gutters: {
        padding: '12px !important',
      },
    },
    MuiListItemText: {
      root: {
        padding: 0,
        color: '#b0b0b0',
      },
    },
    MuiListItemIcon: {
      root: {
        color: '#b0b0b0',
      },
    },
    MuiDialogActions: {
      root: {
        margin: '6px 10px 6px 0px',
        '&.mobile-picker-buttonRow': {
          boxShadow: '0px -5px 10px 0px rgba(204,204,204,1)',
          margin: 0,
          padding: '5px 10px',
          display: 'flex',
          color: '#016D9E',
        },
      },
      spacing: {
        margin: 0,
      },
    },
    MuiButton: {
      contained: {
        [theme.breakpoints.down('md')]: {
          background: '#fff',
          color: '#016D9E',
          boxShadow: 'none',
        },
      },
    },
  },
})
