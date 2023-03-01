import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import React, { Component, MouseEvent } from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../../Actions'
import { rootStateType } from '../../../store/rootReducer'

const mapStateToProps = (state: rootStateType) => {
  return {
    actionmenuOpen: state.dms.actionmenu.open,
  }
}

const mapDispatchToProps = {
  openActionMenu: DMSActions.openActionMenu,
  closeActionMenu: DMSActions.closeActionMenu,
}

export interface ActionsCellProps {
  content: GenericContent
  fieldName: string
}

export interface ActionsCellState {
  status: boolean
}

class ActionsCell extends Component<
  ActionsCellProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  ActionsCellState
> {
  public onClick = (ev: MouseEvent) => {
    const { content, closeActionMenu, openActionMenu } = this.props
    ev.preventDefault()
    closeActionMenu()
    openActionMenu(content.Actions as ActionModel[], content, '', ev.currentTarget.parentElement, {
      top: ev.clientY,
      left: ev.clientX,
    })
  }
  public render() {
    return (
      <TableCell>
        <IconButton onClick={(ev: MouseEvent) => this.onClick(ev)}>
          <MoreHoriz />
        </IconButton>
      </TableCell>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsCell)
