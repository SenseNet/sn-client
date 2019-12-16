import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import Moment from 'react-moment'
import { Button, Grid, TableCell, Tooltip, Typography } from '@material-ui/core'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import { ArrowBack, CloudDownload, Edit, OpenInBrowser } from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ContentList, ContentListProps } from '@sensenet/list-controls-react'
import { File, GenericContent } from '@sensenet/default-content-types'
import { ODataCollectionResponse } from '@sensenet/client-core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { useRepository } from '@sensenet/hooks-react'
import { useHistory } from 'react-router'
import { icons } from '../assets/icons'
import { downloadFile } from '../helper'

export interface ContentListDocState extends ContentListProps<File> {
  isEditing: boolean
}

interface MainPanel {
  width: Breakpoint
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    actionicon: {
      marginRight: '10px',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    iconSmall: {
      fontSize: 20,
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
)
/**
 * Main component
 */
const MainPanel: React.FunctionComponent<MainPanel> = props => {
  const classes = useStyles()
  const repo = useRepository()
  const history = useHistory()
  const [data, setData] = useState<File[]>([])
  const [currentfolder, setCurrentfolder] = useState<string>('')
  const [activeContent, setActiveContent] = useState<File>()
  const [selected, setSelected] = useState<File[]>([])
  const [currentOrder, setCurrentOrder] = useState<keyof File>('DisplayName')
  const [currentDirection, setCurrentDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const loadDocuments = async (): Promise<void> => {
      const result: ODataCollectionResponse<File> = await repo.loadCollection({
        path: `/Root/Content/IT/Document_Library/${currentfolder}`,
        oDataOptions: {
          filter: "ContentType eq 'File' or ContentType eq 'Folder'",
          select: [
            'DisplayName',
            'Description',
            'CreationDate',
            'CreatedBy',
            'ModifiedBy',
            'ModificationDate',
            'Icon',
            'Type',
            'Id',
            'Path',
            'Name',
            'Size',
            'Actions',
          ] as any,
          orderby: [['DisplayName', 'asc']],
          expand: ['CreatedBy', 'Actions', 'ModifiedBy'],
        },
      })
      setData(result.d.results)
    }

    // Load documents from Repository
    loadDocuments()
  }, [repo, currentfolder])

  const handleDownload = (path: string): void => {
    downloadFile(path, repo.configuration.repositoryUrl)
  }

  const getPreview = (id: number) => {
    history.push(`/preview/${id}`)
  }

  const handleItemClickEvent = (ev: React.SyntheticEvent, content: File) => {
    const target = ev.target as HTMLElement
    if (content.Type === 'File' && target.innerHTML === (content.DisplayName || content.Name)) {
      // Handle preview
      getPreview(content.Id)
    }
  }

  // Handle double click event on folder
  const handleItemDoubleClickEvent = (_ev: React.SyntheticEvent, content: File): void => {
    if (content.Type === 'Folder') {
      setData([])
      setCurrentfolder(content.Name)
    }
  }

  // Handle back to root
  const handleBackEvent = (): void => {
    setData([])
    setCurrentfolder('')
  }

  const editMode = (id: number) => {
    history.push(`/edit/${id}`)
  }

  const handleOrderChange = (field: keyof File, direction: 'asc' | 'desc') => {
    if (field === 'Actions') {
      return null
    }
    const orderedItems = (data as File[]).sort((a, b) => {
      const textA = typeof a[field] === 'number' ? a[field] || 0 : (a[field] || '').toString().toUpperCase()
      const textB = typeof b[field] === 'number' ? b[field] || 0 : (b[field] || '').toString().toUpperCase()
      return direction === 'asc'
        ? textA < textB
          ? -1
          : textA > textB
          ? 1
          : 0
        : textA > textB
        ? -1
        : textA < textB
        ? 1
        : 0
    })
    setData(orderedItems)
    setCurrentOrder(field)
    setCurrentDirection(direction)
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={12} style={{ display: currentfolder === '' ? 'none' : 'inline-block' }}>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Button variant="contained" size="small" className={classes.button} onClick={handleBackEvent}>
              <ArrowBack className={clsx(classes.leftIcon, classes.iconSmall)} />
              Back
            </Button>
            <Typography variant="overline" display="block">
              /{currentfolder}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ContentList
            displayRowCheckbox={false}
            schema={repo.schemas.getSchemaByName('File')}
            selected={selected}
            onRequestSelectionChange={setSelected}
            onRequestActiveItemChange={setActiveContent}
            active={activeContent}
            orderBy={currentOrder ? currentOrder : ('DisplayName' as any)}
            onRequestOrderChange={handleOrderChange}
            orderDirection={currentDirection}
            items={data}
            icons={icons}
            checkboxProps={{ color: 'primary' }}
            fieldComponent={fieldOptions => {
              switch (fieldOptions.field) {
                case 'DisplayName':
                  return <TableCell>{fieldOptions.content.DisplayName}</TableCell>
                case 'CreatedBy':
                  return <TableCell />
                case 'Actions':
                  if (fieldOptions.content.Type === 'File') {
                    return (
                      <TableCell className="actioncell">
                        <Tooltip title="Download">
                          <CloudDownload
                            data-icon="download"
                            className={classes.actionicon}
                            onClick={() => handleDownload(fieldOptions.content.Path)}
                          />
                        </Tooltip>
                        <Tooltip title="Preview">
                          <OpenInBrowser
                            className={classes.actionicon}
                            onClick={() => getPreview(fieldOptions.content.Id)}
                          />
                        </Tooltip>
                        <Tooltip title="Online edit">
                          <Edit data-icon="edit" onClick={() => editMode(fieldOptions.content.Id)} />
                        </Tooltip>
                      </TableCell>
                    )
                  } else {
                    return <TableCell className="actioncell" />
                  }
                case 'Size' as any:
                  if (fieldOptions.content.Type === 'File') {
                    if (
                      (fieldOptions.content as any).Size !== null &&
                      (fieldOptions.content as any).Size !== undefined
                    ) {
                      let converted = (fieldOptions.content as any).Size / 1024
                      let symbol = ' KB'
                      if (converted > 1000) {
                        converted = converted / 1024
                        symbol = ' MB'
                        if (converted > 1000) {
                          converted = converted / 1024
                          symbol = ' GB'
                        }
                      }
                      return <TableCell>{parseFloat(converted.toFixed(2)) + symbol}</TableCell>
                    } else {
                      return null
                    }
                  } else {
                    return <TableCell className="actioncell" />
                  }
                case 'ModificationDate':
                  if (fieldOptions.content.Type === 'File') {
                    return (
                      <TableCell>
                        <Tooltip
                          title={
                            fieldOptions.content.ModifiedBy
                              ? (fieldOptions.content.ModifiedBy as GenericContent).DisplayName
                              : ''
                          }>
                          <Moment fromNow={true}>{fieldOptions.content.ModificationDate as string}</Moment>
                        </Tooltip>
                      </TableCell>
                    )
                  } else {
                    return <TableCell className="actioncell" />
                  }

                default:
                  return null
              }
            }}
            fieldsToDisplay={
              isWidthUp('md', props.width)
                ? ['DisplayName', 'CreatedBy', 'ModificationDate', 'Size' as any, 'Actions'] // x > 960px
                : isWidthUp('sm', props.width)
                ? ['DisplayName', 'ModificationDate', 'Size' as any, 'Actions'] // 600px < x < 960px
                : ['DisplayName', 'Actions'] // x < 600px
            }
            onItemClick={handleItemClickEvent}
            onItemDoubleClick={handleItemDoubleClickEvent}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default withWidth()(MainPanel)
