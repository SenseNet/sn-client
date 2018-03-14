import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../Actions'
import BreadCrumb from '../components/BreadCrumb'
import DocumentLibrary from '../components/DocumentLibrary'
import FloatingActionButton from '../components/FloatingActionButton'
import Header from '../components/Header'
import MessageBar from '../components/MessageBar'
import * as DMSReducers from '../Reducers'

const styles = {
    dashBoardInner: {
        padding: 60,
    },
    dashBoardInnerMobile: {
        padding: '30px 0 0',
    },
    root: {
        background: '#efefef',
    },
}

interface DashboardProps {
    match,
    currentContent,
    loggedinUser,
    loadContent,
    setCurrentId,
    currentId,
    selectionModeIsOn: boolean
}

class Dashboard extends React.Component<DashboardProps, { currentId }> {
    constructor(props) {
        super(props)
        this.state = {
            currentId: this.props.match.params.id ? this.props.match.params.id : '',
        }
    }
    public componentDidMount() {
        const id = parseInt(this.props.match.params.id, 10)
        if (id && !isNaN(id) && isFinite(id)) {
            this.props.setCurrentId(id)
        } else {
            if (this.props.match.params.id !== undefined && this.props.match.params.id !== this.props.currentId) {
                if (this.props.loggedinUser.userName !== 'Visitor') {
                    return this.props.setCurrentId(this.props.match.params.id)
                        && this.props.loadContent(`/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library`)
                }
            }
        }
    }
    public componentWillReceiveProps(nextProps) {
        const id = parseInt(nextProps.match.params.id, 10)
        if (id && !isNaN(id) && isFinite(id)) {
            this.props.setCurrentId(id)
        }
        if (nextProps.currentId &&
            !isNaN(id) &&
            id === Number(nextProps.currentId) &&
            this.props.currentId !== nextProps.currentId) {
            if (nextProps.loggedinUser.userName !== 'Visitor') {

                this.props.setCurrentId(id)
                this.props.loadContent(id)
            }
        }
        if (nextProps.loggedinUser.userName !== this.props.loggedinUser.userName) {
            id ?
                this.props.setCurrentId(Number(nextProps.match.params.id)) &&
                this.props.loadContent(Number(nextProps.match.params.id)) :
                this.props.loadContent(`/Root/Profiles/Public/${nextProps.loggedinUser.userName}/Document_Library`)
        }
    }
    public render() {
        const { id } = this.props.match.params
        return (
            <div style={styles.root}>
                <Header />
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        if (matches) {
                            return <div style={styles.dashBoardInner}>
                                <BreadCrumb />
                                <DocumentLibrary parentId={id} />
                            </div>
                        } else {
                            return <div style={styles.dashBoardInnerMobile}>
                                <BreadCrumb />
                                <DocumentLibrary parentId={id} />
                            </div>
                        }
                    }}
                </MediaQuery>
                {!this.props.selectionModeIsOn ? <FloatingActionButton content={this.props.currentContent} /> : null}
                <MessageBar />
            </div>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
        selectionModeIsOn: DMSReducers.getIsSelectionModeOn(state.dms),
    }
}

export default connect(mapStateToProps, {
    loadContent: Actions.loadContent,
    setCurrentId: DMSActions.setCurrentId,
})(Dashboard)
