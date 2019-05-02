import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { SearchDocuments } from './SearchDocuments'

class Search extends React.Component<RouteComponentProps & any> {
  public render() {
    if (this.props.location.pathname.startsWith('/documents')) {
      return <SearchDocuments {...this.props} />
    }
    return <div style={{ width: '100%' }} />
  }
}

const connectedComponent = withRouter(Search)
export { connectedComponent as Search }
