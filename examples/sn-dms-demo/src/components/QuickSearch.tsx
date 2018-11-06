import IconButton from '@material-ui/core/IconButton'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import MediaQuery from 'react-responsive'
import QuickSearchBox from './QuickSearchInput'

const styles = {
    searchContainerMobile: {
        flex: 5,
    },
    searchButton: {
        color: '#fff',
        marginRight: -10,
        height: 36,
    },
}

export class QuickSearch extends React.Component<{}, { isOpen }> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
        }
    }
    public onClick = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }
    public render() {
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    if (matches) {
                        return <div style={matches ? null : styles.searchContainerMobile}>
                            <QuickSearchBox {...this.props}
                                isOpen={matches ? this.state.isOpen : true}
                                onClick={this.onClick} />
                        </div>
                    } else {
                        return <IconButton style={styles.searchButton}>
                            <Icon type={iconType.materialui} iconName="search" style={{ color: '#fff' }} />
                        </IconButton>
                    }
                }}
            </MediaQuery>
        )
    }
}
