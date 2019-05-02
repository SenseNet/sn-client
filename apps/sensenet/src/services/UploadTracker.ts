import { Injectable } from '@furystack/inject'
import { LogLevel } from '@furystack/logging'
import { UploadProgressInfo } from '@sensenet/client-core'
import { ObservableValue } from '@sensenet/client-utils'
import { EventService } from './EventService'
import { LocalizationService } from './LocalizationService'

@Injectable({ lifetime: 'singleton' })
export class UploadTracker {
  public onUploadProgress: ObservableValue<UploadProgressInfo> = new ObservableValue()

  /**
   *
   */
  constructor(eventService: EventService, localization: LocalizationService) {
    this.onUploadProgress.subscribe(progress => {
      if (progress.completed) {
        eventService.add({
          scope: 'UploadTracker',
          level: LogLevel.Information,
          message: localization.currentValues
            .getValue()
            .uploadProgress.contentUploaded.replace('{0}', progress.file.name),
          data: {
            multiple: true,
            digestMessage: localization.currentValues.getValue().uploadProgress.contentUploadedMultiple,
          },
        })
      }
    })
  }
}
