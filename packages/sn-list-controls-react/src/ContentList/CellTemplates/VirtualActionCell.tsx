import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'

export const virtualStyles = {
  actionMenuButton: {
    padding: 0,
    width: 30,
    cursor: 'pointer' as any,
  },
  icon: {
    verticalAlign: 'middle' as any,
    opacity: 0,
  },
  selectedIcon: {
    verticalAlign: 'middle' as any,
  },
  hoveredIcon: {
    verticalAlign: 'middle' as any,
  },
}

export interface VirtualActionsCellProps<T extends GenericContent> {
  content: T
  actions: ActionModel[]
  openActionMenu: (ev: React.MouseEvent) => any
}

export interface VirtualMenuCellState {
  anchorTop: number
  anchorLeft: number
}

export class VirtualActionsCell<T extends GenericContent> extends React.Component<
  VirtualActionsCellProps<T>,
  VirtualMenuCellState
> {
  constructor(props: VirtualActionsCellProps<T>) {
    super(props)
    this.state = {
      anchorLeft: 0,
      anchorTop: 0,
    }
    this.handleActionMenuClick = this.handleActionMenuClick.bind(this)
  }
  public handleActionMenuClick(e: React.MouseEvent) {
    this.props.openActionMenu(e)
  }
  public render() {
    return (
      <TableCell style={virtualStyles.actionMenuButton}>
        <IconButton aria-label="Menu" aria-owns="actionmenu" onClick={event => this.handleActionMenuClick(event)}>
          <Icon type={iconType.materialui} iconName="more_vert" />
        </IconButton>
      </TableCell>
    )
  }
}
