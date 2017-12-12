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
            const content = monitor.getItem().content;
            const dragId = content.Id
            const dropId = props.content.Id
            const { selected, selectedContentItems } = component.props

            if (dragId === dropId) {
                return
            }
            if (selected.length > 0) {
                if (props.isCopy)
                    props.copyBatch(selectedContentItems, props.content.Path)
                if (!props.isCopy)
                    props.moveBatch(selectedContentItems, props.content.Path)
            }
            else {
                let obj = {}
                obj[content.Id] = content
                if (props.isCopy)
                    props.copyBatch(obj, props.content.Path)
                if (!props.isCopy)
                    props.moveBatch(obj, props.content.Path)
            }
        },
        canDrop(props, monitor) {
            return props.content.IsFolder
        },
        hover(props, monitor, component) {
            const canDrop = monitor.canDrop();

        }
    }

    export const uploadTarget = {
        hover(props, monitor, component) {
            //console.log(monitor.getItem().files)
        },
        drop(props, monitor) {
            if (props.onDrop) {
                props.onDrop(props, monitor)
            }
        },
    }
}