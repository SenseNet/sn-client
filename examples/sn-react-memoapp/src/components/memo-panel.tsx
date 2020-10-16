/* eslint-disable require-jsdoc */
import { GenericContent, User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Accordion, AccordionDetails, AccordionSummary, Grid, TextField, Typography } from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import RedoIcon from '@material-ui/icons/Redo'
import SaveIcon from '@material-ui/icons/Save'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { NewMemo } from '../interfaces'
import { AddNew } from './add-new-memo'
import { DialogComponent } from './dialog'

/**
 * Style for component with Material UI
 */
const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    hidden: {
      display: 'none',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    fab: {
      margin: theme.spacing(1),
    },
    fabAdd: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }),
)

export const MemoPanel: React.FunctionComponent = () => {
  const repo = useRepository()
  const classes = useStyles()
  const [expanded, setExpanded] = useState<string | false>(false)
  const [editmode, setEditmode] = useState('')
  const [editText, setEditText] = useState('')
  const [openmodal, setOpenmodal] = useState(false)
  const [modaltitle, setModaltitle] = useState('')
  const [addpanelshow, setAddpanelshow] = useState(false)
  const [currentmemo, setCurrentmemo] = useState<GenericContent>(null as any)
  const [data, setData] = useState<GenericContent[]>([])

  useEffect(() => {
    async function loadMemos() {
      const result = await repo.loadCollection<GenericContent>({
        path: `/Root/Content/IT/Memos`,
        oDataOptions: {
          select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'ModificationDate'],
          orderby: [['ModificationDate', 'desc']],
          expand: ['CreatedBy'],
        },
      })
      setData(result.d.results)
    }
    loadMemos()
  }, [repo])

  // Remove memo - open modal
  const deleteOpenModal = (memo: GenericContent) => {
    setCurrentmemo(memo) // set current content for removing
    const title = memo.DisplayName ? memo.DisplayName : ''
    setModaltitle(title)
    setOpenmodal(true)
  }

  // Remove memo - remove content
  const deleteMemoContent = async (receivebtn: boolean) => {
    if (receivebtn) {
      // User clicked "Yes"
      const newdata = data.filter((x) => x.Id !== currentmemo.Id)
      await repo.delete({
        idOrPath: currentmemo.Path,
        permanent: true,
      })
      setData(newdata) // refresh memo list
      setOpenmodal(false) // close modal window
    } else {
      // User clicked "No"
      setOpenmodal(false)
    }
  }

  // Create new memo handler
  const handleAddNew = async (memocnt: NewMemo) => {
    const created = await repo.post<GenericContent>({
      contentType: 'Memo',
      parentPath: '/Root/Content/IT/Memos/',
      oDataOptions: {
        select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'ModificationDate'],
        expand: ['CreatedBy'],
      },
      content: memocnt,
    })
    const newList = [...data, created.d]
    newList.sort((a, b) => {
      const bDate = new Date(b.ModificationDate ? b.ModificationDate : '').getTime()
      const aDate = new Date(a.ModificationDate ? a.ModificationDate : '').getTime()
      return aDate < bDate ? 1 : -1
    })
    setData(newList)
    setAddpanelshow(false)
  }

  // Expansion panel handler
  const handleChangeExpand = (panel: string) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  // Edit/Read mode handler
  const handleEditmode = (memo: GenericContent) => () => {
    setEditmode(memo.Id.toString())
    setEditText(memo.Description ? memo.Description : '')
  }

  // Save handler
  const handleSave = async (memo: GenericContent) => {
    const newDescrition = {
      Description: editText,
    }
    const editedMemo = await repo.patch<GenericContent>({
      idOrPath: memo.Id,
      content: newDescrition,
      oDataOptions: {
        select: ['DisplayName', 'Description', 'CreationDate', 'CreatedBy', 'ModificationDate'],
        expand: ['CreatedBy'],
      },
    })

    const newlist = data.map((x) => {
      if (x.Id === memo.Id) {
        return editedMemo.d
      } else {
        return x
      }
    })

    newlist.sort((a, b) => {
      const bDate = new Date(b.ModificationDate ? b.ModificationDate : '').getTime()
      const aDate = new Date(a.ModificationDate ? a.ModificationDate : '').getTime()
      return aDate < bDate ? 1 : -1
    })

    setData(newlist)
    setEditmode('')
  }

  // Text change handler in edit mode
  const handleChange: any = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value)
  }

  return (
    <div className={classes.root}>
      <AddNew
        show={addpanelshow}
        onCreate={(memo: any) => {
          handleAddNew(memo)
        }}
        onClose={() => setAddpanelshow(false)}
      />
      {data.map((memo) => (
        <Accordion
          key={memo.Id}
          expanded={expanded === memo.Id.toString()}
          onChange={handleChangeExpand(memo.Id.toString())}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography className={classes.heading}>{memo.DisplayName}</Typography>
            <Typography className={classes.secondaryHeading}>
              Created by: {memo.CreatedBy ? (memo.CreatedBy as User).FullName : ''}{' '}
              {moment(new Date(memo.CreationDate ? memo.CreationDate : '')).format('dddd on DD-MM-YYYY')}{' '}
              <span style={{ fontStyle: 'italic' }}>
                (Modified:{' '}
                {moment(new Date(memo.ModificationDate ? memo.ModificationDate : '')).format('DD-MM-YYYY HH:mm:ss')})
              </span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <Grid item xs={12}>
                <ReactMarkdown
                  source={memo.Description}
                  className={editmode === memo.Id.toString() ? classes.hidden : ''}
                />
                <TextField
                  style={{ width: '100%', display: editmode === memo.Id.toString() ? 'inline-flex' : 'none' }}
                  placeholder="Write a memo..."
                  multiline={true}
                  value={editText}
                  onChange={handleChange(memo.Id.toString())}
                  rows={1}
                  rowsMax={10}
                  id={memo.Id.toString()}
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Fab
                  color="secondary"
                  aria-label="Edit"
                  size={'small'}
                  className={editmode === memo.Id.toString() ? classes.hidden : classes.fab}>
                  <EditIcon data-icon="edit" onClick={handleEditmode(memo)} />
                </Fab>
                <Fab
                  aria-label="Delete"
                  size={'small'}
                  onClick={() => deleteOpenModal(memo)}
                  className={editmode === memo.Id.toString() ? classes.hidden : classes.fab}>
                  <DeleteIcon />
                </Fab>
                <Fab
                  aria-label="Save"
                  size={'small'}
                  onClick={() => handleSave(memo)}
                  className={editmode === memo.Id.toString() ? classes.fab : classes.hidden}>
                  <SaveIcon />
                </Fab>
                <Fab
                  aria-label="Cancel"
                  size={'small'}
                  onClick={() => {
                    setEditmode('')
                  }}
                  className={editmode === memo.Id.toString() ? classes.fab : classes.hidden}>
                  <RedoIcon />
                </Fab>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => {
          setAddpanelshow(true)
          window.scrollTo(0, 0)
        }}
        aria-label="Add new"
        className={classes.fabAdd}>
        <AddIcon className={classes.extendedIcon} />
        Add new
      </Fab>
      <DialogComponent
        open={openmodal}
        title={modaltitle}
        onClose={(receivebtn) => {
          deleteMemoContent(receivebtn)
        }}
      />
    </div>
  )
}
