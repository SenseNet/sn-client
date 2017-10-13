import * as React from 'react'
import MediaQuery from 'react-responsive';
import QuickSearchBox from './QuickSearchInput'

const styles = {
    searchContainerMobile: {
        flex: 5
    }
}

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
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <div style={matches ? null : styles.searchContainerMobile}>
                        <QuickSearchBox {...this.props}
                            isOpen={matches ? this.state.isOpen : true}
                            onClick={this.onClick} />
                    </div>
                }}
            </MediaQuery>
        )
    }
}