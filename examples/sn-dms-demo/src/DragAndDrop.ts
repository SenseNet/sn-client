
import * as ReactDOM from 'react-dom'

export module DragAndDrop {
    export const rowSource = {
        beginDrag(props) {
            return {
                content: props.content
            }
        },
        endDrag(props, monitor) {
            const item = monitor.getItem().content
            const dropResult = monitor.getDropResult()
        }
    }

    export function collect(connect, monitor) {
        return ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        })
    }


    export const rowTarget = {
        drop(props, monitor, component) {
            const dragId = monitor.getItem().content.Id
            const dropId = props.content.Id
            const selected = component.props.selected

            if (dragId === dropId) {
                return
            }

            if (selected.length > 0) {
                if (props.isCopy)
                    console.log(`You copied ${selected.join()} into ${dropId}!`)
                if (!props.isCopy)
                    console.log(`You moved ${selected.join()} into ${dropId}!`)
            }
            else {
                if (props.isCopy)
                    console.log(`You copied ${dragId} into ${dropId}!`)
                if (!props.isCopy)
                    console.log(`You moved ${dragId} into ${dropId}!`)
            }
        },
        canDrop(props, monitor) {
            return props.content.IsFolder
        },
        hover(props, monitor, component) {
            const canDrop = monitor.canDrop();

        }
    }
}