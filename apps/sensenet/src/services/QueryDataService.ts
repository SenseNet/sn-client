import { Disposable, Injectable, ObservableValue } from '@sensenet/client-utils'
import { QueryData } from '../components/search'

/**
 * A context service to get/set the query data
 */
@Injectable({ lifetime: 'singleton' })
export class QueryDataService implements Disposable {
  public queryData = new ObservableValue<QueryData | undefined>(undefined)

  public async dispose() {
    this.queryData.dispose()
  }
}
