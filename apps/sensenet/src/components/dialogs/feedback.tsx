import {
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  DialogContentText,
  makeStyles,
  Theme,
} from '@material-ui/core'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { DialogTitle, useDialog } from '.'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paragraph: {
      marginBottom: '18px',
      '& a': {
        color: theme.palette.primary.main,
      },
    },
  }),
)

export function FeedbackDialog() {
  const { closeLastDialog } = useDialog()
  const localization = useLocalization().feedback
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <>
      <DialogTitle>{localization.title}</DialogTitle>
      <>
        <DialogContent>
          <DialogContentText style={{ wordBreak: 'break-word' }}>
            <div
              className={classes.paragraph}
              dangerouslySetInnerHTML={{
                __html: localization.feedbackText1(
                  '<a href="https://trello.com/b/aoZbRaYz/snaas-beta" target="_blank">trello board</a>',
                ),
              }}
            />
            <div
              className={classes.paragraph}
              dangerouslySetInnerHTML={{
                __html: localization.feedbackText2,
              }}
            />
            <div className={classes.paragraph}>
              <a href="mailto:benceh+ekrk3fsakexqn5ic7iqn@boards.trello.com" style={{ fontSize: '20px' }}>
                benceh+ekrk3fsakexqn5ic7iqn@boards.trello.com
              </a>
            </div>
            <div
              className={classes.paragraph}
              dangerouslySetInnerHTML={{
                __html: localization.feedbackText3(
                  '<a href="https://trello.com/b/aoZbRaYz/snaas-beta" target="_blank">board</a>',
                ),
              }}
            />
            <div className={classes.paragraph}>{localization.feedbackText4}</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label={localization.cancel}
            className={globalClasses.cancelButton}
            onClick={closeLastDialog}
            style={{ marginRight: 0 }}>
            {localization.cancel}
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export default FeedbackDialog
