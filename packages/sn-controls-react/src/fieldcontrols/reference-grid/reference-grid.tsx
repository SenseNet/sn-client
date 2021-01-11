import { deepMerge, PathHelper } from '@sensenet/client-utils'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { PickerClassKey } from '@sensenet/pickers-react'
import { DialogTitle } from '@material-ui/core'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import React, { ElementType, useCallback, useEffect, useMemo, useState } from 'react'
import { ReactClientFieldSetting } from '../client-field-setting'
import { defaultLocalization } from '../localization'
import { DefaultItemTemplate } from './default-item-template'
import { ReferencePicker } from './reference-picker'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  listContainer: {
    display: 'block',
    marginTop: 10,
  },
}

interface ReferenceGridProps extends ReactClientFieldSetting<ReferenceFieldSetting> {
  dialogProps?: Partial<DialogProps>
  dialogTitleComponent?: ElementType
  renderPickerIcon?: (item: any) => JSX.Element
  pickerClasses?: PickerClassKey
}

export const ReferenceGrid: React.FC<ReferenceGridProps> = (props) => {
  const localization = deepMerge(defaultLocalization.referenceGrid, props.localization?.referenceGrid)
  const DialogTitleComponent = props.dialogTitleComponent ?? DialogTitle

  const emptyContent = useMemo(
    () => ({
      DisplayName: localization.addReference,
      Icon: '',
      Id: -1,
      Path: '',
      Type: '',
      Name: 'AddReference',
    }),
    [localization.addReference],
  )

  const changeContent = useMemo(
    () => ({
      DisplayName: localization.changeReference,
      Icon: '',
      Id: -2,
      Path: '',
      Type: '',
      Name: 'ChangeReference',
    }),
    [localization.changeReference],
  )

  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [fieldValue, setFieldValue] = useState<GenericContent[]>([])

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
    handleDialogClose()
  }

  const handleOkClick = (newSelection: GenericContent[]) => {
    props.fieldOnChange?.(
      props.settings.Name,
      newSelection.map((item) => item.Id),
    )

    setFieldValue(newSelection)
    handleDialogClose()
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

  useEffect(() => {
    if (props.actionName === 'new') {
      getDefaultValue()
    }
  }, [props.actionName, getDefaultValue])

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

          <Dialog fullWidth maxWidth="md" onClose={handleDialogClose} open={isPickerOpen} {...props.dialogProps}>
            <DialogTitleComponent>{localization.referencePickerTitle}</DialogTitleComponent>
            <ReferencePicker
              defaultValue={fieldValue}
              path={props.settings.SelectionRoots?.[0] || '/Root'}
              repository={props.repository!}
              renderIcon={props.renderPickerIcon}
              handleSubmit={handleOkClick}
              handleCancel={handleCancelClick}
              fieldSettings={props.settings}
              localization={{ cancelButton: localization.cancelButton, submitButton: localization.okButton }}
              classes={props.pickerClasses}
            />
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
                {fieldValue.length ? (
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
                    {localization.noValue}
                  </Typography>
                )}
              </List>
            ) : (
              <Typography variant="body1" gutterBottom={true}>
                {localization.noValue}
              </Typography>
            )}
          </FormGroup>
        </FormControl>
      )
    }
  }
}
