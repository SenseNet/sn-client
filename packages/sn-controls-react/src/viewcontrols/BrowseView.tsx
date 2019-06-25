/**
 * @module ViewControls
 *
 */
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Repository } from '@sensenet/client-core'
import { ControlSchema } from '@sensenet/control-mapper'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component, createElement, ComponentType } from 'react'
import { reactControlMapper } from '../ReactControlMapper'
import { ReactClientFieldSetting } from '../fieldcontrols/field-settings/ClientFieldSetting'
import { styles } from './BrowseViewStyles'

/**
 * Interface for BrowseView properties
 */
export interface BrowseViewProps {
  content: GenericContent
  repository: Repository
  renderIcon?: (name: string) => JSX.Element
}
/**
 * Interface for BrowseView state
 */
export interface BrowseViewState {
  content: GenericContent
  schema: ControlSchema<ComponentType, ComponentType<ReactClientFieldSetting>>
}

/**
 * View Control for browsing a Content, works with a single Content and based on the ReactControlMapper
 */
export class BrowseView extends Component<BrowseViewProps, BrowseViewState> {
  protected ControlMapper = reactControlMapper(this.props.repository)
  state = {
    content: this.props.content,
    schema: this.ControlMapper.getFullSchemaForContentType(this.props.content.Type, 'browse'),
  }
  /**
   * returns a value of an input
   * @param {string} name name of the input
   * @return {any} value of the input or null
   */
  public getFieldValue(name: string) {
    if (this.props.content[name]) {
      return this.props.content[name]
    } else {
      return null
    }
  }

  public render() {
    return (
      <Grid container={true} spacing={2}>
        <div style={styles.container}>
          <Typography variant="h5" gutterBottom={true}>
            {this.props.content.DisplayName}
          </Typography>
          {this.state.schema.fieldMappings.map(field => {
            return (
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} key={field.fieldSettings.Name}>
                {createElement(
                  this.ControlMapper.getControlForContentField(
                    this.props.content.Type,
                    field.fieldSettings.Name,
                    'browse',
                  ),
                  {
                    fieldName: field.fieldSettings.Name,
                    labelText: field.fieldSettings.DisplayName,
                    actionName: 'browse',
                    value: this.getFieldValue(field.fieldSettings.Name),
                    repository: this.props.repository,
                    renderIcon: this.props.renderIcon,
                    fieldOnChange: () => {
                      /** */
                    },
                  },
                )}
              </Grid>
            )
          })}
        </div>
      </Grid>
    )
  }
}
