import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from '@material-ui/core'
import { GenericContent, IActionModel, Schema } from '@sensenet/default-content-types'
import * as React from 'react'
import { ActionsCell, CellProps, DateCell, DefaultCell, DisplayNameCell, ReferenceCell } from './CellTemplates'

export interface ContentListProps<T extends GenericContent> {
    items: T[]
    schema: Schema
    active?: T
    selected: T[]
    fieldsToDisplay: Array<keyof T>
    orderBy: keyof T
    orderDirection: 'asc' | 'desc'
    fieldComponent?: React.StatelessComponent<CellProps<T, keyof T>>,
    icons: any
    displayRowCheckbox?: boolean,
    onItemClick?: (e: React.MouseEvent, content: T) => void
    onItemDoubleClick?: (e: React.MouseEvent, content: T) => void
    onItemTap?: (e: React.TouchEvent, content: T) => void
    onItemContextMenu?: (e: React.MouseEvent, content: T) => void
    onRequestActionsMenu?: (ev: React.MouseEvent, content: T) => void
    onRequestOrderChange?: (field: keyof T, direction: 'asc' | 'desc') => void
    onRequestSelectionChange?: (newSelection: T[]) => void
    onRequestActiveItemChange?: (newActiveItem: T) => void
    onAction?: (item: T, action: IActionModel) => void
}

export interface ContentListState {
    itemCount: number
    selectedCount: number
    isAllSelected: boolean
    hasSelected: boolean
}

export class ContentList<T extends GenericContent> extends React.Component<ContentListProps<T>, ContentListState> {
    public state = ContentList.getDerivedStateFromProps(this.props as any, null as any)

    public static getDerivedStateFromProps(nextProps: ContentListProps<GenericContent>, lastState: ContentListState) {
        const selectedCount = nextProps.selected.length
        const itemCount = nextProps.items.length
        return {
            selectedCount,
            itemCount,
            hasSelected: selectedCount > 0,
            isAllSelected: itemCount === selectedCount,
        } as ContentListState
    }

    public handleSelectAllClick() {
        this.props.onRequestSelectionChange &&
            (this.state.isAllSelected ?
                this.props.onRequestSelectionChange([]) :
                this.props.onRequestSelectionChange(this.props.items))
    }

    public handleContentSelection(content: T) {
        if (this.props.onRequestSelectionChange) {
            if (this.props.selected.find((c) => c.Id === content.Id)) {
                this.props.onRequestSelectionChange(this.props.selected.filter((s) => s.Id !== content.Id))
            } else {
                this.props.onRequestSelectionChange([...this.props.selected, content])
            }
        }
    }

    private defaultFieldComponents: React.StatelessComponent<CellProps<T, keyof T>> = (props: CellProps<T, keyof T>) => {
        switch (props.field) {
            case 'DisplayName':
                return (<DisplayNameCell content={props.content} isSelected={props.isSelected} icons={this.props.icons}></DisplayNameCell>)
            case 'Actions':
                if (props.content.Actions && props.content.Actions instanceof Array) {
                    return (<ActionsCell
                        actions={props.content.Actions as IActionModel[]}
                        content={props.content}
                        openActionMenu={(ev) => this.props.onRequestActionsMenu && this.props.onRequestActionsMenu(ev, props.content)}></ActionsCell>)
                }
                break
            case 'ModificationDate':
                return <DateCell date={props.content.ModificationDate as string} />
        }
        const field: any = props.content[props.field]
        if (field && field.Id && field.Path && field.DisplayName) {
            return <ReferenceCell content={field} fieldName={'DisplayName'} />
        }
        return null
    }

    constructor(props: ContentListProps<T>) {
        super(props)
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this)
        this.handleContentSelection = this.handleContentSelection.bind(this)
    }
    public render() {
        return <Table>
            <TableHead>
                <TableRow>
                    {this.props.displayRowCheckbox !== false ?
                        <TableCell padding="checkbox" key="selectAll" style={{ width: '30px', paddingRight: 0 }}>
                            <Checkbox
                                className="select-all"
                                indeterminate={this.state.hasSelected && !this.state.isAllSelected}
                                checked={this.state.isAllSelected}
                                onChange={this.handleSelectAllClick}
                            />
                        </TableCell>
                        : null}
                    {this.props.fieldsToDisplay.map((field) => {
                        const fieldSetting = this.props.schema.FieldSettings.find((s) => s.Name === field)
                        const isNumeric = fieldSetting && (fieldSetting.Type === 'IntegerFieldSetting' || fieldSetting.Type === 'NumberFieldSetting')
                        const description = fieldSetting && fieldSetting.Description || field
                        const displayName = fieldSetting && fieldSetting.DisplayName || field
                        return (
                            <TableCell
                                key={field as string}
                                numeric={isNumeric}
                                className={field as string}
                                padding="checkbox"
                            >
                                <Tooltip title={description} >
                                    <TableSortLabel
                                        active={this.props.orderBy === field}
                                        direction={this.props.orderDirection}
                                        onClick={() => this.props.onRequestOrderChange && this.props.onRequestOrderChange(field, this.props.orderDirection === 'asc' ? 'desc' : 'asc')}
                                    >
                                        {displayName}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>)
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {this.props.items.map((item) => {
                    const isSelected = this.props.selected.find((s) => s.Id === item.Id) ? true : false
                    const isActive = this.props.active && this.props.active.Id === item.Id ? true : false
                    return (<TableRow
                        key={item.Id}
                        hover
                        className={`${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${item.Type && 'type-' + item.Type.toLowerCase()}`}
                        selected={isActive}
                        onClick={(e) => {
                            this.props.onRequestActiveItemChange && this.props.onRequestActiveItemChange(item)
                            this.props.onItemClick && this.props.onItemClick(e, item)
                        }}
                        onDoubleClick={(e) => {
                            this.props.onItemDoubleClick && this.props.onItemDoubleClick(e, item)
                        }}
                        onTouchEnd={(e) => this.props.onItemTap && this.props.onItemTap(e, item)}
                        onContextMenu={(e) => this.props.onItemContextMenu && this.props.onItemContextMenu(e, item)}
                    >
                        {this.props.displayRowCheckbox !== false ?
                            <TableCell padding="checkbox" key="select">
                                <Checkbox
                                    checked={this.props.selected.find((i) => i.Id === item.Id) ? true : false}
                                    onChange={() => this.handleContentSelection(item)}
                                />
                            </TableCell> : null}
                        {this.props.fieldsToDisplay.map((field) => {
                            const fieldSetting = this.props.schema.FieldSettings.find((s) => s.Name === field)
                            const cellProps: CellProps<T, keyof T> = { ...this.props as ContentListProps<T>, field, content: item, fieldSetting, isSelected }

                            const fieldComponent = this.props.fieldComponent && this.props.fieldComponent(cellProps)
                            const defaultComponent = this.defaultFieldComponents(cellProps)

                            const el = {
                                ...React.createElement(fieldComponent ? this.props.fieldComponent as any : defaultComponent ? this.defaultFieldComponents : DefaultCell, cellProps),
                                key: field as string,
                            }
                            return el
                        })}
                    </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    }
}
