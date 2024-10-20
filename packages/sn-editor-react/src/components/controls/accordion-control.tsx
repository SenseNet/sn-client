import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
  makeStyles,
  TextField,
  Theme,
  Tooltip,
  useTheme,
} from '@material-ui/core'
import { ArrowDropDown, Close, DragHandle } from '@material-ui/icons'

import { Editor } from '@tiptap/react'
import React, { FC, useCallback, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    ListIcon: {
      paddingLeft: '0px',
      height: '32px',
      '& .MuiIconButton-label': {
        flexDirection: 'column',
        height: 'inherit',
        justifyContent: 'center',
        '& .icon-container': {
          '&:first-of-type': {
            marginBottom: '-14px',
          },
          height: '23px',
          position: 'relative',
          '& .down-arrow': {
            top: '0',
            right: '0',
            position: 'absolute',
            marginTop: '0px',
            marginRight: '-13px',
          },
        },
      },
    },
    accordion: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '15px',
      border: '2px solid',
      borderColor: theme.palette.primary.main,
      position: 'relative',
      padding: '10px',
      borderRadius: '10px',
      '& .panel-close-button': {
        position: 'absolute',
        right: '0',
        top: '0',
      },
    },
    accordionContainer: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '20px',
    },
    actionPanel: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
    },
    dialog: {
      '& .MuiDialogContent-root': {
        padding: '8px 15px',
      },
    },
  })
})

interface AccordionControlProps {
  editor: Editor
  buttonProps?: Partial<IconButtonProps>
}

type TAccordions = {
  title: string
  body: string
}

type PanelPros = {
  title: string
  body: string
}

const Panel = ({ title, body }: PanelPros) => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">
          <a href="#collapse1716279617835-0" className="collapsed">
            <i className="svg" />
            {title}
          </a>
        </h3>
      </div>
      <div className="panel-collapse collapse">
        <div className="panel-body">{body}</div>
      </div>
    </div>
  )
}

const initialAccordion = { title: '', body: '' }

export const AccordionControl: FC<AccordionControlProps> = ({ buttonProps, editor }) => {
  const [open, setOpen] = useState(false)

  const [accordions, setAccordions] = useState<TAccordions[]>([initialAccordion])
  const form = useRef<HTMLFormElement>(null)

  const theme = useTheme()

  const classes = useStyles(theme)
  const localization = useLocalization()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = useCallback(() => {
    setAccordions([initialAccordion])

    setOpen(false)
  }, [])

  const handleSubmit = () => {
    if (accordions.length === 0) {
      handleClose()
      return
    }

    if (!form.current?.reportValidity()) {
      return
    }

    const panelGroup = renderToString(
      <>
        <div className="panel-group">
          {accordions.map((item, index) => {
            return <Panel key={index} title={item.title} body={item.body} />
          })}
        </div>
        {/* eslint-disable-next-line react/self-closing-comp*/}
        <p></p>
      </>,
    )

    editor.chain().focus().insertContent(panelGroup).run()

    handleClose()
  }

  const handleClosePanel = (index: number) => {
    setAccordions((prev) => {
      return prev.filter((_, i) => i !== index)
    })
  }

  return (
    <>
      <Tooltip title={localization.accordionControl.title}>
        <IconButton className={classes.ListIcon} onClick={handleClickOpen} {...buttonProps}>
          <div className="icon-container">
            <ArrowDropDown className="down-arrow" />
            <DragHandle />
          </div>
          <div className="icon-container">
            <ArrowDropDown className="down-arrow" />
            <DragHandle />
          </div>
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        className={classes.dialog}
        onClose={handleSubmit}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth>
        <DialogTitle id="form-dialog-title">{localization.accordionControl.title}</DialogTitle>
        <DialogContent>
          <form ref={form} className={classes.accordionContainer}>
            {accordions.map((accordion, index) => {
              return (
                <div key={index} className={classes.accordion}>
                  <Tooltip title={localization.accordionControl.closePanel}>
                    <IconButton className="panel-close-button" onClick={() => handleClosePanel(index)} {...buttonProps}>
                      <Close color="error" />
                    </IconButton>
                  </Tooltip>

                  <TextField
                    autoFocus
                    margin="dense"
                    label={localization.accordionControl.title}
                    type="text"
                    required
                    fullWidth
                    value={accordion.title}
                    onChange={(e) => {
                      const newAccordions = [...accordions]

                      newAccordions[index] = { ...accordions[index], title: e.target.value }

                      setAccordions(newAccordions)
                    }}
                  />

                  <TextField
                    multiline
                    autoFocus
                    margin="dense"
                    label={localization.accordionControl.body}
                    type="text"
                    required
                    fullWidth
                    value={accordion.body}
                    onChange={(e) => {
                      const newAccordions = [...accordions]

                      newAccordions[index] = { ...accordions[index], body: e.target.value }

                      setAccordions(newAccordions)
                    }}
                  />
                </div>
              )
            })}
          </form>
        </DialogContent>
        <DialogActions>
          <div className={classes.actionPanel}>
            <Button
              onClick={() =>
                setAccordions((prev) => {
                  return [...prev, initialAccordion]
                })
              }
              title={localization.accordionControl.addPanel}>
              {localization.accordionControl.addPanel}
            </Button>

            <div className="close-actions">
              <Button onClick={handleClose}>{localization.common.cancel}</Button>
              <Button
                onClick={() => {
                  handleSubmit()
                }}
                color="primary">
                {localization.imageControl.submit}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </>
  )
}
