import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { noop } from '@babel/types'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'
import AddNewDialog from '../Dialogs/AddNewDialog'
import PathPicker from './PathPicker'

interface PathPickerDialogProps {
  dialogComponent?: JSX.Element
  dialogTitle: string
  dialogCallback?: (...args: any[]) => void
  mode: string
  showAddFolder?: boolean
  currentPath: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    pickerClose: state.dms.picker.pickerOnClose,
    selectedItems: state.dms.picker.selected,
  }
}

const mapDispatchToProps = {
  openDialog: DMSActions.openDialog,
}

// eslint-disable-next-line require-jsdoc
function PathPickerDialog(
  props: PathPickerDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
) {
  const handleSubmit = () => {
    const { dialogComponent, dialogTitle, dialogCallback } = props
    if (!dialogComponent) {
      dialogCallback && dialogCallback(props.selectedItems)
      return
    }
    props.openDialog(dialogComponent, dialogTitle, noop, dialogCallback)
  }

  const handleAddNewClick = () => {
    props.openDialog(
      <AddNewDialog
        parentPath={props.selectedItems.length ? props.selectedItems[0].Path : props.currentPath}
        contentTypeName="Folder"
        title="folder"
      />,
      resources.ADD_NEW,
      noop,
    )
  }

  return (
    <>
      <DialogContent>
        <Scrollbars
          style={{
            height: 240,
            width: 'calc(100% - 1px)',
          }}
          renderThumbVertical={({ style }) => (
            <div style={{ ...style, borderRadius: 2, backgroundColor: '#999', width: 10, marginLeft: -2 }} />
          )}
          thumbMinSize={180}>
          <PathPicker currentPath={props.currentPath} />
        </Scrollbars>
      </DialogContent>

      <MediaQuery minDeviceWidth={700}>
        {(matches) => (
          <DialogActions className="mobile-picker-buttonRow">
            {props.showAddFolder === false ? null : (
              <div>
                <IconButton onClick={handleAddNewClick}>
                  <Icon type={iconType.materialui} iconName="create_new_folder" style={{ color: '#016D9E' }} />
                </IconButton>
                <Typography
                  style={{ flexGrow: 1, color: '#016D9E', fontFamily: 'Raleway Medium', fontSize: 14 }}
                  onClick={handleAddNewClick}>
                  {matches ? null : resources.NEW_FOLDER}
                </Typography>
              </div>
            )}
            {matches ? (
              <Button color="default" style={{ marginRight: 20 }} onClick={props.pickerClose}>
                {resources.CANCEL}
              </Button>
            ) : null}
            <Button
              onClick={handleSubmit}
              variant="contained"
              className="disabled-mobile-button"
              disabled={!props.selectedItems.length}
              color={matches ? 'primary' : 'default'}>
              {resources[`${props.mode.toUpperCase()}_BUTTON`]}
            </Button>
          </DialogActions>
        )}
      </MediaQuery>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PathPickerDialog)
