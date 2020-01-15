import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import zIndex from '@material-ui/core/styles/zIndex'

const theme: ThemeOptions = {
  palette: {
    type: 'light',
    secondary: {
      light: '#90caf9',
      main: '#1976d2',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    primary: {
      light: '#80cbc4',
      main: '#26a69a',
      dark: '#00796b',
      contrastText: '#fff',
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        zIndex: zIndex.drawer + 1,
      },
    },
    MuiTableCell: {
      root: {
        padding: '4px 56px 4px 24px',
      },
    },
  },
}

export default theme
