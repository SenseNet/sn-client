import { deepMerge, ObservableValue } from '@sensenet/client-utils'
import defaultValues from '../localization/default'

export class LocalizationService {
  public currentValues = new ObservableValue(defaultValues)

  public async load(languageName: string) {
    try {
      const newLang = await import(`../localization/${languageName}`)

      this.currentValues.setValue(deepMerge(defaultValues, newLang.default))
    } catch (error) {
      console.warn(`Error loading localization for language '${languageName}'`)
    }
  }
}
