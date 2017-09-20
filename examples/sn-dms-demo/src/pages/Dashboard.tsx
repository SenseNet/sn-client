import * as React from 'react'
import { connect } from 'react-redux'
import { Actions, Reducers } from 'sn-redux'
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

class Dashboard extends React.Component<{ match, currentContent, loadContent }, { currentId }>{
    constructor(props) {
        super(props)
        this.state = {
            currentId: this.props.match.params.id ? this.props.match.params.id : ''
        }
    }
    componentDidMount() {
        this.props.match.params.id ?
        this.props.loadContent(Number(this.props.match.params.id)) :
        null
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
        currentContent: Reducers.getCurrentContent(state.sensenet)
    }
}

export default connect(mapStateToProps, {
    loadContent: Actions.LoadContent
})(Dashboard)