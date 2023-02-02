/**
 * @module FieldControls
 */
import { Content } from '@sensenet/client-core'
import { deepMerge, PathHelper } from '@sensenet/client-utils'
import { BinaryFieldSetting, GenericContent } from '@sensenet/default-content-types'
import { useDownload } from '@sensenet/hooks-react'
import {
  Box,
  Button,
  createStyles,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core'
import CloudDownload from '@material-ui/icons/CloudDownload'
import React, { useEffect, useState } from 'react'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

const useStyles = makeStyles(() => {
  return createStyles({
    downloadContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      cursor: 'pointer',
      columnGap: '10px',
      '& p ': {
        marginBottom: '1.5px',
        lineHeight: 1,
      },
    },
    textDate: {
      fontSize: '0.66rem',
      letterSpacing: '0.5px',
      marginLeft: '5px',
      verticalAlign: 'middle',
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    label: {
      padding: 0,
      fontSize: '12px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: 1,
    },
    value: {
      fontStyle: 'italic',
      margin: '5px 0',
    },
  })
})

interface FileName {
  IsValid: boolean
  FullFileName: string
  FileNameWithoutExtension: string
  Extension: string
}

interface Binary {
  IsEmpty: boolean
  IsModified: boolean
  Id: number
  FileId: number
  Size: number
  FileName: FileName
  ContentType: string
  Checksum?: any
  Timestamp: number
  BlobProvider?: any
  BlobProviderData?: any
}

export const errorMessages = {
  repository: 'You must pass a repository to this control.',
  contentToFetch: 'There needs to be a content to get the name of the binary field.',
  contentToUpload: 'There needs to be a content to be able to upload.',
}

/**
 * Field control that represents a FileUpload field. Available values will be populated from the FieldSettings.
 */
export const FileUpload: React.FC<ReactClientFieldSetting<BinaryFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.fileUpload, props.localization?.fileUpload)

  const [fileName, setFileName] = useState('')
  useEffect(() => {
    const ac = new AbortController()

    ;(async () => {
      try {
        if (!props.repository) {
          throw new Error(errorMessages.repository)
        }
        if (!props.content) {
          throw new Error(errorMessages.contentToFetch)
        }
        const loadPath = PathHelper.joinPaths(PathHelper.getContentUrl(props.content.Path), '/', props.settings.Name)
        const binaryField = await props.repository.load<{ Binary: Binary } & Content>({
          idOrPath: loadPath,
          requestInit: { signal: ac.signal },
        })
        setFileName(binaryField.d.Binary.FileName.FullFileName)
      } catch (error) {
        console.error(error.message)
      }
    })()
    return () => ac.abort()
  }, [props.content, props.repository, props.settings.Name])

  /**
   * returns a name from the given path
   */
  const getNameFromPath = (path: string) => path.replace(/^.*[\\/]/, '')

  /**
   * handles change event on the fileupload input
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!props.repository) {
        throw new Error(errorMessages.repository)
      }
      if (!props.content) {
        throw new Error(errorMessages.contentToUpload)
      }
      e.persist()
      if (!e.target.files) {
        return
      }
      await props.repository.upload.file({
        parentPath: PathHelper.getParentPath(props.content.Path),
        file: e.target.files[0],
        fileName: props.content.Name,
        overwrite: true,
        contentTypeName: props.content.Type,
        binaryPropertyName: props.settings.Name,
      })

      const newValue = `${getNameFromPath(e.target.value)}`
      setFileName(newValue)
    } catch (error) {
      console.error(error.message)
    }
  }

  const download = useDownload(props.content as GenericContent)

  const classes = useStyles()

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl
          className={classes.root}
          key={props.settings.Name}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <label className={classes.label} htmlFor={props.settings.Name}>
            {props.settings.DisplayName}
          </label>
          <Typography variant="body1" gutterBottom={true}>
            {fileName}
          </Typography>
          <InputLabel htmlFor="raised-button-file">
            <Button aria-label={localization.buttonText} variant="contained" component="span" color="primary">
              {localization.buttonText}
            </Button>
          </InputLabel>
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
          <Input style={{ display: 'none' }} id="raised-button-file" type="file" onChange={handleUpload} />
        </FormControl>
      )
    case 'browse':
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Tooltip title={fileName || localization.noValue}>
            <Box onClick={download.download} className={classes.downloadContainer}>
              <CloudDownload />
              <Typography variant="body1" gutterBottom={true}>
                {defaultLocalization.fileDownload.buttonText}
              </Typography>
            </Box>
          </Tooltip>
        </div>
      )
  }
}
