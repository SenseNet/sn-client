import { MenuProps } from '@material-ui/core/Menu'
import TextField, { TextFieldProps as MaterialTextFieldProps } from '@material-ui/core/TextField'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import * as React from 'react'

// tslint:disable-next-line:no-var-requires
import { CircularProgress, InputAdornment, Menu, MenuItem } from '@material-ui/core'
import debounce = require('lodash.debounce')

/**
 * Props for the ReferenceField component
 */
export interface ReferenceFieldProps<T> {
    fieldName: keyof T
    fieldKey?: string
    fieldSetting: ReferenceFieldSetting
    fetchItems: (fetchQuery: Query<T>) => Promise<T[]>
    onQueryChange: (key: string, query: Query<GenericContent>) => void
    getMenuItem?: (item: T, select: (item: T) => void) => JSX.Element
    MenuProps?: Partial<MenuProps>
}

/**
 * State object for the ReferenceField component
 */
export interface ReferenceFieldState<T extends GenericContent> {
    inputValue: string
    isLoading: boolean
    isOpened: boolean
    term?: string
    items: T[]
    selected: T | null
    anchorEl: HTMLElement
    getMenuItem: (item: T, select: (item: T) => void) => JSX.Element
}

/**
 * Reference field picker component
 */
export class ReferenceField<T extends GenericContent = GenericContent> extends React.Component<ReferenceFieldProps<T> & MaterialTextFieldProps, ReferenceFieldState<T>> {

    /**
     * Initial state
     */
    public state: ReferenceFieldState<T> = {
        inputValue: '',
        isOpened: false,
        isLoading: false,
        items: [],
        selected: null,
        anchorEl: null as any,
        getMenuItem: (item: T, select: (item: T) => void) => <MenuItem key={item.Id} value={item.Id} onClick={() => select(item)}>{item.DisplayName}</MenuItem>,
    }

    private willUnmount: boolean = false
    public componentWillUnmount() {
        this.willUnmount = true
    }

    constructor(props: ReferenceFieldProps<T>) {
        super(props)
        const handleInputChange = this.handleInputChange.bind(this)
        this.handleInputChange = debounce(handleInputChange, 350)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleClickAway = this.handleClickAway.bind(this)
    }

    private async handleInputChange(ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) {
        // tslint:disable
        const term = `*${ev.target.value}*`
        const query = new Query((q) => q
            .query((q2) =>
                q2.equals('Name', term)
                    .or
                    .equals('DisplayName', term)))

        if (this.props.fieldSetting.AllowedTypes) {
            new QueryOperators(query).and.query(q2 => {
                (this.props.fieldSetting.AllowedTypes as string[]).map((allowedType, index, array) => {
                    new QueryExpression(q2['queryRef']).term(`TypeIs:${allowedType}`)
                    if (index < array.length - 1) {
                        new QueryOperators(q2['queryRef']).or
                    }
                })
                return q2
            })
        }

        if (this.props.fieldSetting.SelectionRoots && this.props.fieldSetting.SelectionRoots.length) {
            new QueryOperators(query).and.query((q2) => {
                (this.props.fieldSetting.SelectionRoots as string[]).forEach((root, index, array) => {
                    new QueryExpression(q2['queryRef']).inTree(root)
                    if (index < array.length - 1) {
                        new QueryOperators(q2['queryRef']).or
                    }
                })
                return q2
            })
            // tslint:enable
        }

        this.setState({
            isLoading: true,
            inputValue: ev.target.value,
        })
        try {
            const values = await this.props.fetchItems(query)
            if (this.willUnmount) {
                return
            }
            this.setState({
                items: values,
                isOpened: values.length > 0 ? true : false,
            })

        } catch (_e) {
            /** */
        } finally {
            !this.willUnmount && this.setState({ isLoading: false })
        }
    }

    private handleClickAway() {
        this.setState({ isOpened: false })
    }

    private handleSelect(item: T) {
        this.setState({
            inputValue: item.DisplayName || item.Name,
            selected: item,
            isOpened: false,
        })
        this.props.onQueryChange(this.props.fieldKey || this.props.fieldName.toString(), new Query((q) => q.equals(this.props.fieldName, item.Id)))
    }

    /**
     * Renders the component
     */
    public render() {
        const displayName = this.props.fieldSetting && this.props.fieldSetting.DisplayName || this.props.label
        const description = this.props.fieldSetting && this.props.fieldSetting.Description || ''
        const { fetchItems, fieldName, onQueryChange, fieldSetting, fieldKey, ...materialProps } = { ...this.props }

        return <div ref={(ref) => ref && this.state.anchorEl !== ref && this.setState({ anchorEl: ref })}>
            <TextField
                value={this.state.inputValue}
                type="text"
                onChange={async (ev) => {
                    this.setState({ inputValue: ev.target.value })
                    ev.persist()
                    await this.handleInputChange(ev)
                }}
                autoFocus
                label={displayName}
                placeholder={description}
                title={this.props.fieldSetting && this.props.fieldSetting.Description}
                InputProps={{
                    endAdornment:
                        this.state.isLoading ? <InputAdornment position="end" >
                            <CircularProgress size={16} />
                        </InputAdornment> : null,
                }}
                {...materialProps}
            >
            </TextField >
            <Menu
                BackdropProps={{
                    onClick: this.handleClickAway,
                    style: { background: 'none' },
                }}
                open={this.state.isOpened}
                anchorEl={this.state.anchorEl}
                PaperProps={{
                    style: {
                        marginTop: '45px',
                        minWidth: '250px',
                    },
                }}
                {...this.props.MenuProps}
            >
                {this.state.items.length > 0 ? this.state.items.map((i) => this.state.getMenuItem(i, this.handleSelect)) : <MenuItem>No hits</MenuItem>}
            </Menu>
        </div >
    }
}
