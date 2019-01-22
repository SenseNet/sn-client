/**
 * @module FieldControls
 *
 */ /** */
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import React, { Component } from 'react'
import { ReactBinaryFieldSetting } from '../BinaryFieldSetting'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'

// const styles = {
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   label: {
//     color: 'rgba(0, 0, 0, 0.54)',
//     padding: 0,
//     fontSize: '12px',
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     lineHeight: 1,
//   },
// }

/**
 * Interface for Name properties
 */
export interface ImageProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactBinaryFieldSetting<T, K> {}
/**
 * Interface for Name state
 */
export interface ImageState {
  value: string
  error: string
  filename: string
}
/**
 * Field control that represents a Image field. Available values will be populated from the FieldSettings.
 */
@Radium
export class Image<T extends GenericContent, K extends keyof T> extends Component<ImageProps<T, K>, ImageState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ImageProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props['data-fieldValue']).toString(),
      error: '',
      filename: this.props.value || '',
    }

    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * convert incoming default value string to proper format
   * @param {string} value
   */
  public setValue(value: string) {
    if (value) {
      return value.replace(/<[^>]*>/g, '')
    } else {
      if (this.props['data-defaultValue']) {
        return this.props['data-defaultValue']
      } else {
        return ''
      }
    }
  }
  /**
   * Handles input changes. Dispatches a redux action to change field value in the state tree.
   * @param e
   */
  public handleChange(e: React.ChangeEvent) {
    const { onChange } = this.props
    // tslint:disable-next-line:no-string-literal
    const value = e.target['value']
    this.setState({ value })
    onChange(this.props.name, value)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props['data-actionName']) {
      case 'edit':
        return <div>aaa</div>
      case 'new':
        return <div>aaa</div>
      case 'browse':
        return this.props.value && this.props.value.length > 0 ? <div>aaa</div> : null
      default:
        return this.props.value && this.props.value.length > 0 ? (
          <div className={this.props.className}>
            <Typography variant="caption" gutterBottom={true}>
              {this.props['data-labelText']}
            </Typography>
            <Typography variant="body2" gutterBottom={true}>
              {this.props.value}
            </Typography>
          </div>
        ) : null
    }
  }
}

// TODO
// előnézet (ha van benne vmi, kiolvasni, ha new, vagy nincs, akkor default image oda)
// edit ikon a képre
// edit ikonra katt feljön az upload és a reference
// amelyik utoljára változik, abból frissül be az előnézet
