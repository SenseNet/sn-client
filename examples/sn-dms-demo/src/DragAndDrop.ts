export const rowSource = {
  beginDrag(props: { content: any }) {
    return {
      content: props.content,
    }
  },
}

export function collect(connect: any, monitor: any) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

export const rowTarget = {
  drop(props: any, monitor: any, component: any) {
    const content = monitor.getItem().content
    const dragId = content.Id
    const dropId = props.content.Id
    const { selected, selectedContentItems } = component.props

    if (dragId === dropId) {
      return
    }
    if (selected.length > 0) {
      if (props.isCopy) {
        props.copyBatch(selectedContentItems, props.content.Path)
      }
      if (!props.isCopy) {
        props.moveBatch(selectedContentItems, props.content.Path)
      }
    } else {
      const obj: any = {}
      obj[content.Id] = content
      if (props.isCopy) {
        props.copyBatch(obj, props.content.Path)
      }
      if (!props.isCopy) {
        props.moveBatch(obj, props.content.Path)
      }
    }
  },
  canDrop(props: any) {
    return props.content.IsFolder
  },
}

export const uploadTarget = {
  hover() {
    // console.log(monitor.getItem().files)
  },
  drop(props: any, monitor: any) {
    if (props.onDrop) {
      props.onDrop(props, monitor)
    }
  },
}
