import { useEffect, useState } from 'react'
import { ConstantContent } from '@sensenet/client-core'
import { useRepository } from './use-repository'

/*
 * The type of a specific package
 */
export enum PackageType {
  /**
   * Can contain small repeatable activities that do not perform significant changes but can be important because of business or technical reasons. A good example is performing an undo checkout on multiple content. Executing a package of this level does not change the application's or the product's version number but the execution is logged and registered
   */
  Tool,

  /**
   * Contains small modifications (e.g. a couple of new content to import or a bugfix in a dll). Usually patches form a chain where every package assumes the existence of all the previous ones but it is not mandatory. It is possible to control this behavior, see version control below.
   */
  Patch,

  /**
   *  An application's first package must be an 'install' package. This is the package that injects a new application into the system. Only Application packages can be set on this level. An install level package must contain a new application identifier that is unknown to the system. Packages on this level can be executed only once.
   */
  Install,
}

/**
 * Represents a .NET Assembly in the Version Info
 */
export interface Assembly {
  CodeBase: string
  IsDynamic: boolean
  Name: string
  Version: string
}

/**
 * Represents a sensenet Component in the Version Info
 */
export interface Component {
  ComponentId: string
  Version: string
  AcceptableVersion: string
  Description: string
  IsUpdateAvailable?: boolean
  NugetManifest?: any
}

/**
 * Represents a sensenet Package in the Version Info
 */
export interface Package {
  ComponentId: string
  ComponentVersion: string
  Description: string
  ExecutionDate: Date
  ExecutionError: any
  Id: number
  Manifest: any
  PackageType: PackageType
  ReleaseDate: Date
}

/**
 * Represents a model for the sensenet's GetVersionInfo custom action's response
 */
export interface VersionInfo {
  Assemblies: {
    Dynamic: Assembly[]
    GAC: Assembly[]
    Other: Assembly[]
    Plugins: Assembly[]
    SenseNet: Assembly[]
  }
  Components: Component[]
  DatabaseAvailable: boolean
  InstalledPackages: Package[]
}

/**
 * Returns the current repository's Version Info values and also checks if the installed components has an updated version on https://nuget.org
 */
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
