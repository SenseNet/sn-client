import { Repository } from '@sensenet/client-core'
import { compile } from 'path-to-regexp'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '../../store/rootReducer'
import { getWopiData } from './store/actions'

const mapStateToProps = (state: rootStateType) => {
  return {
    wopiData: state.wopi,
    documentId: state.dms.documentLibrary.active,
  }
}

const mapDispatchToProps = {
  getWopiData,
}

interface EditorPageProps extends RouteComponentProps<any> {
  repository: Repository
  documentId: number
}

interface EditorPageState {
  documentId: number
}

class EditorPage extends Component<
  EditorPageProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  EditorPageState
> {
  constructor(props: EditorPage['props']) {
    super(props)
    this.state = {
      documentId: 0,
    }
    this.formElement = React.createRef()
    if (this.props.documentId) {
      this.props.getWopiData(this.props.documentId)
    }
  }
  private formElement: React.RefObject<HTMLFormElement>
  private static updateStoreFromPath(newProps: EditorPage['props']) {
    try {
      if (newProps.match.params.documentId) {
        const fileId = newProps.match.params.documentId.replace('wopi', '').replace(/\//g, '')
        const fileIdUrl = newProps.match.params.documentId && atob(decodeURIComponent(fileId))
        newProps.getWopiData(fileIdUrl)
      }
    } catch (error) {
      /** Cannot parse current folder from URL */
      return compile(newProps.match.path)({ folderPath: '' })
      // tslint:disable-next-line:no-empty
    }
  }
  public static getDerivedStateFromProps(newProps: EditorPage['props'], lastState: EditorPage['state']) {
    const id = newProps.match.params.documentId

    if (id === null || (id && id !== lastState.documentId)) {
      EditorPage.updateStoreFromPath(newProps)
    }
    return {
      ...lastState,
      documentId: id,
    } as EditorPage['state']
  }
  public componentDidMount() {
    setTimeout(() => {
      this.formElement.current && this.formElement.current.submit()
    }, 1000)
  }
  public render() {
    const { accesstoken, expiration, actionUrl } = this.props.wopiData.wopiData
    return (
      <div style={{ marginTop: 65 }}>
        <form
          id="office_form"
          name="office_form"
          action={actionUrl}
          target="office_frame"
          method="post"
          ref={this.formElement}>
          <input name="access_token" value={accesstoken} type="hidden" />
          <input name="access_token_ttl" value={expiration} type="hidden" />
        </form>
        <span id="frameholder">
          <iframe
            frameBorder="no"
            width="100%"
            height={window.innerHeight - 65}
            name="office_frame"
            id="office_frame"
            title="Office Online Frame"
            allowFullScreen={true}
            sandbox={
              'allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox'
            }
          />
        </span>
      </div>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(EditorPage),
)
