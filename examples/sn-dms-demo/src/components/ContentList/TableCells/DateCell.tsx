import * as React from 'react'
import Moment from 'react-moment';
import { connect } from 'react-redux'
import { Reducers } from 'sn-redux'
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd'
import { DragAndDrop } from '../../../DragAndDrop'
import { TableCell } from 'material-ui/Table';

const styles = {
    cellPadding: {
        padding: '16px 24px'
    }
}

interface IDateCellProps {
    date,
    content,
    handleRowSingleClick: Function,
    handleRowDoubleClick: Function,
    connectDragSource: Function,
    connectDropTarget: Function,
    isDragging: boolean,
    isCopy: boolean
}

@DropTarget('row', DragAndDrop.rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
@DragSource('row', DragAndDrop.rowSource, DragAndDrop.collect)
class DateCell extends React.Component<IDateCellProps, {}>{
    constructor(props) {
        super(props)
    }
    render() {
        const { content, date, handleRowSingleClick, handleRowDoubleClick, isDragging, connectDragSource, connectDropTarget, isCopy } = this.props
        const dropEffect = isCopy ? 'copy' : 'move'
        const isVmi = true
        return (
            <TableCell
                padding='none'
                onClick={event => handleRowSingleClick(event, content.Id)}
                onDoubleClick={event => handleRowDoubleClick(event, content.Id)}>
                {!isVmi ? null : connectDragSource(connectDropTarget(<div style={styles.cellPadding}>
                    <Moment fromNow>
                        {date}
                    </Moment>
                </div>
                ), { dropEffect: dropEffect })}
            </TableCell>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContent(state.sensenet)
    }
}

export default connect(mapStateToProps, {})(DateCell)