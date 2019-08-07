import { Repository } from '@sensenet/client-core'
import { usePersonalSettings } from './use-personal-settings'

export const useWidgets = (repository?: Repository, dashboardName?: string) => {
  const personalSettings = usePersonalSettings()
  if (repository) {
    const currentRepo = personalSettings.repositories.find(r => r.url === repository.configuration.repositoryUrl)
    return dashboardName && personalSettings.dashboards[dashboardName]
      ? personalSettings.dashboards[dashboardName]
      : currentRepo && currentRepo.dashboard
      ? currentRepo.dashboard
      : personalSettings.dashboards.repositoryDefault
  }
  return personalSettings.dashboards.globalDefault
}
