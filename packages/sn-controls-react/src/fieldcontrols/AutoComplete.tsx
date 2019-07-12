import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
// import debounce from 'lodash.debounce'
import React, { useRef, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Field control that represents a AutoComplete field. Available values will be populated from the FieldSettings.
 */
export function AutoComplete(props: ReactClientFieldSetting<ReferenceFieldSetting>) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [value, setValue] = useState(props.fieldValue || props.settings.DefaultValue || '')
  const anchorEl = useRef(null)
  const [items, setItems] = useState<GenericContent[]>([])

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>,
  ) => {
    const term = `*${e.target.value}*`
    const query = new Query(q => q.query(q2 => q2.equals('Name', term).or.equals('DisplayName', term)))

    new QueryOperators(query).and.query(q2 => {
      props.settings.AllowedTypes &&
        props.settings.AllowedTypes.map((allowedType, index, array) => {
          new QueryExpression(q2.queryRef).term(`TypeIs:${allowedType}`)
          if (index < array.length - 1) {
            return new QueryOperators(q2.queryRef).or
          }
        })
      return q2
    })

    new QueryOperators(query).and.query(q2 => {
      props.settings.SelectionRoots &&
        props.settings.SelectionRoots.forEach((root, index, array) => {
          new QueryExpression(q2.queryRef).inTree(root)
          if (index < array.length - 1) {
            return new QueryOperators(q2.queryRef).or
          }
        })
      return q2
    })

    try {
      if (!props.repository) {
        throw new Error('You must pass a repository to this control')
      }
      setIsLoading(true)

      const values = await props.repository.loadCollection<GenericContent>({
        path: '/Root',
        oDataOptions: {
          query: query.toString(),
          select: 'all',
        },
      })
      setIsOpened(!!values.d.results.length)
      setItems(values.d.results)
    } catch (_e) {
      /** */
    } finally {
      setIsLoading(false)
    }
  }

  const handleClickAway = () => {
    setIsOpened(false)
  }

  const handleSelect = (item: GenericContent) => {
    setValue(item.DisplayName || '')
    setIsOpened(false)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, item.Id)
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <div ref={anchorEl}>
          <FormControl key={props.settings.Name} component={'fieldset' as 'div'} required={props.settings.Compulsory}>
            <TextField
              value={value}
              type="text"
              onChange={async e => {
                setValue(e.target.value)
                e.persist()
                await handleInputChange(e)
              }}
              autoFocus={true}
              label={props.settings.DisplayName}
              placeholder={props.settings.DisplayName}
              InputProps={{
                endAdornment: isLoading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : null,
              }}
              name={props.settings.Name}
              id={props.settings.Name}
              required={props.settings.Compulsory}
              disabled={props.settings.ReadOnly}
              fullWidth={true}
              helperText={props.settings.Description}
            />
            <Menu
              BackdropProps={{
                onClick: handleClickAway,
                style: { background: 'none' },
              }}
              autoFocus={false}
              disableAutoFocusItem={true}
              open={isOpened}
              anchorEl={anchorEl.current}
              PaperProps={{
                style: {
                  marginTop: '45px',
                  minWidth: '250px',
                },
              }}>
              {items.length > 0 ? (
                items.map(item => (
                  <MenuItem key={item.Id} value={item.Id} onClick={() => handleSelect(item)}>
                    {item.DisplayName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>No hits</MenuItem>
              )}
            </Menu>
          </FormControl>
        </div>
      )
    case 'browse':
    default: {
      return props.fieldValue ? (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {props.fieldValue}
          </Typography>
        </div>
      ) : null
    }
  }
}
