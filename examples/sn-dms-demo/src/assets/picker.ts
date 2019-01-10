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
      // root: {
      //     '&.selected, &.active, &:hover, &.active:hover': {
      //         color: '#fff !important',
      //     },
      // },
      title: {
        fontFamily: 'Raleway Semibold',
        fontSize: 18,
        flex: 1,
      },
      subheading: {
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
        marginRight: 10,
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
      action: {
        margin: 0,
      },
    },
    MuiButton: {
      raised: {
        [theme.breakpoints.down('md')]: {
          background: '#fff',
          color: '#016D9E',
          boxShadow: 'none',
        },
      },
      contained: {
        [theme.breakpoints.down('md')]: {
          background: '#fff',
          color: '#016D9E',
          boxShadow: 'none',
        },
      },
      // '&$disabled': {
      //   background: '#fff',
      //   color: '#016D9E',
      //   boxShadow: 'none',
      //   // '&.disabled-mobile-button': {
      //   //   [theme.breakpoints.down('md')]: {
      //   //     background: '#fff',
      //   //     color: '#016D9E',
      //   //     opacity: 0.25,
      //   //   },
      //   // },
      // },
    } as any,
  },
})
