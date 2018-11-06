import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import MediaQuery from 'react-responsive'
import WorkspaceSelector from '../components/WorkspaceSelector/WorkspaceSelector'
import BatchActionlist from './ActionMenu/BatchActionlist'
import BreadCrumb from './BreadCrumb'

export interface ListToolbarProps {
    currentContent: GenericContent,
    selected: GenericContent[],
    ancestors: GenericContent[]
}

const styles = {
    appBar: {
        background: '#fff',
    },
    appBarMobile: {
        background: '#4cc9f2',
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0 12px',
    },
    toolbarMobile: {
        padding: '0',
        minHeight: 36,
        borderBottom: 'solid 1px #fff',
        display: 'flex',
        flexDirection: 'row',
    },
}

export class ListToolbar extends React.Component<ListToolbarProps, {}> {
    public render() {
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return matches ? <AppBar position="static" style={matches ? styles.appBar : styles.appBarMobile}>
                    <Toolbar style={matches ? styles.toolbar as any : styles.toolbarMobile as any}>
                        <div style={{ flex: 1, display: 'flex' }}>
                            <WorkspaceSelector />
                            <BreadCrumb ancestors={this.props.ancestors} currentContent={this.props.currentContent} />
                        </div>
                        <BatchActionlist currentContent={this.props.currentContent} selected={this.props.selected} />
                    </Toolbar>
                </AppBar> :
                    <AppBar position="static" style={matches ? styles.appBar : styles.appBarMobile}>
                        <Toolbar style={matches ? styles.toolbar as any : styles.toolbarMobile as any}>
                            <WorkspaceSelector />
                            <BreadCrumb ancestors={this.props.ancestors} currentContent={this.props.currentContent} />
                            <BatchActionlist currentContent={this.props.currentContent} selected={this.props.selected} />
                        </Toolbar>
                    </AppBar>
            }}
        </MediaQuery>
    }
}
