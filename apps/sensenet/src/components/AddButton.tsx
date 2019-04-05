import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fab from '@material-ui/core/Fab'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'
import CloudUpload from '@material-ui/icons/CloudUpload'
import { Upload } from '@sensenet/client-core'
import { NewViewComponent } from '@sensenet/controls-react'
import { Schema } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { CurrentContentContext, InjectorContext, LocalizationContext, RepositoryContext } from '../context'
import { UploadTracker } from '../services/UploadTracker'
import { Icon } from './Icon'

export const AddButton: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const repo = useContext(RepositoryContext)
  const parent = useContext(CurrentContentContext)
  const [showSelectType, setShowSelectType] = useState(false)
  const [allowedChildTypes, setAllowedChildTypes] = useState<Schema[]>([])

  const [showAddNewDialog, setShowAddNewDialog] = useState(false)
  const [selectedSchema, setSelectedSchema] = useState<Schema>(repo.schemas.getSchemaByName('GenericContent'))

  const localization = useContext(LocalizationContext).values.addButton

  useEffect(() => {
    if (showSelectType) {
      repo
        .getAllowedChildTypes({ idOrPath: parent.Id })
        .then(types => setAllowedChildTypes(types.d.results.map(t => repo.schemas.getSchemaByName(t.Name))))
    }
  }, [parent.Id, showSelectType])

  return (
    <div>
      <Tooltip title={localization.tooltip} placement="top-end">
        <Fab
          color="primary"
          style={{ position: 'fixed', bottom: '1em', right: '1em' }}
          onClick={() => setShowSelectType(true)}>
          <Add />
        </Fab>
      </Tooltip>
      <SwipeableDrawer
        anchor="bottom"
        onClose={() => setShowSelectType(false)}
        onOpen={() => {
          /** */
        }}
        open={showSelectType}>
        <Typography variant="subtitle1" style={{ margin: '0.8em' }}>
          {localization.new}
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
                <Typography variant="body2">{localization.upload}</Typography>
              </div>
            </label>
          </Button>
          <div style={{ visibility: 'hidden', display: 'none' }}>
            <input
              onChange={ev => {
                setShowSelectType(false)
                ev.target.files &&
                  Upload.fromFileList({
                    parentPath: parent.Path,
                    fileList: ev.target.files,
                    createFolders: true,
                    repository: repo,
                    binaryPropertyName: 'Binary',
                    overwrite: false,
                    progressObservable: injector.getInstance(UploadTracker).onUploadProgress,
                  })
              }}
              type="file"
              accept=""
              multiple={true}
              id="upload_file_input"
            />
          </div>
          {allowedChildTypes.map(childType => (
            <Button
              key={childType.ContentTypeName}
              onClick={() => {
                setShowSelectType(false)
                setShowAddNewDialog(true)
                setSelectedSchema(childType)
              }}>
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
      <Dialog open={showAddNewDialog} onClose={() => setShowAddNewDialog(false)}>
        <DialogTitle> {localization.dialogTitle.replace('{0}', selectedSchema.DisplayName)}</DialogTitle>
        <DialogContent>
          <NewViewComponent
            repositoryUrl={repo.configuration.repositoryUrl}
            fields={[]}
            changeAction={() => {
              return null as any
            }}
            handleCancel={() => setShowAddNewDialog(false)}
            repository={repo}
            contentTypeName={selectedSchema.ContentTypeName}
            schema={selectedSchema}
            path={parent.Path}
            onSubmit={(parentPath, content) => {
              repo.post({
                contentType: selectedSchema.ContentTypeName,
                parentPath,
                content,
              })
              setShowAddNewDialog(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
