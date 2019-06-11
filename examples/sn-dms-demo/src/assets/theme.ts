import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

import './css/raleway-font.css'

export const theme = createMuiTheme({
  palette: {
    common: {
      black: '#000',
      white: '#fff',
    },
    secondary: {
      light: '#80e27e',
      main: '#4caf50',
      dark: '#087f23',
      contrastText: '#fff',
    },
    primary: {
      light: '#509bcf',
      main: '#016d9e',
      dark: '#00426f',
      contrastText: '#fff',
    },
    error: {
      light: '#f44336',
      dark: '#f44336',
      main: '#f44336',
      contrastText: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#666',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Raleway Regular',
    button: {
      fontFamily: 'Raleway ExtraBold',
      fontSize: 14,
      textTransform: 'none',
      letterSpacing: '.1em',
    },
    body1: {
      color: '#000',
    },
    h5: {
      fontFamily: 'Raleway SemiBold',
      fontSize: 18,
    },
  },
  shape: {
    borderRadius: 2,
  },
})

export default theme
