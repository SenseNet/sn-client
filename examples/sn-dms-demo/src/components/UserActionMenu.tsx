import { Icon, iconType } from '@sensenet/icons-react'
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
}

interface UserActionMenuState {
    anchorEl: JSX.Element | null,
    open: boolean,
    selectedIndex: number,
    userName: string,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        actions: state.dms.actionmenu.userActions,
    }
}

const mapDispatchToProps = {
    loadUserActions: DMSActions.loadUserActions,
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
}

class UserActionMenu extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, UserActionMenuState> {
    public state = {
        anchorEl: null,
        open: false,
        selectedIndex: 1,
        userName: '',
    }
    constructor(props: UserActionMenu['props']) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
    }
    public static getDerivedStateFromProps(newProps: UserActionMenu['props'], lastState: UserActionMenu['state']) {
        if (lastState.userName !== newProps.loggedinUser.userName && newProps.loggedinUser.userName !== 'Visitor') {
            newProps.loadUserActions(newProps.loggedinUser.content.Path, 'DMSUserActions')
        }
        return {
            ...lastState,
            userName: newProps.loggedinUser.userName,
        } as UserActionMenu['state']
    }
    public handleClick = (e: React.MouseEvent<HTMLElement>) => {
        const { actions, loggedinUser } = this.props
        this.props.closeActionMenu()
        this.props.openActionMenu(actions, loggedinUser.content, loggedinUser.fullName, e.currentTarget, {
            top: (e.target as HTMLElement).offsetTop + 40,
            left: (e.target as HTMLElement).offsetLeft,
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
                        <UserPanel />
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
