import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import Button from '@material-ui/core/Button'
import { resources } from '../../assets/resources'

interface AddNewButtonProps {
  contentType: string
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

export class AddNewButton extends React.Component<AddNewButtonProps, {}> {
  constructor(props: AddNewButton['props']) {
    super(props)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }
  public handleButtonClick(e: React.MouseEvent<HTMLElement>) {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
  public render() {
    return (
      <Button
        variant="contained"
        component="span"
        color="secondary"
        style={{
          color: '#fff',
          width: '100%',
          fontFamily: 'Raleway Bold',
          textTransform: 'none',
          fontSize: '14px',
          padding: '6px 10px',
          letterSpacing: 1,
          margin: '10px 0',
          boxShadow:
            '0px 1px 3px 0px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
        }}
        onClick={this.handleButtonClick}>
        <Icon type={iconType.materialui} iconName="add" style={{ fontSize: 20, marginRight: 5, color: '#fff' }} />
        {this.props.contentType
          ? `${resources.ADD_NEW} ${resources[this.props.contentType.toUpperCase()]}`
          : resources.ADD_NEW}
      </Button>
    )
  }
}
