/**
 * @module FieldControls
 */
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Content, ODataCollectionResponse } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { renderIconDefault } from '../icon'
import { ReactReferenceFieldSetting } from '../ReferenceFieldSetting'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const DEFAULT_AVATAR_PATH = '/Root/Sites/Default_Site/demoavatars/Admin.png'
const menuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}

/**
 * Interface for TagsInput properties
 */
export interface TagsInputProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactReferenceFieldSetting<T, K> {}
/**
 * Interface for TagsInput state
 */
export interface TagsInputState<T extends GenericContent, _K extends keyof T> {
  label: string
  dataSource: any[]
  fieldValue: any
}
/**
 * Field control that represents a Reference field. Available values will be populated from the FieldSettings.
 */
export class TagsInput<T extends GenericContent, K extends keyof T> extends Component<
  TagsInputProps<T, K>,
  TagsInputState<T, K>
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: TagsInputProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {any[]} chips array of chips input value
     * @property {any[]} dataSource array of data for autocomplete
     */

    this.search = this.search.bind(this)
    if (this.props.dataSource && this.props.dataSource.length > 0) {
      this.state = {
        dataSource: this.props.dataSource.map(suggestion => ({
          value: suggestion.Id,
          label: suggestion.DisplayName,
          avatar: suggestion.Avatar || {},
          type: suggestion.Type || 'GenericContent',
        })),
        label: this.props['data-defaultDisplayName'] || 'DisplayName',
        fieldValue: this.props.dataSource
          ? this.props.dataSource.map(data => ({
              value: data['Id'],
              label: data['DisplayName'],
              avatar: data['Avatar'] || {},
              type: data['Type'] || 'GenericContent',
            }))
          : [],
      }
      if (this.props['data-actionName'] !== 'new') {
        this.getSelected()
        this.handleChange = this.handleChange.bind(this)
      }
    } else {
      this.state = {
        dataSource: [],
        label: this.props['data-defaultDisplayName'] || 'DisplayName',
        fieldValue: this.props['data-fieldValue'] ? this.props['data-fieldValue'] : [],
      }
      this.search()
    }
    this.getSelected = this.getSelected.bind(this)
  }
  /**
   * handles input changes
   */
  public handleChange = (e: React.ChangeEvent) => {
    const { name, onChange } = this.props
    const selected = this.state.fieldValue
    let s = selected
    const selectedContent = this.getContentById(e.target['value'])

    this.props['data-allowMultiple'] !== undefined && this.props['data-allowMultiple']
      ? this.isSelected(selectedContent)
        ? (s = selected)
        : s.push(selectedContent)
      : (s = [selectedContent])

    this.setState({
      fieldValue: s,
    })
    onChange(name, s.map((content: any) => content.value))
  }
  /**
   * returns referencefields' datasource
   * @param path
   */
  public async search(): Promise<ODataCollectionResponse<Content>> {
    const selectionRoot = this.props['data-selectionRoot'] || []
    const allowedTypes = this.props['data-allowedTypes'] || ['GenericContent']

    let pathQuery = ''
    selectionRoot.map((selectionPath, index) => {
      pathQuery += index === 0 ? `InTree:${selectionPath}` : `OR InTree:${selectionPath}`
    })
    let typeQuery = ''
    allowedTypes.map(type => {
      typeQuery += ` +TypeIs:${type}`
    })
    const repo = this.props['data-repository'] || this.props.repository
    const req = await repo.loadCollection({
      path: '/Root',
      oDataOptions: {
        query: `(${pathQuery}) AND${typeQuery}`,
        select: 'all',
      },
    })
    const { label } = this.state
    this.setState({
      dataSource: req.d.results.map((suggestion: GenericContent) => ({
        value: suggestion['Id'],
        label: suggestion[label] || suggestion['DisplayName'],
        avatar: suggestion['Avatar'] || {},
        type: suggestion['Type'] || 'GenericContent',
      })),
    })
    if (this.props['data-actionName'] !== 'new') {
      this.getSelected()
      this.handleChange = this.handleChange.bind(this)
    }
    return req
  }
  /**
   * getSelected
   * @return {any[]}
   */
  public async getSelected() {
    const repo = this.props['data-repository'] || this.props.repository
    const loadPath = this.props['content']
      ? PathHelper.joinPaths(PathHelper.getContentUrl(this.props['content'].Path), '/', this.props.name.toString())
      : ''
    const references = await repo.loadCollection({
      path: loadPath,
      oDataOptions: {
        select: 'all',
      },
    })
    const { label } = this.state
    const results = references.d.results ? references.d.results : [references.d]
    this.setState({
      fieldValue: results.map((item: GenericContent) => ({
        value: item['Id'],
        label: item[label],
        avatar: item['Avatar'] || {},
        type: item['Type'] || 'GenericContent',
      })),
    })

    if (this.props.dataSource && this.props.dataSource.length > 0) {
      this.setState({
        fieldValue: this.props.dataSource.map((item: GenericContent) => ({
          value: item['Id'],
          label: item[label],
          avatar: item['Avatar'] || {},
          type: item['Type'] || 'GenericContent',
        })),
      })
    }

    return references
  }
  /**
   * returns a content by its id
   */
  public getContentById = (id: number) => {
    return this.state.dataSource.find(item => item.value === id)
  }
  /**
   * returns whether the content with the given id is selected or not
   */
  public isSelected = (id: number) => {
    return this.state.fieldValue.indexOf(id) > -1
  }
  public handleDelete = (id: number) => {
    const { name, onChange } = this.props
    const newValue = this.state.fieldValue.filter((item: any) => item.value !== id)
    this.setState({
      fieldValue: newValue,
    })

    onChange(name, newValue.map((content: any) => content.value))
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const repo = this.props['data-repository'] || this.props.repository
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <FormControl
            className={this.props.className}
            style={styles.root as any}
            key={this.props.name as string}
            component={'fieldset' as 'div'}
            required={this.props.required}>
            <InputLabel htmlFor={this.props.name as string}>{this.props['data-labelText']}</InputLabel>
            <Select
              value={this.state.fieldValue}
              onChange={e => this.handleChange(e)}
              input={<Input id={this.props.name as string} fullWidth={true} />}
              renderValue={() => (
                <div style={styles.chips as any}>
                  {this.state.fieldValue.map((content: any) =>
                    this.getContentById(content.value).type === 'User' && this.getContentById(content.value).avatar ? (
                      <Chip
                        avatar={
                          <Avatar
                            alt={this.getContentById(content.value).label}
                            src={
                              this.getContentById(content.value).avatar.Url
                                ? `${repo.configuration.repositoryUrl}${this.getContentById(content.value).avatar.Url}`
                                : `${repo.configuration.repositoryUrl}${DEFAULT_AVATAR_PATH}`
                            }
                          />
                        }
                        key={content.value.toString()}
                        label={this.getContentById(content.value).label}
                        onDelete={() => this.handleDelete(content.value)}
                      />
                    ) : (
                      <Chip
                        icon={
                          this.props['data-renderIcon']
                            ? this.props['data-renderIcon'](this.getContentById(content.value).type.toLowerCase())
                            : renderIconDefault(this.getContentById(content.value).type.toLowerCase())
                        }
                        key={content.value.toString()}
                        label={this.getContentById(content.value).label}
                        onDelete={() => this.handleDelete(content.value)}
                      />
                    ),
                  )}
                </div>
              )}
              MenuProps={menuProps}>
              {this.state.dataSource.map(content => (
                <MenuItem key={content.value} value={content.value}>
                  {content.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl
            className={this.props.className}
            style={styles.root as any}
            key={this.props.name as string}
            component={'fieldset' as 'div'}
            required={this.props.required}>
            <InputLabel htmlFor={this.props.name as string}>{this.props['data-labelText']}</InputLabel>
            <Select
              value={this.state.fieldValue}
              onChange={e => this.handleChange(e)}
              input={<Input id={this.props.name as string} fullWidth={true} />}
              renderValue={() => (
                <div style={styles.chips as any}>
                  {this.state.fieldValue.map((content: any) =>
                    this.getContentById(content.value).type === 'User' && this.getContentById(content.value).avatar ? (
                      <Chip
                        avatar={
                          <Avatar
                            alt={this.getContentById(content.value).label}
                            src={
                              this.getContentById(content.value).avatar.Url
                                ? `${repo.configuration.repositoryUrl}${this.getContentById(content.value).avatar.Url}`
                                : `${repo.configuration.repositoryUrl}${DEFAULT_AVATAR_PATH}`
                            }
                          />
                        }
                        key={content.value.toString()}
                        label={this.getContentById(content.value).label}
                        onDelete={() => this.handleDelete(content.value)}
                      />
                    ) : (
                      <Chip
                        key={content.value.toString()}
                        label="{this.getContentById(fvalue).label}"
                        icon={
                          this.props['data-renderIcon']
                            ? this.props['data-renderIcon'](this.getContentById(content.value).type.toLowerCase())
                            : renderIconDefault(this.getContentById(content.value).type.toLowerCase())
                        }
                        onDelete={() => this.handleDelete(content.value)}
                      />
                    ),
                  )}
                </div>
              )}
              MenuProps={menuProps}>
              {this.state.dataSource.map(content => (
                <MenuItem key={content.value} value={content.value}>
                  {content.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'browse':
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <FormGroup>
              {this.state.fieldValue.map((content: any, index: number) => (
                <FormControl key={index} component={'fieldset' as 'div'}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={this.state.dataSource.find(item => item.value === content.value).label}
                    control={<span />}
                    key={content.value}
                  />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
      default:
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <FormGroup>
              {this.state.fieldValue.map((content: any, index: number) => (
                <FormControl key={index} component={'fieldset' as 'div'}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={this.state.dataSource.find(item => item.value === content.value).label}
                    control={<span />}
                    key={content.value}
                  />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
    }
  }
}
