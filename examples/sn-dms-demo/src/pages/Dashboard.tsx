import * as React from 'react'
import { connect } from 'react-redux'
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../Reducers'
import Header from '../components/Header'
import { FloatingActionButton } from '../components/FloatingActionButton'
import DocumentLibrary from '../components/DocumentLibrary'

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
    loadContent: Function
}

class Dashboard extends React.Component<IDashboardProps, { currentId }>{
    constructor(props) {
        super(props)
        this.state = {
            currentId: this.props.match.params.id ? this.props.match.params.id : ''
        }
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.match.params.id && !isNaN(parseFloat(id)) && isFinite(id) ?
            this.props.loadContent(Number(this.props.match.params.id)) :
            this.props.loadContent(`/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library`)
    }
    componentWillReceiveProps(nextProps) {
        let nextId = Number(nextProps.match.url.replace('/', '')) !== 0 ? Number(nextProps.match.url.replace('/', '')) : undefined
        if (typeof this.props.currentContent.Id !== 'undefined' &&
            typeof nextId !== 'undefined' &&
            nextId !== this.props.currentContent.Id) {
            this.props.loadContent(nextId)
        }
    }
    render() {
        return (
            <div style={styles.root}>
                <Header />
                <div style={styles.dashBoarInner}>
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
        currentContent: Reducers.getCurrentContent(state.sensenet)
    }
}

export default connect(mapStateToProps, {
    loadContent: Actions.LoadContent
})(Dashboard)