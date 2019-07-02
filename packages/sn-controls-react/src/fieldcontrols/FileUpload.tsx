/**
 * @module FieldControls
 */

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel/InputLabel'
import Typography from '@material-ui/core/Typography'
import React, { useEffect, useState } from 'react'
import { BinaryFieldSetting, File } from '@sensenet/default-content-types'
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

/**
 * Field control that represents a FileUpload field. Available values will be populated from the FieldSettings.
 */
export function FileUpload(props: ReactClientFieldSetting<BinaryFieldSetting, File>) {
  const [fileName, setFileName] = useState('')
  useEffect(() => {
    // eslint-disable-next-line require-jsdoc
    async function fetchData() {
      if (!props.repository) {
        throw new Error('You must pass a repository to this control')
      }
      if (!props.content) {
        return
      }
      const loadPath = PathHelper.joinPaths(PathHelper.getContentUrl(props.content.Path), '/', props.settings.Name)
      const binaryField = ((await props.repository.load({ idOrPath: loadPath })) as unknown) as ODataResponse<{
        Binary: Binary
      }>
      setFileName(binaryField.d.Binary.FileName.FullFileName)
    }
    fetchData()
  }, [props.content, props.repository, props.settings.Name])

  /**
   * returns a name from the given path
   */
  const getNameFromPath = (path: string) => path.replace(/^.*[\\/]/, '')
  /**
   * handles change event on the fileupload input
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.repository) {
      throw new Error('You must pass a repository to this control')
    }
    if (!props.content) {
      throw new Error('There needs to be a content to be able to upload')
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
