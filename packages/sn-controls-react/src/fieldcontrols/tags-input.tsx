/**
 * @module FieldControls
 */
import {
  Avatar,
  Chip,
  createStyles,
  FormControl,
  FormGroup,
  FormHelperText,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  MenuProps,
  Select,
  Typography,
} from '@material-ui/core'
import { deepMerge, PathHelper } from '@sensenet/client-utils'
import { GenericContent, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import React, { useCallback, useEffect, useState } from 'react'
import { ReactClientFieldSetting } from './client-field-setting'
import { renderIconDefault } from './icon'
import { defaultLocalization } from './localization'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const menuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
} as Partial<MenuProps>

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    select: {
      paddingBottom: 4,
      '&:focus': {
        backgroundColor: 'transparent',
      },
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: '0 3px 3px 0',
    },
  }),
)

/**
 * Field control that represents a Reference field. Available values will be populated from the FieldSettings.
 */
export const TagsInput: React.FC<ReactClientFieldSetting<ReferenceFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.tagsInput, props.localization?.tagsInput)

  const [fieldValue, setFieldValue] = useState<GenericContent[]>([])
  const [dataSource, setDataSource] = useState<GenericContent[]>([])

  const classes = useStyles(props)

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: number | number[] }>) => {
    let s: GenericContent[] = []
    props.settings.AllowMultiple && Array.isArray(event.target.value)
      ? (s = event.target.value.reduce<GenericContent[]>((value, c: number) => {
          const content = getContentById(c)
          if (content) {
            value.push(content)
          }
          return value
        }, []))
      : (s = [getContentById(event.target.value as number)!])

    setFieldValue(s)

    props.fieldOnChange?.(
      props.settings.Name,
      s.reduce<number[]>((contentIds, content) => {
        if (content) {
          contentIds.push(content.Id)
        }
        return contentIds
      }, []),
    )
  }

  const getDefaultValue = useCallback(async () => {
    if (!props.settings.DefaultValue || !props.repository) {
      return
    }

    const defaultValue = props.settings.DefaultValue.split(/,|;/)
      .filter((value) =>
        props.settings.SelectionRoots?.length
          ? props.settings.SelectionRoots.some((root) => PathHelper.isInSubTree(value, root))
          : true,
      )
      .slice(0, props.settings.AllowMultiple ? undefined : 1)

    try {
      const responses = await Promise.all(
        defaultValue.map(
          async (contentPath) =>
            await props.repository!.load({
              idOrPath: contentPath,
              oDataOptions: {
                select: 'all',
              },
            }),
        ),
      )
      const defaultContent = responses.map((response) => response.d)

      setFieldValue(defaultContent)
    } catch (error) {
      console.error('At least one request for default reference value has failed.')
    }
  }, [props.repository, props.settings.DefaultValue, props.settings.SelectionRoots, props.settings.AllowMultiple])

  const getSelected = useCallback(async () => {
    try {
      if (!props.repository) {
        throw new Error('You must pass a repository to this control')
      }
      const loadPath = props.content
        ? PathHelper.joinPaths('/', PathHelper.getContentUrl(props.content.Path), props.settings.Name)
        : ''
      const references = await props.repository.load({
        idOrPath: loadPath,
        oDataOptions: {
          select: 'all',
        },
      })
      let result = [references.d]
      if (Object.prototype.hasOwnProperty.call(references.d, 'results')) {
        result = (references.d as any).results
      }

      setFieldValue(result)
      return result
    } catch (error) {
      console.error(error.message)
    }
  }, [props.content, props.repository, props.settings.Name])

  const search = useCallback(async () => {
    try {
      if (!props.repository) {
        throw new Error('You must pass a repository to this control')
      }
      const selectionRoot = props.settings.SelectionRoots || []
      const allowedTypes = props.settings.AllowedTypes || ['GenericContent']

      let pathQuery = ''
      selectionRoot.forEach((selectionPath, index) => {
        pathQuery += index === 0 ? `InTree:${selectionPath}` : ` OR InTree:${selectionPath}`
      })
      let typeQuery = ''
      allowedTypes.forEach((type, index) => {
        typeQuery += index === 0 ? `TypeIs:${type}` : ` OR TypeIs:${type}`
      })

      const req = await props.repository.loadCollection({
        path: '/Root',
        oDataOptions: {
          query: `${pathQuery && `(${pathQuery})`}${pathQuery && typeQuery ? ' AND ' : ''}${typeQuery}`,
          select: 'all',
        },
      })
      setDataSource(req.d.results)

      if (props.actionName !== 'new') {
        getSelected()
      }
      return req
    } catch (error) {
      console.error(error.mesage)
    }
  }, [getSelected, props.actionName, props.repository, props.settings.AllowedTypes, props.settings.SelectionRoots])

  /**
   * returns a content by its id
   */
  const getContentById = (id: number) => {
    return dataSource.find((item) => item.Id === id)
  }

  const handleDelete = (id: number) => {
    const newValue = fieldValue.filter((item) => item.Id !== id)
    setFieldValue(newValue)

    props.fieldOnChange?.(
      props.settings.Name,
      newValue.map((content) => content.Id),
    )
  }

  /**
   * Get proper value for the Select component
   */
  const getValue = () => {
    if (props.settings.AllowMultiple) {
      return fieldValue.length ? fieldValue.map((c) => c.Id) : []
    }
    return fieldValue?.length ? fieldValue[0].Id : ''
  }

  useEffect(() => {
    if (props.actionName === 'browse') {
      getSelected()
    }
  }, [getSelected, props.actionName])

  useEffect(() => {
    if (props.actionName === 'new') {
      getDefaultValue()
    }
  }, [props.actionName, getDefaultValue])

  useEffect(() => {
    if (props.actionName !== 'browse') {
      search()
    }
  }, [props.actionName, search])

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl
          className={classes.root}
          key={props.settings.Name}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <InputLabel required={props.settings.Compulsory} htmlFor={props.settings.Name}>
            {props.settings.DisplayName}
          </InputLabel>
          <Select
            value={getValue()}
            onChange={handleChange}
            classes={{ select: classes.select }}
            multiple={props.settings.AllowMultiple}
            input={<Input id={props.settings.Name} fullWidth={true} />}
            renderValue={() => (
              <div className={classes.chips}>
                {fieldValue?.map((content) => (
                  <Chip
                    avatar={
                      props.repository?.schemas.isContentFromType<User>(content, 'User') ? (
                        content.Avatar?.Url ? (
                          <Avatar
                            alt={localization.avatarAlt(content.DisplayName || content.Name)}
                            src={`${props.repository.configuration.repositoryUrl}${content.Avatar.Url}`}
                          />
                        ) : (
                          <Avatar>{content.DisplayName?.[0] || content.Name[0]}</Avatar>
                        )
                      ) : undefined
                    }
                    icon={
                      props.repository?.schemas.isContentFromType<User>(content, 'User')
                        ? undefined
                        : props.renderIcon
                        ? props.renderIcon(content.Type.toLowerCase())
                        : renderIconDefault(content.Type.toLowerCase())
                    }
                    key={content.Id}
                    label={content.DisplayName}
                    onDelete={() => handleDelete(content.Id)}
                    onMouseDown={(event) => {
                      event.stopPropagation()
                    }}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={menuProps}>
            {dataSource?.map((content) => (
              <MenuItem key={content.Id} value={content.Id}>
                {content.DisplayName}
              </MenuItem>
            ))}
          </Select>
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </FormControl>
      )
    case 'browse':
    default:
      return (
        <>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <FormGroup>
            {fieldValue && fieldValue.length > 0 ? (
              fieldValue.map((content: GenericContent, index: number) => (
                <Typography variant="body1" gutterBottom={index === fieldValue.length - 1} key={index}>
                  {content.DisplayName}
                </Typography>
              ))
            ) : (
              <Typography variant="body1" gutterBottom={true}>
                {localization.noValue}
              </Typography>
            )}
          </FormGroup>
        </>
      )
  }
}
