import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fab from '@material-ui/core/Fab'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import { MuiThemeProvider } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FolderOpen from '@material-ui/icons/FolderOpen'
import Help from '@material-ui/icons/Help'
import Send from '@material-ui/icons/Send'
import React, { useState, useEffect } from 'react'
import { defaultTheme } from '@sensenet/document-viewer-react/src'
import { VirtualizedTable } from '@sensenet/list-controls-react/src/ContentList'
import { Repository } from '@sensenet/client-core/src'
import { RepositoryContext } from '@sensenet/hooks-react/src'

const localStorageKey = 'sn-virtual-table-example'

export const VirtualizedTableShowCase: React.FC = () => {
  const [hostName, setHostName] = useState('')
  const [documentIdOrPath, setDocumentIdOrPath] = useState('')
  const [isTableOpened, setIsTableOpened] = useState(false)
  const [isHelpOpened, setIsHelpOpened] = useState(false)
  const [save, setSave] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(localStorageKey) || '')
      setHostName(stored.hostName)
      setDocumentIdOrPath(stored.documentIdOrPath)
      setIsTableOpened(stored.isViewerOpened)
      setIsHelpOpened(stored.isHelpOpened)
      setSave(true)
    } catch (error) {
      /** ignore */
    }
  }, [])

  useEffect(() => {
    if (save) {
      localStorage.setItem(localStorageKey, JSON.stringify({ hostName, documentIdOrPath, isTableOpened, isHelpOpened }))
    } else {
      localStorage.removeItem(localStorageKey)
    }
  }, [documentIdOrPath, hostName, isHelpOpened, isTableOpened, save])

  const [repository, setRepository] = useState(new Repository({ repositoryUrl: hostName }))

  useEffect(() => {
    setRepository(new Repository({ repositoryUrl: hostName }))
  }, [hostName])

  return (
    <MuiThemeProvider theme={defaultTheme}>
      <div style={{ height: '100%' }}>
        {isTableOpened ? (
          <RepositoryContext.Provider value={repository}>
            <Paper style={{ height: '100%', width: '100%', background: 'transparent', position: 'relative' }}>
              <VirtualizedTable
                active={activeContent}
                cellRenderer={fieldComponentFunc}
                displayRowCheckbox={true}
                fieldsToDisplay={props.fieldsToDisplay}
                getSelectionControl={getSelectionControl}
                items={children}
                onRequestOrderChange={onRequestOrderChangeFunc}
                onRequestSelectionChange={setSelected}
                orderBy={currentOrder}
                orderDirection={currentDirection}
                schema={repo.schemas.getSchema(GenericContent)}
                selected={selected}
                tableProps={{
                  rowCount: children.length,
                  rowHeight: 57,
                  headerHeight: 42,
                  rowGetter: ({ index }) => children[index],
                  onRowClick: rowMouseEventHandlerParams => {
                    setActiveContent(rowMouseEventHandlerParams.rowData)
                    handleItemClick(rowMouseEventHandlerParams)
                  },
                  onRowDoubleClick: onItemDoubleClickFunc,
                  disableHeader: false,
                }}
              />
              {activeContent ? (
                <ContentContextMenu
                  content={activeContent}
                  isOpened={isContextMenuOpened}
                  menuProps={menuPropsObj}
                  onClose={onCloseFunc}
                  onOpen={onOpenFunc}
                />
              ) : null}
            </Paper>
          </RepositoryContext.Provider>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <Paper
              elevation={4}
              style={{
                padding: '1.2rem',
                flexGrow: 1,
                maxWidth: '65%',
              }}>
              <Typography variant="h6">Virtualized Table Demo</Typography>
              <Typography>Select a sensenet site and document to open.</Typography>
              <form
                autoComplete="off"
                autoCorrect="off"
                onSubmit={() => setIsTableOpened(true)}
                style={{
                  margin: '.5em',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <TextField
                  value={hostName}
                  onChange={ev => {
                    setHostName(ev.currentTarget.value)
                  }}
                  required={true}
                  placeholder="The host URL, e.g. 'https://my-sensenet-site.org'"
                  type="url"
                  label="Host name"
                  margin="normal"
                />
                <TextField
                  value={documentIdOrPath}
                  onChange={ev => {
                    setDocumentIdOrPath(ev.currentTarget.value)
                  }}
                  required={true}
                  margin="normal"
                  placeholder="The Id or full path of the document, e.g.: /Root/Sites/MySite/MyDocLib/('Example.docx')"
                  label="Document id / full path"
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    marginTop: '1em',
                  }}>
                  <Button type="submit" variant="contained" color="primary">
                    {' '}
                    <Send /> &nbsp; Open{' '}
                  </Button>
                  &nbsp;
                  <Button onClick={() => setIsHelpOpened(true)} variant="contained" color="primary">
                    {' '}
                    <Help /> &nbsp; Help{' '}
                  </Button>
                  &nbsp;
                  <FormControlLabel
                    control={<Checkbox checked={save} onChange={() => setSave(!save)} value="checkedA" />}
                    label="Remember"
                  />
                </div>
              </form>
              <Dialog open={isHelpOpened || false}>
                <DialogTitle>Help</DialogTitle>
                <DialogContent>
                  <Typography component="div">
                    If you have trouble opening a file be sure that
                    <ul>
                      <li>
                        you are using sensenet{' '}
                        <a
                          href="https://community.sensenet.com/docs/install-sn-from-nuget/"
                          target="_blank"
                          rel="noopener noreferrer">
                          7.0+
                        </a>
                      </li>
                      <li>
                        <a href="https://community.sensenet.com/docs/cors/" target="_blank" rel="noopener noreferrer">
                          CORS
                        </a>{' '}
                        is allowed for the current host
                      </li>
                      <li>You are logged in</li>
                      <li>You have Open rights to the document</li>
                      <li>The preview images has been generated or Task Management is configured</li>
                    </ul>
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsHelpOpened(false)} variant="contained" color="primary">
                    {' '}
                    Close{' '}
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </div>
        )}

        {isTableOpened ? (
          <Fab
            style={{
              position: 'fixed',
              right: '2em',
              bottom: '1em',
              zIndex: 1,
            }}
            color="secondary"
            aria-label="select another document"
            onClick={() => setIsTableOpened(false)}>
            <FolderOpen />
          </Fab>
        ) : null}
      </div>
    </MuiThemeProvider>
  )
}
