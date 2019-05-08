import CircularProgress from '@material-ui/core/CircularProgress'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Info from '@material-ui/icons/Info'
import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { LocalizationContext, RepositoryContext, ThemeContext } from '../../context'
import { VersionInfo as VersionInfoModel } from './version-info-models'

export const VersionInfo: React.FunctionComponent = () => {
  const repo = useContext(RepositoryContext)
  const [versionInfo, setVersionInfo] = useState<VersionInfoModel | undefined>()
  const theme = useContext(ThemeContext)
  const localization = useContext(LocalizationContext).values.versionInfo

  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    ;(async () => {
      const result = await repo.executeAction<undefined, VersionInfoModel>({
        idOrPath: ConstantContent.PORTAL_ROOT.Path,
        body: undefined,
        method: 'GET',
        name: 'GetVersionInfo',
      })
      setVersionInfo(result)
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
                    <Typography variant="h6">{localization.components}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List style={{ width: '100%' }}>
                      {versionInfo.Components.map((component, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${component.ComponentId} ${component.Version}`}
                            secondary={component.Description}
                          />
                          <ListItemSecondaryAction>
                            <IconButton>
                              <Info />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
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
                          <ListItemSecondaryAction>
                            <IconButton>
                              <Info />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">{localization.installedPackages}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List style={{ width: '100%' }}>
                      {versionInfo.Assemblies.SenseNet.map((ass, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`${ass.Name} ${ass.Version}`} secondary={ass.CodeBase} />
                          <ListItemSecondaryAction>
                            <IconButton>
                              <Info />
                            </IconButton>
                          </ListItemSecondaryAction>
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
