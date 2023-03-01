import { IconButton, TableCell } from '@material-ui/core'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { Component, MouseEvent } from 'react'

export const styles = {
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
  virtual: {
    height: '57px',
    width: '100%',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

export interface ActionsCellProps<T extends GenericContent> {
  content: T
  actions: ActionModel[]
  openActionMenu: (ev: MouseEvent) => any
  virtual?: boolean
}

export interface MenuCellState {
  anchorTop: number
  anchorLeft: number
}

export class ActionsCell<T extends GenericContent> extends Component<ActionsCellProps<T>, MenuCellState> {
  constructor(props: ActionsCellProps<T>) {
    super(props)
    this.state = {
      anchorLeft: 0,
      anchorTop: 0,
    }
    this.handleActionMenuClick = this.handleActionMenuClick.bind(this)
  }
  public handleActionMenuClick(e: MouseEvent) {
    this.props.openActionMenu(e)
  }
  public render() {
    return (
      <TableCell
        component={this.props.virtual ? 'div' : 'td'}
        style={
          this.props.virtual
            ? {
                ...styles.actionMenuButton,
                ...styles.virtual,
              }
            : styles.actionMenuButton
        }>
        <IconButton aria-label="Menu" aria-owns="actionmenu" onClick={(event) => this.handleActionMenuClick(event)}>
          <Icon type={iconType.materialui} iconName="more_vert" />
        </IconButton>
      </TableCell>
    )
  }
}
