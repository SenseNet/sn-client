/**
 * @module sn-controls-react
 *
 *
 */
import { FieldSetting } from '@sensenet/default-content-types'

/**
 * class
 * @description Base class for React client field config
 */
export class ReactClientFieldConfig<TFieldSettings extends FieldSetting> {
  constructor(public readonly fieldSettings: TFieldSettings) {}
}
