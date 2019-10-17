import { Injectable } from '@furystack/inject'
import { Repository, UploadProgressInfo } from '@sensenet/client-core'
import { ObservableValue, LogLevel } from '@sensenet/client-utils'
import { EventService } from './EventService'
import { LocalizationService } from './LocalizationService'

@Injectable({ lifetime: 'singleton' })
export class UploadTracker {
  public onUploadProgress: ObservableValue<{ progress: UploadProgressInfo; repo: Repository }> = new ObservableValue()

  /**
   *
   */
  constructor(eventService: EventService, localization: LocalizationService) {
    this.onUploadProgress.subscribe(({ progress, repo }) => {
      if (progress.completed) {
        eventService.add({
          scope: 'UploadTracker',
          level: LogLevel.Information,
          message: localization.currentValues
            .getValue()
            .uploadProgress.contentUploaded.replace('{0}', progress.file.name),
          data: {
            details: { progress },
            relatedContent: progress.createdContent,
            relatedRepository: repo.configuration.repositoryUrl,
            multiple: true,
            digestMessage: localization.currentValues.getValue().uploadProgress.contentUploadedMultiple,
          },
        })
      }
    })
  }
}
