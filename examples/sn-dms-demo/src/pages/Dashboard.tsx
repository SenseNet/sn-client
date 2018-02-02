import * as React from 'react'
import { connect } from 'react-redux'
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../Reducers'
import { DMSActions } from '../Actions'
import Header from '../components/Header'
import FloatingActionButton from '../components/FloatingActionButton'
import DocumentLibrary from '../components/DocumentLibrary'
import BreadCrumb from '../components/BreadCrumb'
import MediaQuery from 'react-responsive'
import MessageBar from '../components/MessageBar'

const styles = {
    dashBoardInner: {
        padding: 60
    },
    dashBoardInnerMobile: {
        padding: '30px 0 0'
    },
    root: {
        background: '#efefef'
    }
}

interface IDashboardProps {
    match,
    currentContent,
    loggedinUser,
    loadContent: Function,
    setCurrentId: Function,
    currentId,
    selectionModeIsOn: boolean
}

class Dashboard extends React.Component<IDashboardProps, { currentId }>{
    constructor(props) {
        super(props)
        this.state = {
            currentId: this.props.match.params.id ? this.props.match.params.id : ''
        }
    }
    componentDidMount() {
        const id = parseInt(this.props.match.params.id);
        if (id && !isNaN(id) && isFinite(id)) {
            this.props.setCurrentId(id)
        }
        else {
            if (this.props.match.params.id !== undefined && this.props.match.params.id !== this.props.currentId) {
                return this.props.setCurrentId(this.props.match.params.id)
                    && this.props.loadContent(`/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library`)
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        const id = parseInt(nextProps.match.params.id);
        if (id && !isNaN(id) && isFinite(id)) {
            this.props.setCurrentId(id)
        }

        if (nextProps.currentId &&
            !isNaN(id) &&
            id === Number(nextProps.currentId) &&
            this.props.currentId !== nextProps.currentId) {
            this.props.setCurrentId(id)
            this.props.loadContent(id)
        }
    }
    render() {
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
                            </div>;
                        } else {
                            return <div style={styles.dashBoardInnerMobile}>
                                <BreadCrumb />
                                <DocumentLibrary parentId={id} />
                            </div>;
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
        selectionModeIsOn: DMSReducers.getIsSelectionModeOn(state.dms)
    }
}

export default connect(mapStateToProps, {
    loadContent: Actions.LoadContent,
    setCurrentId: DMSActions.SetCurrentId
})(Dashboard)
