import CircularProgress from '@material-ui/core/CircularProgress'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Update from '@material-ui/icons/Update'
import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { LocalizationContext, RepositoryContext, ResponsiveContext, ThemeContext } from '../../context'
import { ComponentInfo } from './component-info'
import { VersionInfo as VersionInfoModel } from './version-info-models'

export const VersionInfo: React.FunctionComponent = () => {
  const repo = useContext(RepositoryContext)
  const [versionInfo, setVersionInfo] = useState<VersionInfoModel | undefined>()
  const theme = useContext(ThemeContext)
  const localization = useContext(LocalizationContext).values.versionInfo
  const device = useContext(ResponsiveContext)

  const [showRaw, setShowRaw] = useState(false)
  const [nugetManifests, setNugetManifests] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const result = await repo.executeAction<undefined, VersionInfoModel>({
        idOrPath: ConstantContent.PORTAL_ROOT.Path,
        body: undefined,
        method: 'GET',
        name: 'GetVersionInfo',
      })
      setVersionInfo(result)

      const nugetPromises = result.Components.map(async component => {
        const response = await fetch(
          `https://api.nuget.org/v3/registration3-gz-semver2/${component.ComponentId.toLowerCase()}/index.json`,
        )
        if (response.ok) {
          const nugetManifest = await response.json()
          return nugetManifest
        }
      })
      const loadedManifests = await Promise.all(nugetPromises)
      setNugetManifests(loadedManifests.filter(m => m))
    })()
  }, [repo])

  return (
    <div style={{ padding: '1em', margin: '1em', overflow: 'hidden', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" gutterBottom={true}>
          {localization.title}
        </Typography>
        <Tooltip title={localization.showRaw}>
          <IconButton color={showRaw ? 'primary' : 'default'} onClick={() => setShowRaw(!showRaw)}>
            {'{ }'}
          </IconButton>
        </Tooltip>
      </div>
      <div style={{ overflow: 'auto', height: 'calc(100% - 45px)', color: theme.palette.text.secondary }}>
        {versionInfo ? (
          <>
            {showRaw ? (
              <MonacoEditor
                defaultValue={JSON.stringify(versionInfo, undefined, 2)}
                theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
                language="json"
                options={{
                  readOnly: true,
                }}
              />
            ) : (
              <>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">{localization.adminUi}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List style={{ width: '100%' }}>
                      <ListItem>
                        <ListItemText primary={localization.appVersion} secondary={process.env.APP_VERSION} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={localization.branchName} secondary={process.env.GIT_BRANCH} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={localization.commitHash} secondary={process.env.GIT_COMMITHASH} />
                      </ListItem>
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">{localization.components}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List style={{ width: '100%' }}>
                      {versionInfo.Components.map((component, index) => {
                        const isUpdateAvailable = nugetManifests.find(
                          m =>
                            m['@id'] ===
                              `https://api.nuget.org/v3/registration3-gz-semver2/${component.ComponentId.toLocaleLowerCase()}/index.json` &&
                            m.items[0].upper > component.Version,
                        )
                        return (
                          <ListItem key={index}>
                            <ListItemText
                              primary={
                                isUpdateAvailable ? (
                                  <>
                                    {`${component.ComponentId} ${component.Version}`}&nbsp;
                                    <a href={`https://nuget.org/packages/${component.ComponentId}`} target="_blank">
                                      {device === 'mobile'
                                        ? ''
                                        : localization.updateAvailable
                                            .replace('{0}', component.Version)
                                            .replace('{1}', isUpdateAvailable.items[0].upper)}
                                      <Update style={{ height: 20, marginLeft: 3, verticalAlign: 'text-bottom' }} />
                                    </a>
                                  </>
                                ) : (
                                  `${component.ComponentId} ${component.Version}`
                                )
                              }
                              secondary={component.Description}
                            />
                            {device === 'mobile' ? (
                              <ComponentInfo component={component} update={isUpdateAvailable} />
                            ) : null}
                          </ListItem>
                        )
                      })}
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">{localization.installedPackages}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List style={{ width: '100%' }}>
                      {versionInfo.InstalledPackages.map((pkg, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${pkg.ComponentId} ${pkg.ComponentVersion}`}
                            secondary={pkg.Description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">{localization.assemblies}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List style={{ width: '100%' }}>
                      {[
                        ...versionInfo.Assemblies.Dynamic,
                        ...versionInfo.Assemblies.GAC,
                        ...versionInfo.Assemblies.Other,
                        ...versionInfo.Assemblies.Plugins,
                        ...versionInfo.Assemblies.SenseNet,
                      ].map((ass, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`${ass.Name} ${ass.Version}`} secondary={ass.CodeBase} />
                        </ListItem>
                      ))}
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </>
            )}
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  )
}

export default VersionInfo
