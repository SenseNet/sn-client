import { Divider } from '@material-ui/core'
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
import { IODataCollectionResponse, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { MaterialIcon } from '@sensenet/icons-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AdvancedSearch } from './Components/AdvancedSearch'
import { TextField } from './Components/Fields/TextField'

const localStorageKey = 'sn-advanced-search-demo'

let demoData: { siteUrl: string, idOrPath: string | number, countOnly: boolean } = {
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
    fullQuery: string
    isSettingsOpen: boolean
    isHelpOpen: boolean
    response?: IODataCollectionResponse<GenericContent>
}

class ExampleComponent extends React.Component<{}, ExampleComponentState> {
    /**
     * State object for the Example component
     */
    public state: ExampleComponentState = {
        nameFieldQuery: '',
        displayNameFieldQuery: '',
        fullQuery: '',
        isSettingsOpen: false,
        isHelpOpen: false,
    }

    private async sendRequest(ev: React.SyntheticEvent) {
        ev.preventDefault()
        const response = await repo.loadCollection<GenericContent>({
            path: demoData.idOrPath as string, // ToDo: query by Id in client-core
            oDataOptions: {
                select: ['Id', 'Path', 'Name', 'DisplayName', 'Type'],
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
        return (<div style={{ height: '100%' }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="title" color="inherit" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <MaterialIcon iconName="search" style={{ color: 'white', padding: '0 15px 0 0', verticalAlign: 'text-bottom' }} />
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
            <div style={{
                height: 'calc(100% - 80px)',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <AdvancedSearch
                    style={{ flexShrink: 0 }}
                    onQueryChanged={(q) => {
                        this.setState({ fullQuery: q.toString() })
                    }}
                    schema={repo.schemas.getSchemaByName('GenericContent')}
                    fields={(_options) => (
                        <Paper style={{ margin: '1em' }}>
                            <Typography variant="title" style={{ padding: '1em .7em' }}>Advanced search in fields</Typography>
                            <form style={{
                                display: 'flex',
                                padding: '1em',
                                justifyContent: 'space-evenly',
                                flexWrap: 'wrap',
                            }}
                                onSubmit={(ev) => this.sendRequest(ev)}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    fieldName="Name"
                                    onQueryChange={(key, query) => {
                                        this.setState({ nameFieldQuery: query.toString() })
                                        _options.updateQuery(key, query)
                                    }}
                                    fieldKey="alma"
                                    fieldSetting={_options.getFieldSetting('Name')}
                                    helperText={this.state.nameFieldQuery ? `Field Query: ${this.state.nameFieldQuery}` : 'A simple free text query on the Name field'}
                                />

                                <TextField
                                    fieldName="DisplayName"
                                    onQueryChange={(key, query) => {
                                        this.setState({ displayNameFieldQuery: query.toString() })
                                        _options.updateQuery(key, query)
                                    }}
                                    fieldSetting={_options.getFieldSetting('DisplayName')}
                                    helperText={this.state.displayNameFieldQuery ? `Field Query: ${this.state.displayNameFieldQuery}` : 'Query on the DisplayName'}
                                />
                                <button style={{ display: 'none' }} type="submit"></button>
                            </form>
                            <Divider />
                            <div style={{
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
                    )
                    }
                />
                {this.state.response ? <Paper style={{ margin: '1em', overflow: 'auto' }}>
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
                            {this.state.response.d.results.map((r) => (<TableRow key={r.Id}>
                                <TableCell>{r.Id}</TableCell>
                                <TableCell>{r.Path}</TableCell>
                                <TableCell>{r.Name}</TableCell>
                                <TableCell>{r.DisplayName}</TableCell>
                                <TableCell>{r.Type}</TableCell>
                            </TableRow>))}
                        </TableBody>
                    </Table>
                </Paper> : null}
            </div>
            <Dialog open={this.state.isSettingsOpen} onClose={() => { this.setState({ isSettingsOpen: false }) }}>
                <DialogTitle>Settings</DialogTitle>
                <DialogContent style={{ paddingTop: '.6em' }}>
                    <DialogContentText>
                        You can configure there a repository instance to test your queries
                    </DialogContentText>
                    <MaterialTextField
                        fullWidth
                        margin="normal"
                        label="Repository URL"
                        type="URL"
                        helperText="Enter the full path of your repository, e.g.: 'https://my-sn-repository.my.org'"
                        variant="outlined"
                        defaultValue={demoData.siteUrl}
                        onChange={(ev) => {
                            demoData.siteUrl = ev.currentTarget.value
                            repo.configuration.repositoryUrl = demoData.siteUrl
                            localStorage.setItem(localStorageKey, JSON.stringify(demoData))
                        }}
                    />
                    <br />
                    <MaterialTextField
                        fullWidth
                        margin="normal"
                        label="Content path or Id"
                        type="URL"
                        helperText="Enter the full path or ID of the content that you want to query (e.g.: '/Root/Sites/MySite')"
                        variant="outlined"
                        defaultValue={demoData.idOrPath}
                        onChange={(ev) => {
                            demoData.idOrPath = isNaN(ev.currentTarget.value as any) ? ev.currentTarget.value : parseInt(ev.currentTarget.value, 10)
                            localStorage.setItem(localStorageKey, JSON.stringify(demoData))
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({ isSettingsOpen: false })} >Ok</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={this.state.isHelpOpen} onClose={() => this.setState({ isHelpOpen: false })}>
                <DialogTitle>Help</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This example application is a showcase for the <a href="http://npmjs.com/package/@sensenet/search-react" target="_blank">@sensenet/search-react</a> package
                        and demonstrates the basic functionality with some predefined field filters and an example query result.<br />
                        In order to get the result, please set up your repository in the <strong>Settings</strong> section and check that
                        <ul>
                            <li>Your <a href="https://community.sensenet.com/docs/cors/" target="_blank">CORS</a> settings are correct</li>
                            <li>You have logged in and have appropriate rights for the content</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({ isHelpOpen: false })} >Ok</Button>
                </DialogActions>
            </Dialog>
        </div>)
    }
}

ReactDOM.render(
    <ExampleComponent />,
    document.getElementById('example'),
)
