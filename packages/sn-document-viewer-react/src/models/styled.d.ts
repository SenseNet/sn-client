import { Theme } from '@material-ui/core/styles'
import 'styled-components'

declare module 'styled-components' {
  /**
   * Extend the default theme with the material theme to
   * be able to style components with material theme.
   */
  export interface DefaultTheme extends Theme {}
}
