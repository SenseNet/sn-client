import * as React from 'react'
import QuickSearchBox from './QuickSearchInput'


export class QuickSearch extends React.Component<{}, { isOpen }>{
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }
    onClick = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    render() {
        return (
            <div>
                <QuickSearchBox {...this.props}
                isOpen={this.state.isOpen}
                onClick={this.onClick} />
            </div>
        )
    }
}