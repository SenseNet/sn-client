import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import { RepositoryContext, ThemeContext } from '../../context'
import { VersionInfo as VersionInfoModel } from './version-info-models'

export const VersionInfo: React.FunctionComponent = () => {
  const repo = useContext(RepositoryContext)
  const [versionInfo, setVersionInfo] = useState<VersionInfoModel | undefined>()
  const theme = useContext(ThemeContext)

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
      <Typography variant="h5">Version Info</Typography>
      <div style={{ overflow: 'auto', height: 'calc(100% - 45px)', color: theme.palette.text.secondary }}>
        {versionInfo ? <>{JSON.stringify(versionInfo)}</> : <CircularProgress />}
      </div>
    </div>
  )
}

export default VersionInfo
