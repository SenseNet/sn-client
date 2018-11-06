import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import UserPanel from './UserPanel'

const styles = {
    actionmenuContainer: {
        flex: 1,
    },
    menuIcon: {
        color: '#fff',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer',
    },
    menuIconMobile: {
        width: 'auto' as any,
        marginLeft: '16px',
    },
    arrowButton: {
        marginLeft: 0,
    },
    avatar: {
        display: 'inline-block',
    },
}

interface UserActionMenuState {
    anchorEl,
    open: boolean,
    selectedIndex: number,
}

const mapStateToProps = (state: rootStateType, match) => {
    return {
        loggedinUser: state.sensenet.session.user,
        actions: state.dms.actionmenu.userActions,
    }
}

const mapDispatchToProps = {
    logout: Actions.userLogout,
    loadUserActions: DMSActions.loadUserActions,
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
}

class UserActionMenu extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, UserActionMenuState> {
    public state = {
        anchorEl: null,
        open: false,
        selectedIndex: 1,
    }
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
    }
    public componentWillReceiveProps(nextProps: UserActionMenu['props']) {
        const { loggedinUser, loadUserActions } = this.props
        if (loggedinUser.userName !== nextProps.loggedinUser.userName && nextProps.loggedinUser.userName !== 'Visitor') {
            loadUserActions(nextProps.loggedinUser.content.Path, 'DMSUserActions')
        }
    }
    public handleClick = (e) => {
        const { actions, loggedinUser } = this.props
        this.props.closeActionMenu()
        this.props.openActionMenu(actions, loggedinUser.content, loggedinUser.fullName, e.currentTarget, {
            top: e.currentTarget.offsetTop + 40,
            left: e.currentTarget.offsetLeft,
        })
    }

    public handleRequestClose = () => {
        this.setState({ open: false })
    }
    public render() {
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <div
                        style={matches ? {} : styles.actionmenuContainer}
                        aria-owns="actionmenu"
                        onClick={(e) => this.handleClick(e)}>
                        <UserPanel user={this.props.loggedinUser} style={styles.avatar} />
                        <Icon
                            type={iconType.materialui}
                            iconName="arrow_drop_down"
                            style={matches ? styles.menuIcon : { ...styles.menuIcon, ...styles.menuIconMobile }} />
                    </div>
                }}
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserActionMenu)
