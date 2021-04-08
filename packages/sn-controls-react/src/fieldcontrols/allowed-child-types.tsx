import { ConstantContent, ODataCollectionResponse } from '@sensenet/client-core'
import { deepMerge } from '@sensenet/client-utils'
import { ContentType, GenericContent } from '@sensenet/default-content-types'
import {
  ClickAwayListener,
  createStyles,
  FormGroup,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { typeicons } from '../assets/icons'
import { ReactClientFieldSetting } from './client-field-setting'
import { renderIconDefault } from './icon'
import { defaultLocalization } from './localization'

const INPUT_PLACEHOLDER = 'Start typing to add another type'
const ITEM_HEIGHT = 48

const useStyles = makeStyles(() => {
  return createStyles({
    inputContainer: {
      padding: '2px 4px',
      alignItems: 'center',
      boxShadow: 'none',
      position: 'relative',
    },
    input: {
      marginLeft: 8,
      flex: 1,
    },
    button: {
      padding: 10,
    },
    listContainer: {
      position: 'absolute',
      top: '40px',
      maxHeight: ITEM_HEIGHT * 2.5,
      overflow: 'auto',
      zIndex: 10,
    },
    list: {},
    listItem: {
      margin: 0,
    },
    remove: {
      marginLeft: '8px',
    },
    ddIsOpened: {
      display: 'block',
    },
    ddIsClosed: {
      display: 'none',
    },
  })
})

type AllowedChildTypesClassKey = Partial<ReturnType<typeof useStyles>>

const compare = (a: GenericContent, b: GenericContent) => {
  if (a.Name < b.Name) {
    return -1
  }
  if (a.Name > b.Name) {
    return 1
  }
  return 0
}

/**
 * Field control that represents an AllowedChildTypes field. Available values will be populated from the FieldSettings.
 */
export const AllowedChildTypes: React.FC<ReactClientFieldSetting & { classes?: AllowedChildTypesClassKey }> = (
  props,
) => {
  const classes = useStyles(props)
  const localization = deepMerge(defaultLocalization.allowedChildTypes, props.localization?.allowedChildTypes)

  const [isOpened, setIsOpened] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<ContentType[]>([])
  const [allowedTypesOnCTD, setAllowedTypesOnCTD] = useState<ContentType[]>([])
  const [allCTDs, setAllCTDs] = useState<ContentType[]>([])
  const [currentSelected, setCurrentSelected] = useState<ContentType>()

  const filteredList = allCTDs.filter((ctd) => ctd.DisplayName?.toLowerCase().includes(inputValue.toLowerCase()))

  const getTypes = useCallback(
    (typeResults: ContentType[], allowedChildTypesFromCTD: ODataCollectionResponse<ContentType>) => {
      if (props.actionName === 'new') {
        return (allowedChildTypesFromCTD.d.results.length && allowedChildTypesFromCTD.d.results) || []
      }
      return typeResults.length ? typeResults : allowedChildTypesFromCTD.d.results
    },
    [props.actionName],
  )

  useEffect(() => {
    ;(async () => {
      try {
        if (!props.repository) {
          throw new Error('You must pass a repository to this control')
        }
        if (!props.content) {
          return
        }

        const result = await props.repository.load<GenericContent>({
          idOrPath: props.content.Path,
          oDataOptions: {
            select: ['EffectiveAllowedChildTypes'],
            expand: ['EffectiveAllowedChildTypes'],
          },
        })

        const allowedChildTypesFromCTD = await props.repository.allowedChildTypes.getFromCTD(props.content.Path)

        const typeResults = result.d.EffectiveAllowedChildTypes as ContentType[]
        const types = getTypes(typeResults, allowedChildTypesFromCTD)

        setSelected(types)
        setAllowedTypesOnCTD(allowedChildTypesFromCTD.d.results)
      } catch (error) {
        console.error(error.message)
      }
    })()
  }, [props.actionName, props.content, props.repository, getTypes])

  useEffect(() => {
    ;(async () => {
      try {
        if (!props.repository) {
          throw new Error('You must pass a repository to this control')
        }

        const result = (await props.repository.executeAction({
          idOrPath: ConstantContent.PORTAL_ROOT.Id,
          name: 'GetAllContentTypes',
          method: 'GET',
          oDataOptions: {
            select: ['Name', 'DisplayName', 'Icon'],
          },
        })) as ODataCollectionResponse<ContentType>

        setAllCTDs(result.d.results.sort(compare))
      } catch (error) {
        console.error(error.message)
      }
    })()
  }, [props.repository])

  const handleRemove = (item: GenericContent) => {
    if (selected.length > 1) {
      const newSelected = selected.filter((i) => item.Name !== i.Name)
      setSelected(newSelected)
      props.fieldOnChange?.(
        props.settings.Name,
        newSelected.map((newItem) => newItem.Name),
      )
    } else {
      const valuesOnCTD = allowedTypesOnCTD.map((allowedType) => allowedType.Name)
      setSelected(allowedTypesOnCTD)
      props.fieldOnChange?.(props.settings.Name, valuesOnCTD)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const term = e.target.value

    setInputValue(term)

    if (term.length === 0) {
      setCurrentSelected(undefined)
    }
  }

  const handleClickAway = () => {
    setIsOpened(false)
  }

  const handleSelect = (item: ContentType) => {
    setCurrentSelected(item)
    setInputValue(item.DisplayName || '')
    setIsOpened(false)
  }

  const handleOnClick = () => {
    setIsOpened(true)
  }

  const handleAddClick = () => {
    const newSelection = currentSelected ? [...selected, currentSelected] : selected
    setSelected(newSelection)
    props.fieldOnChange?.(
      props.settings.Name,
      newSelection.map((item) => item.Name),
    )

    setCurrentSelected(undefined)
    setInputValue('')
  }

  const renderMenuItem = (item: ContentType, select: (item: ContentType) => void) => (
    <ListItem key={item.Id} value={item.Id} onClick={() => select(item)}>
      <ListItemIcon style={{ margin: 0 }}>
        {props.renderIcon
          ? props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
          : renderIconDefault(
              item.Icon && typeicons[item.Icon.toLowerCase()]
                ? typeicons[item.Icon.toLowerCase()]
                : typeicons.contenttype,
            )}
      </ListItemIcon>
      <ListItemText primary={item.DisplayName} />
    </ListItem>
  )

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <InputLabel shrink htmlFor={props.settings.Name} required={props.settings.Compulsory}>
              {props.settings.DisplayName}
            </InputLabel>
            <List dense={true} className={classes.list}>
              {selected.map((item, index) => (
                <ListItem key={index} className={classes.listItem}>
                  <ListItemIcon style={{ margin: 0 }}>
                    {props.renderIcon
                      ? props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
                      : renderIconDefault(
                          item.Icon && typeicons[item.Icon.toLowerCase()]
                            ? typeicons[item.Icon.toLowerCase()]
                            : typeicons.contenttype,
                        )}
                  </ListItemIcon>
                  <ListItemText primary={item.DisplayName} />
                  <ListItemSecondaryAction className={classes.remove}>
                    <IconButton aria-label="Remove" onClick={() => handleRemove(item)}>
                      {props.renderIcon ? props.renderIcon('delete') : renderIconDefault('delete')}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <div style={{ position: 'relative' }}>
              <FormGroup row className={classes.inputContainer}>
                <TextField
                  id={props.settings.Name}
                  autoComplete="off"
                  type="search"
                  onClick={handleOnClick}
                  onChange={handleInputChange}
                  placeholder={INPUT_PLACEHOLDER}
                  fullWidth={true}
                  value={inputValue}
                  className={classes.input}
                />
                <IconButton
                  color="primary"
                  className={classes.button}
                  disabled={currentSelected && currentSelected.Name.length > 0 ? false : true}
                  onClick={handleAddClick}>
                  {props.renderIcon ? props.renderIcon('add_circle') : renderIconDefault('add_circle')}
                </IconButton>
              </FormGroup>
              <Paper className={`${classes.listContainer} ${isOpened ? classes.ddIsOpened : classes.ddIsClosed}`}>
                <List>
                  {filteredList.length > 0 ? (
                    filteredList.map((item: any) => renderMenuItem(item, handleSelect))
                  ) : (
                    <ListItem>No hits</ListItem>
                  )}
                </List>
              </Paper>
              {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
            </div>
          </div>
        </ClickAwayListener>
      )
    case 'browse':
    default:
      return (
        <>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          {selected.length ? (
            <List dense={true}>
              {selected.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon style={{ margin: 0 }}>
                    {props.renderIcon
                      ? props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
                      : renderIconDefault(
                          item.Icon && typeicons[item.Icon.toLowerCase()]
                            ? typeicons[item.Icon.toLowerCase()]
                            : typeicons.contenttype,
                        )}
                  </ListItemIcon>
                  <ListItemText primary={item.DisplayName} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" gutterBottom={true}>
              {localization.noValue}
            </Typography>
          )}
        </>
      )
  }
}
