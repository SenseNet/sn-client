/**
 * @module ViewControls
 */
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { createElement, ReactElement } from 'react'
import { reactControlMapper } from '../ReactControlMapper'

/**
 * Interface for BrowseView properties
 */
export interface BrowseViewProps {
  content: GenericContent
  repository: Repository
  renderIcon?: (name: string) => ReactElement
}

/**
 * View Control for browsing a Content, works with a single Content and based on the ReactControlMapper
 */
export const BrowseView: React.FC<BrowseViewProps> = props => {
  const controlMapper = reactControlMapper(props.repository)
  const schema = controlMapper.getFullSchemaForContentType(props.content.Type, 'browse')

  return (
    <Grid container={true} spacing={2}>
      <div style={{ margin: 12 }}>
        <Typography variant="h5" gutterBottom={true}>
          {props.content.DisplayName}
        </Typography>
        {schema.fieldMappings.map(field => {
          return (
            <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} key={field.fieldSettings.Name}>
              {createElement(
                controlMapper.getControlForContentField(props.content.Type, field.fieldSettings.Name, 'browse'),
                {
                  actionName: 'browse',
                  settings: field.fieldSettings,
                  content: props.content,
                  fieldValue: (props.content as any)[field.fieldSettings.Name],
                  renderIcon: props.renderIcon,
                  repository: props.repository,
                },
              )}
            </Grid>
          )
        })}
      </div>
    </Grid>
  )
}
