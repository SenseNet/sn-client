import {
  Button,
  Checkbox,
  createStyles,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { ReactClientFieldSetting } from '@sensenet/controls-react'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocalization } from '../../hooks'

type FormFieldConfig = {
  fieldName?: string
  displayName?: string
  placeholder?: string
  required?: boolean
  formatErrorMessage?: string
  type?: string
  minRows?: number
  [key: string]: unknown
}

type PrivacyPolicyConfig = {
  label?: string
  tooltip?: string
  modalCheckboxLabel?: string
  acceptLabel?: string
  declineLabel?: string
  [key: string]: unknown
}

type FormPropertiesConfig = {
  formTitle?: string
  recaptcha?: boolean
  formDesc?: string
  submitBtn?: string
  responseTitle?: string
  responseMessage?: string
  fieldErrorMessage?: string
  requiredMessage?: string
  requiredErrorMessage?: string
  captchaErrorMessage?: string
  errorMessage?: string
  rows?: FormFieldConfig[][]
  privacyPolicy?: PrivacyPolicyConfig
  [key: string]: unknown
}

type FormPropertiesTextFieldKey =
  | 'formTitle'
  | 'formDesc'
  | 'submitBtn'
  | 'responseTitle'
  | 'responseMessage'
  | 'fieldErrorMessage'
  | 'requiredMessage'
  | 'requiredErrorMessage'
  | 'captchaErrorMessage'
  | 'errorMessage'

type PrivacyPolicyFieldKey = 'label' | 'tooltip' | 'modalCheckboxLabel' | 'acceptLabel' | 'declineLabel'

const defaultFormProperties: FormPropertiesConfig = {
  recaptcha: false,
  rows: [],
  privacyPolicy: {},
}

const textFieldKeys: FormPropertiesTextFieldKey[] = [
  'formTitle',
  'formDesc',
  'submitBtn',
  'responseTitle',
  'responseMessage',
  'fieldErrorMessage',
  'requiredMessage',
  'requiredErrorMessage',
  'captchaErrorMessage',
  'errorMessage',
]

const privacyPolicyKeys: PrivacyPolicyFieldKey[] = [
  'label',
  'tooltip',
  'modalCheckboxLabel',
  'acceptLabel',
  'declineLabel',
]

const formFieldTypeOptions = ['text', 'email', 'tel', 'textarea', 'number', 'checkbox', 'date', 'select']

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
    },
    section: {
      borderRadius: 4,
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
    },
    sectionHeader: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1),
    },
    fieldCard: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 4,
      marginTop: theme.spacing(1),
      padding: theme.spacing(2),
    },
    fieldHeader: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1),
    },
    jsonEditor: {
      fontFamily: 'monospace',
    },
    errorText: {
      color: theme.palette.error.main,
      marginTop: theme.spacing(1),
    },
    actions: {
      display: 'flex',
      gap: theme.spacing(1),
      justifyContent: 'flex-end',
      marginTop: theme.spacing(2),
    },
  }),
)

const formatLabel = (value: string) => {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (firstLetter) => firstLetter.toUpperCase())
    .trim()
}

const parseFormProperties = (rawValue: string): { value?: FormPropertiesConfig; error?: string } => {
  if (!rawValue.trim()) {
    return { value: { ...defaultFormProperties } }
  }

  try {
    const parsedValue = JSON.parse(rawValue) as FormPropertiesConfig

    return {
      value: {
        ...defaultFormProperties,
        ...parsedValue,
        rows: Array.isArray(parsedValue.rows) ? parsedValue.rows : [],
        privacyPolicy: parsedValue.privacyPolicy || {},
      },
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Invalid JSON' }
  }
}

const stringifyFormProperties = (value: FormPropertiesConfig) => JSON.stringify(value, null, 2)

export const FormPropertiesEditor: React.FC<ReactClientFieldSetting<LongTextFieldSetting>> = (props) => {
  const classes = useStyles()
  const localization = useLocalization().formPropertiesEditor
  const initialRawValue = useMemo(
    () => props.fieldValue || (props.actionName === 'new' && props.settings.DefaultValue) || '{}',
    [props.actionName, props.fieldValue, props.settings.DefaultValue],
  )
  const initialParsedValue = useMemo(() => parseFormProperties(initialRawValue), [initialRawValue])
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>(initialParsedValue.error ? 'json' : 'visual')
  const [rawValue, setRawValue] = useState(initialRawValue)
  const [formProperties, setFormProperties] = useState<FormPropertiesConfig>(
    initialParsedValue.value || { ...defaultFormProperties },
  )
  const [parseError, setParseError] = useState(initialParsedValue.error)
  const isReadonly = Boolean(props.settings.ReadOnly)

  useEffect(() => {
    setRawValue(initialRawValue)
    setParseError(initialParsedValue.error)

    if (initialParsedValue.value) {
      setFormProperties(initialParsedValue.value)
    }

    setActiveTab(initialParsedValue.error ? 'json' : 'visual')
  }, [initialParsedValue.error, initialParsedValue.value, initialRawValue])

  const emitFormProperties = (nextValue: FormPropertiesConfig) => {
    const nextRawValue = stringifyFormProperties(nextValue)

    setFormProperties(nextValue)
    setRawValue(nextRawValue)
    setParseError(undefined)
    props.fieldOnChange?.(props.settings.Name, nextRawValue)
  }

  const updateRootField = (fieldName: FormPropertiesTextFieldKey | 'recaptcha', value: string | boolean) => {
    emitFormProperties({
      ...formProperties,
      [fieldName]: value,
    })
  }

  const updatePrivacyPolicyField = (fieldName: PrivacyPolicyFieldKey, value: string) => {
    emitFormProperties({
      ...formProperties,
      privacyPolicy: {
        ...(formProperties.privacyPolicy || {}),
        [fieldName]: value,
      },
    })
  }

  const updateFormField = (rowIndex: number, fieldIndex: number, fieldPatch: Partial<FormFieldConfig>) => {
    const rows = (formProperties.rows || []).map((row, currentRowIndex) =>
      currentRowIndex === rowIndex
        ? row.map((field, currentFieldIndex) =>
            currentFieldIndex === fieldIndex ? { ...field, ...fieldPatch } : field,
          )
        : row,
    )

    emitFormProperties({
      ...formProperties,
      rows,
    })
  }

  const updateFormFieldMinRows = (rowIndex: number, fieldIndex: number, value: string) => {
    const nextMinRows = Number(value)
    const rows = (formProperties.rows || []).map((row, currentRowIndex) =>
      currentRowIndex === rowIndex
        ? row.map((field, currentFieldIndex) => {
            if (currentFieldIndex !== fieldIndex) {
              return field
            }

            const nextField = { ...field }

            if (value && Number.isFinite(nextMinRows)) {
              nextField.minRows = nextMinRows
            } else {
              delete nextField.minRows
            }

            return nextField
          })
        : row,
    )

    emitFormProperties({
      ...formProperties,
      rows,
    })
  }

  const addRow = () => {
    emitFormProperties({
      ...formProperties,
      rows: [...(formProperties.rows || []), []],
    })
  }

  const removeRow = (rowIndex: number) => {
    emitFormProperties({
      ...formProperties,
      rows: (formProperties.rows || []).filter((_, currentRowIndex) => currentRowIndex !== rowIndex),
    })
  }

  const addField = (rowIndex: number) => {
    const rows = (formProperties.rows || []).map((row, currentRowIndex) =>
      currentRowIndex === rowIndex
        ? [
            ...row,
            {
              fieldName: '',
              displayName: '',
              placeholder: '',
              required: false,
              type: 'text',
            },
          ]
        : row,
    )

    emitFormProperties({
      ...formProperties,
      rows,
    })
  }

  const removeField = (rowIndex: number, fieldIndex: number) => {
    const rows = (formProperties.rows || []).map((row, currentRowIndex) =>
      currentRowIndex === rowIndex ? row.filter((_, currentFieldIndex) => currentFieldIndex !== fieldIndex) : row,
    )

    emitFormProperties({
      ...formProperties,
      rows,
    })
  }

  const handleRawValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextRawValue = event.target.value
    const parsedValue = parseFormProperties(nextRawValue)

    setRawValue(nextRawValue)
    setParseError(parsedValue.error)

    if (parsedValue.value) {
      setFormProperties(parsedValue.value)
    }

    props.fieldOnChange?.(props.settings.Name, nextRawValue)
  }

  const formatRawValue = () => {
    const parsedValue = parseFormProperties(rawValue)

    if (parsedValue.value) {
      emitFormProperties(parsedValue.value)
    } else {
      setParseError(parsedValue.error)
    }
  }

  const renderJsonEditor = () => (
    <>
      <TextField
        className={classes.jsonEditor}
        disabled={isReadonly}
        fullWidth
        multiline
        name={props.settings.Name}
        onChange={handleRawValueChange}
        required={props.settings.Compulsory}
        rows={18}
        value={rawValue}
        variant="outlined"
      />
      {parseError && (
        <Typography className={classes.errorText} variant="body2">
          {localization.invalidJson}: {parseError}
        </Typography>
      )}
      <div className={classes.actions}>
        <Button color="primary" disabled={isReadonly} onClick={formatRawValue} variant="outlined">
          {localization.formatJson}
        </Button>
      </div>
    </>
  )

  const renderVisualEditor = () => {
    const rows = formProperties.rows || []

    if (parseError) {
      return (
        <Typography className={classes.errorText} variant="body2">
          {localization.fixJsonFirst}
        </Typography>
      )
    }

    return (
      <>
        <Paper className={classes.section} variant="outlined">
          <Typography variant="subtitle1">{localization.generalSettings}</Typography>
          <Grid container spacing={2}>
            {textFieldKeys.map((fieldName) => (
              <Grid item key={fieldName} md={6} xs={12}>
                <TextField
                  disabled={isReadonly}
                  fullWidth
                  label={formatLabel(fieldName)}
                  onChange={(event) => updateRootField(fieldName, event.target.value)}
                  value={(formProperties[fieldName] as string) || ''}
                  variant="outlined"
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(formProperties.recaptcha)}
                    color="primary"
                    disabled={isReadonly}
                    onChange={(event) => updateRootField('recaptcha', event.target.checked)}
                  />
                }
                label={localization.recaptcha}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.section} variant="outlined">
          <div className={classes.sectionHeader}>
            <Typography variant="subtitle1">{localization.rows}</Typography>
            <Button color="primary" disabled={isReadonly} onClick={addRow} startIcon={<AddIcon />} variant="outlined">
              {localization.addRow}
            </Button>
          </div>
          {rows.map((row, rowIndex) => (
            <Paper className={classes.fieldCard} key={rowIndex} variant="outlined">
              <div className={classes.fieldHeader}>
                <Typography variant="subtitle2">
                  {localization.row} {rowIndex + 1}
                </Typography>
                <div>
                  <Button
                    color="primary"
                    disabled={isReadonly}
                    onClick={() => addField(rowIndex)}
                    startIcon={<AddIcon />}
                    size="small">
                    {localization.addField}
                  </Button>
                  <IconButton disabled={isReadonly} onClick={() => removeRow(rowIndex)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              {!row.length && (
                <Typography color="textSecondary" variant="body2">
                  {localization.emptyRow}
                </Typography>
              )}
              {row.map((field, fieldIndex) => {
                const typeOptions = formFieldTypeOptions.includes(field.type || '')
                  ? formFieldTypeOptions
                  : [field.type || 'text', ...formFieldTypeOptions]

                return (
                  <div className={classes.fieldCard} key={`${rowIndex}-${fieldIndex}`}>
                    <div className={classes.fieldHeader}>
                      <Typography variant="subtitle2">
                        {field.fieldName || `${localization.field} ${fieldIndex + 1}`}
                      </Typography>
                      <IconButton disabled={isReadonly} onClick={() => removeField(rowIndex, fieldIndex)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </div>
                    <Grid container spacing={2}>
                      <Grid item md={4} xs={12}>
                        <TextField
                          disabled={isReadonly}
                          fullWidth
                          label={localization.fieldName}
                          onChange={(event) => updateFormField(rowIndex, fieldIndex, { fieldName: event.target.value })}
                          value={field.fieldName || ''}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          disabled={isReadonly}
                          fullWidth
                          label={localization.displayName}
                          onChange={(event) =>
                            updateFormField(rowIndex, fieldIndex, { displayName: event.target.value })
                          }
                          value={field.displayName || ''}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          disabled={isReadonly}
                          fullWidth
                          label={localization.type}
                          onChange={(event) => updateFormField(rowIndex, fieldIndex, { type: event.target.value })}
                          select
                          value={field.type || 'text'}
                          variant="outlined">
                          {typeOptions.map((typeOption) => (
                            <MenuItem key={typeOption} value={typeOption}>
                              {typeOption}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          disabled={isReadonly}
                          fullWidth
                          label={localization.placeholder}
                          onChange={(event) =>
                            updateFormField(rowIndex, fieldIndex, { placeholder: event.target.value })
                          }
                          value={field.placeholder || ''}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          disabled={isReadonly}
                          fullWidth
                          label={localization.formatErrorMessage}
                          onChange={(event) =>
                            updateFormField(rowIndex, fieldIndex, { formatErrorMessage: event.target.value })
                          }
                          value={field.formatErrorMessage || ''}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(field.required)}
                              color="primary"
                              disabled={isReadonly}
                              onChange={(event) =>
                                updateFormField(rowIndex, fieldIndex, { required: event.target.checked })
                              }
                            />
                          }
                          label={localization.required}
                        />
                      </Grid>
                      {field.type === 'textarea' && (
                        <Grid item md={6} xs={12}>
                          <TextField
                            disabled={isReadonly}
                            fullWidth
                            label={localization.minRows}
                            onChange={(event) => updateFormFieldMinRows(rowIndex, fieldIndex, event.target.value)}
                            type="number"
                            value={field.minRows ?? ''}
                            variant="outlined"
                          />
                        </Grid>
                      )}
                    </Grid>
                  </div>
                )
              })}
            </Paper>
          ))}
        </Paper>

        <Paper className={classes.section} variant="outlined">
          <Typography variant="subtitle1">{localization.privacyPolicy}</Typography>
          <Grid container spacing={2}>
            {privacyPolicyKeys.map((fieldName) => (
              <Grid item key={fieldName} md={6} xs={12}>
                <TextField
                  disabled={isReadonly}
                  fullWidth
                  label={formatLabel(fieldName)}
                  onChange={(event) => updatePrivacyPolicyField(fieldName, event.target.value)}
                  value={String((formProperties.privacyPolicy || {})[fieldName] || '')}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </>
    )
  }

  if (props.actionName === 'browse') {
    return (
      <div>
        <Typography variant="caption" gutterBottom>
          {`${props.settings.DisplayName} (${props.settings.Name})`}
        </Typography>
        <pre>{rawValue}</pre>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <Typography variant="caption" gutterBottom>
        {`${props.settings.DisplayName} (${props.settings.Name})`}
      </Typography>
      {props.settings.Description && !props.hideDescription && (
        <Typography color="textSecondary" variant="body2">
          {props.settings.Description}
        </Typography>
      )}
      <Tabs indicatorColor="primary" onChange={(_, value) => setActiveTab(value)} textColor="primary" value={activeTab}>
        <Tab label={localization.visualEditor} value="visual" />
        <Tab label={localization.jsonEditor} value="json" />
      </Tabs>
      <Divider />
      {activeTab === 'visual' ? renderVisualEditor() : renderJsonEditor()}
    </div>
  )
}
