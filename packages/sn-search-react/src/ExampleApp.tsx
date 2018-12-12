import { Checkbox, Divider, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MaterialTextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { ODataCollectionResponse, Repository } from '@sensenet/client-core'
import { File as SnFile, Folder, GenericContent, User } from '@sensenet/default-content-types'
import { ReferenceFieldSetting } from '@sensenet/default-content-types'
import { Icon, iconType, MaterialIcon } from '@sensenet/icons-react'
import { Query } from '@sensenet/query'
import React from 'react'
import { AdvancedSearch } from './Components/AdvancedSearch'
import { PresetField } from './Components/Fields/PresetField'
import { ReferenceField } from './Components/Fields/ReferenceField'
import { TextField } from './Components/Fields/TextField'
import { TypeField } from './Components/Fields/TypeField'

const localStorageKey = 'sn-advanced-search-demo'

let demoData: { siteUrl: string; idOrPath: string | number; countOnly: boolean } = {
  siteUrl: '',
  idOrPath: '/Root',
  countOnly: false,
}
try {
  const storedValue = localStorage.getItem(localStorageKey)
  if (storedValue) {
    demoData = {
      ...demoData,
      ...JSON.parse(storedValue),
    }
  }
} catch (error) {
  // tslint:disable-next-line:no-console
  console.warn('Failed to parse stored settings')
}

const repo = new Repository({
  repositoryUrl: demoData.siteUrl,
})

interface ExampleComponentState {
  nameFieldQuery: string
  displayNameFieldQuery: string
  typeFieldQuery: string
  creationDateQuery: string
  referenceFieldQuery: string
  fullQuery: string
  isSettingsOpen: boolean
  isHelpOpen: boolean
  response?: ODataCollectionResponse<GenericContent>
}

const icons: any = {
  folder: 'folder',
  file: 'insert_drive_file',
  user: 'person',
}

/**
 * Example app component for search
 */
export class ExampleApp extends React.Component<{}, ExampleComponentState> {
  /**
   * State object for the Example component
   */
  public state: ExampleComponentState = {
    nameFieldQuery: '',
    displayNameFieldQuery: '',
    fullQuery: '',
    typeFieldQuery: '',
    creationDateQuery: '',
    referenceFieldQuery: '',
    isSettingsOpen: localStorage.getItem(localStorageKey) === null, // false,
    isHelpOpen: false,
  }

  private async sendRequest(ev: React.SyntheticEvent) {
    ev.preventDefault()
    const response = await repo.loadCollection<GenericContent>({
      path: demoData.idOrPath as string, // ToDo: query by Id in client-core
      oDataOptions: {
        select: 'all',
        metadata: 'no',
        inlinecount: 'allpages',
        query: this.state.fullQuery,
        top: 100,
      },
    })
    this.setState({ response })
  }

  constructor(props: {}) {
    super(props)
    this.sendRequest = this.sendRequest.bind(this)
  }

  /**
   * Renders the component
   */
  public render() {
    return (
      <div style={{ height: '100%' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <MaterialIcon
                  iconName="search"
                  style={{ color: 'white', padding: '0 15px 0 0', verticalAlign: 'text-bottom' }}
                />
                Search Component Demo
              </div>
              <div>
                <IconButton onClick={() => this.setState({ isSettingsOpen: true })} title="Settings">
                  <MaterialIcon iconName="settings" style={{ color: 'white', verticalAlign: 'text-bottom' }} />
                </IconButton>
                <IconButton onClick={() => this.setState({ isHelpOpen: true })} title="Help">
                  <MaterialIcon iconName="help" style={{ color: 'white', verticalAlign: 'text-bottom' }} />
                </IconButton>
              </div>
            </Typography>
          </Toolbar>
        </AppBar>
        <div
          style={{
            height: 'calc(100% - 80px)',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <AdvancedSearch
            style={{ flexShrink: 0 }}
            onQueryChanged={q => {
              this.setState({ fullQuery: q.toString() })
            }}
            schema={repo.schemas.getSchemaByName('GenericContent')}
            fields={_options => (
              <Paper style={{ margin: '1em' }}>
                <Typography variant="title" style={{ padding: '1em .7em' }}>
                  Advanced search in fields
                </Typography>
                <form
                  style={{
                    display: 'flex',
                    padding: '1em',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                  }}
                  onSubmit={ev => this.sendRequest(ev)}
                  noValidate={true}
                  autoComplete="off">
                  <TextField
                    fieldName="Name"
                    onQueryChange={(key, query) => {
                      this.setState({ nameFieldQuery: query.toString() })
                      _options.updateQuery(key, query)
                    }}
                    fieldKey="alma"
                    fieldSetting={_options.schema.FieldSettings.find(s => s.Name === 'Name')}
                    helperText={
                      this.state.nameFieldQuery
                        ? `Field Query: ${this.state.nameFieldQuery}`
                        : 'A simple free text query on the Name field'
                    }
                  />

                  <TextField
                    fieldName="DisplayName"
                    onQueryChange={(key, query) => {
                      this.setState({ typeFieldQuery: query.toString() })
                      _options.updateQuery(key, query)
                    }}
                    fieldSetting={_options.schema.FieldSettings.find(s => s.Name === 'DisplayName')}
                    helperText={
                      this.state.displayNameFieldQuery
                        ? `Field Query: ${this.state.displayNameFieldQuery}`
                        : 'Query on the DisplayName'
                    }
                  />
                  <FormControl>
                    <InputLabel htmlFor="type-filter">Created at</InputLabel>
                    <PresetField
                      fieldName="CreationDate"
                      presets={[
                        { text: '-', value: new Query(a => a) },
                        { text: 'Today', value: new Query(a => a.term('CreationDate:>@@Today@@')) },
                        {
                          text: 'Yesterday',
                          value: new Query(a =>
                            a.term('CreationDate:>@@Yesterday@@').and.term('CreationDate:<@@Today@@'),
                          ),
                        },
                      ]}
                      onQueryChange={(key, query) => {
                        this.setState({ creationDateQuery: query.toString() })
                        _options.updateQuery(key, query)
                      }}
                    />
                    <FormHelperText>
                      {this.state.creationDateQuery.length ? this.state.creationDateQuery : 'Filter by creation date'}
                    </FormHelperText>
                  </FormControl>

                  <FormControl style={{ minWidth: 150 }}>
                    <InputLabel htmlFor="type-filter">Filter by type</InputLabel>
                    <TypeField
                      onQueryChange={query => {
                        this.setState({ typeFieldQuery: query.toString() })
                        _options.updateQuery('Type', query)
                      }}
                      id="type-filter"
                      types={/*contentTypes*/ [SnFile, Folder, User]}
                      schemaStore={repo.schemas}
                      getMenuItem={(schema, isSelected) => (
                        <MenuItem
                          key={schema.ContentTypeName}
                          value={schema.ContentTypeName}
                          title={schema.Description}>
                          {isSelected ? (
                            <Checkbox checked={true} style={{ padding: 0 }} />
                          ) : (
                            <Icon type={iconType.materialui} iconName={icons[schema.Icon.toLocaleLowerCase()]} />
                          )}
                          <ListItemText primary={schema.ContentTypeName} />
                        </MenuItem>
                      )}
                    />
                    <FormHelperText>
                      {this.state.typeFieldQuery.length ? this.state.typeFieldQuery : 'Filter in all content types'}
                    </FormHelperText>
                  </FormControl>

                  <ReferenceField
                    fieldName="CreatedBy"
                    fieldSetting={{
                      ...(_options.schema.FieldSettings.find(s => s.Name === 'CreatedBy') as ReferenceFieldSetting),
                      AllowedTypes: ['User'],
                    }}
                    fetchItems={async q => {
                      const response = await repo.loadCollection<GenericContent>({
                        path: demoData.idOrPath as string, // ToDo: query by Id in client-core
                        oDataOptions: {
                          select: ['Id', 'Path', 'Name', 'DisplayName', 'Type'],
                          metadata: 'no',
                          inlinecount: 'allpages',
                          query: q.toString(),
                          top: 10,
                        },
                      })
                      return response.d.results
                    }}
                    onQueryChange={(key, query) => {
                      this.setState({ referenceFieldQuery: query.toString() })
                      _options.updateQuery(key, query)
                    }}
                    helperText={this.state.referenceFieldQuery || 'Search a content creator'}
                    id="reference-filter"
                  />

                  <button style={{ display: 'none' }} type="submit" />
                </form>
                <Divider />
                <div
                  style={{
                    display: 'flex',
                    padding: '1em',
                    justifyContent: 'space-evenly',
                    alignItems: 'baseline',
                  }}>
                  <MaterialTextField
                    style={{
                      flexGrow: 1,
                    }}
                    helperText="This is the aggregated query from all of the fields above."
                    margin="none"
                    variant="filled"
                    label="Full query"
                    disabled={true}
                    value={this.state.fullQuery}
                  />
                  <Button onClick={this.sendRequest}>
                    <MaterialIcon iconName="play_arrow" /> Send
                  </Button>
                </div>
              </Paper>
            )}
          />
          {this.state.response ? (
            <Paper style={{ margin: '1em', overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Path</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Display name</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.response.d.results.map(r => (
                    <TableRow key={r.Id}>
                      <TableCell>{r.Id}</TableCell>
                      <TableCell>{r.Path}</TableCell>
                      <TableCell>{r.Name}</TableCell>
                      <TableCell>{r.DisplayName}</TableCell>
                      <TableCell>{r.Type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : null}
        </div>
        <Dialog
          open={this.state.isSettingsOpen}
          onClose={() => {
            this.setState({ isSettingsOpen: false })
          }}>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent style={{ paddingTop: '.6em' }}>
            <DialogContentText>You can configure there a repository instance to test your queries</DialogContentText>
            <MaterialTextField
              fullWidth={true}
              margin="normal"
              label="Repository URL"
              type="URL"
              helperText="Enter the full path of your repository, e.g.: 'https://my-sn-repository.my.org'"
              variant="outlined"
              defaultValue={demoData.siteUrl}
              onChange={ev => {
                demoData.siteUrl = ev.target.value
                repo.configuration.repositoryUrl = demoData.siteUrl
                localStorage.setItem(localStorageKey, JSON.stringify(demoData))
              }}
            />
            <br />
            <MaterialTextField
              fullWidth={true}
              margin="normal"
              label="Content path or Id"
              type="URL"
              helperText="Enter the full path or ID of the content that you want to query (e.g.: '/Root/Sites/MySite')"
              variant="outlined"
              defaultValue={demoData.idOrPath}
              onChange={ev => {
                demoData.idOrPath = isNaN(ev.target.value as any) ? ev.target.value : parseInt(ev.target.value, 10)
                localStorage.setItem(localStorageKey, JSON.stringify(demoData))
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ isSettingsOpen: false })}>Ok</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.isHelpOpen} onClose={() => this.setState({ isHelpOpen: false })}>
          <DialogTitle>Help</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This example application is a showcase for the{' '}
              <a href="http://npmjs.com/package/@sensenet/search-react" target="_blank">
                @sensenet/search-react
              </a>{' '}
              package and demonstrates the basic functionality with some predefined field filters and an example query
              result.
              <br />
              In order to get the result, please set up your repository in the <strong>Settings</strong> section and
              check that
              <li>
                Your{' '}
                <a href="https://community.sensenet.com/docs/cors/" target="_blank">
                  CORS
                </a>{' '}
                settings are correct
              </li>
              <li>You have logged in / have appropriate rights for the content</li>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ isHelpOpen: false })}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
