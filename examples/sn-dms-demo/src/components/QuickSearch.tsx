import * as React from 'react'
import MediaQuery from 'react-responsive';
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
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        return <QuickSearchBox {...this.props}
                            isOpen={matches ? this.state.isOpen : true}
                            onClick={this.onClick} />
                    }}
                </MediaQuery>
            </div>
        )
    }
}