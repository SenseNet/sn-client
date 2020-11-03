import { PathHelper } from '@sensenet/client-utils'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import React, { useCallback, useEffect, useState } from 'react'
import { ReactClientFieldSetting } from '../ClientFieldSetting'
import { DefaultItemTemplate } from './DefaultItemTemplate'
import { ReferencePicker } from './ReferencePicker'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dialog: {
    padding: 20,
  },
  listContainer: {
    display: 'block',
    marginTop: 10,
  },
}

const ADD_REFERENCE = 'Add reference'
const CHANGE_REFERENCE = 'Change reference'
const REFERENCE_PICKER_TITLE = 'Reference picker'
const OK = 'Ok'
const CANCEL = 'Cancel'

const emptyContent = {
  DisplayName: ADD_REFERENCE,
  Icon: '',
  Id: -1,
  Path: '',
  Type: '',
  Name: 'AddReference',
}

const changeContent = {
  DisplayName: CHANGE_REFERENCE,
  Icon: '',
  Id: -2,
  Path: '',
  Type: '',
  Name: 'ChangeReference',
}

export const ReferenceGrid: React.FC<ReactClientFieldSetting<ReferenceFieldSetting>> = (props) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [fieldValue, setFieldValue] = useState<GenericContent[]>([])
  const [selected, setSelected] = useState<GenericContent[]>([])

  const getSelected = useCallback(async () => {
    try {
      if (!props.repository) {
        throw new Error('You must pass a repository to this control')
      }
      const loadPath = props.content
        ? PathHelper.joinPaths(PathHelper.getContentUrl(props.content.Path), '/', props.settings.Name)
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
      setSelected(result)
    } catch (error) {
      console.error(error.message)
    }
  }, [props.content, props.repository, props.settings.Name])

  /**
   * Removes the chosen item from the grid and the field value
   */
  const removeItem = (id: number) => {
    const value = fieldValue.length > 1 ? fieldValue.filter((item) => item.Id !== id) : []
    props.fieldOnChange?.(
      props.settings.Name,
      value.map((item) => item.Id),
    )

    setFieldValue(value)
    setSelected(value)
  }

  /**
   * Opens a picker to choose an item to add into the grid and the field value
   */
  const addItem = () => {
    setIsPickerOpen(true)
  }

  const handleDialogClose = () => {
    setIsPickerOpen(false)
  }

  const handleCancelClick = () => {
    setSelected(fieldValue)
    handleDialogClose()
  }

  const handleOkClick = () => {
    props.fieldOnChange?.(
      props.settings.Name,
      selected.map((item: GenericContent) => item.Id),
    )

    setFieldValue(selected)
    handleDialogClose()
  }

  const selectItem = (content: GenericContent) => {
    selected.length > 0 && !props.settings.AllowMultiple
      ? setSelected((previous) => (previous.some((c) => content.Id === c.Id) ? previous : [content]))
      : setSelected((previous) =>
          previous.some((c) => content.Id === c.Id)
            ? previous.filter((c) => content.Id !== c.Id)
            : [...previous, content],
        )
  }

  const isObject = function (a: any) {
    return !!a && a.constructor === Object
  }

  useEffect(() => {
    if (props.actionName !== 'new') {
      getSelected()
    }
  }, [props.actionName, getSelected])

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <FormControl style={styles.root as any} component={'fieldset' as 'div'} required={props.settings.Compulsory}>
          <InputLabel shrink={true} htmlFor={props.settings.Name}>
            {props.settings.DisplayName}
          </InputLabel>
          <List
            dense={true}
            style={fieldValue?.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
            {fieldValue?.map((item: GenericContent) => (
              <DefaultItemTemplate
                content={item}
                remove={removeItem}
                add={addItem}
                key={item.Id}
                actionName={props.actionName}
                readOnly={props.settings.ReadOnly}
                repository={props.repository}
                multiple={props.settings.AllowMultiple ? props.settings.AllowMultiple : false}
                renderIcon={props.renderIcon}
              />
            ))}
            {!props.settings.ReadOnly ? (
              <DefaultItemTemplate
                content={fieldValue?.length > 0 && !props.settings.AllowMultiple ? changeContent : emptyContent}
                add={addItem}
                actionName={props.actionName}
                repository={props.repository}
                multiple={props.settings.AllowMultiple ? props.settings.AllowMultiple : false}
                renderIcon={props.renderIcon}
              />
            ) : null}
          </List>
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}

          <Dialog onClose={handleDialogClose} open={isPickerOpen}>
            <div style={styles.dialog}>
              <Typography variant="h5" gutterBottom={true}>
                {REFERENCE_PICKER_TITLE}
              </Typography>
              <ReferencePicker
                path={props.settings.SelectionRoots?.[0] || '/Root'}
                allowedTypes={props.settings.AllowedTypes}
                repository={props.repository!}
                select={(content) => selectItem(content)}
                selected={selected}
                renderIcon={props.renderIcon}
              />
              <DialogActions>
                <Button aria-label={OK} variant="contained" onClick={handleOkClick} color="primary">
                  {OK}
                </Button>
                <Button aria-label={CANCEL} variant="contained" onClick={handleCancelClick} color="default">
                  {CANCEL}
                </Button>
              </DialogActions>
            </div>
          </Dialog>
        </FormControl>
      )
    case 'browse':
    default: {
      return (
        <FormControl style={styles.root as any}>
          <InputLabel shrink={true} htmlFor={props.settings.Name}>
            {props.settings.DisplayName}
          </InputLabel>
          <FormGroup>
            {fieldValue ? (
              <List dense={true} style={styles.listContainer}>
                {Array.isArray(fieldValue) ? (
                  fieldValue.length ? (
                    fieldValue.map((item: GenericContent) => (
                      <DefaultItemTemplate
                        content={item}
                        remove={removeItem}
                        add={addItem}
                        key={item.Id}
                        actionName="browse"
                        repository={props.repository}
                        multiple={props.settings.AllowMultiple ? props.settings.AllowMultiple : false}
                        renderIcon={props.renderIcon}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" gutterBottom={true}>
                      No value set
                    </Typography>
                  )
                ) : isObject(props.fieldValue) ? (
                  <Typography variant="body1" gutterBottom={true}>
                    {(fieldValue as any).Name}
                  </Typography>
                ) : null}
              </List>
            ) : (
              <Typography variant="body1" gutterBottom={true}>
                No value set
              </Typography>
            )}
          </FormGroup>
        </FormControl>
      )
    }
  }
}
