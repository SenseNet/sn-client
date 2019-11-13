import { deepMerge, Injectable, ObservableValue } from '@sensenet/client-utils'
import defaultValues from '../localization/default'

/**
 * Service class that loads localizations from a dynamic import and updates an observable object with its values
 */
@Injectable({ lifetime: 'singleton' })
export class LocalizationService {
  /**
   * An observable that will be updated with the current localization values after loading new localization info
   */
  public currentValues = new ObservableValue(defaultValues)

  /**
   * Loads a specified language module and updates the observable languages object
   * @param languageName The name of the language module (e.g. 'default' or 'hungarian')
   */
  public async load(languageName: string) {
    try {
      const newLang = await import(`../localization/${languageName}`)
      this.currentValues.setValue(deepMerge(defaultValues, newLang.default))
    } catch (error) {
      console.warn(`Error loading localization for language '${languageName}'`)
    }
  }
}
