import { DeepPartial } from '@sensenet/client-utils'

const values: DeepPartial<typeof import('./default').default> = {
  CommandPaletteTitle: 'Command palette megnyitása',
  personalSettings: {
    languageTitle: 'A választott nyelv megnevezése',
    themeTitle: 'Téma beállítása',
  },
}

export default values
