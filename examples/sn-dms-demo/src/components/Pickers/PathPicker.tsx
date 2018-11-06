import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

import IconButton from '@material-ui/core/IconButton'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { loadPickerItems, loadPickerParent, selectPickerItem, setBackLink } from '../../store/picker/actions'
import AddNewDialog from '../Dialogs/AddNewDialog'

const styles = {
    selected: {
        background: '#016d9e',
        color: '#fff',
    },
    iconsSelected: {
        color: '#fff',
    },
    textSelected: {
        color: '#fff !important',
    },
    openIcon: {
        display: 'block',
        color: '#fff',
    },
}

interface PathPickerProps {
    dialogComponent,
    dialogTitle: string,
    dialogCallback,
    mode: string,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        selectedTarget: state.dms.picker.selected,
        items: state.dms.picker.items,
        pickerClose: state.dms.picker.pickerOnClose,
        parent: state.dms.picker.parent,
    }
}

const mapDispatchToProps = {
    selectPickerItem,
    loadPickerParent,
    loadPickerItems,
    openDialog: DMSActions.openDialog,
    closeDialog: DMSActions.closeDialog,
    setBackLink,
}

interface PathPickerState {
    hovered: number,
}

class PathPicker extends React.Component<PathPickerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, PathPickerState> {
    public state = {
        hovered: null,
        items: this.props.items,
    }
    public static getDerivedStateFromProps(newProps: PathPicker['props'], lastState: PathPicker['state']) {
        if (lastState.items.length !== newProps.items.length) {
            newProps.loadPickerItems(newProps.parent.Path, newProps.parent)
        }
        return {
            ...lastState,
            items: newProps.items,
        }
    }

    public handleClose = () => {
        this.props.pickerClose()
    }
    public handleSubmit = () => {
        const { dialogComponent, dialogTitle, dialogCallback } = this.props
        this.props.openDialog(dialogComponent, dialogTitle, this.handleAddNewClose, dialogCallback)
    }
    public isSelected = (id: number) => {
        return this.props.selectedTarget.findIndex((item) => item.Id === id) > -1
    }
    public handleClick = (e, content: GenericContent) => {
        // tslint:disable-next-line:no-string-literal
        e.currentTarget.attributes.getNamedItem('role') && e.currentTarget.attributes.getNamedItem('role').value === 'menuitem' ?
            this.props.selectPickerItem(content) :
            this.handleLoading(content.Id)
    }
    public handleMouseOver = (id: number) => {
        this.setState({
            hovered: id,
        })
    }
    public handleMouseOut = () => {
        this.setState({
            hovered: null,
        })
    }
    public isHovered = (id: number) => {
        return this.state.hovered === id
    }
    public hasChildren = (id: number) => {
        const content = this.props.items.find((item) => item.Id === id)
        // tslint:disable-next-line:no-string-literal
        return content['Children'] ? content['Children'].filter((child) => child.IsFolder).length > 0 ? true : false : false
    }
    public handleLoading = (id: number) => {
        const content = this.props.items.find((item) => item.Id === id)
        this.props.loadPickerParent(id)
        this.props.loadPickerItems(content.Path, content)
        this.props.setBackLink(true)
    }
    public handleAddNewClose = () => {
        // TODO
    }
    public handleAddNewClick = () => {
        const { parent, openDialog } = this.props
        openDialog(<AddNewDialog
            parentPath={parent.Path}
            contentTypeName="Folder"
            title="folder" />,
            resources.ADD_NEW, this.handleAddNewClose)
    }
    public render() {
        const { selectedTarget } = this.props
        const { items } = this.state
        return (
            <div>
                <DialogContent>
                    <Scrollbars
                        style={{ height: 240, width: 'calc(100% - 1px)' }}
                        renderThumbVertical={({ style }) => <div style={{ ...style, borderRadius: 2, backgroundColor: '#999', width: 10, marginLeft: -2 }}></div>}
                        thumbMinSize={180}>
                        <List>
                            {items.map((item) => {
                                return <MenuItem button
                                    key={item.Id}
                                    style={this.isSelected(item.Id) ? styles.selected : null}
                                    onClick={(e) => this.handleClick(e, item)}
                                    onMouseEnter={() => this.handleMouseOver(item.Id)}
                                    onMouseLeave={() => this.handleMouseOut()}
                                    selected={this.isSelected(item.Id)}>
                                    <ListItemIcon style={this.isSelected(item.Id) ? styles.iconsSelected : null}>
                                        <Icon type={iconType.materialui} iconName="folder" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                className={this.isSelected(item.Id) ? 'picker-item-selected' : this.isHovered(item.Id) ? 'picker-item-hovered' : 'picker-item'}>
                                                {item.DisplayName}
                                            </Typography>} />
                                    {
                                        this.hasChildren(item.Id) ? <Icon
                                            type={iconType.materialui}
                                            iconName="keyboard_arrow_right"
                                            style={this.isHovered ? styles.openIcon : { display: 'none' }}
                                            onClick={(e) => this.handleClick(e, item)} /> :
                                            null
                                    }
                                </MenuItem>
                            },
                            )}
                        </List>
                    </Scrollbars>
                </DialogContent>

                <MediaQuery minDeviceWidth={700}>
                    {(matches) =>
                        <DialogActions className="mobile-picker-buttonRow">
                            <IconButton onClick={() => this.handleAddNewClick()}>
                                <Icon type={iconType.materialui} iconName="create_new_folder" style={{ color: '#016D9E' }} />
                            </IconButton>
                            <Typography style={{ flexGrow: 1, color: '#016D9E', fontFamily: 'Raleway Medium', fontSize: 14 }} onClick={() => this.handleAddNewClick()}>
                                {matches ? null : resources.NEW_FOLDER}
                            </Typography>
                            {matches ? <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleClose()}>{resources.CANCEL}</Button> : null}
                            <Button onClick={() => this.handleSubmit()} variant="raised" className="disabled-mobile-button" disabled={selectedTarget.length > 0 ? false : true} color={matches ? 'primary' : 'default'}>{resources[`${this.props.mode.toUpperCase()}_BUTTON`]}</Button>
                        </DialogActions>
                    }
                </MediaQuery>
            </div>
        )
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(PathPicker))
