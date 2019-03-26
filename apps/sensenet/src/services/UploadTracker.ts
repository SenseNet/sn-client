import { Injectable } from '@furystack/inject'
import { UploadProgressInfo } from '@sensenet/client-core'
import { ObservableValue } from '@sensenet/client-utils'

@Injectable()
export class UploadTracker {
  public onUploadProgress: ObservableValue<UploadProgressInfo> = new ObservableValue()
}
