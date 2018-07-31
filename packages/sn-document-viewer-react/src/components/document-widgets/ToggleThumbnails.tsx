import { IconButton } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setThumbnails } from '../../store'
import { styles } from '../styles'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        toggleThumbnailsTitle: state.sensenetDocumentViewer.localization.toggleThumbnails,
        showThumbnails: state.sensenetDocumentViewer.viewer.showThumbnails,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
    setThumbnails,
}

/**
 * Document widget component that toggles the displaying of the watermark
 */
export class ToggleThumbnailsComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private toggleThumbnails() {
        this.props.setThumbnails(!this.props.showThumbnails)
    }

    /**
     * renders the component
     */
    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton title={this.props.toggleThumbnailsTitle} >
                    <svg onClick={() => this.toggleThumbnails()} version="1.1" xmlns="http://www.w3.org/2000/svg"
                        style={{ width: '1em', height: '1em' }}
                        fill={this.props.showThumbnails ? styles.colors.icon.active : styles.colors.icon.inactive}
                        viewBox="0 0 1000 1000"
                        enableBackground="new 0 0 1000 1000">
                        <g><path d="M826.7,990H173.3C83.5,990,10,916.5,10,826.7V173.3C10,83.5,83.5,10,173.3,10h653.3C916.5,10,990,83.5,990,173.3v653.3C990,916.5,916.5,990,826.7,990z M173.3,91.7c-44.9,0-81.7,36.8-81.7,81.7v653.3c0,44.9,36.7,81.7,81.7,81.7h653.3c44.9,0,81.7-36.8,81.7-81.7V173.3c0-44.9-36.8-81.7-81.7-81.7H173.3z" /><path d="M336.7,990c-24.5,0-40.8-16.3-40.8-40.8V50.8c0-24.5,16.3-40.8,40.8-40.8c24.5,0,40.8,16.3,40.8,40.8v898.3C377.5,973.7,361.2,990,336.7,990z" /><path d="M581.7,540.8c-12.2,0-20.4-4.1-28.6-12.3c-16.3-16.3-16.3-40.8,0-57.2l122.5-122.5c16.3-16.3,40.8-16.3,57.2,0s16.3,40.8,0,57.2L610.3,528.6C602.1,536.8,593.9,540.8,581.7,540.8z" /><path d="M704.2,663.3c-12.2,0-20.4-4.1-28.6-12.3L553.1,528.6c-16.3-16.3-16.3-40.8,0-57.2c16.3-16.3,40.8-16.3,57.2,0l122.5,122.5c16.3,16.3,16.3,40.8,0,57.2C724.6,659.3,716.4,663.3,704.2,663.3z" /></g>
                    </svg>
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ToggleThumbnailsComponent)

export { connectedComponent as ToggleThumbnailsWidget }
