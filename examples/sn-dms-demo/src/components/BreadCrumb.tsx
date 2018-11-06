import Button from '@material-ui/core/Button'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { icons } from '../assets/icons'

const styles = {
    breadCrumb: {
        flexGrow: 2,
    },
    breadCrumbMobile: {
        flexGrow: 1,
    },
    breadCrumbItem: {
        fontFamily: 'Raleway SemiBold',
        textTransform: 'none',
        color: '#666',
        padding: 8,
        letterSpacing: '0.05rem',
        fontSize: 16,
    },
    breadCrumbItemMobile: {
        color: '#fff',
        fontFamily: 'Raleway SemiBold',
        textTransform: 'none',
        padding: 8,
        letterSpacing: '0.05rem',
        fontSize: 16,
    },
    breadCrumbIcon: {
        display: 'inline-block',
        color: '#777',
        verticalAlign: 'middle',
        margin: '0 -7px',
    },
    breadCrumbItemLast: {
        fontFamily: 'Raleway ExtraBold',
        fontSize: 16,
    },
    breadCrumbIconLast: {
        margin: 0,
    },
    breadCrumbIconLeft: {
    },
    item: {
        display: 'inline-block',
        margin: 0,
        padding: 0,
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        isLoading: state.dms.isLoading,
        actions: state.dms.actionmenu.breadcrumb.actions,
    }
}

const mapDispatchToProps = {
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
    getActions: DMSActions.loadBreadcrumbActions,
}

interface BreadCrumbProps extends RouteComponentProps<any> {
    ancestors: GenericContent[]
    currentContent: GenericContent,
}

interface BreadCrumbState {
    currentContent: GenericContent,
}

class BreadCrumb extends React.Component<BreadCrumbProps & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>, BreadCrumbState> {
    public state = {
        currentContent: this.props.currentContent,
    }
    constructor(props: BreadCrumb['props']) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleActionMenuClick = this.handleActionMenuClick.bind(this)
    }

    public static getDerivedStateFromProps(newProps: BreadCrumb['props'], lastState: BreadCrumb['state']) {
        newProps.currentContent && newProps.getActions(newProps.currentContent.Id)
        return {}
    }

    public handleClick(e, content: GenericContent) {
        const newPath = compile(this.props.match.path)({ folderPath: btoa(content.Path) })
        this.props.history.push(newPath)
    }

    public handleActionMenuClick(e: React.MouseEvent<HTMLElement>, content: GenericContent) {
        const top = e.pageY - e.currentTarget.offsetTop
        const left = e.pageX - e.currentTarget.offsetLeft
        this.props.closeActionMenu()
        this.props.openActionMenu(this.props.actions, content, content.DisplayName, e.currentTarget, { top: top + 30, left })
    }
    public render() {
        const ancestors = this.props.ancestors
            .filter((a) => a.Type === 'DocumentLibrary' || a.Type === 'Folder' || a.Id === this.props.currentContent.Id)
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return <div style={matches ? styles.breadCrumb : styles.breadCrumbMobile}>
                    {ancestors
                        .map((ancestor, i) => {
                            const isLast = i === (ancestors.length - 1)
                            if (matches) {
                                return <div style={styles.item} key={i}>
                                    <Button
                                        aria-owns="actionmenu"
                                        onClick={
                                            !isLast ?
                                                (event) => this.handleClick(event, ancestor) :
                                                (e) => this.handleActionMenuClick(e, ancestor)
                                        }
                                        key={ancestor.Id}
                                        style={isLast ? { ...styles.breadCrumbItem, ...styles.breadCrumbItemLast } : styles.breadCrumbItem as any}>
                                        {ancestor.DisplayName}
                                        {!isLast ?
                                            '' :
                                            <Icon
                                                style={styles.breadCrumbIconLast}
                                                onClick={(e) => this.handleActionMenuClick(e, ancestor)}
                                                type={iconType.materialui}
                                                iconName={icons.arrowDropDown}></Icon>}
                                    </Button>
                                    {!isLast ?
                                        <Icon
                                            style={styles.breadCrumbIcon}
                                            onClick={(e) => this.handleActionMenuClick(e, ancestor)}
                                            type={iconType.materialui}
                                            iconName={icons.arrowRight} /> : ''}
                                </div>
                            } else if (!matches && isLast) {
                                return <div style={styles.item} key={i}>
                                    <Button onClick={(event) => this.handleClick(event, ancestor)}
                                        key={ancestor.Id}
                                        style={styles.breadCrumbItemMobile as any}>
                                        {ancestor.DisplayName}
                                    </Button>
                                </div>
                            } else {
                                return null
                            }
                        })}
                </div>
            }}
        </MediaQuery>
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BreadCrumb))
