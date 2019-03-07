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
        PaperProps={{ style: { padding: '2em' } }}
        onClose={() => setAddState('hidden')}
        onOpen={() => {
          /** */
        }}
        open={addState === 'selectType'}>
        <Typography variant="body1">New...</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '512px', overflow: 'auto' }}>
          <Button key="Upload">
            <label htmlFor="upload_file_input">
              <div
                style={{
                  width: 128,
                  height: 128,
                }}>
                <CloudUpload style={{ height: 82, width: 82 }} />
                <Typography>Upload</Typography>
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
                  width: 128,
                  height: 128,
                }}>
                <Icon style={{ height: 82, width: 82 }} item={childType} />
                <Typography>{childType.DisplayName}</Typography>
              </div>
            </Button>
          ))}
        </div>
      </SwipeableDrawer>
    </div>
  )
}
