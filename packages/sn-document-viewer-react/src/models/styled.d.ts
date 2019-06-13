import { Theme } from '@material-ui/core/styles'
import 'styled-components'

declare module 'styled-components' {
  /**
   * Extend the default theme with the material theme to
   * be able to style components with material theme.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
