import Typography from '@material-ui/core/Typography'
import { ConstantContent } from '@sensenet/client-core'
import { Settings } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { Query } from '../../../../../packages/sn-query/dist'
import { LocalizationContext, RepositoryContext } from '../../context'

const Setup: React.StatelessComponent = () => {
  const repo = useContext(RepositoryContext)
  const localization = useContext(LocalizationContext).values.settings
  const [wellKnownSettings, setWellKnownSettings] = useState<Settings[]>([])
  const [settings, setSettings] = useState<Settings[]>([])

  useEffect(() => {
    ;(async () => {
      const response = await repo.loadCollection({
        path: ConstantContent.PORTAL_ROOT.Path,
        oDataOptions: {
          query: new Query(q => q.typeIs(Settings)).toString() + ' .AUTOFILTERS:OFF',
        },
      })

      setWellKnownSettings(
        response.d.results.filter(setting => Object.keys(localization.descriptions).includes(setting.Path)),
      )

      setSettings(response.d.results.filter(setting => !Object.keys(localization.descriptions).includes(setting.Path)))
    })()
  }, [repo])

  return (
    <div style={{ padding: '1em', margin: '1em', overflow: 'auto' }}>
      <Typography variant="h5">Setup</Typography>
      WellKnownSettings:
      {wellKnownSettings.map(s => (
        <span key={s.Id}>{s.DisplayName || s.Name}</span>
      ))}
      <br />
      Settings:{' '}
      {settings.map(s => (
        <span key={s.Id}>{s.DisplayName || s.Name}</span>
      ))}
    </div>
  )
}

export default Setup
