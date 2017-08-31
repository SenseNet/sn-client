import * as React from 'react'
import Header from '../components/Header'
import { FloatingActionButton } from '../components/FloatingActionButton'

class Dashboard extends React.Component<{ match, loggedinUser }, { currentId }>{
    constructor(props) {
        super(props)
        this.state = {
            currentId: this.props.match.params.id ? this.props.match.params.id : '/Root'
        }
    }
    render() {
        return (
            <div>
                <Header />
                <FloatingActionButton />
            </div>
        )
    }
}

export default Dashboard