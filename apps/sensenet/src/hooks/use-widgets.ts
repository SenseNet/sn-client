import { Repository } from '@sensenet/client-core'
import { usePersonalSettings } from './use-personal-settings'

export const useWidgets = (repository?: Repository) => {
  const personalSettings = usePersonalSettings()
  if (repository) {
    const currentRepo = personalSettings.repositories.find(r => r.url === repository.configuration.repositoryUrl)
    return currentRepo && currentRepo.dashboard ? currentRepo.dashboard : personalSettings.dashboards.repositoryDefault
  }
  return personalSettings.dashboards.globalDefault
}
