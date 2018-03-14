import { Actions, Reducers } from '@sensenet/redux'
import { TableCell } from 'material-ui/Table'
import * as React from 'react'
import { DragSource } from 'react-dnd'
import { DropTarget } from 'react-dnd'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import * as DragAndDrop from '../../../DragAndDrop'

const styles = {
    cellPadding: {
        padding: '16px 24px',
    },
}

interface DateCellProps {
    date,
    content,
    handleRowSingleClick,
    handleRowDoubleClick,
    connectDragSource,
    connectDropTarget,
    copyBatch,
    moveBatch,
    isDragging: boolean,
    isCopy: boolean,
    selected,
    selectedContentItems
}

@DropTarget('row', DragAndDrop.rowTarget, (conn, monitor) => ({
    connectDropTarget: conn.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
@DragSource('row', DragAndDrop.rowSource, DragAndDrop.collect)
class DateCell extends React.Component<DateCellProps, {}> {
    constructor(props) {
        super(props)
    }
    public render() {
        const { content, date, handleRowSingleClick, handleRowDoubleClick, connectDragSource, connectDropTarget, isCopy } = this.props
        const dropEffect = isCopy ? 'copy' : 'move'
        const isVmi = true
        return (
            <TableCell
                padding="none"
                onClick={(event) => handleRowSingleClick(event, content.Id)}
                onDoubleClick={(event) => handleRowDoubleClick(event, content.Id)}>
                {!isVmi ? null : connectDragSource(connectDropTarget(<div style={styles.cellPadding}>
                    <Moment fromNow>
                        {date}
                    </Moment>
                </div>,
                ), { dropEffect })}
            </TableCell>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContentIds(state.sensenet),
        selectedContentItems: Reducers.getSelectedContentItems(state.sensenet),
    }
}

export default connect(mapStateToProps, {
    copyBatch: Actions.copyBatch,
    moveBatch: Actions.moveBatch,
})(DateCell)
