import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'
import CloudUpload from '@material-ui/icons/CloudUpload'
import { Repository, Upload } from '@sensenet/client-core'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { UploadTracker } from '../services/UploadTracker'
import { Icon } from './Icon'
import { InjectorContext } from './InjectorContext'

export interface AddButtonProps {
  parent: GenericContent
}

export const AddButton: React.FunctionComponent<AddButtonProps> = props => {
  const injector = useContext(InjectorContext)
  const repo = injector.GetInstance(Repository)
  const [addState, setAddState] = useState<'hidden' | 'selectType' | 'edit'>('hidden')
  const [allowedChildTypes, setAllowedChildTypes] = useState<Schema[]>([])

  useEffect(() => {
    setAllowedChildTypes(
      repo.schemas.getSchemaByName(props.parent.Type).AllowedChildTypes.map(type => repo.schemas.getSchemaByName(type)),
    )
  }, [props.parent.Type])

  return (
    <div>
      <Tooltip title="Create or upload content" placement="top-end">
        <Fab
          color="primary"
          style={{ position: 'fixed', bottom: '1em', right: '1em' }}
          onClick={() => setAddState('selectType')}>
          <Add />
        </Fab>
      </Tooltip>
      <SwipeableDrawer
        anchor="bottom"
        onClose={() => setAddState('hidden')}
        onOpen={() => {
          /** */
        }}
        open={addState === 'selectType'}>
        <Typography variant="subtitle1" style={{ margin: '0.8em' }}>
          New...
        </Typography>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', maxHeight: '512px', overflow: 'auto' }}>
          <Button key="Upload">
            <label htmlFor="upload_file_input">
              <div
                style={{
                  width: 90,
                }}>
                <CloudUpload style={{ height: 38, width: 38 }} />
                <Typography variant="body2">Upload</Typography>
              </div>
            </label>
          </Button>
          <div style={{ visibility: 'hidden', display: 'none' }}>
            <input
              onChange={ev => {
                setAddState('hidden')
                ev.target.files &&
                  Upload.fromFileList({
                    parentPath: props.parent.Path,
                    fileList: ev.target.files,
                    createFolders: true,
                    repository: repo,
                    binaryPropertyName: 'Binary',
                    overwrite: false,
                    progressObservable: injector.GetInstance(UploadTracker).onUploadProgress,
                  })
              }}
              type="file"
              accept=""
              multiple={true}
              id="upload_file_input"
            />
          </div>
          {allowedChildTypes.map(childType => (
            <Button key={childType.ContentTypeName}>
              <div
                style={{
                  width: 90,
                }}>
                <Icon style={{ height: 38, width: 38 }} item={childType} />
                <Typography variant="body2">{childType.DisplayName}</Typography>
              </div>
            </Button>
          ))}
        </div>
      </SwipeableDrawer>
    </div>
  )
}
