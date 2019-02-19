import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { DefaultItemTemplate } from './DefaultItemTemplate'
import { ReactReferenceGridFieldSetting } from './ReferenceGridFieldSettings'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  listContainer: {
    display: 'block',
  },
}

const ADD_REFERENCECE = 'Add reference'

const emptyContent = {
  DisplayName: ADD_REFERENCECE,
  Icon: 'link',
} as GenericContent

/**
 * Interface for RefernceGrid properties
 */
export interface ReferenceGridProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactReferenceGridFieldSetting<T, K> {}
/**
 * Interface for TagsInput state
 */
export interface ReferenceGridState<T extends GenericContent, _K extends keyof T> {
  fieldValue: any
  itemLabel: string
}

export class ReferenceGrid<T extends GenericContent, K extends keyof T> extends Component<
  ReferenceGridProps<T, K>,
  ReferenceGridState<T, K>
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ReferenceGrid<T, K>['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value default value
     */
    this.state = {
      fieldValue: this.props['data-fieldValue'] || this.props['data-defaultValue'] || [emptyContent],
      itemLabel: this.props['data-defaultDisplayName'] || 'DisplayName',
    }
    this.getSelected = this.getSelected.bind(this)
    if (this.props['data-actionName'] === 'edit') {
      this.getSelected()
    }
  }
  /**
   * getSelected
   * @return {GenericContent[]}
   */
  public async getSelected() {
    // tslint:disable:no-string-literal
    const loadPath = this.props['content']
      ? PathHelper.joinPaths(PathHelper.getContentUrl(this.props['content'].Path), '/', this.props.name.toString())
      : ''
    const references = await this.props['data-repository'].loadCollection({
      path: loadPath,
      oDataOptions: {
        select: 'all',
      },
    })
    this.setState({
      fieldValue:
        references.d.results.length > 0
          ? references.d.results.map((item: GenericContent) => ({
              // tslint:disable-next-line:no-string-literal
              DisplayName: item.DisplayName,
              Icon: item.Icon,
              Id: item.Id,
            }))
          : [],
    })
    return references
  }
  /**
   * Removes the chosen item from the grid and the field value
   */
  public removeItem = (id: number) => {
    this.setState({
      fieldValue: this.state.fieldValue.filter((item: GenericContent) => item.Id !== id),
    })
  }
  /**
   * Opens a picker to choose an item to add into the grid and the field value
   */
  public addItem = () => {
    console.log('add')
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const { className, name, required, itemTemplate } = this.props
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <FormControl
            className={className}
            style={styles.root as any}
            key={name as string}
            component={'fieldset' as 'div'}
            required={required}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props['data-labelText']}
            </InputLabel>
            <List dense={true} style={styles.listContainer}>
              {this.state.fieldValue.map((item: GenericContent) => {
                if (itemTemplate) {
                  return itemTemplate(item)
                } else {
                  return (
                    <DefaultItemTemplate content={item} remove={this.removeItem} add={this.addItem} key={item.Id} />
                  )
                }
              })}
            </List>
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}
          </FormControl>
        )
      case 'new':
        return (
          <FormControl
            className={className}
            style={styles.root as any}
            key={name as string}
            component={'fieldset' as 'div'}
            required={required}>
            <InputLabel htmlFor={name as string}>{this.props['data-labelText']}</InputLabel>

            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'browse':
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <FormGroup>
              {this.props['data-fieldValue'].map((value: any) => (
                <FormControl component={'fieldset' as 'div'}>
                  <FormControlLabel style={{ marginLeft: 0 }} label="aaa" control={<span />} key={value} />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
      default:
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <FormGroup>
              {this.props['data-fieldValue'].map((value: any) => (
                <FormControl component={'fieldset' as 'div'}>
                  <FormControlLabel style={{ marginLeft: 0 }} label="aaa" control={<span />} key={value} />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
    }
  }
}
