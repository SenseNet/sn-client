import {
  Avatar,
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import React, { FunctionComponent } from 'react'
import { useLocalization } from '../../../hooks'

export interface UploadConflictDialogProps {
  fileName: string
  onSelectAction: (type: ResolveConflictType) => any
  onApplyAllChange: (checked: boolean) => any
}

export type ResolveConflictType = 'KEEP_BOTH' | 'REPLACE' | 'SKIP'

const useStyle = makeStyles((theme: Theme) => {
  return createStyles({
    mainColor: {
      color: theme.palette.primary.main,
    },
  })
})

const UploadConflictDialog: FunctionComponent<UploadConflictDialogProps> = ({
  fileName,
  onSelectAction,
  onApplyAllChange,
}) => {
  const style = useStyle()
  const localization = useLocalization()

  return (
    <div>
      <Dialog fullScreen={false} open={true}>
        <DialogContent>
          <DialogContentText style={{ display: 'flex' }}>
            <Avatar>
              <FileCopy />
            </Avatar>
            <div style={{ marginLeft: '16px' }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: localization.uploadProgress.uploadConflictDetails(fileName),
                }}
              />
              <FormControlLabel
                control={<Checkbox color="primary" onChange={(_, checked) => onApplyAllChange(checked)} />}
                label={localization.uploadProgress.applyToAll}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-around' }}>
          <Button className={style.mainColor} onClick={(_) => onSelectAction('KEEP_BOTH')}>
            {localization.uploadProgress.keepBoth}
          </Button>
          <Button className={style.mainColor} onClick={(_) => onSelectAction('REPLACE')}>
            {localization.uploadProgress.replace}
          </Button>
          <Button className={style.mainColor} onClick={(_) => onSelectAction('SKIP')}>
            {localization.uploadProgress.skip}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UploadConflictDialog
