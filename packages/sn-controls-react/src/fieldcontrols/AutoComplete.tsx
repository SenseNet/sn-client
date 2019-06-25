// TODO Review this because of datasource

// import CircularProgress from '@material-ui/core/CircularProgress'
// import FormControl from '@material-ui/core/FormControl'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import FormGroup from '@material-ui/core/FormGroup'
// import FormLabel from '@material-ui/core/FormLabel'
// import InputAdornment from '@material-ui/core/InputAdornment'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
// import TextField from '@material-ui/core/TextField'
// import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
// import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
// import debounce from 'lodash.debounce'
// import React, { Component } from 'react'
// import { ReactClientFieldSetting } from './field-settings/ClientFieldSetting';

// /**
//  * State object for the AutoComplete component
//  */
// export interface AutoCompleteState<T extends GenericContent> {
//   inputValue: string
//   isLoading: boolean
//   isOpened: boolean
//   term?: string
//   items: T[]
//   selected: number | number[] | null
//   anchorEl: HTMLElement
//   getMenuItem: (item: T, select: (item: T) => void) => JSX.Element
// }

// /**
//  * Field control that represents a AutoComplete field. Available values will be populated from the FieldSettings.
//  */
// export class AutoComplete<T extends GenericContent = GenericContent, K extends keyof T = 'Name'> extends Component<
// ReactClientFieldSetting<ReferenceFieldSetting>,
//   AutoCompleteState<T>
// > {
//   /**
//    * returns a content by its id
//    */
//   // public getContentById = (id: number) => {
//   //   return this.props.dataSource ? this.props.dataSource.find(item => item.Id === id) : null
//   // }
//   /**
//    * state initialization
//    */
//   public state = {
//     inputValue: '',
//     isOpened: false,
//     isLoading: false,
//     items: this.props.dataSource || [],
//     selected: this.props.content[this.props.settings.Name] || [],
//     anchorEl: null as any,
//     getMenuItem: (item: T, select: (item: T) => void) => (
//       <MenuItem key={item.Id} value={item.Id} onClick={() => select(item)}>
//         {item.DisplayName}
//       </MenuItem>
//     ),
//   }
//   private willUnmount: boolean = false
//   /**
//    * component will unmount
//    */
//   public componentWillUnmount() {
//     this.willUnmount = true
//   }

//   constructor(props: AutoComplete['props']) {
//     super(props)
//     const handleInputChange = this.handleInputChange.bind(this)
//     this.handleInputChange = debounce(handleInputChange, 350)
//     this.handleSelect = this.handleSelect.bind(this)
//     this.handleClickAway = this.handleClickAway.bind(this)
//   }

//   private async handleInputChange(e: React.ChangeEvent) {
//     // eslint-disable-next-line dot-notation
//     const term = `*${e.target['value']}*`
//     const query = new Query(q => q.query(q2 => q2.equals('Name', term).or.equals('DisplayName', term)))

//       new QueryOperators(query).and.query(q2 => {
//         this.props.settings.AllowedTypes && this.props.settings.AllowedTypes.map((allowedType, index, array) => {
//           new QueryExpression(q2.queryRef).term(`TypeIs:${allowedType}`)
//           if (index < array.length - 1) {
//             return new QueryOperators(q2.queryRef).or
//           }
//         })
//         return q2
//       })

//       new QueryOperators(query).and.query(q2 => {
//         this.props.settings.SelectionRoots && this.props.settings.SelectionRoots.forEach((root, index, array) => {
//           new QueryExpression(q2.queryRef).inTree(root)
//           if (index < array.length - 1) {
//             return new QueryOperators(q2.queryRef).or
//           }
//         })
//         return q2
//       })

//     this.setState({
//       isLoading: true,
//       // inputValue: [e.target.value],
//     })
//     if (this.props.dataSource && this.props.dataSource.length > 0) {
//       this.setState({
//         items: this.props.dataSource,
//         isOpened: this.props.dataSource.length > 0 ? true : false,
//       })
//     } else {
//       if (!this.props.repository) {
//         throw new Error('You must pass a repository to this control')
//       }
//       try {
//         const values = await this.props.repository.loadCollection<T>({
//           path: '/Root',
//           oDataOptions: {
//             query: query.toString(),
//             select: 'all',
//           },
//         })
//         if (this.willUnmount) {
//           return
//         }
//         this.setState({
//           items: values.d.results,
//           isOpened: values.d.results.length > 0 ? true : false,
//         })
//       } catch (_e) {
//         /** */
//       } finally {
//         !this.willUnmount && this.setState({ isLoading: false })
//       }
//     }
//   }

//   private handleClickAway() {
//     this.setState({ isOpened: false })
//   }

//   private handleSelect(item: T) {
//     this.setState({
//       inputValue: '',
//       selected: [item.Id],
//       isOpened: false,
//       isLoading: false,
//     })
//     this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, item.Id)
//   }
//   /**
//    * render
//    * @return {ReactElement} markup
//    */
//   public render() {
//     const displayName = 'DisplayName'
//     switch (this.props.actionName) {
//       case 'edit':
//       case 'new':
//         return (
//           <div ref={ref => ref && this.state.anchorEl !== ref && this.setState({ anchorEl: ref })}>
//             <FormControl
//               key={this.props.settings.Name}
//               component={'fieldset' as 'div'}
//               required={this.props.settings.Compulsory}>
//               <TextField
//                 value={this.state.selected.length > 0 ? this.getContentById(this.state.selected[0])[displayName] : ''}
//                 type="text"
//                 onChange={async e => {
//                   this.setState({ inputValue: e.target.value })
//                   e.persist()
//                   await this.handleInputChange(e)
//                 }}
//                 autoFocus={true}
//                 label={this.props.settings.DisplayName}
//                 placeholder={this.props.settings.DisplayName}
//                 InputProps={{
//                   endAdornment: this.state.isLoading ? (
//                     <InputAdornment position="end">
//                       <CircularProgress size={16} />
//                     </InputAdornment>
//                   ) : null,
//                 }}
//                 name={this.props.settings.Name}
//                 id={this.props.settings.Name}
//                 required={this.props.settings.Compulsory}
//                 disabled={this.props.settings.ReadOnly}
//                 fullWidth={true}
//                 helperText={this.props.settings.Description}
//               />
//               <Menu
//                 BackdropProps={{
//                   onClick: this.handleClickAway,
//                   style: { background: 'none' },
//                 }}
//                 open={this.state.isOpened}
//                 anchorEl={this.state.anchorEl}
//                 PaperProps={{
//                   style: {
//                     marginTop: '45px',
//                     minWidth: '250px',
//                   },
//                 }}>
//                 {this.state.items.length > 0 ? (
//                   this.state.items.map((item: any) => this.state.getMenuItem(item, this.handleSelect))
//                 ) : (
//                   <MenuItem>No hits</MenuItem>
//                 )}
//               </Menu>
//             </FormControl>
//           </div>
//         )
//       case 'browse':
//         return this.props.content[this.props.settings.Name] (
//           <FormControl component={'fieldset' as 'div'}>
//             <FormLabel component={'legend' as 'label'}>{this.props.settings.DisplayName}</FormLabel>
//             <FormGroup>
//               {this.props.content[this.props.settings.Name].map((value: T[K], index: number) => (
//                 <FormControl component={'fieldset' as 'div'} key={index}>
//                   <FormControlLabel
//                     style={{ marginLeft: 0 }}
//                     label={this.state.items.find((item: any) => item.Id === value)[displayName]}
//                     control={<span />}
//                     key={this.state.items.find(item => item.Id === value).Name}
//                   />
//                 </FormControl>
//               ))}
//             </FormGroup>
//           </FormControl>
//         ) : null
//       default:
//         return this.props.content[this.props.settings.Name].length > 0 ? (
//           <FormControl component={'fieldset' as 'div'}>
//             <FormLabel component={'legend' as 'label'}>{this.props.settings.DisplayName}</FormLabel>
//             <FormGroup>
//               {this.props.content[this.props.settings.Name].map((value: T[K], index: number) => (
//                 <FormControl component={'fieldset' as 'div'} key={index}>
//                   <FormControlLabel
//                     style={{ marginLeft: 0 }}
//                     label={this.state.items.find((item: any) => item.Id === value)[displayName]}
//                     control={<span />}
//                     key={this.state.items.find(item => item.Id === value).Name}
//                   />
//                 </FormControl>
//               ))}
//             </FormGroup>
//           </FormControl>
//         ) : null
//     }
//   }
// }
