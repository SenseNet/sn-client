import { useEffect, useState } from 'react'
import { ConstantContent } from '@sensenet/client-core'
import { VersionInfo } from '../components/version-info/version-info-models'
import { useRepository } from './use-repository'

export const useVersionInfo = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | undefined>()
  const [nugetManifests, setNugetManifests] = useState<any[]>([])
  const [hasUpdates, setHasUpdates] = useState(false)
  const repo = useRepository()

  useEffect(() => {
    ;(async () => {
      const result = await repo.executeAction<undefined, VersionInfo>({
        idOrPath: ConstantContent.PORTAL_ROOT.Path,
        body: undefined,
        method: 'GET',
        name: 'GetVersionInfo',
      })

      const nugetPromises = result.Components.map(async component => {
        try {
          const response = await fetch(
            `https://api.nuget.org/v3/registration3-gz-semver2/${component.ComponentId.toLowerCase()}/index.json`,
          )
          if (response.ok) {
            const nugetManifest = await response.json()
            return nugetManifest
          }
        } catch (error) {
          return {}
        }
      })
      const loadedManifests = (await Promise.all(nugetPromises)).filter(m => m)
      setNugetManifests(loadedManifests)

      let hasOneUpdate = false

      result.Components = result.Components.map(component => {
        const nugetManifest = loadedManifests.find(
          m =>
            m['@id'] ===
            `https://api.nuget.org/v3/registration3-gz-semver2/${component.ComponentId.toLocaleLowerCase()}/index.json`,
        )
        const updateAvailable = nugetManifest ? nugetManifest.items[0].upper > component.Version : false
        if (updateAvailable) {
          hasOneUpdate = true
        }
        return {
          ...component,
          NugetManifest: nugetManifest,
          IsUpdateAvailable: updateAvailable,
        }
      })
      setHasUpdates(hasOneUpdate)
      setVersionInfo(result)
    })()
  }, [repo])

  return { versionInfo, nugetManifests, hasUpdates }
}
