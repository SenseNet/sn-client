import * as React from 'react'
import QuickSearchBox from './QuickSearchInput'

const animationStyle = {
    transition: 'width 0.75s cubic-bezier(0.000, 0.795, 0.000, 1.000)'
};

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
                onClick={this.onClick}
                additionalStyles={{text: animationStyle, frame: animationStyle}} />
            </div>
        )
    }
}