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
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { renderIconDefault } from '../icon'
import { ReactClientFieldSetting } from '../ClientFieldSetting'
import { isUser } from '../type-guards'

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
 * Interface for TagsInput state
 */
export interface TagsInputState {
  dataSource: GenericContent[]
  fieldValue: GenericContent[]
}
/**
 * Field control that represents a Reference field. Available values will be populated from the FieldSettings.
 */
export class TagsInput extends Component<ReactClientFieldSetting<ReferenceFieldSetting>, TagsInputState> {
  constructor(props: TagsInput['props']) {
    super(props)
    if (this.props.actionName === 'edit') {
      this.getSelected()
    }
    this.state = {
      dataSource: [],
      fieldValue: [],
    }
    this.search()
  }

  public handleChange = (event: React.ChangeEvent<{ name?: string; value: number }>) => {
    const selected = this.state.fieldValue
    let s = selected
    const selectedContent = this.getContentById(event.target.value)

    this.props.settings.AllowMultiple !== undefined && this.props.settings.AllowMultiple && selectedContent
      ? this.state.fieldValue.includes(selectedContent)
        ? (s = selected)
        : s.push(selectedContent)
      : (s = [selectedContent!])

    this.setState({
      fieldValue: s,
    })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, s.map(content => content.Id))
  }

  /**
   * returns referencefields' datasource
   * @param path
   */
  public async search(): Promise<ODataCollectionResponse<Content>> {
    if (!this.props.repository) {
      throw new Error('You must pass a repository to this control')
    }
    const selectionRoot = this.props.settings.SelectionRoots || []
    const allowedTypes = this.props.settings.AllowedTypes || ['GenericContent']

    let pathQuery = ''
    selectionRoot.map((selectionPath, index) => {
      pathQuery += index === 0 ? `InTree:${selectionPath}` : `OR InTree:${selectionPath}`
    })
    let typeQuery = ''
    allowedTypes.map(type => {
      typeQuery += ` +TypeIs:${type}`
    })

    const req = await this.props.repository.loadCollection({
      path: '/Root',
      oDataOptions: {
        query: `(${pathQuery}) AND${typeQuery}`,
        select: 'all',
      },
    })
    this.setState({
      dataSource: req.d.results,
    })
    if (this.props.actionName === 'edit') {
      this.getSelected()
    }
    return req
  }

  public async getSelected() {
    if (!this.props.repository) {
      throw new Error('You must pass a repository to this control')
    }
    const loadPath = this.props.content
      ? PathHelper.joinPaths(PathHelper.getContentUrl(this.props.content.Path), '/', this.props.settings.Name)
      : ''
    const references = await this.props.repository.loadCollection<GenericContent>({
      path: loadPath,
      oDataOptions: {
        select: 'all',
      },
    })

    this.setState({
      fieldValue: references.d.results,
    })

    return references.d.results
  }
  /**
   * returns a content by its id
   */
  public getContentById = (id: number) => {
    return this.state.dataSource.find(item => item.Id === id)
  }

  public handleDelete = (id: number) => {
    const newValue = this.state.fieldValue.filter(item => item.Id !== id)
    this.setState({
      fieldValue: newValue,
    })

    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, newValue.map(content => content.Id))
  }

  public render() {
    switch (this.props.actionName) {
      case 'edit':
      case 'new':
        return (
          <FormControl
            style={styles.root as any}
            key={this.props.settings.Name}
            component={'fieldset' as 'div'}
            required={this.props.settings.Compulsory}>
            <InputLabel htmlFor={this.props.settings.Name}>{this.props.settings.DisplayName}</InputLabel>
            <Select
              value={this.state.fieldValue}
              onChange={this.handleChange}
              input={<Input id={this.props.settings.Name} fullWidth={true} />}
              renderValue={() => (
                <div style={styles.chips as any}>
                  {this.state.fieldValue &&
                    this.state.fieldValue.map(content =>
                      isUser(content) ? (
                        <Chip
                          avatar={
                            <Avatar
                              alt={content.DisplayName}
                              src={
                                content.Avatar && content.Avatar.Url
                                  ? `${this.props.repository!.configuration.repositoryUrl}${content.Avatar.Url}`
                                  : `${this.props.repository!.configuration.repositoryUrl}${DEFAULT_AVATAR_PATH}`
                              }
                            />
                          }
                          key={content.Id}
                          label={content.DisplayName}
                          onDelete={() => this.handleDelete(content.Id)}
                        />
                      ) : (
                        <Chip
                          key={content.Id}
                          label={content.DisplayName}
                          icon={
                            this.props.renderIcon
                              ? this.props.renderIcon(content.Type.toLowerCase())
                              : renderIconDefault(content.Type.toLowerCase())
                          }
                          onDelete={() => this.handleDelete(content.Id)}
                        />
                      ),
                    )}
                </div>
              )}
              MenuProps={menuProps}>
              {this.state.dataSource &&
                this.state.dataSource.map(content => (
                  <MenuItem key={content.Id} value={content.Id}>
                    {content.DisplayName}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>{this.props.settings.Description}</FormHelperText>
          </FormControl>
        )
      case 'browse':
      default:
        return this.props.fieldValue ? (
          <FormControl component={'fieldset' as 'div'}>
            <FormLabel component={'legend' as 'label'}>{this.props.settings.DisplayName}</FormLabel>
            <FormGroup>
              {(this.props.fieldValue as any).map((content: GenericContent, index: number) => (
                <FormControl key={index} component={'fieldset' as 'div'}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={content.DisplayName}
                    control={<span />}
                    key={content.Id}
                  />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
    }
  }
}
