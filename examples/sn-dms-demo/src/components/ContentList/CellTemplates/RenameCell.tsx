import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import TableCell from '@material-ui/core/TableCell'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../../..'
import { setEditedContentId } from '../../../Actions'

const mapStateToProps = (state: rootStateType) => ({})
const mapDispatchToProps = {
    setEdited: setEditedContentId,
}

interface RenameCellProps {
    displayName: string
    icon: string
    icons: any
    onFinish: (newDisplayName: string) => any
}

class RenameCell extends React.Component<RenameCellProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, { newDisplayName: string }> {

    public state = { newDisplayName: this.props.displayName }

    constructor(props: RenameCell['props']) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleDismiss = this.handleDismiss.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    private input: HTMLInputElement
    public componentDidMount() {
        setTimeout(() => {
            this.input.focus()
        }, 300)
    }

    private handleChange(ev: React.FormEvent<HTMLInputElement>) {
        this.setState({
            newDisplayName: ev.currentTarget.value,
        })
    }

    private handleDismiss() {
        this.props.setEdited(0)
    }

    private handleSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        this.props.onFinish(this.state.newDisplayName)
        this.handleDismiss()
    }

    private handleKeyUp(ev: React.KeyboardEvent) {
        if (ev.key === 'Escape') {
            this.handleDismiss()
        }
    }

    private handleClick(ev: React.MouseEvent) {
        ev.preventDefault()
        ev.stopPropagation()
        ev.nativeEvent.stopImmediatePropagation()
        return true
    }

    public render() {
        const icon = this.props.icon && this.props.icons[this.props.icon.toLowerCase() as any]

        return (
            <TableCell padding="checkbox" className="DisplayName display-name">
                <form onSubmit={this.handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                    {icon ?
                        <Icon
                            type={iconType.materialui}
                            iconName={icon} style={{ marginRight: '.5em' }} />
                        : null}

                    <ClickAwayListener onClickAway={this.handleDismiss}>
                        <input
                            required
                            className="rename"
                            onClick={this.handleClick}
                            onDoubleClick={this.handleClick}
                            onContextMenu={this.handleClick}
                            onKeyUp={this.handleKeyUp}
                            onChange={this.handleChange}
                            defaultValue={this.props.displayName}
                            ref={(input) => (this.input = input)} />
                    </ClickAwayListener>
                </form>

            </TableCell>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(RenameCell)

export { connectedComponent as RenameCell }
