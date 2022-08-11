/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable-next-line import/no-unresolved */
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides'

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P]
}

type CustomType = {
  MuiPickersBasePicker: {
    pickerView: {
      backgroundColor?: string
    }
  }
}

declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey extends overridesNameToClassKey {}
  export interface ComponentNameToClassKey extends CustomType {}
}
