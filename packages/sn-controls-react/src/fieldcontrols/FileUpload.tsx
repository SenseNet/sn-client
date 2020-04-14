/**
 * @module FieldControls
 */

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel/InputLabel'
import Typography from '@material-ui/core/Typography'
import React, { useEffect, useState } from 'react'
import { BinaryFieldSetting } from '@sensenet/default-content-types'
import { PathHelper } from '@sensenet/client-utils'
import { ODataResponse } from '@sensenet/client-core'
import { ReactClientFieldSetting } from './ClientFieldSetting'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  label: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 0,
    fontSize: '12px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1,
  },
  value: {
    fontStyle: 'italic',
    margin: '5px 0',
  },
}

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
  const [fileName, setFileName] = useState('')
  useEffect(() => {
    const ac = new AbortController()
    // eslint-disable-next-line require-jsdoc
    async function fetchData() {
      try {
        if (!props.repository) {
          throw new Error(errorMessages.repository)
        }
        if (!props.content) {
          throw new Error(errorMessages.contentToFetch)
        }
        const loadPath = PathHelper.joinPaths(PathHelper.getContentUrl(props.content.Path), '/', props.settings.Name)
        const binaryField = ((await props.repository.load({
          idOrPath: loadPath,
          requestInit: { signal: ac.signal },
        })) as unknown) as ODataResponse<{
          Binary: Binary
        }>
        setFileName(binaryField.d.Binary.FileName.FullFileName)
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchData()
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
        binaryPropertyName: 'Binary',
      })

      const newValue = `${getNameFromPath(e.target.value)}`
      setFileName(newValue)
      props.fieldOnChange && props.fieldOnChange(props.settings.Name, newValue)
    } catch (error) {
      console.error(error.message)
    }
  }

  switch (props.actionName) {
    case 'edit':
      return (
        <FormControl
          style={styles.root as any}
          key={props.settings.Name}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <label style={styles.label} htmlFor={props.settings.Name}>
            {props.settings.DisplayName}
          </label>
          <Typography variant="body1" gutterBottom={true}>
            {fileName}
          </Typography>
          <div style={{ display: 'table-row' }}>
            <div style={{ position: 'relative', display: 'table-cell', minWidth: 100 }}>
              <InputLabel htmlFor="raised-button-file" style={{ transform: 'translate(0, 4px) scale(1)' }}>
                <Button variant="contained" component="span" color="primary">
                  Upload
                </Button>
              </InputLabel>
            </div>
          </div>
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
          <Typography variant="body1" gutterBottom={true}>
            {fileName}
          </Typography>
        </div>
      )
  }
}
