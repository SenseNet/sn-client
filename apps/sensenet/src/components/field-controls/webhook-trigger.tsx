/**
 * @module FieldControls
 */

import { ReactClientFieldSetting, ReferencePicker, renderIconDefault, typeicons } from '@sensenet/controls-react'
import { GenericContent, LongTextFieldSetting } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import {
  Button,
  Checkbox,
  ClickAwayListener,
  createStyles,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { Check, Close, Info } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { globals, widgetStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

const ITEM_HEIGHT = 48
const DEFAULT_CONTAINER = '/Root'

const useWidgetStyles = makeStyles(widgetStyles)

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    deleteIcon: {
      color: red[500],
      cursor: 'pointer',
      display: 'flex',
      alignSelf: 'center',
    },
    inputContainer: {
      alignItems: 'center',
      boxShadow: 'none',
      position: 'relative',
    },
    input: {
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
    ddIsOpened: {
      display: 'block',
    },
    ddIsClosed: {
      display: 'none',
    },
    containerSelector: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      justifyContent: 'space-between',
    },
    containerSelectorInput: {
      width: '75%',
    },
    fixColumn: {
      position: 'sticky',
      backgroundColor: theme.palette.type === 'light' ? globals.light.drawerBackground : '#1e1e1e',
      left: 0,
      zIndex: 1,
    },
    errorMessage: {
      color: theme.palette.error.light,
      padding: '20px 0',
    },
    webhookTriggerTableHeader: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
    infoIcon: {
      marginLeft: '2px',
    },
  })
})

//Types
export interface WebhookTriggerType {
  Path?: string
  TriggersForAllEvents: boolean
  ContentTypes?: WebhookContentTypeItem[]
}

export interface WebhookContentTypeItem {
  Name: string
  Events: WebhookEventType[]
}

export type WebhookEventType =
  | 'All'
  | 'Create'
  | 'Modify'
  | 'Delete'
  | 'MoveToTrash'
  | 'RestoreFromTrash'
  | 'Checkout'
  | 'Draft'
  | 'Approve'
  | 'Pending'
  | 'Reject'

/**
 * Field control that represents a Webhook filter field.
 */
export const WebhookTrigger: React.FC<ReactClientFieldSetting<LongTextFieldSetting>> = (props) => {
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()

  const repo = useRepository()
  const logger = useLogger('webhook filter')
  const localization = useLocalization()

  const getInitialstate = () => {
    const initialState =
      props.actionName === 'new'
        ? (props.settings.DefaultValue &&
            (JSON.parse(props.settings.DefaultValue) as WebhookTriggerType | undefined)) || {
            Path: DEFAULT_CONTAINER,
            TriggersForAllEvents: true,
            ContentTypes: [{ Name: 'File', Events: ['All'] } as WebhookContentTypeItem],
          }
        : undefined
    props.fieldOnChange?.(props.settings.Name, JSON.stringify(initialState))
    return initialState
  }

  const [value, setValue] = useState<WebhookTriggerType | undefined>(
    (props.fieldValue && (JSON.parse(props.fieldValue) as WebhookTriggerType)) || getInitialstate,
  )

  //Triggers
  const webhookEvents = [
    { name: 'Create', tooltip: localization.webhooksTrigger.createTooltip },
    { name: 'Modify', tooltip: localization.webhooksTrigger.modifyTooltip },
    { name: 'Delete', tooltip: localization.webhooksTrigger.deleteTooltip },
    { name: 'MoveToTrash', tooltip: localization.webhooksTrigger.moveToTrashTooltip },
    { name: 'RestoreFromTrash', tooltip: localization.webhooksTrigger.restoreFromTrashTooltip },
    {
      name: 'Checkout',
      tooltip: localization.webhooksTrigger.checkoutTooltip,
    },
    { name: 'Draft', tooltip: localization.webhooksTrigger.draftTooltip },
    {
      name: 'Approve',
      tooltip: localization.webhooksTrigger.approveTooltip,
    },
    {
      name: 'Pending',
      tooltip: localization.webhooksTrigger.pendingTooltip,
    },
    {
      name: 'Reject',
      tooltip: localization.webhooksTrigger.rejectTooltip,
    },
  ]

  const [contentForContainer, setContentForContainer] = useState<GenericContent>()
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false)

  const [isContentTypeDropdownOpened, setContentTypeDropdownOpened] = useState<boolean>(false)
  const [contentTypeInputValue, setContentTypeInputValue] = useState('')
  const [currentTypeSelected, setCurrentTypeSelected] = useState<string>()
  const [typesSelected, setTypesSelected] = useState<string[]>(value?.ContentTypes?.map((type) => type.Name) || [])
  const allTypes = repo.schemas.getTypesFromSchema()

  const filteredList = allTypes.filter(
    (type: string) => type.toLowerCase().includes(contentTypeInputValue.toLowerCase()) && !typesSelected.includes(type),
  )

  useEffect(() => {
    if (value?.Path) {
      ;(async () => {
        try {
          const response = await repo.load({
            idOrPath: value.Path!,
          })
          setContentForContainer(response.d)
        } catch (error) {
          logger.error({ message: localization.webhooksTrigger.errorMessageOnLoad, data: { error } })
        }
      })()
    }
  }, [localization.webhooksTrigger.errorMessageOnLoad, logger, repo, value?.Path])

  const handleTypeInputOnClick = () => {
    !value?.TriggersForAllEvents && setContentTypeDropdownOpened(true)
  }

  const handleTypeInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const term = e.target.value
    setContentTypeInputValue(term)
    if (term.length === 0) {
      setCurrentTypeSelected(undefined)
    }
  }

  const handleTypeAddClick = () => {
    const newSelection = currentTypeSelected ? [...typesSelected, currentTypeSelected] : typesSelected
    setTypesSelected(newSelection)
    currentTypeSelected && value?.ContentTypes?.push({ Name: currentTypeSelected, Events: [] })

    setCurrentTypeSelected(undefined)
    setContentTypeInputValue('')
  }

  const handleTypeSelect = (item: string) => {
    setCurrentTypeSelected(item)
    setContentTypeInputValue(item || '')
    setContentTypeDropdownOpened(false)
  }

  const handleTypeRemove = (item: string) => {
    if (value && !value?.TriggersForAllEvents) {
      const newSelected = typesSelected.filter((type) => item !== type)
      setTypesSelected(newSelected)

      setValue({ ...value, ContentTypes: value.ContentTypes?.filter((type) => item !== type.Name) })
      props.fieldOnChange?.(
        props.settings.Name,
        JSON.stringify({ ...value, ContentTypes: value.ContentTypes?.filter((type) => item !== type.Name) }),
      )
    }
  }

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    contentType: string,
    webhookEvent: WebhookEventType,
  ) => {
    const copyOfContentTypes = value?.ContentTypes
    const actualRow = copyOfContentTypes?.find((type) => type.Name === contentType)

    if (event.target.checked) {
      !actualRow?.Events.includes(webhookEvent) && actualRow?.Events.push(webhookEvent)
    } else {
      const actualEventIndex = actualRow?.Events.indexOf(webhookEvent)
      if (actualEventIndex !== undefined && actualEventIndex > -1) {
        actualRow?.Events.splice(actualEventIndex, 1)
      }

      const allEventIndex = actualRow?.Events.indexOf('All')
      if (allEventIndex !== undefined && allEventIndex > -1) {
        const newEvents = webhookEvents.filter((item) => item.name !== webhookEvent)
        Object.assign(actualRow as WebhookContentTypeItem, { Events: newEvents })
      }
    }

    value
      ? setValue({ ...value, ContentTypes: copyOfContentTypes })
      : setValue({ Path: DEFAULT_CONTAINER, TriggersForAllEvents: true, ContentTypes: copyOfContentTypes })
    props.fieldOnChange?.(props.settings.Name, JSON.stringify(value))
  }

  const handleCheckboxAllChange = (event: React.ChangeEvent<HTMLInputElement>, contentType: string) => {
    const copyOfContentTypes = value?.ContentTypes
    const actualRow = copyOfContentTypes?.find((type) => type.Name === contentType)

    if (event.target.checked) {
      Object.assign(actualRow as WebhookContentTypeItem, { Events: ['All'] })
    } else {
      Object.assign(actualRow as WebhookContentTypeItem, { Events: [] })
    }

    value
      ? setValue({ ...value, ContentTypes: copyOfContentTypes })
      : setValue({ Path: DEFAULT_CONTAINER, TriggersForAllEvents: true, ContentTypes: copyOfContentTypes })
    props.fieldOnChange?.(props.settings.Name, JSON.stringify(value))
  }

  const handleDialogClose = () => {
    setIsPickerOpen(false)
  }

  const renderTypeListItem = (item: string, select: (item: string) => void) => (
    <ListItem key={item} value={item} onClick={() => select(item)}>
      <ListItemIcon style={{ margin: 0 }}>{renderIconDefault(typeicons.contenttype)}</ListItemIcon>
      <ListItemText primary={item} />
    </ListItem>
  )

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <>
          <div className={classes.containerSelector}>
            <TextField
              className={classes.containerSelectorInput}
              autoFocus={props.autoFocus}
              autoComplete="off"
              name={props.settings.Name}
              id={props.settings.Name}
              label={props.settings.DisplayName}
              placeholder={props.settings.DisplayName}
              value={value?.Path}
              fullWidth={true}
              InputProps={{ readOnly: true }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setIsPickerOpen(true)
              }}>
              {localization.webhooksTrigger.pickAContainer}
            </Button>
          </div>
          <Dialog fullWidth maxWidth="md" onClose={handleDialogClose} open={isPickerOpen}>
            <DialogTitle>{localization.webhooksTrigger.pickAContainer}</DialogTitle>
            <ReferencePicker
              defaultValue={contentForContainer ? [contentForContainer] : undefined}
              path={DEFAULT_CONTAINER}
              repository={props.repository!}
              handleSubmit={(newSelection: GenericContent[]) => {
                value
                  ? setValue({ ...value, Path: newSelection[0].Path })
                  : setValue({ TriggersForAllEvents: true, Path: newSelection[0].Path, ContentTypes: [] })
                props.fieldOnChange?.(props.settings.Name, JSON.stringify({ ...value, Path: newSelection[0].Path }))
                handleDialogClose()
              }}
              handleCancel={handleDialogClose}
              fieldSettings={props.settings}
            />
          </Dialog>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label={localization.webhooksTrigger.triggerRadioGroup}
              name="triggerRadioGroup"
              value={value ? String(value.TriggersForAllEvents) : undefined}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const targetValue = (event.target as HTMLInputElement).value === 'true'
                value
                  ? setValue({
                      ...value,
                      TriggersForAllEvents: targetValue,
                    })
                  : setValue({
                      Path: DEFAULT_CONTAINER,
                      TriggersForAllEvents: targetValue,
                      ContentTypes: [],
                    })
                if (targetValue) {
                  value?.ContentTypes?.forEach((type) => {
                    Object.assign(type, { Events: ['All'] })
                  })
                } else {
                  value?.ContentTypes?.forEach((type) => {
                    Object.assign(type, { Events: [] })
                  })
                }
                props.fieldOnChange?.(
                  props.settings.Name,
                  JSON.stringify({ ...value, TriggersForAllEvents: targetValue }),
                )
              }}>
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label={localization.webhooksTrigger.triggerForAll}
              />
              <FormControlLabel
                value="false"
                control={<Radio color="primary" />}
                label={localization.webhooksTrigger.selectSpecificEvents}
              />
            </RadioGroup>
          </FormControl>
          <div className={widgetClasses.root}>
            <Paper elevation={0} className={widgetClasses.container}>
              <TableContainer>
                <Table size="small" aria-label="Stats components">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className={classes.fixColumn} />
                      <TableCell align="center">{localization.webhooksTrigger.all}</TableCell>
                      {webhookEvents.map((event) => (
                        <Tooltip key={event.name} title={event.tooltip} placement="bottom">
                          <TableCell align="center">
                            <div className={classes.webhookTriggerTableHeader}>
                              {event.name}
                              <Info className={classes.infoIcon} fontSize="small" color="disabled" />
                            </div>
                          </TableCell>
                        </Tooltip>
                      ))}
                      <TableCell align="center" className={classes.fixColumn} style={{ right: 0 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {typesSelected.length > 0 ? (
                      typesSelected.map((row) => {
                        const actualEvent = value?.ContentTypes?.find((type) => type.Name === row)
                        return (
                          <TableRow key={row}>
                            <TableCell align="center" className={classes.fixColumn}>
                              {row}
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                disabled={value?.TriggersForAllEvents}
                                color="primary"
                                checked={actualEvent?.Events.includes('All')}
                                onChange={(event) => handleCheckboxAllChange(event, row)}
                              />
                            </TableCell>
                            {webhookEvents.map((eventItem) => (
                              <TableCell key={eventItem.name} align="center">
                                <Checkbox
                                  disabled={value?.TriggersForAllEvents}
                                  color="primary"
                                  checked={
                                    actualEvent?.Events.includes(eventItem.name as WebhookEventType) ||
                                    actualEvent?.Events.includes('All')
                                  }
                                  onChange={(event) =>
                                    handleCheckboxChange(event, row, eventItem.name as WebhookEventType)
                                  }
                                />
                              </TableCell>
                            ))}
                            <TableCell align="center" className={classes.fixColumn} style={{ right: 0 }}>
                              <Close
                                className={classes.deleteIcon}
                                onClick={() => {
                                  handleTypeRemove(row)
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={webhookEvents.length + 3} align="center">
                          <div className={classes.errorMessage}>{localization.webhooksTrigger.noTypeSelected}</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <ClickAwayListener
            onClickAway={() => {
              setContentTypeDropdownOpened(false)
            }}>
            <div style={{ position: 'relative' }}>
              <FormGroup row className={classes.inputContainer}>
                <TextField
                  disabled={value?.TriggersForAllEvents}
                  id="trigger-for-all-events"
                  autoComplete="off"
                  type="search"
                  onClick={handleTypeInputOnClick}
                  onChange={handleTypeInputChange}
                  placeholder={localization.webhooksTrigger.startTyping}
                  fullWidth={true}
                  value={contentTypeInputValue}
                  className={classes.input}
                />
                <IconButton
                  color="primary"
                  className={classes.button}
                  disabled={
                    value?.TriggersForAllEvents ||
                    (currentTypeSelected && currentTypeSelected.length > 0 ? false : true)
                  }
                  onClick={handleTypeAddClick}>
                  {props.renderIcon ? props.renderIcon('add_circle') : renderIconDefault('add_circle')}
                </IconButton>
              </FormGroup>
              <Paper
                className={`${classes.listContainer} ${
                  isContentTypeDropdownOpened ? classes.ddIsOpened : classes.ddIsClosed
                }`}>
                <List>
                  {filteredList.length > 0 ? (
                    filteredList.map((item: any) => renderTypeListItem(item, handleTypeSelect))
                  ) : (
                    <ListItem>{localization.webhooksTrigger.noHits}</ListItem>
                  )}
                </List>
              </Paper>
              {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
            </div>
          </ClickAwayListener>
        </>
      )
    case 'browse':
    default:
      return (
        <>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography gutterBottom={true}>{value?.Path}</Typography>
          {value?.TriggersForAllEvents ? (
            <>
              <Typography variant="body1" gutterBottom={true}>
                {localization.webhooksTrigger.triggerForAll}
              </Typography>
              {value?.ContentTypes && value?.ContentTypes?.length > 0 ? (
                <Typography variant="body1" gutterBottom={true}>
                  {localization.webhooksTrigger.onTypes}
                  {value?.ContentTypes?.map((type) => (
                    <Typography key="type.Name" variant="body1" display="inline" gutterBottom={true}>
                      {`${type.Name} `}
                    </Typography>
                  ))}
                </Typography>
              ) : (
                localization.webhooksTrigger.noTypeSelected
              )}
            </>
          ) : (
            <div className={widgetClasses.root}>
              <Paper elevation={0} className={widgetClasses.container}>
                <TableContainer>
                  <Table size="small" aria-label="Stats components">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" className={classes.fixColumn} />
                        <TableCell align="center">{localization.webhooksTrigger.all}</TableCell>
                        {webhookEvents.map((event) => (
                          <Tooltip key={event.name} title={event.tooltip} placement="bottom">
                            <TableCell align="center">{event.name}</TableCell>
                          </Tooltip>
                        ))}
                        <TableCell align="center" className={classes.fixColumn} style={{ right: 0 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {typesSelected.length > 0 ? (
                        typesSelected.map((row) => {
                          const actualEvent = value?.ContentTypes?.find((type) => type.Name === row)
                          return (
                            <TableRow key={row}>
                              <TableCell align="center" className={classes.fixColumn}>
                                {row}
                              </TableCell>
                              <TableCell align="center">
                                {actualEvent?.Events.includes('All') ? <Check color="primary" /> : null}
                              </TableCell>
                              {webhookEvents.map((eventItem) => (
                                <TableCell key={eventItem.name} align="center">
                                  {actualEvent?.Events.includes(eventItem.name as WebhookEventType) ||
                                  actualEvent?.Events.includes('All') ? (
                                    <Check color="primary" />
                                  ) : null}
                                </TableCell>
                              ))}
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={webhookEvents.length + 3} align="center">
                            <div className={classes.errorMessage}>{localization.webhooksTrigger.noTypeSelected}</div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          )}
        </>
      )
  }
}
