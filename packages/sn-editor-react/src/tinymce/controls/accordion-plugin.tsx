import {
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
  makeStyles,
  TextField,
  Tooltip,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'

import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { Editor } from 'tinymce'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
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
    dialog: {
      border: 'none !important',
      borderRadius: 12,
      boxShadow: '0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '1.6rem',
      maxWidth: '600px',
      width: '100%',
      '&::backdrop': {
        backgroundColor: 'rgba(255, 255, 255, .75)',
      },

      '& .MuiDialogContent-root': {
        padding: 0,
      },
      '& .MuiDialogTitle-root': {
        paddingLeft: 0,
      },
      '& .tox-icon': {
        position: 'absolute',
        top: '0',
        right: '0',
        marginRight: '25px',
        marginTop: '20px',
        cursor: 'pointer',
        padding: '10px',
      },
    },
    accordion: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '15px',
      border: '2px solid',
      borderColor: '#006ce7',
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
    modal: {
      '& .MuiDialogContent-root': {
        padding: '8px 15px',
      },
    },
  })
})

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

interface AccordionPluginControlProps {
  editor: Editor
  buttonProps?: Partial<IconButtonProps>
  closeDialog: () => void
}

export const AccordionPluginControl: FC<AccordionPluginControlProps> = ({ editor, buttonProps, closeDialog }) => {
  const [accordions, setAccordions] = useState<TAccordions[]>([initialAccordion])
  const form = useRef<HTMLFormElement>(null)

  const classes = useStyles()
  const localization = useLocalization()

  const handleClose = useCallback(() => {
    setAccordions([initialAccordion])

    closeDialog()
  }, [closeDialog])

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

    editor.execCommand('mceInsertContent', false, panelGroup)

    handleClose()
  }

  const handleClosePanel = (index: number) => {
    setAccordions((prev) => {
      return prev.filter((_, i) => i !== index)
    })
  }

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      dialogRef.current?.close()
    }
  }, [])

  return (
    <>
      <dialog ref={dialogRef} className={classes.dialog}>
        <DialogTitle id="form-dialog-title">{localization.accordionControl.title}</DialogTitle>{' '}
        <span
          className="tox-icon"
          onClick={() => {
            dialogRef.current?.close()
          }}>
          <svg width="24" height="24" focusable="false">
            <path
              d="M17.3 8.2 13.4 12l3.9 3.8a1 1 0 0 1-1.5 1.5L12 13.4l-3.8 3.9a1 1 0 0 1-1.5-1.5l3.9-3.8-3.9-3.8a1 1 0 0 1 1.5-1.5l3.8 3.9 3.8-3.9a1 1 0 0 1 1.5 1.5Z"
              fillRule="evenodd"
            />
          </svg>
        </span>
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
      </dialog>
    </>
  )
}
