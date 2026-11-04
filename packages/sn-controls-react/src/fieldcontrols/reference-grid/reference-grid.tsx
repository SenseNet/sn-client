import {
  Button,
  createStyles,
  Dialog,
  DialogProps,
  DialogTitle,
  FormControl,
  makeStyles,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'
import { deepMerge, PathHelper } from '@sensenet/client-utils'
import { GenericContent, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { GenericContentWithIsParent, PickerAdvanced, PickerClassKey } from '@sensenet/pickers-react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import React, { ElementType, useCallback, useEffect, useState } from 'react'
import { ReactClientFieldSetting } from '../client-field-setting'
import CustomLabel from '../label/custom-label'
import { defaultLocalization } from '../localization'
import { buildCustomPath, getAppPathAndContent, Paths } from './default-item-template'

const useStyles = makeStyles(() =>
  createStyles({
    gridCont: {
      width: '100%',
      height: '100%',
      minHeight: '300px',
    },
    grid: {
      width: '100%',
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    listContainer: {
      padding: 0,
    },
    fieldName: {
      opacity: '0',
      pointerEvents: 'none',
      height: '0px',
    },
    actionButton: {
      minHeight: '0',
      minWidth: '0',
      padding: '0 12px',
    },
    pickerDialog: {
      width: '950px',
      maxWidth: '80%',
      height: '900px',
      maxHeight: '80%',
      padding: '8px 8px 0',
      border: '2px solid grey',
    },
    pathCell: {
      cursor: 'pointer',
      '&[data-clickable="true"]:hover': {
        textDecoration: 'underline',
      },
    },
  }),
)

interface ReferenceGridProps extends ReactClientFieldSetting<ReferenceFieldSetting> {
  dialogProps?: Partial<DialogProps>
  dialogTitleComponent?: ElementType
  renderPickerIcon: (item: GenericContentWithIsParent | User) => JSX.Element
  pickerClasses?: PickerClassKey
  paths?: Paths
}

export const ReferenceGrid: React.FC<ReferenceGridProps> = (props) => {
  const theme = useTheme()
  const classes = useStyles()
  const localization = deepMerge(defaultLocalization.referenceGrid, props.localization?.referenceGrid)
  const DialogTitleComponent = props.dialogTitleComponent ?? DialogTitle

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

  //Removes the chosen item from the grid and the field value
  const removeItem = (id: number) => {
    const value = fieldValue.length > 1 ? fieldValue.filter((item) => item.Id !== id) : []
    props.fieldOnChange?.(
      props.settings.Name,
      value.map((item) => item.Id),
    )

    setFieldValue(value)
  }

  //Opens a picker to choose an item to add into the grid and the field value
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

  const navigateToReference = (content: GenericContent) => {
    if (!content?.Path || content.Id === -1 || !props.paths) {
      return
    }
    const referencedItemPaths = getAppPathAndContent(props.paths, content.Path)
    if (!referencedItemPaths) {
      return
    }
    const { appPath, contentePath } = referencedItemPaths
    window.location.href = buildCustomPath(appPath, props.actionName, contentePath)
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

  const iconCol: ColDef = {
    headerName: '',
    field: 'Icon',
    width: 24,
    minWidth: 24,
    cellRenderer: (x: { data: GenericContent }) => props.renderPickerIcon(x.data),
    cellStyle: { padding: 0 },
  }

  const pathCol: ColDef = {
    headerName: 'Path',
    field: 'Path',
    headerTooltip: 'Path',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()),
    resizable: true,
    cellRenderer: (x: { data: GenericContent; value: string }) => {
      const clickable = Boolean(props.paths && x.data?.Id !== -1)
      return (
        <span
          className={classes.pathCell}
          data-clickable={clickable}
          onClick={() => clickable && navigateToReference(x.data)}>
          {x.value}
        </span>
      )
    },
  }

  const displayNameCol: ColDef = {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    flex: 1.5,
    filter: true,
    sortable: true,
    comparator: (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()),
    resizable: true,
  }

  const typeCol: ColDef = {
    headerName: 'Type',
    field: 'Type',
    headerTooltip: 'Type',
    flex: 1,
    filter: true,
    sortable: true,
    resizable: true,
  }

  const dataCols: ColDef[] = [pathCol, displayNameCol, typeCol]

  const removeCol: ColDef = {
    headerName: '',
    field: '',
    width: 66,
    cellRenderer: (x: { data: GenericContent }) => {
      return (
        <Button className={classes.actionButton} onClick={() => removeItem(x.data.Id)}>
          &#10006;
        </Button>
      )
    },
    headerComponent: () => (
      <Button
        className={classes.actionButton}
        onClick={() => {
          addItem()
        }}>
        &#10009;
      </Button>
    ),
  }

  const currentParent = props.content?.Path.substring(0, props.content?.Path.lastIndexOf('/')) || '/Root'

  switch (props.actionName) {
    case 'new':
    case 'edit':
      return (
        <FormControl
          data-test="edit-refence"
          className={classes.root}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <TextField
            name={props.content?.Name}
            autoComplete="off"
            value={fieldValue.length === 0 ? '' : 'selected'}
            required={props.settings.Compulsory}
            className={classes.fieldName}
          />
          <CustomLabel
            name={props.settings.Name}
            displayName={props.settings.DisplayName}
            highlighted={props.settings.Customization?.Highlighted}
            description={props.settings.Description}
            showDescription={!props.hideDescription}
          />
          <div style={{ width: '100%' }}>
            <AgGridReact
              rowData={fieldValue}
              columnDefs={[iconCol, ...dataCols, removeCol]}
              className={`${classes.grid} ${
                theme.palette.type === 'light' ? 'ag-theme-balham' : 'ag-theme-balham-dark'
              }`}
              tooltipShowDelay={100}
              suppressNoRowsOverlay={true}
              domLayout="autoHeight"
            />
          </div>

          <Dialog
            fullWidth
            PaperProps={{ className: classes.pickerDialog }}
            maxWidth={false}
            onClose={handleDialogClose}
            open={isPickerOpen}
            {...props.dialogProps}>
            <DialogTitleComponent style={{ width: '100%' }}>{localization.referencePickerTitle}</DialogTitleComponent>
            <PickerAdvanced
              defaultValue={fieldValue}
              repository={props.repository!}
              path={currentParent}
              renderIcon={props.renderPickerIcon}
              allowMultiple={props.settings.AllowMultiple}
              onCancel={handleCancelClick}
              onSubmit={handleOkClick}
            />
          </Dialog>
        </FormControl>
      )
    case 'browse':
    default: {
      return (
        <FormControl className={classes.root}>
          <Typography variant="caption" gutterBottom={true}>
            {`${props.settings.DisplayName} (${props.settings.Name})`}
          </Typography>
          {fieldValue?.length ? (
            <div style={{ height: `${35 + fieldValue.length * 27}px`, width: '100%' }}>
              <AgGridReact
                rowData={fieldValue}
                columnDefs={[iconCol, ...dataCols]}
                className={`${classes.grid} ${
                  theme.palette.type === 'light' ? 'ag-theme-balham' : 'ag-theme-balham-dark'
                }`}
                tooltipShowDelay={100}
                suppressNoRowsOverlay={true}
              />
            </div>
          ) : (
            <Typography variant="body1" gutterBottom={true}>
              {localization.noValue}
            </Typography>
          )}
        </FormControl>
      )
    }
  }
}
