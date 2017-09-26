import * as React from 'react'
import { connect } from 'react-redux'
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../Reducers'
import { DMSActions } from '../Actions'
import Header from '../components/Header'
import { FloatingActionButton } from '../components/FloatingActionButton'
import DocumentLibrary from '../components/DocumentLibrary'
import BreadCrumb from '../components/BreadCrumb'

const styles = {
    dashBoarInner: {
        padding: 60
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
    currentId
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
        console.log('idka: ' + id)
        if (id && !isNaN(id) && isFinite(id)) {
            this.props.setCurrentId(id)
        }
        else {
            if (this.props.match.params.id !== undefined && this.props.match.params.id !== this.props.currentId) {
                this.props.setCurrentId(this.props.match.params.id)
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
        return (
            <div style={styles.root}>
                <Header />
                <div style={styles.dashBoarInner}>
                    <BreadCrumb />
                    <DocumentLibrary parentId={this.props.match.params.id} />
                </div>
                <FloatingActionButton />
            </div>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state)
    }
}

export default connect(mapStateToProps, {
    loadContent: Actions.LoadContent,
    setCurrentId: DMSActions.SetCurrentId
})(Dashboard)