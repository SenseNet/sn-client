import React, { useState } from 'react'

// start of material-ui components
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MaterialTextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
// end of material-ui components

// start of sensenet components
import { ODataCollectionResponse } from '@sensenet/client-core'
import { ChoiceFieldSetting, GenericContent, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { MaterialIcon } from '@sensenet/icons-react'
import { Query } from '@sensenet/query'
import { AdvancedSearch, PresetField, ReferenceField, TextField } from '@sensenet/search-react'
import { BrowseView } from '@sensenet/controls-react'
import { useRepository } from '@sensenet/hooks-react'
// end of sensenet components

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
  console.warn('Failed to parse stored settings')
}

interface ExampleComponentState {
  typeFieldQuery: string
  loginnameFieldQuery: string
  emailFieldQuery: string
  fullnameFieldQuery: string
  jobtitleFieldQuery: string
  managerFieldQuery: string
  departmentFieldQuery: string
  languagesFieldQuery: string
  genderFieldQuery: string
  maritalstatusFieldQuery: string
  phoneFieldQuery: string
  fullQuery: string
  selectedUser?: User
  isProfilOpen: boolean
  response?: ODataCollectionResponse<User>
}

const useStyles = makeStyles({
  avatar: {
    width: 100,
    height: 100,
    margin: 10,
  },
  bigAvatar: {
    margin: 10,
    width: 200,
    height: 200,
  },
})

/**
 * User search
 */
const UserSearchPanel = () => {
  const repo = useRepository() // Custom hook that will return with a Repository object
  const classes = useStyles()
  /**
   * State object for the Example component
   */
  const [searchdata, setSearchdata] = useState<ExampleComponentState>({
    typeFieldQuery: '',
    loginnameFieldQuery: '',
    emailFieldQuery: '',
    fullnameFieldQuery: '',
    jobtitleFieldQuery: '',
    managerFieldQuery: '',
    departmentFieldQuery: '',
    languagesFieldQuery: '',
    genderFieldQuery: '',
    maritalstatusFieldQuery: '',
    phoneFieldQuery: '',
    fullQuery: 'TypeIs:User',
    isProfilOpen: false,
  })

  const sendRequest = async () => {
    const result = await repo.loadCollection<User>({
      path: `/Root/IMS`,
      oDataOptions: {
        metadata: 'no',
        inlinecount: 'allpages',
        query: searchdata.fullQuery,
        select: ['Avatar', 'Email', 'Fullname', 'LoginName'] as any,
        orderby: ['FullName', ['CreationDate', 'desc']],
      },
    })

    setSearchdata((prevState) => ({ ...prevState, response: result }))
  }

  // get choice options from fieldsettings
  const fieldSettings = repo.schemas.getSchemaByName('User').FieldSettings
  const langSetting = fieldSettings.find((f) => f.Name === 'Language') as ChoiceFieldSetting
  const genderSetting = fieldSettings.find((f) => f.Name === 'Gender') as ChoiceFieldSetting
  const maritalSetting = fieldSettings.find((f) => f.Name === 'MaritalStatus') as ChoiceFieldSetting
  const languages =
    langSetting !== undefined && langSetting.Options !== undefined
      ? langSetting.Options.map((l) => ({
          text: l.Text ? l.Text : '',
          value: new Query((a) => a.term(`Language:${l.Text}`)),
        }))
      : [{ text: 'English', value: new Query((a) => a.term(`Language:en`)) }]

  const genders =
    genderSetting !== undefined && genderSetting.Options !== undefined
      ? genderSetting.Options.map((l) => ({
          text: l.Text ? l.Text : '',
          value: l.Value === '...' ? new Query((a) => a) : new Query((a) => a.term(`Gender:${l.Value}`)),
        }))
      : [{ text: '', value: new Query((a) => a.term(`Gender:Female`)) }]

  const maritals =
    maritalSetting !== undefined && maritalSetting.Options !== undefined
      ? maritalSetting.Options.map((l) => ({
          text: l.Text ? l.Text : '',
          value: l.Value === '...' ? new Query((a) => a) : new Query((a) => a.term(`MaritalStatus:${l.Value}`)),
        }))
      : [{ text: '', value: new Query((a) => a.term(`MaritalStatus:`)) }]

  /**
   * Renders the component
   */
  return (
    <div style={{ height: '100%' }}>
      <div
        style={{
          height: 'calc(100% - 80px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Grid container justify="center" alignItems="center">
          <AdvancedSearch
            style={{ flexGrow: 1 }}
            onQueryChanged={(q) => {
              setSearchdata((prevState) => ({ ...prevState, fullQuery: q.toString() }))
            }}
            schema={repo.schemas.getSchemaByName('User')}
            fields={(_options) => (
              <Paper style={{ margin: '1em' }}>
                <Typography variant="h6" style={{ padding: '1em .7em' }}>
                  User search
                </Typography>
                <form
                  style={{
                    display: 'flex',
                    padding: '1em',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                  }}
                  onSubmit={(ev) => {
                    ev.preventDefault()
                    sendRequest()
                  }}
                  noValidate={true}
                  autoComplete="off">
                  <Grid item xs={12} md={4}>
                    <TextField
                      disabled
                      fieldName="TypeIs"
                      onQueryChange={(key, query) => {
                        setSearchdata((prevState) => ({
                          ...prevState,
                          typeFieldQuery: query.toString(),
                        }))
                        _options.updateQuery(key, query)
                      }}
                      value="User"
                      helperText="Type"
                      fieldKey=""
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fieldName="LoginName"
                      onQueryChange={(key, query) => {
                        setSearchdata((prevState) => ({
                          ...prevState,
                          loginnameFieldQuery: query.toString(),
                        }))
                        _options.updateQuery(key, query)
                      }}
                      fieldKey=""
                      fieldSetting={_options.schema.FieldSettings.find((s) => s.Name === 'LoginName')}
                      helperText={
                        searchdata.loginnameFieldQuery
                          ? `Field Query: ${searchdata.loginnameFieldQuery}`
                          : 'A simple free text query on the loginname field'
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fieldName="Email"
                      onQueryChange={(key, query) => {
                        setSearchdata((prevState) => ({
                          ...prevState,
                          emailFieldQuery: query.toString(),
                        }))
                        _options.updateQuery(key, query)
                      }}
                      fieldSetting={_options.schema.FieldSettings.find((s) => s.Name === 'Email')}
                      helperText={
                        searchdata.emailFieldQuery
                          ? `Field Query: ${searchdata.emailFieldQuery}`
                          : 'Query on the Email Address'
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fieldName="FullName"
                      onQueryChange={(key, query) => {
                        setSearchdata((prevState) => ({
                          ...prevState,
                          fullnameFieldQuery: query.toString(),
                        }))
                        _options.updateQuery(key, query)
                      }}
                      fieldSetting={_options.schema.FieldSettings.find((s) => s.Name === 'FullName')}
                      helperText={
                        searchdata.fullnameFieldQuery
                          ? `Field Query: ${searchdata.fullnameFieldQuery}`
                          : 'Query on the FullName'
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fieldName="JobTitle"
                      onQueryChange={(key, query) => {
                        setSearchdata((prevState) => ({
                          ...prevState,
                          jobtitleFieldQuery: query.toString(),
                        }))
                        _options.updateQuery(key, query)
                      }}
                      fieldSetting={_options.schema.FieldSettings.find((s) => s.Name === 'JobTitle')}
                      helperText={
                        searchdata.jobtitleFieldQuery
                          ? `Field Query: ${searchdata.jobtitleFieldQuery}`
                          : 'Query on the JobTitle'
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ReferenceField
                      fieldName="DisplayName"
                      fieldSetting={{
                        ...(_options.schema.FieldSettings.find((s) => s.Name === 'Manager') as ReferenceFieldSetting),
                        AllowedTypes: ['User'],
                      }}
                      fetchItems={async (fetchQuery: Query<GenericContent>) => {
                        const response = await repo.loadCollection<GenericContent>({
                          path: demoData.idOrPath as string, // ToDo: query by Id in client-core
                          oDataOptions: {
                            select: ['Id', 'Path', 'Name', 'DisplayName', 'Type'],
                            metadata: 'no',
                            inlinecount: 'allpages',
                            query: fetchQuery.toString(),
                            top: 10,
                          },
                        })
                        return response.d.results
                      }}
                      onQueryChange={(key: any, query: any) => {
                        setSearchdata((prevState) => ({
                          ...prevState,
                          managerFieldQuery: query.toString(),
                        }))
                        _options.updateQuery(key, query)
                      }}
                      helperText={searchdata.managerFieldQuery || 'Search a user manager'}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fieldName="Department"
                      onQueryChange={(key, query) => {
                        setSearchdata((prevState) => ({
                          ...prevState,
                          departmentFieldQuery: query.toString(),
                        }))
                        _options.updateQuery(key, query)
                      }}
                      fieldSetting={_options.schema.FieldSettings.find((s) => s.Name === 'Department')}
                      helperText={
                        searchdata.departmentFieldQuery
                          ? `Field Query: ${searchdata.departmentFieldQuery}`
                          : 'Query on the Department'
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl>
                      <InputLabel htmlFor="type-filter">Language</InputLabel>
                      <PresetField
                        fieldName="Language"
                        presets={[{ text: '-', value: new Query((a) => a) }, ...languages]}
                        onQueryChange={(key, query) => {
                          setSearchdata((prevState) => ({
                            ...prevState,
                            languagesFieldQuery: query.toString(),
                          }))
                          _options.updateQuery(key, query)
                        }}
                      />
                      <FormHelperText>
                        {searchdata.languagesFieldQuery.length ? searchdata.languagesFieldQuery : 'Filter by language'}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl>
                      <InputLabel htmlFor="type-filter">Gender</InputLabel>
                      <PresetField
                        fieldName="Gender"
                        presets={genders}
                        onQueryChange={(key, query) => {
                          setSearchdata((prevState) => ({
                            ...prevState,
                            genderFieldQuery: query.toString(),
                          }))
                          _options.updateQuery(key, query)
                        }}
                      />
                      <FormHelperText>
                        {searchdata.genderFieldQuery.length ? searchdata.genderFieldQuery : 'Filter by gender'}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl>
                      <InputLabel htmlFor="type-filter">Marital Status</InputLabel>
                      <PresetField
                        fieldName="MaritalStatus"
                        presets={maritals}
                        onQueryChange={(key, query) => {
                          setSearchdata((prevState) => ({
                            ...prevState,
                            maritalstatusFieldQuery: query.toString(),
                          }))
                          _options.updateQuery(key, query)
                        }}
                      />
                      <FormHelperText>
                        {searchdata.genderFieldQuery.length
                          ? searchdata.maritalstatusFieldQuery
                          : 'Filter by Marital Status'}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fieldName="Phone"
                      onQueryChange={(key, query) => {
                        setSearchdata((prevState) => ({
                          ...prevState,
                          phoneFieldQuery: query.toString(),
                        }))
                        _options.updateQuery(key, query)
                      }}
                      fieldSetting={_options.schema.FieldSettings.find((s) => s.Name === 'Phone')}
                      helperText={
                        searchdata.phoneFieldQuery ? `Field Query: ${searchdata.phoneFieldQuery}` : 'Query on the Phone'
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <button style={{ display: 'none' }} type="submit" />
                  </Grid>
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
                    value={searchdata.fullQuery}
                  />
                  <Button onClick={() => sendRequest()}>
                    <MaterialIcon iconName="play_arrow" /> Send
                  </Button>
                </div>
              </Paper>
            )}
          />
        </Grid>
        {searchdata.response ? (
          <Paper style={{ margin: '1em', overflow: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchdata.response.d.results.map((r) => (
                  <TableRow
                    key={r.Id}
                    onClick={() =>
                      setSearchdata((prevState) => ({ ...prevState, selectedUser: r, isProfilOpen: true }))
                    }>
                    <TableCell>
                      {r.Avatar !== undefined && r.Avatar.Url ? (
                        <Avatar
                          alt={r.FullName}
                          src={repo.configuration.repositoryUrl + r.Avatar.Url}
                          className={classes.avatar}
                        />
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell>{r.FullName ? r.FullName : r.LoginName}</TableCell>
                    <TableCell>{r.Email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : null}
      </div>
      <Dialog
        open={searchdata.isProfilOpen}
        onClose={() => setSearchdata((prevState) => ({ ...prevState, isProfilOpen: false }))}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          {searchdata.selectedUser ? <BrowseView content={searchdata.selectedUser} repository={repo} /> : ''}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchdata((prevState) => ({ ...prevState, isProfilOpen: false }))}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserSearchPanel
